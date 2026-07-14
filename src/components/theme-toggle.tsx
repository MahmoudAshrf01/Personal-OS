import { Moon, Sun } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false,
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return (
    <motion.div whileTap={{ scale: 0.92 }}>
      <Button
        variant="outline"
        size="icon"
        className={cn('rounded-full', className)}
        onClick={() => setDark((value) => !value)}
        aria-label="Toggle theme"
      >
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </motion.span>
      </Button>
    </motion.div>
  )
}
