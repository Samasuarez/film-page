'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { TransitionLink } from '@/components/ui/TransitionLink'

/* ─── Static content ─────────────────────────────────────────────────────────── */
const TITLE_LINE_1 = 'The Eternal'
const TITLE_LINE_2 = 'Light'
const SUBTITLE = 'A sweeping epic about memory, loss, and the enduring power of human connection across three generations and two continents.'

/* ─── Floating orb config ────────────────────────────────────────────────────── */
const ORBS = [
  {
    size: 620,
    color: 'rgba(88,28,135,0.11)',
    blur: 110,
    style: { top: '-8%', left: '-18%' },
    animation: 'orb-float-1 19s ease-in-out infinite',
    delay: '0s',
  },
  {
    size: 420,
    color: 'rgba(109,40,217,0.07)',
    blur: 80,
    style: { top: '18%', right: '-12%' },
    animation: 'orb-float-2 24s ease-in-out infinite',
    delay: '-8s',
  },
  {
    size: 320,
    color: 'rgba(67,20,110,0.08)',
    blur: 90,
    style: { bottom: '8%', left: '28%' },
    animation: 'orb-float-3 17s ease-in-out infinite',
    delay: '-5s',
  },
] as const

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

/**
 * Wraps every character in an overflow-hidden mask so GSAP can slide them
 * upward from below (yPercent: 110 → 0).  Spaces are non-breaking so the
 * inline layout doesn't collapse.
 */
function SplitChars({
  text,
  refs,
  offset = 0,
  className,
}: {
  text: string
  refs: React.MutableRefObject<(HTMLSpanElement | null)[]>
  offset?: number
  className?: string
}) {
  return (
    <>
      {Array.from(text).map((char, i) =>
        char === ' ' ? (
          /* Spaces keep their width but don't need the mask trick */
          <span key={`sp-${i}`} className="inline-block">&nbsp;</span>
        ) : (
          <span
            key={`ch-${i}`}
            className="inline-block overflow-hidden"
            /* Small bottom pad so descenders (g, y…) aren't clipped at y:0 */
            style={{ paddingBottom: '0.08em', marginBottom: '-0.08em' }}
          >
            <span
              ref={el => { refs.current[offset + i] = el }}
              className={cn('inline-block will-change-transform', className)}
            >
              {char}
            </span>
          </span>
        )
      )}
    </>
  )
}

/* Count non-space chars in a string (used for ref-array offset) */
function charCount(s: string) {
  return Array.from(s).filter(c => c !== ' ').length
}

