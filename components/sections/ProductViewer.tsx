'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { cn } from '@/lib/utils'

/* ─── Dynamic Three.js import (no SSR) ──────────────────────────────────── */
const BottleCanvas = dynamic(
  () => import('@/components/ui/ProductCanvas').then(m => ({ default: m.ProductCanvas })),
  { ssr: false, loading: () => <div className="w-full h-full" /> },
)

/* ─── Variant data ───────────────────────────────────────────────────────── */
const VARIANTS = [
  {
    name:      'Nuit Étoilée',
    desc:      'Violette · Vétiver · Orchidée noire',
    swatch:    '#4a1a8c',
    bgBase:    '#0c0420',
    glowColor: 'rgba(80,22,160,0.55)',
  },
  {
    name:      'Forêt Noire',
    desc:      'Cèdre · Mousse · Ambre noir',
    swatch:    '#0f4a22',
    bgBase:    '#040f09',
    glowColor: 'rgba(18,105,52,0.50)',
  },
  {
    name:      'Sang de Rose',
    desc:      'Rose sombre · Oud · Bergamote',
    swatch:    '#7a0f22',
    bgBase:    '#0f0408',
    glowColor: 'rgba(155,22,48,0.52)',
  },
  {
    name:      'Ambre Doré',
    desc:      'Ambre · Santal · Épices chaudes',
    swatch:    '#8a5008',
    bgBase:    '#100a02',
    glowColor: 'rgba(185,105,18,0.46)',
  },
] as const

