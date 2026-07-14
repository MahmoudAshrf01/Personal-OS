import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Coins, Flame, Sparkles, Trophy } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { AchievementCategory, AchievementProgress, UserProfile } from '@/domain/gamification'
import { achievementEngine } from '@/engines/achievement-engine'
import { gameEngine } from '@/engines/game-engine'

import { AchievementCard } from './achievement-card'

const CATEGORY_ORDER: AchievementCategory[] = [
  'tasks',
  'focus',
  'consistency',
  'milestones',
]

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  tasks: 'Tasks',
  focus: 'Focus',
  consistency: 'Consistency',
  milestones: 'Milestones',
}

const STAT_TONES = {
  level: 'text-emerald-500',
  coins: 'text-amber-500',
  streak: 'text-orange-500',
  completed: 'text-violet-500',
} as const

type StatusFilter = 'all' | 'completed' | 'locked'
type SortMode = 'completed-first' | 'progress' | 'category'

function isCompleted(item: AchievementProgress) {
  return Boolean(item.achievement.unlockedAt)
}

function sortItems(items: AchievementProgress[], sort: SortMode): AchievementProgress[] {
  const copy = [...items]
  if (sort === 'completed-first') {
    return copy.sort((a, b) => {
      const aDone = isCompleted(a) ? 0 : 1
      const bDone = isCompleted(b) ? 0 : 1
      if (aDone !== bDone) return aDone - bDone
      if (isCompleted(a) && isCompleted(b)) {
        return (b.achievement.unlockedAt ?? '').localeCompare(a.achievement.unlockedAt ?? '')
      }
      return b.percent - a.percent
    })
  }
  if (sort === 'progress') {
    return copy.sort((a, b) => {
      if (isCompleted(a) !== isCompleted(b)) return isCompleted(a) ? -1 : 1
      return b.percent - a.percent || a.achievement.threshold - b.achievement.threshold
    })
  }
  // category order preserved; within category completed first
  return copy.sort((a, b) => {
    const cat =
      CATEGORY_ORDER.indexOf(a.achievement.category) -
      CATEGORY_ORDER.indexOf(b.achievement.category)
    if (cat !== 0) return cat
    const aDone = isCompleted(a) ? 0 : 1
    const bDone = isCompleted(b) ? 0 : 1
    return aDone - bDone
  })
}

export function GamificationPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [progress, setProgress] = useState<AchievementProgress[]>([])
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | AchievementCategory>('all')
  const [sortMode, setSortMode] = useState<SortMode>('completed-first')

  useEffect(() => {
    gameEngine.getProfile().then(setProfile)
    achievementEngine.getProgress().then(setProgress)
  }, [])

  const filtered = useMemo(() => {
    let items = progress
    if (statusFilter === 'completed') items = items.filter(isCompleted)
    if (statusFilter === 'locked') items = items.filter((p) => !isCompleted(p))
    if (categoryFilter !== 'all') {
      items = items.filter((p) => p.achievement.category === categoryFilter)
    }
    return sortItems(items, sortMode)
  }, [progress, statusFilter, categoryFilter, sortMode])

  const grouped = useMemo(() => {
    if (sortMode !== 'category') return null
    const map = new Map<AchievementCategory, AchievementProgress[]>()
    for (const category of CATEGORY_ORDER) map.set(category, [])
    for (const item of filtered) {
      map.get(item.achievement.category)?.push(item)
    }
    return map
  }, [filtered, sortMode])

  if (!profile) return null

  const xp = gameEngine.getXpProgress(profile.xp)
  const completedCount = progress.filter(isCompleted).length
  const totalCount = progress.length
  const lockedCount = totalCount - completedCount

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          <Trophy className="mr-1 size-3.5 text-amber-500" />
          Rewards
        </Badge>
        <h1 className="mt-2 text-2xl font-semibold">Gamification</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Earn XP and unlock achievements across tasks, focus, and consistency.
        </p>
      </motion.header>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`rounded-full bg-muted p-1.5 ${STAT_TONES.level}`}>
                <Sparkles className="size-4" />
              </span>
              Level
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{profile.level}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`rounded-full bg-muted p-1.5 ${STAT_TONES.coins}`}>
                <Coins className="size-4" />
              </span>
              Coins
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{profile.coins}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`rounded-full bg-muted p-1.5 ${STAT_TONES.streak}`}>
                <Flame className="size-4" />
              </span>
              Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{profile.streak}d</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className={`rounded-full bg-muted p-1.5 ${STAT_TONES.completed}`}>
                <Trophy className="size-4" />
              </span>
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {completedCount}
            <span className="text-base font-normal text-muted-foreground"> / {totalCount}</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            XP — {xp.current} / {xp.max}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xp.percent}%` }}
              className="h-full rounded-full bg-emerald-500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <TabsList>
              <TabsTrigger value="all">All ({totalCount})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
              <TabsTrigger value="locked">Locked ({lockedCount})</TabsTrigger>
            </TabsList>
          </Tabs>

          <Tabs value={sortMode} onValueChange={(value) => setSortMode(value as SortMode)}>
            <TabsList>
              <TabsTrigger value="completed-first">Completed first</TabsTrigger>
              <TabsTrigger value="progress">By progress</TabsTrigger>
              <TabsTrigger value="category">By category</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs
          value={categoryFilter}
          onValueChange={(value) =>
            setCategoryFilter(value as 'all' | AchievementCategory)
          }
        >
          <TabsList className="flex h-auto flex-wrap">
            <TabsTrigger value="all">All categories</TabsTrigger>
            {CATEGORY_ORDER.map((category) => (
              <TabsTrigger key={category} value={category}>
                {CATEGORY_LABELS[category]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No achievements match these filters.</p>
      ) : sortMode === 'category' && grouped ? (
        CATEGORY_ORDER.map((category) => {
          const items = grouped.get(category) ?? []
          if (items.length === 0) return null
          return (
            <section key={category} className="space-y-3">
              <h2 className="flex items-center justify-between text-sm font-medium">
                <span>{CATEGORY_LABELS[category]}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {items.filter(isCompleted).length} / {items.length} completed
                </span>
              </h2>
              {items.map((item, i) => (
                <AchievementCard key={item.achievement.id} index={i} progress={item} />
              ))}
            </section>
          )
        })
      ) : (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Showing {filtered.length} achievement{filtered.length === 1 ? '' : 's'}
          </h2>
          {filtered.map((item, i) => (
            <AchievementCard key={item.achievement.id} index={i} progress={item} />
          ))}
        </section>
      )}
    </div>
  )
}
