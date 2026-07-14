import { useCallback, useEffect, useState } from 'react'

import {
  rewardCelebrationEngine,
  type RewardCelebration,
} from '@/engines/reward-celebration-engine'

export function useRewardCelebration() {
  const [current, setCurrent] = useState<RewardCelebration | null>(
    () => rewardCelebrationEngine.getCurrent(),
  )

  useEffect(() => {
    return rewardCelebrationEngine.subscribe(setCurrent)
  }, [])

  const complete = useCallback((id: string) => {
    rewardCelebrationEngine.onComplete(id)
  }, [])

  return { current, complete }
}
