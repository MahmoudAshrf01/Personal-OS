export type GroupType = 'task' | 'goal'

export interface Group {
  id: string
  name: string
  parentId: string | null
  type: GroupType
  color: string | null
  createdAt: string
}

export type GroupDraft = Pick<Group, 'name' | 'type'> &
  Partial<Pick<Group, 'parentId' | 'color'>>
