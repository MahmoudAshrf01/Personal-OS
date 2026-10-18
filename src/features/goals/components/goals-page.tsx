import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import {
  Check,
  ChevronDown,
  ChevronUp,
  ListChecks,
  Plus,
  Target,
  Trash2,
  X,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Goal } from '@/domain/goal'
import { goalEngine } from '@/engines/goal-engine'

export function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [title, setTitle] = useState('')
  const [steps, setSteps] = useState('')
  const [newSteps, setNewSteps] = useState<Record<string, string>>({})
  const [expandedGoals, setExpandedGoals] = useState<Set<string>>(() => new Set())
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null)

  const load = () => goalEngine.getAll().then(setGoals)
  useEffect(() => {
    load()
  }, [])

  const handleAdd = async () => {
    if (!title.trim()) return
    const stepTitles = steps
      .split('\n')
      .map((step) => step.replace(/^\s*[-*]\s*/, '').trim())
      .filter(Boolean)
    await goalEngine.create(title, stepTitles)
    setTitle('')
    setSteps('')
    setIsCreateDialogOpen(false)
    load()
  }

  const handleComplete = async (id: string) => {
    await goalEngine.complete(id)
    load()
  }

  const handleAddStep = async (goalId: string) => {
    const stepTitle = newSteps[goalId]?.trim()
    if (!stepTitle) return
    await goalEngine.addStep(goalId, stepTitle)
    setNewSteps((current) => ({ ...current, [goalId]: '' }))
    load()
  }

  const handleToggleStep = async (goalId: string, stepId: string) => {
    await goalEngine.toggleStep(goalId, stepId)
    load()
  }

  const handleRemoveStep = async (goalId: string, stepId: string) => {
    await goalEngine.removeStep(goalId, stepId)
    load()
  }

  const handleDeleteGoal = async () => {
    if (!goalToDelete) return
    const goalId = goalToDelete.id
    await goalEngine.delete(goalId)
    setGoalToDelete(null)
    setNewSteps((current) => {
      const next = { ...current }
      delete next[goalId]
      return next
    })
    setExpandedGoals((current) => {
      const next = new Set(current)
      next.delete(goalId)
      return next
    })
    load()
  }

  const toggleExpanded = (goalId: string) => {
    setExpandedGoals((current) => {
      const next = new Set(current)
      if (next.has(goalId)) next.delete(goalId)
      else next.add(goalId)
      return next
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <motion.header
        className="sticky top-0 z-30 -mx-4 flex items-center justify-between gap-4 border-b border-border/70 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:px-6"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            <Target className="mr-1 size-3.5" />
            Goals
          </Badge>
          <h1 className="mt-2 text-2xl font-semibold">Long-term objectives</h1>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="size-4" />
          Add goal
        </Button>
      </motion.header>

      <div className="grid gap-3">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={goal.status === 'completed' ? 'border-primary/30' : undefined}>
              <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    {goal.steps.length > 6 && (
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        aria-label={`${expandedGoals.has(goal.id) ? 'Hide' : 'Show'} extra steps for ${goal.title}`}
                        aria-expanded={expandedGoals.has(goal.id)}
                        onClick={() => toggleExpanded(goal.id)}
                      >
                        {expandedGoals.has(goal.id) ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                      </Button>
                    )}
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                  </div>
                  {goal.status === 'completed' && (
                    <Badge className="mt-2" variant="secondary">
                      Completed
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {goal.status !== 'completed' && (
                    <Button size="sm" variant="outline" onClick={() => handleComplete(goal.id)}>
                      <Check className="size-4" />
                      Complete
                    </Button>
                  )}
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`Delete ${goal.title}`}
                    onClick={() => setGoalToDelete(goal)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {goal.steps.length > 0 ? (
                  <div className="space-y-1">
                    {goal.steps
                      .slice(0, expandedGoals.has(goal.id) ? goal.steps.length : 6)
                      .map((step) => (
                      <div
                        key={step.id}
                        className="group flex min-h-9 items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/60"
                      >
                        <Checkbox
                          aria-label={`Mark ${step.title} as ${step.completed ? 'not completed' : 'completed'}`}
                          checked={step.completed}
                          disabled={goal.status === 'completed'}
                          onCheckedChange={() => handleToggleStep(goal.id, step.id)}
                        />
                        <span
                          className={`min-w-0 flex-1 ${
                            step.completed ? 'text-muted-foreground line-through' : ''
                          }`}
                        >
                          {step.title}
                        </span>
                        {goal.status !== 'completed' && (
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                            aria-label={`Remove ${step.title}`}
                            onClick={() => handleRemoveStep(goal.id, step.id)}
                          >
                            <X className="size-3.5" />
                          </Button>
                        )}
                      </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No steps yet.</p>
                )}

                {goal.status !== 'completed' && (
                  <div className="flex gap-2">
                    <Input
                      aria-label={`Add a step to ${goal.title}`}
                      placeholder="Add another step…"
                      value={newSteps[goal.id] ?? ''}
                      onChange={(event) =>
                        setNewSteps((current) => ({
                          ...current,
                          [goal.id]: event.target.value,
                        }))
                      }
                      onKeyDown={(event) => event.key === 'Enter' && handleAddStep(goal.id)}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label={`Add step to ${goal.title}`}
                      disabled={!newSteps[goal.id]?.trim()}
                      onClick={() => handleAddStep(goal.id)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>
                )}

                <div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {goal.progress}% complete
                    {goal.steps.length > 0 &&
                      ` · ${goal.steps.filter((step) => step.completed).length}/${goal.steps.length} steps`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ListChecks className="size-4 text-primary" />
              Create a big goal
            </DialogTitle>
            <DialogDescription>
              Add the goal title and enter one step per line. You can add more steps later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              autoFocus
              aria-label="Goal title"
              placeholder="Goal title, e.g. Learn C++ and OOP"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleAdd()}
            />
            <Textarea
              aria-label="Goal steps"
              placeholder={'Add one step per line\nVariables\nFunctions\nClasses and objects'}
              value={steps}
              onChange={(event) => setSteps(event.target.value)}
              rows={7}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={!title.trim()}>
              <Plus className="size-4" />
              Add goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={goalToDelete !== null}
        onOpenChange={(open) => !open && setGoalToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete goal?</DialogTitle>
            <DialogDescription>
              “{goalToDelete?.title}” and all of its steps will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGoalToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteGoal}>
              <Trash2 className="size-4" />
              Delete goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
