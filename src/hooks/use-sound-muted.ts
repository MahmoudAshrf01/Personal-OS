import { useSyncExternalStore } from 'react'

import { soundEngine } from '@/lib/sounds/sound-engine'

export function useSoundMuted() {
  return useSyncExternalStore(
    (onStoreChange) => soundEngine.subscribe(onStoreChange),
    () => soundEngine.isMuted(),
    () => false,
  )
}
