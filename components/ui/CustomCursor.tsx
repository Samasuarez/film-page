'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  /* rendered only after confirming pointer:fine on client */
  const [visible, setVisible] = useState(false)

  /* ── Phase 1: detect fine pointer ─────────────────────────────────────── */
  useEffect(() => {
    if (window.matchMedia('(pointer: fine)').matches) setVisible(true)
  }, [])

  /* ── Phase 2: wire up tracking once DOM elements exist ────────────────── */
  useEffect(() => {
    if (!visible) return
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    /* --- Positions -------------------------------------------------------- */
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const lag   = { x: mouse.x, y: mouse.y }
    let raf     = 0
    const isHovering = { current: false }

    /* Dot follows exactly */
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      gsap.set(dot, { x: e.clientX, y: e.clientY })
    }

    /* Ring lerps toward mouse (0.10 factor ≈ 100ms lag feel) */
    const tick = () => {
      lag.x += (mouse.x - lag.x) * 0.10
      lag.y += (mouse.y - lag.y) * 0.10
      gsap.set(ring, { x: lag.x, y: lag.y })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    /* --- Hover states ------------------------------------------------------ */
    const onOver = (e: MouseEvent) => {
      const hit = !!(e.target as Element).closest('a, button, [role="button"], [data-cursor]')
      if (hit === isHovering.current) return
      isHovering.current = hit
      if (hit) {
        gsap.to(ring, { scale: 2.2, opacity: 0.35, duration: 0.35, ease: 'power2.out' })
        gsap.to(dot,  { scale: 0,   opacity: 0,    duration: 0.25 })
      } else {
        gsap.to(ring, { scale: 1,   opacity: 0.65, duration: 0.4,  ease: 'power2.out' })
        gsap.to(dot,  { scale: 1,   opacity: 1,    duration: 0.3  })
      }
    }

    /* Click pulse */
    const onDown = () => gsap.to(dot, { scale: 1.8, duration: 0.1 })
    const onUp   = () => gsap.to(dot, { scale: isHovering.current ? 0 : 1, duration: 0.2 })

    /* Cursor leaves / re-enters viewport */
    const hide = () => gsap.to([dot, ring], { opacity: 0, duration: 0.3 })
    const show = () => {
      gsap.to(dot,  { opacity: isHovering.current ? 0    : 1,    duration: 0.3 })
      gsap.to(ring, { opacity: isHovering.current ? 0.35 : 0.65, duration: 0.3 })
    }

    document.body.classList.add('cursor-none')
    window.addEventListener('mousemove',  onMove,   { passive: true })
    window.addEventListener('mouseover',  onOver)
    window.addEventListener('mousedown',  onDown)
    window.addEventListener('mouseup',    onUp)
    document.addEventListener('mouseleave', hide)
    document.addEventListener('mouseenter', show)

    return () => {
      cancelAnimationFrame(raf)
      document.body.classList.remove('cursor-none')
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseover',  onOver)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      document.removeEventListener('mouseleave', hide)
      document.removeEventListener('mouseenter', show)
    }
  }, [visible])

  if (!visible) return null

  return (
    <>
      {/* 12 px solid gold dot — tracks exactly */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[99999]"
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: '#c9a84c',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      />

      {/* 40 px ring — follows with lerp lag */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[99998]"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.65)',
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
          opacity: 0.65,
        }}
      />
    </>
  )
}
