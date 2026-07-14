import { useEffect, useState, type ReactNode } from 'react'

import { bootstrapDatabase } from '@/database/bootstrap'

export function AppProviders({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    bootstrapDatabase()
      .then(() => setReady(true))
      .catch(console.error)
  }, [])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Loading Personal OS…</div>
      </div>
    )
  }

  return <>{children}</>
}
