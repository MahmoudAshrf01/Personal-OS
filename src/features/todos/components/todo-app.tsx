import { useEffect, useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TodoEditDialog } from '@/features/todos/components/todo-edit-dialog'
import { TodoForm } from '@/features/todos/components/todo-form'
import { TodoListBoard } from '@/features/todos/components/todo-list-board'
import { TodoStatsPanel } from '@/features/todos/components/todo-stats'
import { TodoToolbar } from '@/features/todos/components/todo-toolbar'
import type { Todo } from '@/features/todos/types'
import { selectStats, useTaskStore, useTodoStore } from '@/store/task-store'

export function TodoApp() {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const addTodo = useTodoStore((state) => state.addTodo)
  const updateTodo = useTodoStore((state) => state.updateTask)
  const todos = useTodoStore((state) => state.tasks)
  const search = useTodoStore((state) => state.search)
  const filter = useTodoStore((state) => state.filter)
  const setSearch = useTodoStore((state) => state.setSearch)
  const setFilter = useTodoStore((state) => state.setFilter)
  const clearCompleted = useTodoStore((state) => state.clearCompleted)

  useEffect(() => {
    void useTaskStore.getState().loadTasks()
  }, [])

  const stats = useMemo(() => selectStats({ tasks: todos }), [todos])

  return (
    <div className="bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_32%),linear-gradient(to_bottom,var(--background),color-mix(in_oklch,var(--background),var(--muted)_35%))]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            <Sparkles className="mr-1 size-3.5" />
            Tasks
          </Badge>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Advanced tasks, simple flow
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Drag tasks between groups, filter by status, and keep priorities visible.
              Powered by Dexie, Kibo UI, and Motion.
            </p>
          </div>
        </motion.header>

        <TodoStatsPanel stats={stats} />
        <TodoForm onSubmit={addTodo} />

        <section className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur sm:p-5">
          <TodoToolbar
            search={search}
            filter={filter}
            onSearchChange={setSearch}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
            completedCount={stats.done}
          />

          <Separator className="my-5" />
          <TodoListBoard onEdit={setEditingTodo} />
        </section>
      </div>

      <TodoEditDialog
        todo={editingTodo}
        open={Boolean(editingTodo)}
        onOpenChange={(open) => {
          if (!open) setEditingTodo(null)
        }}
        onSave={updateTodo}
      />
    </div>
  )
}
