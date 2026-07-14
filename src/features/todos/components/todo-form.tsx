import { useState } from 'react'
import { Plus } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { TodoDraft, TodoPriority, TodoStatus } from '@/features/todos/types'

interface TodoFormProps {
  onSubmit: (draft: TodoDraft) => void
}

const emptyDraft = {
  title: '',
  description: '',
  priority: 'medium' as TodoPriority,
  status: 'planned' as TodoStatus,
  dueDate: '',
  tags: '',
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [draft, setDraft] = useState(emptyDraft)
  const [expanded, setExpanded] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!draft.title.trim()) return

    onSubmit({
      title: draft.title,
      description: draft.description,
      priority: draft.priority,
      status: draft.status,
      dueDate: draft.dueDate || null,
      tags: draft.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    })

    setDraft(emptyDraft)
    setExpanded(false)
  }

  return (
    <motion.form
      layout
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm backdrop-blur"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={draft.title}
          onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
          placeholder="What needs to get done?"
          className="h-10 flex-1"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setExpanded((value) => !value)}
          >
            Details
          </Button>
          <motion.div whileTap={{ scale: 0.96 }}>
            <Button type="submit" className="min-w-28">
              <Plus className="size-4" />
              Add task
            </Button>
          </motion.div>
        </div>
      </div>

      {expanded ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Notes</Label>
            <Textarea
              id="description"
              value={draft.description}
              onChange={(event) =>
                setDraft((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Add context, links, or acceptance criteria"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={draft.priority}
              onValueChange={(value) =>
                setDraft((current) => ({ ...current, priority: value as TodoPriority }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={draft.status}
              onValueChange={(value) =>
                setDraft((current) => ({ ...current, status: value as TodoStatus }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due date</Label>
            <Input
              id="dueDate"
              type="date"
              value={draft.dueDate}
              onChange={(event) =>
                setDraft((current) => ({ ...current, dueDate: event.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={draft.tags}
              onChange={(event) => setDraft((current) => ({ ...current, tags: event.target.value }))}
              placeholder="design, backend, urgent"
            />
          </div>
        </motion.div>
      ) : null}
    </motion.form>
  )
}
