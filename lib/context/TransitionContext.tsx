'use client'

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'

export type TransitionPhase = 'intro' | 'idle' | 'entering' | 'holding' | 'exiting'

interface TransitionContextValue {
  phase: TransitionPhase
  counter: number
  navigateTo: (href: string) => void
  completeIntro: () => void
}

const TransitionContext = createContext<TransitionContextValue>({
  phase: 'intro',
  counter: 0,
  navigateTo: () => {},
  completeIntro: () => {},
})

const ENTER_MS = 800
const HOLD_MS  = 300

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms))
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router   = useRouter()
  const [phase,   setPhase]   = useState<TransitionPhase>('intro')
  const [counter, setCounter] = useState(0)
  const busyRef = useRef(false)
  const rafRef  = useRef(0)

  const completeIntro = useCallback(() => setPhase('idle'), [])

  const navigateTo = useCallback(async (href: string) => {
    if (busyRef.current || phase !== 'idle') return
    busyRef.current = true

    setCounter(0)
    setPhase('entering')

    /* Smooth 0 → 100 count during the enter phase */
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - t0) / ENTER_MS, 1)
      setCounter(Math.round(p * 100))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    await sleep(ENTER_MS)
    cancelAnimationFrame(rafRef.current)
    setCounter(100)

    /* Navigate while panel covers the screen */
    setPhase('holding')
    router.push(href)

    await sleep(HOLD_MS)
    setPhase('exiting')

    await sleep(ENTER_MS)
    setPhase('idle')
    setCounter(0)
    busyRef.current = false
  }, [phase, router])

  return (
    <TransitionContext.Provider value={{ phase, counter, navigateTo, completeIntro }}>
      {children}
    </TransitionContext.Provider>
  )
}

export function usePageTransition() {
  return useContext(TransitionContext)
}
