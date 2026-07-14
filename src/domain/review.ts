export type ReviewPeriod = 'weekly' | 'monthly'

export interface Review {
  id: string
  period: ReviewPeriod
  startDate: string
  endDate: string
  summary: string
  highlights: string[]
  improvements: string[]
  createdAt: string
}
