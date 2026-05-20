'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { TransitionLink } from '@/components/ui/TransitionLink'

/* ─── Types ──────────────────────────────────────────────────────────────────── */
export interface NavItem {
  num: string
  label: string
  href: string
}

interface MenuOverlayProps {
  isOpen: boolean
  onClose: () => void
  links: NavItem[]
}

/* ─── Static data ────────────────────────────────────────────────────────────── */
const SOCIALS = [
  { label: 'Instagram',  href: '#' },
  { label: 'Twitter / X', href: '#' },
  { label: 'Vimeo',      href: '#' },
  { label: 'Letterboxd', href: '#' },
]

const MARQUEE_TEXT =
  'CINÉMASCOPE · EDITORIAL CINEMA · EST. 2024 · SELECTED WORKS · DIRECTION · CINEMATOGRAPHY · SOUND DESIGN · COLOUR GRADING · '

/* ─── Component ──────────────────────────────────────────────────────────────── */
export function MenuOverlay({ isOpen, onClose, links }: MenuOverlayProps) {
  const overlayRef    = useRef<HTMLDivElement>(null)
  const linkRefs      = useRef<(HTMLSpanElement | null)[]>([])
  const numRefs       = useRef<(HTMLSpanElement | null)[]>([])
  const lineRefs      = useRef<(HTMLDivElement | null)[]>([])
  const socialsRef    = useRef<HTMLDivElement>(null)
  const copyrightRef  = useRef<HTMLParagraphElement>(null)
  const marqueeRef    = useRef<HTMLDivElement>(null)
  const openTL        = useRef<gsap.core.Timeline | null>(null)
  const closeTL       = useRef<gsap.core.Timeline | null>(null)
  const marqueeAnim   = useRef<gsap.core.Tween | null>(null)
  const hasOpened     = useRef(false)

  /* ── Keyboard close ──────────────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  /* ── Open / close sequence ───────────────────────────────────────────────── */
  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    if (isOpen) {
      /* ── Kill any running close ── */
      closeTL.current?.kill()
      marqueeAnim.current?.kill()

      /* ── Set initial state of animated elements ── */
      gsap.set(overlay,            { visibility: 'visible', clipPath: 'inset(0 0 100% 0)' })
      gsap.set(linkRefs.current,   { y: 90, opacity: 0 })
      gsap.set(numRefs.current,    { opacity: 0, x: 40 })
      gsap.set(lineRefs.current,   { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(socialsRef.current?.querySelectorAll('.social-item') ?? [],
               { y: 20, opacity: 0 })
      gsap.set(copyrightRef.current, { opacity: 0 })

      const tl = gsap.timeline()
      openTL.current = tl

      /* 1 — Overlay curtain drops from top */
      tl.to(overlay, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.75,
        ease: 'power4.inOut',
      })

      /* 2 — Horizontal rule lines extend */
      tl.to(lineRefs.current.filter(Boolean), {
        scaleX: 1,
        duration: 0.6,
        ease: 'power3.inOut',
        stagger: 0.06,
      }, '-=0.5')

      /* 3 — Link texts slide up through mask */
      tl.to(linkRefs.current.filter(Boolean), {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'power3.out',
        stagger: 0.08,
      }, '-=0.45')

      /* 4 — Decorative numbers drift in (parallel) */
      tl.to(numRefs.current.filter(Boolean), {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.08,
      }, '<')

      /* 5 — Social links rise */
      tl.to(socialsRef.current?.querySelectorAll('.social-item') ?? [], {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.05,
      }, '-=0.25')

      tl.to(copyrightRef.current, { opacity: 1, duration: 0.4 }, '<0.1')

      /* 6 — Marquee: calculate one-copy width, then loop */
      tl.call(() => {
        if (!marqueeRef.current) return
        const firstChild = marqueeRef.current.children[0] as HTMLElement | null
        const w = firstChild?.offsetWidth ?? 0
        if (w === 0) return
        marqueeAnim.current = gsap.to(marqueeRef.current, {
          x: -w,
          duration: 22,
          ease: 'none',
          repeat: -1,
        })
      })

      hasOpened.current = true

    } else if (hasOpened.current) {
      /* ── Kill open timeline ── */
      openTL.current?.kill()
      marqueeAnim.current?.kill()

      const tl = gsap.timeline({
        onComplete: () => gsap.set(overlay, { visibility: 'hidden' }),
      })
      closeTL.current = tl

      /* 1 — Links exit upward (fast stagger) */
      tl.to(linkRefs.current.filter(Boolean), {
        y: -50,
        opacity: 0,
        duration: 0.38,
        ease: 'power2.in',
        stagger: 0.05,
      })

      /* 2 — Socials fade out */
      tl.to(socialsRef.current?.querySelectorAll('.social-item') ?? [], {
        opacity: 0,
        duration: 0.2,
      }, '<0.1')

      /* 3 — Curtain lifts up */
      tl.to(overlay, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.6,
        ease: 'power4.inOut',
      }, '-=0.15')
    }

    return () => {
      openTL.current?.kill()
      closeTL.current?.kill()
      marqueeAnim.current?.kill()
    }
  }, [isOpen])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[8500] flex flex-col"
      style={{
        backgroundColor: '#0d0d14',
        visibility: 'hidden',
        clipPath: 'inset(0 0 100% 0)',
      }}
    >
      {/* ── Top bar: brand + close ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between shrink-0 px-8 md:px-14 h-[76px]">
        <span className="font-sans text-[11px] font-semibold tracking-[0.32em] uppercase text-gold">
          Cinémascope
        </span>

        {/* Close × */}
        <button
          onClick={onClose}
          className="group relative flex items-center justify-center w-10 h-10"
          aria-label="Close menu"
        >
          <span className="absolute h-px w-6 bg-foreground/60 rotate-45 group-hover:bg-foreground group-hover:w-7 transition-all duration-300" />
          <span className="absolute h-px w-6 bg-foreground/60 -rotate-45 group-hover:bg-foreground group-hover:w-7 transition-all duration-300" />
        </button>
      </div>

      {/* ── Nav links ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-14 lg:px-20 overflow-hidden">
        {/* Top rule */}
        <div
          ref={el => { lineRefs.current[0] = el }}
          className="h-px bg-foreground/[0.08]"
        />

        {links.map((link, i) => (
          <div key={link.label} className="relative group">
            {/* Decorative large background number */}
            <span
              ref={el => { numRefs.current[i] = el }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 font-serif font-bold leading-none text-foreground/[0.03] select-none pointer-events-none"
              style={{ fontSize: 'clamp(6rem, 14vw, 15rem)' }}
              aria-hidden="true"
            >
              {link.num}
            </span>

            <TransitionLink
              href={link.href}
              onClick={onClose}
              className="relative z-10 flex items-center gap-5 py-4 lg:py-5 w-full"
            >
              {/* Small index number */}
              <span className="font-sans text-[9px] tracking-[0.32em] text-gold/40 w-5 shrink-0 tabular-nums">
                {link.num}
              </span>

              {/* Overflow mask → slide-up reveal */}
              <span className="overflow-hidden block leading-[0.9]">
                <span
                  ref={el => { linkRefs.current[i] = el }}
                  className="block font-serif font-bold leading-[0.9] text-foreground/90 group-hover:text-gold transition-colors duration-400"
                  style={{ fontSize: 'clamp(2.6rem, 5.2vw, 6.5rem)' }}
                >
                  {link.label}
                </span>
              </span>

              {/* Diagonal arrow — appears on hover */}
              <span
                className="ml-auto font-sans text-sm text-gold opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                aria-hidden="true"
              >
                ↗
              </span>
            </TransitionLink>

            {/* Bottom rule for each row */}
            <div
              ref={el => { lineRefs.current[i + 1] = el }}
              className="h-px bg-foreground/[0.08]"
            />
          </div>
        ))}
      </div>

      {/* ── Bottom: socials + marquee ─────────────────────────────────────────── */}
      <div className="shrink-0">
        {/* Social links row */}
        <div
          ref={socialsRef}
          className="flex items-end justify-between px-8 md:px-14 pb-5 pt-2"
        >
          <div className="flex flex-col gap-3">
            <span className="social-item font-sans text-[9px] tracking-[0.4em] uppercase text-muted/40">
              Follow
            </span>
            <div className="flex items-center gap-5 flex-wrap">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  className="social-item font-sans text-[11px] text-foreground/40 hover:text-foreground/80 transition-colors duration-200 tracking-wider"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <p
            ref={copyrightRef}
            className="font-sans text-[9px] tracking-[0.3em] uppercase text-foreground/20"
          >
            &copy; {new Date().getFullYear()} Cinémascope
          </p>
        </div>

        {/* Marquee strip */}
        <div className="border-t border-foreground/[0.06] overflow-hidden py-[10px]">
          <div ref={marqueeRef} className="inline-flex whitespace-nowrap">
            {/* Two copies so GSAP can loop seamlessly */}
            {[0, 1].map(k => (
              <span
                key={k}
                className="font-sans text-[9px] tracking-[0.4em] uppercase text-foreground/20 pr-0"
              >
                {MARQUEE_TEXT}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
