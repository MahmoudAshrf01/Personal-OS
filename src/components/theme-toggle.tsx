import { Moon, Sun } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  className?: string
  size?: 'default' | 'lg'
}

export function ThemeToggle({ className, size = 'default' }: ThemeToggleProps) {
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false,
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <motion.div whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.03 }}>
      <Button
        variant="outline"
        size={size === 'lg' ? 'icon-lg' : 'icon'}
        className={cn('rounded-xl', className)}
        onClick={() => setDark((value) => !value)}
        aria-label="Toggle theme"
      >
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {dark ? (
            <Sun className={size === 'lg' ? 'size-5' : 'size-4'} />
          ) : (
            <Moon className={size === 'lg' ? 'size-5' : 'size-4'} />
          )}
        </motion.span>
      </Button>
    </motion.div>
  )
}
