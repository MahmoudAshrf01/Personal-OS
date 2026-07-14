export interface JournalEntry {
  id: string
  date: string
  content: string
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'awful' | null
  createdAt: string
  updatedAt: string
}

export type JournalDraft = Pick<JournalEntry, 'date' | 'content'> &
  Partial<Pick<JournalEntry, 'mood'>>
