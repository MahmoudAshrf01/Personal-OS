import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()

  useEffect(() => {
    let gPressed = false
    let gTimeout: ReturnType<typeof setTimeout>

    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      if (e.key === 'g') {
        gPressed = true
        clearTimeout(gTimeout)
        gTimeout = setTimeout(() => {
          gPressed = false
        }, 1000)
        return
      }

      if (gPressed) {
        if (e.key === 't') navigate('/tasks')
        if (e.key === 'a') navigate('/analytics')
        if (e.key === 'd') navigate('/')
        gPressed = false
        return
      }

      if (e.key === '/') {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('[data-search-input]')?.focus()
      }
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      clearTimeout(gTimeout)
    }
  }, [navigate])
}
