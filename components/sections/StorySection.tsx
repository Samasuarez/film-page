'use client'

import { Fragment, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

/* ─── Panel data ──────────────────────────────────────────────────────────── */
interface PanelData {
  eyebrow: string
  headlineL1: string
  headlineL2: string
  body: string
  bg: string
  tint: string
  side: 'left' | 'right'
}

const PANELS: PanelData[] = [
  {
    eyebrow: 'Chapter I',
    headlineL1: 'Memory',
    headlineL2: 'Fades',
    body: 'Three generations. One secret buried beneath the rubble of a city that no longer exists on any map.',
    bg: 'linear-gradient(155deg, #06011a 0%, #0d0522 55%, #050508 100%)',
    tint: 'radial-gradient(ellipse 80% 90% at 22% 58%, rgba(88,28,135,0.38) 0%, transparent 62%)',
    side: 'left',
  },
  {
    eyebrow: 'Chapter II',
    headlineL1: 'The Light',
    headlineL2: 'Remains',
    body: 'In the golden hour between dusk and dark, she found what her grandfather had hidden for fifty years.',
    bg: 'linear-gradient(145deg, #0e0800 0%, #1c0e00 55%, #050508 100%)',
    tint: 'radial-gradient(ellipse 70% 80% at 78% 42%, rgba(201,168,76,0.22) 0%, transparent 62%)',
    side: 'right',
  },
  {
    eyebrow: 'Chapter III',
    headlineL1: 'Across',
    headlineL2: 'Oceans',
    body: 'Two cities. Two wars. Two lives that should never have intersected — and yet, here we are.',
    bg: 'linear-gradient(150deg, #00100d 0%, #001a14 55%, #050508 100%)',
    tint: 'radial-gradient(ellipse 85% 95% at 18% 50%, rgba(16,110,74,0.28) 0%, transparent 62%)',
    side: 'left',
  },
  {
    eyebrow: 'Chapter IV',
    headlineL1: 'Eternal',
    headlineL2: 'Return',
    body: 'Some stories refuse to end. They echo across time, finding new voices in every generation.',
    bg: 'linear-gradient(148deg, #120008 0%, #1e0010 55%, #050508 100%)',
    tint: 'radial-gradient(ellipse 75% 85% at 68% 65%, rgba(175,28,52,0.32) 0%, transparent 62%)',
    side: 'right',
  },
]

const MARQUEE_TEXT = 'Cinémascope  ·  The Eternal Light  ·  2024  ·  Drama  ·  '

/* ─── Marquee strip ───────────────────────────────────────────────────────── */
function MarqueeStrip({
  trackRef,
  speed = 30,
}: {
  trackRef: (el: HTMLDivElement | null) => void
  speed?: number
}) {
  const content = MARQUEE_TEXT.repeat(12)
  return (
    <div
      className="relative overflow-hidden border-y border-foreground/[0.06] bg-background"
      style={{ height: 50 }}
    >
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      <div
        ref={trackRef}
        className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap"
        style={{ willChange: 'transform', '--speed': `${speed}s` } as React.CSSProperties}
      >
        <span className="font-sans text-[9.5px] tracking-[0.38em] uppercase text-foreground/[0.22]">
          {content}
        </span>
        <span
          className="font-sans text-[9.5px] tracking-[0.38em] uppercase text-foreground/[0.22]"
          aria-hidden="true"
        >
          {content}
        </span>
      </div>
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────────────────────── */
export function StorySection() {
  const sectionRef   = useRef<HTMLDivElement>(null)
  const panelRefs    = useRef<(HTMLDivElement | null)[]>([])
  const bgRefs       = useRef<(HTMLDivElement | null)[]>([])
  const eyebrowRefs  = useRef<(HTMLDivElement | null)[]>([])
  const ruleRefs     = useRef<(HTMLSpanElement | null)[]>([])
  const line1Refs    = useRef<(HTMLDivElement | null)[]>([])
  const line2Refs    = useRef<(HTMLDivElement | null)[]>([])
  const bodyRefs     = useRef<(HTMLParagraphElement | null)[]>([])
  const marqRefs     = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      /* ── Per-panel pinned scroll sequences ── */
      PANELS.forEach((_, i) => {
        const panel   = panelRefs.current[i]
        const bg      = bgRefs.current[i]
        const eyebrow = eyebrowRefs.current[i]
        const rule    = ruleRefs.current[i]
        const line1   = line1Refs.current[i]
        const line2   = line2Refs.current[i]
        const body    = bodyRefs.current[i]
        if (!panel) return

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top top',
            end: '+=100%',
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        /* 1 — Panel entrance: scale 0.94→1 + fade in (t=0→0.35) */
        tl.fromTo(panel,
          { scale: 0.94, opacity: 0 },
          { scale: 1,    opacity: 1, duration: 0.35, ease: 'none' },
          0,
        )

        /* 2 — Parallax background (t=0→2, subtler travel range) */
        if (bg) {
          tl.fromTo(bg,
            { y: '-10%' },
            { y: '10%', duration: 2, ease: 'none' },
            0,
          )
        }

        /* 3 — Text stagger entrances — compressed, smaller y values */
        if (eyebrow) tl.fromTo(eyebrow, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.30, ease: 'none' }, 0.03)
        if (rule)    tl.fromTo(rule,    { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.24, ease: 'none' }, 0.08)
        if (line1)   tl.fromTo(line1,   { y: 52, opacity: 0 }, { y: 0, opacity: 1, duration: 0.34, ease: 'none' }, 0.12)
        if (line2)   tl.fromTo(line2,   { y: 52, opacity: 0 }, { y: 0, opacity: 1, duration: 0.34, ease: 'none' }, 0.19)
        if (body)    tl.fromTo(body,    { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, ease: 'none' }, 0.26)

        /* 4 — Panel exit: fade out (t=1.5→2.0) */
        tl.to(panel, { opacity: 0, duration: 0.5, ease: 'none' }, 1.5)
      })

      /* ── Marquee infinite scroll ── */
      marqRefs.current.forEach((track, i) => {
        if (!track) return
        const first = track.firstElementChild as HTMLElement | null
        if (!first) return
        const w = first.offsetWidth
        /* Alternate durations so adjacent strips never sync */
        gsap.to(track, {
          x: -w,
          duration: i % 2 === 0 ? 30 : 24,
          ease: 'none',
          repeat: -1,
        })
      })
    }, sectionRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={sectionRef}>
      {PANELS.map((panel, i) => (
        <Fragment key={i}>

          {/* ── Marquee strip ── */}
          <MarqueeStrip
            trackRef={el => { marqRefs.current[i] = el }}
            speed={i % 2 === 0 ? 30 : 24}
          />

          {/* ── Story panel ── */}
          <div
            ref={el => { panelRefs.current[i] = el }}
            className="relative h-screen overflow-hidden"
            style={{ opacity: 0, willChange: 'transform, opacity' }}
          >
            {/* Parallax background layer */}
            <div
              ref={el => { bgRefs.current[i] = el }}
              className="absolute inset-x-0 pointer-events-none"
              style={{
                top: '-18%',
                bottom: '-18%',
                background: panel.bg,
                willChange: 'transform',
              }}
            >
              {/* Color tint */}
              <div className="absolute inset-0" style={{ background: panel.tint }} />
              {/* Noise texture */}
              <div
                className="absolute inset-0"
                style={{
                  opacity: 0.032,
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: '300px 300px',
                }}
              />
            </div>

            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 88% 78% at 50% 50%, transparent 30%, rgba(5,5,8,0.76) 100%)',
              }}
              aria-hidden="true"
            />

            {/* Vertical gold accent line */}
            <div
              className={cn(
                'absolute top-0 bottom-0 w-px pointer-events-none',
                panel.side === 'left' ? 'left-[7.5%]' : 'right-[7.5%]',
              )}
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, rgba(201,168,76,0.18) 25%, rgba(201,168,76,0.18) 75%, transparent 100%)',
              }}
              aria-hidden="true"
            />

            {/* ── Text content ── */}
            <div
              className={cn(
                'relative z-10 h-full flex flex-col justify-center',
                panel.side === 'left'
                  ? 'pl-[11%] pr-[30%]'
                  : 'pr-[11%] pl-[30%] items-end text-right',
              )}
            >
              {/* Eyebrow */}
              <div
                ref={el => { eyebrowRefs.current[i] = el }}
                className={cn(
                  'flex items-center gap-3 mb-5',
                  panel.side === 'right' && 'flex-row-reverse',
                )}
                style={{ opacity: 0 }}
              >
                <span className="h-px w-7 bg-gold/45" aria-hidden="true" />
                <span className="font-sans text-[10px] font-medium tracking-[0.42em] uppercase text-gold/70">
                  {panel.eyebrow}
                </span>
              </div>

              {/* Gold rule */}
              <span
                ref={el => { ruleRefs.current[i] = el }}
                className={cn(
                  'block h-px w-10 bg-gold/35 mb-8',
                  panel.side === 'left' ? 'origin-left' : 'origin-right',
                )}
                style={{ opacity: 0 }}
                aria-hidden="true"
              />

              {/* Headline line 1 */}
              <div
                ref={el => { line1Refs.current[i] = el }}
                className="mb-2"
                style={{ opacity: 0 }}
              >
                <span
                  className="block font-serif font-black leading-[0.88] tracking-tight text-foreground/92"
                  style={{ fontSize: 'clamp(4rem, 9vw, 11.5rem)' }}
                >
                  {panel.headlineL1}
                </span>
              </div>

              {/* Headline line 2 — italic gold */}
              <div
                ref={el => { line2Refs.current[i] = el }}
                className="mb-10"
                style={{ opacity: 0 }}
              >
                <span
                  className="block font-serif font-black italic leading-[0.88] tracking-tight text-gold"
                  style={{ fontSize: 'clamp(4rem, 9vw, 11.5rem)' }}
                >
                  {panel.headlineL2}
                </span>
              </div>

              {/* Body */}
              <p
                ref={el => { bodyRefs.current[i] = el }}
                className="max-w-[38ch] text-muted/70 text-[1.0625rem] leading-relaxed"
                style={{ opacity: 0 }}
              >
                {panel.body}
              </p>
            </div>

            {/* Chapter number watermark — opposite side from text */}
            <div
              className={cn(
                'absolute bottom-8 select-none pointer-events-none font-serif font-black',
                panel.side === 'left' ? 'right-[5%] text-right' : 'left-[5%] text-left',
              )}
              style={{
                fontSize: 'clamp(9rem, 20vw, 26rem)',
                lineHeight: 1,
                color: 'rgba(245,240,232,0.035)',
              }}
              aria-hidden="true"
            >
              0{i + 1}
            </div>
          </div>

        </Fragment>
      ))}

      {/* Final marquee */}
      <MarqueeStrip
        trackRef={el => { marqRefs.current[PANELS.length] = el }}
        speed={PANELS.length % 2 === 0 ? 30 : 24}
      />
    </div>
  )
}
