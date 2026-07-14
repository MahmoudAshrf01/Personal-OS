import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { motion } from 'motion/react'
import { BookOpen, Plus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { JournalEntry } from '@/domain/journal'
import { journalRepository } from '@/repositories/journal-repository'

export function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [content, setContent] = useState('')

  const load = () => journalRepository.getAll().then(setEntries)
  useEffect(() => {
    load()
  }, [])

  const handleAdd = async () => {
    if (!content.trim()) return
    await journalRepository.create({
      date: dayjs().format('YYYY-MM-DD'),
      content,
      mood: 'good',
    })
    setContent('')
    load()
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          <BookOpen className="mr-1 size-3.5" />
          Journal
        </Badge>
        <h1 className="mt-2 text-2xl font-semibold">Daily reflection</h1>
      </motion.header>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <Textarea
            placeholder="How was your day?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
          <Button onClick={handleAdd}>
            <Plus className="size-4" />
            Save entry
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{dayjs(entry.date).format('MMMM D, YYYY')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{entry.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