/* ─── Corner marks ───────────────────────────────────────────────────────── */
function CornerMarks() {
  const defs: [string, string][] = [
    ['top-4 left-4',     'border-t border-l'],
    ['top-4 right-4',    'border-t border-r'],
    ['bottom-4 left-4',  'border-b border-l'],
    ['bottom-4 right-4', 'border-b border-r'],
  ]
  return (
    <>
      {defs.map(([pos, sides]) => (
        <span
          key={pos}
          className={cn('absolute h-5 w-5 opacity-20 pointer-events-none z-20', pos, sides)}
          style={{ borderColor: 'var(--color-gold)' }}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export function ProductViewer() {
  const [variant,  setVariant]  = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added,    setAdded]    = useState(false)

  const prevRef   = useRef(0)
  const bgRef     = useRef<HTMLDivElement>(null)
  const glowRefs  = useRef<(HTMLDivElement | null)[]>([])
  const btnRef    = useRef<HTMLButtonElement>(null)

  /* ── Set initial bg on mount ── */
  useEffect(() => {
    if (bgRef.current) bgRef.current.style.backgroundColor = VARIANTS[0].bgBase
  }, [])

  /* ── Background + glow crossfade on variant change ── */
  const applyVariant = useCallback((next: number) => {
    const prev = prevRef.current
    if (next === prev) return
    prevRef.current = next

    if (bgRef.current) {
      gsap.to(bgRef.current, {
        backgroundColor: VARIANTS[next].bgBase,
        duration: 1.2,
        ease: 'power2.inOut',
      })
    }
    gsap.to(glowRefs.current[prev], { opacity: 0, duration: 1.2, ease: 'power2.inOut' })
    gsap.to(glowRefs.current[next], { opacity: 1, duration: 1.2, ease: 'power2.inOut' })

    setVariant(next)
  }, [])

  /* ── Magnetic button ── */
  const handleMagnet = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const btn = btnRef.current
    if (!btn) return
    const r  = btn.getBoundingClientRect()
    const cx = r.left + r.width  / 2
    const cy = r.top  + r.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    if (Math.hypot(dx, dy) < 110) {
      gsap.to(btn, { x: dx * 0.36, y: dy * 0.36, duration: 0.35, ease: 'power2.out' })
    }
  }, [])

  const handleMagnetLeave = useCallback(() => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1,0.42)' })
  }, [])

  /* ── Add to cart ── */
  const handleAdd = () => {
    setAdded(true)
    gsap.fromTo(btnRef.current,
      { scale: 0.94 },
      { scale: 1, duration: 0.55, ease: 'elastic.out(1,0.5)' },
    )
    setTimeout(() => setAdded(false), 2400)
  }

  return (
    <section className="relative h-screen overflow-hidden">

      {/* ── Background layers ────────────────────────────────────────── */}
      <div ref={bgRef} className="absolute inset-0" />

      {VARIANTS.map((v, i) => (
        <div
          key={i}
          ref={el => { glowRefs.current[i] = el }}
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: i === 0 ? 1 : 0,
            background: `radial-gradient(ellipse 58% 72% at 32% 50%, ${v.glowColor} 0%, transparent 65%)`,
          }}
        />
      ))}

      {/* ── Two-column layout ────────────────────────────────────────── */}
      <div className="relative z-10 flex h-full">

        {/* Left — 3D canvas */}
        <div className="w-[54%] h-full">
          <BottleCanvas variant={variant} />
        </div>

        {/* Right — product info */}
        <div
          className="w-[46%] h-full flex flex-col justify-center pr-[7%] pl-6 overflow-y-auto"
          onMouseMove={handleMagnet}
          onMouseLeave={handleMagnetLeave}
        >
          {/* Brand eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <span className="h-px w-6 bg-gold/50" aria-hidden="true" />
            <span className="font-sans text-[10px] font-medium tracking-[0.42em] uppercase text-gold/70">
              Maison Cinémascope
            </span>
          </div>

          {/* Product name */}
          <h1
            className="font-serif font-black leading-[0.90] tracking-tight text-foreground mb-1"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 6rem)' }}
          >
            L&apos;Éternelle
          </h1>
          <p
            className="font-serif italic text-gold mb-8 leading-none"
            style={{ fontSize: 'clamp(2rem, 3.8vw, 4.4rem)' }}
          >
            Lumière
          </p>

          {/* ── Variant selector ── */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-1">
              <p className="font-sans text-[10px] tracking-[0.32em] uppercase text-foreground/40">
                Variante
              </p>
              <p className="font-sans text-[11px] font-medium text-foreground/75">
                {VARIANTS[variant].name}
              </p>
            </div>

            <p className="font-sans text-[12px] italic text-muted/55 mb-4">
              {VARIANTS[variant].desc}
            </p>

            <div className="flex gap-[10px]">
              {VARIANTS.map((v, i) => (
                <button
                  key={i}
                  onClick={() => applyVariant(i)}
                  aria-label={v.name}
                  aria-pressed={variant === i}
                  className="relative w-8 h-8 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
                  style={{
                    backgroundColor: v.swatch,
                    boxShadow: variant === i
                      ? `0 0 0 2px rgba(201,168,76,0.6), 0 0 18px ${v.swatch}88`
                      : `0 0 0 1px rgba(255,255,255,0.08)`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Gold divider */}
          <span className="block h-px w-12 bg-gold/25 mb-7" aria-hidden="true" />

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-8">
            <span
              className="font-serif font-bold text-gold leading-none"
              style={{ fontSize: 'clamp(1.7rem, 2.8vw, 2.8rem)' }}
            >
              €290
            </span>
            <span className="font-sans text-[10px] tracking-[0.26em] uppercase text-foreground/35">
              100 ml · Eau de Parfum
            </span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-5 mb-9">
            <p className="font-sans text-[10px] tracking-[0.32em] uppercase text-foreground/40">
              Qté
            </p>
            <div
              className="flex items-center border border-foreground/12"
              role="group"
              aria-label="Quantité"
            >
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center text-foreground/45 hover:text-foreground/85 transition-colors duration-200"
                aria-label="Diminuer"
              >
                <svg width="10" height="2" viewBox="0 0 10 2" fill="currentColor" aria-hidden="true">
                  <rect width="10" height="2" />
                </svg>
              </button>
              <span className="w-10 h-10 flex items-center justify-center font-sans text-[13px] text-foreground border-x border-foreground/12 select-none tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => Math.min(10, q + 1))}
                className="w-10 h-10 flex items-center justify-center text-foreground/45 hover:text-foreground/85 transition-colors duration-200"
                aria-label="Aumentar"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                  <rect x="4" width="2" height="10" />
                  <rect y="4" width="10" height="2" />
                </svg>
              </button>
            </div>
          </div>

          {/* ── Add to cart — magnetic + fill sweep ── */}
          <button
            ref={btnRef}
            onClick={handleAdd}
            disabled={added}
            className={cn(
              'group relative overflow-hidden inline-flex items-center justify-center',
              'w-full max-w-[280px] px-10 py-[15px]',
              'font-sans text-[11px] font-medium tracking-[0.30em] uppercase',
              'border transition-colors duration-500',
              added
                ? 'border-gold bg-gold text-background cursor-default'
                : 'border-gold/32 hover:border-gold/60 text-foreground/80 hover:text-background',
            )}
            style={{ transitionTimingFunction: 'cubic-bezier(0.76,0,0.24,1)' }}
          >
            {!added && (
              <span
                className="absolute inset-0 bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 pointer-events-none"
                style={{ transitionTimingFunction: 'cubic-bezier(0.76,0,0.24,1)' }}
                aria-hidden="true"
              />
            )}
            <span className="relative z-10 transition-colors duration-500">
              {added ? 'Ajouté au panier ✓' : 'Ajouter au panier'}
            </span>
          </button>

          {/* Shipping note */}
          <p className="font-sans text-[10px] tracking-[0.22em] uppercase text-foreground/22 mt-5">
            Livraison mondiale · Retours sous 30 jours
          </p>
        </div>
      </div>

      <CornerMarks />
    </section>
  )
}
