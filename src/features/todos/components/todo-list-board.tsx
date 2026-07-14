import { useMemo } from 'react'
import { motion } from 'motion/react'

import {
  ListGroup,
  ListHeader,
  ListItems,
  ListProvider,
} from '@/components/kibo-ui/list'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AnimatedTodoItems } from '@/features/todos/components/todo-item'
import { TODO_STATUSES } from '@/features/todos/constants'
import type { Todo } from '@/features/todos/types'
import { selectVisibleTasks, useTodoStore } from '@/store/task-store'

interface TodoListBoardProps {
  onEdit: (todo: Todo) => void
}

export function TodoListBoard({ onEdit }: TodoListBoardProps) {
  const handleDragEnd = useTodoStore((state) => state.handleDragEnd)
  const deleteTodo = useTodoStore((state) => state.deleteTodo)
  const tasks = useTodoStore((state) => state.tasks)
  const search = useTodoStore((state) => state.search)
  const filter = useTodoStore((state) => state.filter)

  const visibleTodos = useMemo(
    () => selectVisibleTasks({ tasks, search, filter }),
    [tasks, search, filter],
  )

  return (
    <ListProvider onDragEnd={handleDragEnd} className="min-h-[520px]">
      <div className="grid gap-4 xl:grid-cols-3">
        {TODO_STATUSES.map((status, columnIndex) => {
          const todos = visibleTodos.filter((todo) => todo.status === status.id)

          return (
            <motion.section
              key={status.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: columnIndex * 0.08, duration: 0.35 }}
              className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm backdrop-blur"
            >
              <ListGroup id={status.id}>
                <ListHeader name={status.name} color={status.color} />
                <ScrollArea className="h-[460px]">
                  <ListItems>
                    {todos.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border/80 bg-background/40 p-6 text-center text-sm text-muted-foreground">
                        Drop tasks here or add a new one above.
                      </div>
                    ) : (
                      <AnimatedTodoItems
                        todos={todos}
                        onEdit={onEdit}
                        onDelete={deleteTodo}
                      />
                    )}
                  </ListItems>
                </ScrollArea>
              </ListGroup>
            </motion.section>
          )
        })}
      </div>
    </ListProvider>
  )
}
