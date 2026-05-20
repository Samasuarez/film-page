'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations/variants'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export function FeaturedFilm() {
  const sectionRef = useRef<HTMLElement>(null)
  const posterRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!posterRef.current || !sectionRef.current) return

    gsap.fromTo(
      posterRef.current,
      { scale: 1.08, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          toggleActions: 'play none none none',
        },
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Subtle side glow */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[50%] w-[30%] bg-[radial-gradient(ellipse_at_left,rgba(201,168,76,0.04)_0%,transparent_70%)]" />

      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

          {/* ── Poster ── */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '2/3' }}>
            <div
              ref={posterRef}
              className="absolute inset-0 overflow-hidden bg-surface-elevated"
            >
              {/* Placeholder aesthetic gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a10] via-[#12101a] to-[#060608]" />

              {/* Decorative rule lines */}
              <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-gold/30 via-gold/10 to-transparent" />
              <div className="absolute left-8 top-8 right-8 h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />

              {/* Large numeral watermark */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="select-none font-serif text-[12rem] leading-none text-gold/[0.04]">
                  I
                </span>
              </div>

              {/* Film title on poster */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-background via-background/60 to-transparent p-8 pt-20">
                <p className="font-serif italic text-2xl text-foreground/70 leading-tight">
                  Shadows of Tomorrow
                </p>
                <p className="mt-1 font-sans text-[10px] tracking-[0.3em] uppercase text-muted">
                  Sofia Marchetti · 2024
                </p>
              </div>
            </div>

            {/* Awards ribbon */}
            <div className="absolute top-4 right-4 flex flex-col gap-1">
              <Badge variant="outline">Palme d&apos;Or</Badge>
              <Badge variant="outline">Best Picture</Badge>
            </div>
          </div>

          {/* ── Copy ── */}
          <motion.div
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-6"
          >
            <motion.span
              variants={fadeUpVariants}
              className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold"
            >
              Featured Film
            </motion.span>

            <motion.h2
              variants={fadeUpVariants}
              className="font-serif text-display-md text-foreground leading-tight"
            >
              Shadows of{' '}
              <em className="text-gold not-italic italic">Tomorrow</em>
            </motion.h2>

            <motion.div
              variants={fadeUpVariants}
              className="flex items-center gap-3 font-sans text-sm text-muted"
            >
              <span>2024</span>
              <span className="h-1 w-1 rounded-full bg-gold/40" />
              <span>Drama · Thriller</span>
              <span className="h-1 w-1 rounded-full bg-gold/40" />
              <span>2h 31m</span>
            </motion.div>

            <motion.span variants={fadeUpVariants} className="gold-rule" />

            <motion.p variants={fadeUpVariants} className="text-muted leading-relaxed">
              In a near-future city where memories can be extracted and sold, a
              detective unravels a conspiracy that threatens to erase the collective
              past of an entire generation — and her own.
            </motion.p>

            <motion.div variants={fadeUpVariants} className="space-y-1">
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold/50">
                Director
              </span>
              <p className="font-serif text-xl text-foreground">Sofia Marchetti</p>
            </motion.div>

            <motion.div variants={fadeUpVariants} className="space-y-1">
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold/50">
                Starring
              </span>
              <p className="font-sans text-sm text-muted">
                Léa Fontaine &middot; Marcus Adusei &middot; Yuki Tanabe
              </p>
            </motion.div>

            <motion.div variants={fadeUpVariants} className="flex gap-4 pt-2">
              <Button variant="primary">Watch Film</Button>
              <Button variant="ghost">+ Watchlist</Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
