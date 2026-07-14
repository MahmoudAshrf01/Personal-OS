import { Volume2, VolumeX } from 'lucide-react'
import { motion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { useSoundMuted } from '@/hooks/use-sound-muted'
import { soundEngine } from '@/lib/sounds/sound-engine'
import { cn } from '@/lib/utils'

type SoundToggleProps = {
  className?: string
  grouped?: boolean
  size?: 'default' | 'lg'
}

export function SoundToggle({ className, grouped = false, size = 'default' }: SoundToggleProps) {
  const muted = useSoundMuted()

  return (
    <motion.div whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.03 }}>
      <Button
        sound={false}
        variant={grouped ? 'ghost' : 'outline'}
        size={size === 'lg' ? 'icon-lg' : 'icon'}
        className={cn(grouped ? 'rounded-lg' : 'rounded-xl', className)}
        onClick={() => soundEngine.toggleMuted()}
        aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
        aria-pressed={muted}
      >
        <motion.span
          key={muted ? 'muted' : 'unmuted'}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {muted ? (
            <VolumeX className={size === 'lg' ? 'size-5' : 'size-4'} />
          ) : (
            <Volume2 className={size === 'lg' ? 'size-5' : 'size-4'} />
          )}
        </motion.span>
      </Button>
    </motion.div>
  )
}
