import { format, isPast, parseISO, startOfDay } from 'date-fns'
import { CalendarDays, GripVertical, Pencil, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ListItem,
  ListItemDragHandle,
  useIsDragOverlay,
} from '@/components/kibo-ui/list'
import { PRIORITY_META } from '@/features/todos/constants'
import type { Todo } from '@/features/todos/types'
import { cn } from '@/lib/utils'

interface TodoItemContentProps {
  todo: Todo
  onEdit?: (todo: Todo) => void
  onDelete?: (id: string) => void
  showHandle?: boolean
}

export function TodoItemContent({
  todo,
  onEdit,
  onDelete,
  showHandle = true,
}: TodoItemContentProps) {
  const isDragOverlay = useIsDragOverlay()
  const priority = PRIORITY_META[todo.priority]
  const overdue =
    todo.status !== 'done' &&
    todo.dueDate &&
    isPast(startOfDay(parseISO(todo.dueDate)))

  return (
    <div className="flex w-full items-start gap-2">
      {showHandle ? (
        isDragOverlay ? (
          <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        ) : (
          <ListItemDragHandle className="mt-0.5 shrink-0">
            <GripVertical className="size-4 text-muted-foreground" />
          </ListItemDragHandle>
        )
      ) : null}

      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className={cn(
                'truncate font-medium text-sm',
                todo.status === 'done' && 'text-muted-foreground line-through',
              )}
            >
              {todo.title}
            </p>
            {todo.description ? (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {todo.description}
              </p>
            ) : null}
          </div>

          <Badge
            variant="outline"
            style={{ borderColor: priority.color, color: priority.color }}
          >
            {priority.label}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {todo.dueDate ? (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground',
                overdue && 'bg-destructive/10 text-destructive',
              )}
            >
              <CalendarDays className="size-3" />
              {format(parseISO(todo.dueDate), 'MMM d')}
            </span>
          ) : null}

          {todo.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[11px]">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {onEdit && onDelete && !isDragOverlay ? (
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onEdit(todo)}
            aria-label={`Edit ${todo.title}`}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onDelete(todo.id)}
            aria-label={`Delete ${todo.title}`}
          >
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        </div>
      ) : null}
    </div>
  )
}

interface TodoItemProps {
  todo: Todo
  index: number
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
}

export function TodoItemCard({ todo, index, onEdit, onDelete }: TodoItemProps) {
  return (
    <ListItem id={todo.id} name={todo.title} index={index} parent={todo.status}>
      <TodoItemContent todo={todo} onEdit={onEdit} onDelete={onDelete} />
    </ListItem>
  )
}

export function TodoDragPreview({ todo }: { todo: Todo }) {
  return (
    <div className="flex size-full cursor-grabbing items-center gap-2 rounded-md border bg-background p-2 shadow-lg ring-2 ring-primary/20">
      <TodoItemContent todo={todo} showHandle />
    </div>
  )
}

export function AnimatedTodoItems({
  todos,
  onEdit,
  onDelete,
}: {
  todos: Todo[]
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
}) {
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {todos.map((todo, index) => (
        <motion.div
          key={todo.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.2 }}
        >
          <TodoItemCard
            todo={todo}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
