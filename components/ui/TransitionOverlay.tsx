'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls, type Variants } from 'framer-motion'
import { usePageTransition, type TransitionPhase } from '@/lib/context/TransitionContext'

/* ─── Constants ─────────────────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1]
const DURATION = 0.8
const BRAND    = 'Cinémascope'

/* Stagger math: N chars × 65 ms + 500 ms last-letter + 320 ms hold */
const LETTER_STAGGER  = 65
const LETTER_DURATION = 500
const HOLD_AFTER_LETTERS = 320
const STAGGER_WAIT = BRAND.length * LETTER_STAGGER + LETTER_DURATION + HOLD_AFTER_LETTERS

function sleep(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms))
}

/* ─── Variants ──────────────────────────────────────────────────────────────── */

/** Stagger container for the intro letters */
const letterContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: LETTER_STAGGER / 1000 } },
  exit:    { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
}

/** Individual letter */
const letterVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0,  transition: { duration: LETTER_DURATION / 1000, ease: EASE } },
  exit:    { opacity: 0, y: -20, transition: { duration: 0.25, ease: EASE } },
}

/** Counter block fade */
const counterVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}

/* ─── Component ─────────────────────────────────────────────────────────────── */

export function TransitionOverlay() {
  const { phase, counter, completeIntro } = usePageTransition()
  const controls       = useAnimationControls()
  const [showLetters,  setShowLetters]  = useState(false)
  const [showGoldRule, setShowGoldRule] = useState(false)
  const introDoneRef   = useRef(false)

  /* ── Intro sequence (runs only once on mount) ─────────────────────────────── */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function runIntro() {
      /* Panel starts covering the screen (set by initial prop) */
      controls.set({ y: '0%' })

      await sleep(380)
      setShowLetters(true)

      /* Wait for all letters to finish + hold */
      await sleep(STAGGER_WAIT)
      setShowGoldRule(true)

      await sleep(220)
      setShowLetters(false)
      setShowGoldRule(false)

      await sleep(180) // brief pause before exit

      /* Slide panel up, revealing the hero */
      await controls.start({
        y: '-100%',
        transition: { duration: DURATION, ease: EASE },
      })

      /* Reset to below screen for page transitions */
      controls.set({ y: '100%' })
      introDoneRef.current = true
      completeIntro()
    }

    runIntro()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intentional: intro runs exactly once on mount

  /* ── Page-transition animation ───────────────────────────────────────────── */
  useEffect(() => {
    if (!introDoneRef.current) return

    if (phase === 'entering') {
      /* Panel rises from below to cover screen */
      controls.start({ y: '0%',    transition: { duration: DURATION, ease: EASE } })
    } else if (phase === 'exiting') {
      /* Panel slides up, revealing new page */
      controls.start({ y: '-100%', transition: { duration: DURATION, ease: EASE } })
    } else if (phase === 'idle') {
      /* Instant reset; overlay is off-screen so the jump is invisible */
      controls.set({ y: '100%' })
    }
  }, [phase, controls])

  /* ── Scroll lock ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    document.body.style.overflow = phase !== 'idle' ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [phase])

  const isActive: boolean =
    phase === 'intro' || phase === 'entering' || phase === 'holding' || phase === 'exiting'

  /* Which content key to show inside AnimatePresence */
  const contentKey: TransitionPhase | null =
    phase === 'intro'
      ? 'intro'
      : phase === 'entering' || phase === 'holding'
      ? 'entering'
      : null

  return (
    <motion.div
      initial={{ y: '0%' }}   /* covers screen on first paint (intro) */
      animate={controls}
      className="fixed inset-0 z-[9000] flex flex-col items-center justify-center overflow-hidden bg-background"
      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
      aria-hidden="true"
    >

      {/* ── Inner content: letters ↔ counter — swapped with AnimatePresence ── */}
      <AnimatePresence mode="wait">

        {contentKey === 'intro' && showLetters && (
          <motion.div
            key="intro-letters"
            className="flex flex-col items-center gap-6"
            variants={letterContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Brand name letter-by-letter */}
            <div className="flex items-baseline overflow-hidden">
              {BRAND.split('').map((char, i) => (
                <motion.span
                  key={i}
                  variants={letterVariants}
                  className="font-serif text-5xl tracking-[0.04em] text-foreground"
                >
                  {char === ' ' ? ' ' : char}
                </motion.span>
              ))}
            </div>

            {/* Gold rule that appears after all letters */}
            <motion.span
              className="block h-px bg-gold"
              initial={{ scaleX: 0, originX: 0 }}
              animate={showGoldRule ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.45, ease: EASE }}
              style={{ width: '3rem' }}
            />
          </motion.div>
        )}

        {contentKey === 'entering' && (
          <motion.div
            key="page-counter"
            className="flex flex-col items-center"
            variants={counterVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Large low-opacity numeral */}
            <span
              className="select-none font-serif leading-none text-foreground/[0.055]"
              style={{ fontSize: 'clamp(5rem, 14vw, 10rem)' }}
            >
              {String(counter).padStart(2, '0')}
            </span>
          </motion.div>
        )}

      </AnimatePresence>

      {/* ── Scanning line (page transitions only) ─────────────────────────── */}
      {(phase === 'entering' || phase === 'holding') && (
        <motion.div
          className="absolute left-0 right-0 h-px bg-foreground/[0.035]"
          initial={{ top: '0%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 1.8, ease: 'linear', repeat: Infinity }}
        />
      )}

      {/* ── Gold progress bar (page transitions only) ─────────────────────── */}
      {(phase === 'entering' || phase === 'holding') && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-surface-elevated">
          <div
            className="h-full bg-gold"
            style={{ width: `${counter}%`, transition: 'width 16ms linear' }}
          />
        </div>
      )}

      {/* ── Persistent brand watermark ─────────────────────────────────────── */}
      <span className="absolute bottom-7 left-7 font-serif italic text-sm text-foreground/[0.15]">
        Cinémascope
      </span>

      {/* ── Corner frame marks ─────────────────────────────────────────────── */}
      {(['top-5 left-5', 'top-5 right-5', 'bottom-5 left-5', 'bottom-5 right-5'] as const).map(pos => (
        <span
          key={pos}
          className={`absolute ${pos} h-5 w-5 opacity-20`}
          style={{
            borderColor: 'var(--color-gold)',
            borderTopWidth:    pos.includes('top')    ? 1 : 0,
            borderBottomWidth: pos.includes('bottom') ? 1 : 0,
            borderLeftWidth:   pos.includes('left')   ? 1 : 0,
            borderRightWidth:  pos.includes('right')  ? 1 : 0,
          }}
        />
      ))}
    </motion.div>
  )
}
