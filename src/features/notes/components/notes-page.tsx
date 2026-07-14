import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { NotebookPen, Plus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Note } from '@/domain/note'
import { noteRepository } from '@/repositories/note-repository'

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const load = () => noteRepository.getAll().then(setNotes)
  useEffect(() => {
    load()
  }, [])

  const handleAdd = async () => {
    if (!title.trim()) return
    await noteRepository.create({ title, content })
    setTitle('')
    setContent('')
    load()
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          <NotebookPen className="mr-1 size-3.5" />
          Notes
        </Badge>
        <h1 className="mt-2 text-2xl font-semibold">Rich notes</h1>
      </motion.header>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea
            placeholder="Write your note… (TipTap-ready content field)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
          <Button onClick={handleAdd}>
            <Plus className="size-4" />
            Save note
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {notes.map((note, i) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{note.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{note.content || 'Empty note'}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
