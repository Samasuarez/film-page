import type { Variants } from 'framer-motion'

const easeFilmic = [0.25, 0.46, 0.45, 0.94] as const

/* Page-level fade used by PageTransition */
export const pageVariants: Variants = {
  initial: { opacity: 0 },
  enter:   { opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.35, ease: 'easeIn' } },
}

/* Fade up — primary reveal for most content blocks */
export const fadeUpVariants: Variants = {
  initial: { opacity: 0, y: 32 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: easeFilmic },
  },
}

/* Orchestration wrapper — staggers children */
export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.2,
    },
  },
}

/* Slide in from left */
export const slideInVariants: Variants = {
  initial: { opacity: 0, x: -28 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: easeFilmic },
  },
}

/* Scale pop for cards / posters */
export const scaleInVariants: Variants = {
  initial: { opacity: 0, scale: 0.94 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeFilmic },
  },
}

/* Simple clip reveal — use with overflow-hidden parent */
export const clipRevealVariants: Variants = {
  initial: { clipPath: 'inset(0 100% 0 0)' },
  animate: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 1.1, ease: easeFilmic },
  },
}
