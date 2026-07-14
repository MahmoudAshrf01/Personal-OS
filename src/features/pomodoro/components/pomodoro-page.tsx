import { useCallback, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Pause, Play, RotateCcw, Timer } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { eventRepository } from '@/repositories/event-repository'

const DEFAULT_MINUTES = 25

export function PomodoroPage() {
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_MINUTES * 60)
  const [running, setRunning] = useState(false)

  const reset = useCallback(() => {
    setRunning(false)
    setSecondsLeft(DEFAULT_MINUTES * 60)
  }, [])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setRunning(false)
          eventRepository.create({ type: 'pomodoro_finished', payload: { minutes: DEFAULT_MINUTES } })
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [running])

  const mins = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60

  return (
    <div className="mx-auto flex max-w-md flex-col items-center space-y-6 p-4 sm:p-6">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          <Timer className="mr-1 size-3.5" />
          Pomodoro
        </Badge>
        <h1 className="mt-2 text-2xl font-semibold">Focus timer</h1>
      </motion.header>

      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-5xl font-mono tabular-nums">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center gap-3">
          <Button size="lg" onClick={() => setRunning((r) => !r)}>
            {running ? <Pause className="size-5" /> : <Play className="size-5" />}
            {running ? 'Pause' : 'Start'}
          </Button>
          <Button size="lg" variant="outline" onClick={reset}>
            <RotateCcw className="size-5" />
            Reset
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
