import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Coins, Flame, Sparkles, Trophy } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Achievement, UserProfile } from '@/domain/gamification'
import { XP_PER_LEVEL } from '@/domain/gamification'
import { gameEngine } from '@/engines/game-engine'

export function GamificationPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])

  useEffect(() => {
    gameEngine.getProfile().then(setProfile)
    gameEngine.getAchievements().then(setAchievements)
  }, [])

  if (!profile) return null

  const xp = gameEngine.getXpProgress(profile.xp)

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          <Trophy className="mr-1 size-3.5" />
          Rewards
        </Badge>
        <h1 className="mt-2 text-2xl font-semibold">Gamification</h1>
      </motion.header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4" /> Level
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{profile.level}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="size-4" /> Coins
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{profile.coins}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-muted-foreground">
              <Flame className="size-4" /> Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">{profile.streak}d</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">XP — {xp.current} / {XP_PER_LEVEL}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xp.percent}%` }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="text-sm font-medium">Achievements</h2>
        {achievements.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={a.unlockedAt ? 'border-primary/30' : 'opacity-60'}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                </div>
                {a.unlockedAt ? (
                  <Badge>Unlocked</Badge>
                ) : (
                  <Badge variant="outline">Locked</Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
