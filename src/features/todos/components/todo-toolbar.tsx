import { Search, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { TodoFilter } from '@/features/todos/types'

const filters: { value: TodoFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'Active' },
  { value: 'done', label: 'Done' },
]

interface TodoToolbarProps {
  search: string
  filter: TodoFilter
  onSearchChange: (value: string) => void
  onFilterChange: (value: TodoFilter) => void
  onClearCompleted: () => void
  completedCount: number
}

export function TodoToolbar({
  search,
  filter,
  onSearchChange,
  onFilterChange,
  onClearCompleted,
  completedCount,
}: TodoToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          data-search-input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks, tags, notes..."
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Tabs
          value={filter}
          onValueChange={(value) => onFilterChange(value as TodoFilter)}
        >
          <TabsList className="grid w-full grid-cols-4 sm:w-auto">
            {filters.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Button
          variant="outline"
          size="sm"
          onClick={onClearCompleted}
          disabled={completedCount === 0}
          className="justify-center"
        >
          <Trash2 className="size-4" />
          Clear done
        </Button>
      </div>
    </div>
  )
}
