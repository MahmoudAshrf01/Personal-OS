export interface Note {
  id: string
  title: string
  content: string
  archived: boolean
  createdAt: string
  updatedAt: string
}

export type NoteDraft = Pick<Note, 'title'> & Partial<Pick<Note, 'content' | 'archived'>>
