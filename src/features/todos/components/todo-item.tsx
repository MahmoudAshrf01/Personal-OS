import { format, isPast, parseISO, startOfDay } from 'date-fns'
import { CalendarDays, GripVertical, Pencil, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ListItem } from '@/components/kibo-ui/list'
import { PRIORITY_META } from '@/features/todos/constants'
import type { Todo } from '@/features/todos/types'
import { cn } from '@/lib/utils'

interface TodoItemProps {
  todo: Todo
  index: number
  onEdit: (todo: Todo) => void
  onDelete: (id: string) => void
}

export function TodoItemCard({ todo, index, onEdit, onDelete }: TodoItemProps) {
  const priority = PRIORITY_META[todo.priority]
  const overdue =
    todo.status !== 'done' &&
    todo.dueDate &&
    isPast(startOfDay(parseISO(todo.dueDate)))

  return (
    <ListItem id={todo.id} name={todo.title} index={index} parent={todo.status}>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96, height: 0 }}
        className="flex w-full items-start gap-2"
      >
        <GripVertical className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

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

        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onEdit(todo)}
            aria-label={`Edit ${todo.title}`}
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => onDelete(todo.id)}
            aria-label={`Delete ${todo.title}`}
          >
            <Trash2 className="size-3.5 text-destructive" />
          </Button>
        </div>
      </motion.div>
    </ListItem>
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
    <AnimatePresence initial={false}>
      {todos.map((todo, index) => (
        <TodoItemCard
          key={todo.id}
          todo={todo}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </AnimatePresence>
  )
}
