import dayjs from 'dayjs'
import {
  Anchor,
  Award,
  BadgeCheck,
  Brain,
  Building2,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronUp,
  CircleDot,
  ClipboardList,
  Clock,
  Coffee,
  Compass,
  Crosshair,
  Crown,
  Diamond,
  Dumbbell,
  Eye,
  Flag,
  Flame,
  Flower2,
  Gem,
  Hammer,
  Hash,
  Heart,
  Hourglass,
  Inbox,
  Infinity as InfinityIcon,
  Layers,
  Lightbulb,
  Link2,
  ListTodo,
  Map,
  Medal,
  Mountain,
  Orbit,
  Repeat,
  Rocket,
  Shield,
  ShieldCheck,
  Sparkle,
  Sparkles,
  Star,
  Stars,
  Sun,
  Swords,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  Watch,
  Waves,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'motion/react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { AchievementProgress } from '@/domain/gamification'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  list: ListTodo,
  clipboard: ClipboardList,
  layers: Layers,
  lightbulb: Lightbulb,
  inbox: Inbox,
  eye: Eye,
  check: Check,
  'thumbs-up': BadgeCheck,
  zap: Zap,
  flag: Flag,
  medal: Medal,
  rocket: Rocket,
  bolt: Zap,
  trophy: Trophy,
  hammer: Hammer,
  dumbbell: Dumbbell,
  crown: Crown,
  gem: Gem,
  timer: Timer,
  coffee: Coffee,
  hourglass: Hourglass,
  brain: Brain,
  focus: Target,
  clock: Clock,
  waves: Waves,
  mountain: Mountain,
  lotus: Flower2,
  watch: Watch,
  spark: Sparkle,
  repeat: Repeat,
  heart: Heart,
  flame: Flame,
  'calendar-days': CalendarDays,
  link: Link2,
  calendar: Calendar,
  candle: Flame,
  shield: Shield,
  anchor: Anchor,
  infinity: InfinityIcon,
  'check-circle': CheckCircle2,
  'circle-dot': CircleDot,
  star: Star,
  stars: Stars,
  sun: Sun,
  'gem-day': Gem,
  diamond: Diamond,
  'chevron-up': ChevronUp,
  'trending-up': TrendingUp,
  award: Award,
  badge: BadgeCheck,
  hash: Hash,
  swords: Swords,
  'shield-check': ShieldCheck,
  'medal-gold': Medal,
  'crown-level': Crown,
  orbit: Orbit,
  target: Target,
  crosshair: Crosshair,
  map: Map,
  compass: Compass,
  building: Building2,
}

export function AchievementCard({
  progress,
  index,
}: {
  progress: AchievementProgress
  index: number
}) {
  const { achievement, current, percent } = progress
  const completed = Boolean(achievement.unlockedAt)
  const Icon = ICON_MAP[achievement.icon] ?? Trophy

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index, 12) * 0.03 }}
    >
      <Card
        className={cn(
          'transition-colors',
          completed ? 'border-emerald-500/40' : 'opacity-70',
        )}
      >
        <CardContent className="flex gap-4 py-4">
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full',
              completed
                ? 'bg-emerald-500/20 text-emerald-500'
                : 'bg-muted text-muted-foreground',
            )}
          >
            <Icon className="size-5" />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={cn('font-medium', completed && 'text-emerald-700 dark:text-emerald-400')}>
                  {achievement.title}
                </p>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
              {completed ? (
                <Badge className="bg-emerald-500 text-white hover:bg-emerald-500">Completed</Badge>
              ) : (
                <Badge variant="outline">Locked</Badge>
              )}
            </div>

            <div className="space-y-1">
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    completed ? 'bg-emerald-500' : 'bg-primary',
                  )}
                  style={{ width: `${completed ? 100 : percent}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground">
                {completed
                  ? `${achievement.threshold} / ${achievement.threshold}`
                  : `${Math.min(current, achievement.threshold)} / ${achievement.threshold}`}
              </p>
            </div>

            <p className="text-[10px] text-muted-foreground">
              +{achievement.xpReward} XP · +{achievement.coinReward} coins
              {completed && achievement.unlockedAt
                ? ` · ${dayjs(achievement.unlockedAt).format('MMM D, YYYY')}`
                : null}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