/* ─── Component ──────────────────────────────────────────────────────────────── */
export function Hero() {
  const sectionRef    = useRef<HTMLElement>(null)
  const bgRef         = useRef<HTMLDivElement>(null)
  /* All animated title chars share one ref array; line 2 starts at offset  */
  const charsRef      = useRef<(HTMLSpanElement | null)[]>([])
  const line1Count    = charCount(TITLE_LINE_1)     // excludes spaces
  const eyebrowRef    = useRef<HTMLDivElement>(null)
  const metaRef       = useRef<HTMLDivElement>(null)
  const subtitleRef   = useRef<HTMLParagraphElement>(null)
  const dividerRef    = useRef<HTMLSpanElement>(null)
  const ctaRef        = useRef<HTMLDivElement>(null)
  const scrollRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      /* ── Initial state for title chars ── */
      gsap.set(charsRef.current.filter(Boolean), { yPercent: 115 })

      /* ── Master timeline ── */
      const tl = gsap.timeline({ delay: 0.25 })

      /* 1 — Line 1 letters slide up */
      const l1 = charsRef.current.slice(0, line1Count).filter(Boolean)
      tl.to(l1, {
        yPercent: 0,
        duration: 1.05,
        ease: 'power4.out',
        stagger: { amount: 0.55 },
      })

      /* 2 — Line 2 letters (overlaps last 0.5s of line 1) */
      const l2 = charsRef.current.slice(line1Count).filter(Boolean)
      tl.to(l2, {
        yPercent: 0,
        duration: 1.15,
        ease: 'power4.out',
        stagger: { amount: 0.35 },
      }, '-=0.5')

      /* 3 — Eyebrow: starts at the same moment as line 1, 0.15s offset */
      tl.fromTo(eyebrowRef.current,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        '<-=1.0', // rewind to when line 1 chars began, keeps stagger feel
      )

      /* 4 — Divider rule: 0.15s after eyebrow START */
      tl.fromTo(dividerRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power3.inOut', transformOrigin: 'left center' },
        '<+0.15',
      )

      /* 5 — Subtitle: 0.15s after divider START */
      tl.fromTo(subtitleRef.current,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '<+0.15',
      )

      /* 6 — Meta strip: 0.15s after subtitle START */
      tl.fromTo(metaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        '<+0.15',
      )

      /* 7 — CTA: 0.15s after meta START */
      tl.fromTo(ctaRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        '<+0.15',
      )

      /* 8 — Scroll indicator: 0.15s after CTA START */
      tl.fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' },
        '<+0.15',
      )

      /* ── Background parallax on scroll ── */
      if (bgRef.current && sectionRef.current) {
        gsap.to(bgRef.current, {
          y: '22%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.4,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen items-center justify-center overflow-hidden"
    >
      {/* ── Parallax background container ───────────────────────────────────── */}
      <div ref={bgRef} className="absolute inset-0 -top-[20%] -bottom-[20%]">
        {/* Purple radial gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse 72% 55% at 28% 58%, rgba(88,28,135,0.09) 0%, transparent 68%)',
              'radial-gradient(ellipse 52% 38% at 74% 28%, rgba(109,40,217,0.055) 0%, transparent 60%)',
            ].join(', '),
          }}
        />

        {/* ── Floating orbs ───────────────────────────────────────────────── */}
        {ORBS.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle at 40% 40%, ${orb.color} 0%, transparent 70%)`,
              filter: `blur(${orb.blur}px)`,
              animation: orb.animation,
              animationDelay: orb.delay,
              ...orb.style,
            }}
            aria-hidden="true"
          />
        ))}

        {/* Bottom fade-to-background */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* ── Vignette ────────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(5,5,8,0.65) 100%)',
        }}
        aria-hidden="true"
      />

      {/* ── Corner frame marks ──────────────────────────────────────────────── */}
      <CornerMarks />

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center w-full max-w-6xl mx-auto">

        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="flex items-center gap-3 mb-8 opacity-0"
        >
          <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
          <span className="font-sans text-[10px] font-medium tracking-[0.42em] uppercase text-gold/80">
            2024 &middot; Drama &middot; 2h&nbsp;47m
          </span>
          <span className="h-px w-8 bg-gold/50" aria-hidden="true" />
        </div>

        {/* ── Giant title (Playfair 900, letter-by-letter) ─────────────────── */}
        <h1
          className="font-serif font-black leading-[0.92] tracking-tight text-center mb-2"
          /* Screen-reader gets the plain text; aria-hidden on spans */
          aria-label={`${TITLE_LINE_1} ${TITLE_LINE_2}`}
        >
          {/* Line 1 */}
          <div
            className="block"
            style={{ fontSize: 'clamp(4.5rem,8.5vw,11.25rem)' }}
            aria-hidden="true"
          >
            <SplitChars
              text={TITLE_LINE_1}
              refs={charsRef}
              offset={0}
              className="text-foreground/92"
            />
          </div>

          {/* Line 2 — italic gold, larger */}
          <div
            className="block italic"
            style={{ fontSize: 'clamp(6.5rem,12vw,15rem)' }}
            aria-hidden="true"
          >
            <SplitChars
              text={TITLE_LINE_2}
              refs={charsRef}
              offset={line1Count}
              className="text-gold"
            />
          </div>
        </h1>

        {/* Gold divider */}
        <span
          ref={dividerRef}
          className="block h-px w-14 bg-gold/60 mx-auto mt-6 mb-7 opacity-0"
          style={{ transformOrigin: 'left center' }}
          aria-hidden="true"
        />

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="max-w-[52ch] text-muted/80 leading-relaxed text-[1.0625rem] mb-5 opacity-0"
        >
          {SUBTITLE}
        </p>

        {/* Meta strip */}
        <div
          ref={metaRef}
          className="flex items-center gap-5 mb-10 opacity-0"
        >
          {['Dir. Sofia Marchetti', 'Cinemat. Lucas Vidal', 'Score: Hans Auer'].map((item, i) => (
            <span key={item} className="flex items-center gap-5">
              {i > 0 && <span className="h-3 w-px bg-foreground/20" aria-hidden="true" />}
              <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-foreground/35">
                {item}
              </span>
            </span>
          ))}
        </div>

        {/* ── CTA group ───────────────────────────────────────────────────── */}
        <div ref={ctaRef} className="flex items-center gap-5 opacity-0">
          {/* Ghost button with fill sweep */}
          <TransitionLink
            href="/about"
            className="group relative inline-flex items-center overflow-hidden border border-gold/30 hover:border-gold/55 px-10 py-[14px] transition-colors duration-500"
            style={{ transitionTimingFunction: 'cubic-bezier(0.76,0,0.24,1)' }}
          >
            {/* Gold fill — scales left → right on hover */}
            <span
              className="absolute inset-0 bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
              style={{ transitionTimingFunction: 'cubic-bezier(0.76,0,0.24,1)' }}
              aria-hidden="true"
            />
            <span className="relative z-10 font-sans text-[11px] font-medium tracking-[0.28em] uppercase text-foreground/80 group-hover:text-background transition-colors duration-500">
              Explore the Collection
            </span>
          </TransitionLink>

          {/* Secondary — play link */}
          <button
            className="group flex items-center gap-3 font-sans text-xs tracking-[0.2em] uppercase text-foreground/40 hover:text-foreground/80 transition-colors duration-300"
          >
            <span
              className="flex items-center justify-center w-9 h-9 rounded-full border border-foreground/20 group-hover:border-foreground/50 transition-colors duration-300"
              aria-hidden="true"
            >
              <svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
                <path d="M0 0l10 6-10 6V0z" />
              </svg>
            </span>
            View Trailer
          </button>
        </div>
      </div>

      {/* ── Scroll indicator ────────────────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-[10px] opacity-0 z-20"
      >
        <span className="font-sans text-[9px] tracking-[0.42em] uppercase text-foreground/35">
          Scroll
        </span>

        {/* Pulsing gold line */}
        <div className="relative w-px h-16 overflow-hidden bg-foreground/10">
          <div className="absolute inset-x-0 top-0 h-full bg-gold scroll-line-fill" />
        </div>
      </div>
    </section>
  )
}

/* ─── Corner marks ───────────────────────────────────────────────────────────── */
function CornerMarks() {
  const corners: [string, Record<string, boolean>][] = [
    ['top-5 left-5',    { borderTop: true,    borderLeft: true  }],
    ['top-5 right-5',   { borderTop: true,    borderRight: true }],
    ['bottom-5 left-5', { borderBottom: true, borderLeft: true  }],
    ['bottom-5 right-5',{ borderBottom: true, borderRight: true }],
  ]

  return (
    <>
      {corners.map(([pos, sides]) => (
        <span
          key={pos}
          className={`absolute ${pos} h-5 w-5 opacity-25 pointer-events-none`}
          style={{
            borderColor: 'var(--color-gold)',
            borderTopWidth:    sides.borderTop    ? 1 : 0,
            borderBottomWidth: sides.borderBottom ? 1 : 0,
            borderLeftWidth:   sides.borderLeft   ? 1 : 0,
            borderRightWidth:  sides.borderRight  ? 1 : 0,
          }}
          aria-hidden="true"
        />
      ))}
    </>
  )
}
