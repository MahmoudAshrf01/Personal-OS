import { liveQuery } from 'dexie'
import { useEffect, useState } from 'react'

import { db } from '@/database/db'
import type { UserProfile } from '@/domain/gamification'

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    const subscription = liveQuery(() => db.profile.get('default')).subscribe((value) => {
      setProfile(value ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  return profile
}
