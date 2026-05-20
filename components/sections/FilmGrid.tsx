'use client'

import { motion } from 'framer-motion'
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations/variants'
import { Badge } from '@/components/ui/Badge'

const films = [
  { title: 'Noir Horizon',      year: '2024', genre: 'Neo-Noir',  rating: '9.1', duration: '2h 14m', hue: 220 },
  { title: 'The Cartographer',  year: '2023', genre: 'Drama',     rating: '8.7', duration: '1h 58m', hue: 250 },
  { title: 'Embers & Ash',      year: '2024', genre: 'Thriller',  rating: '8.9', duration: '2h 05m', hue: 15  },
  { title: 'Parallel Light',    year: '2023', genre: 'Sci-Fi',    rating: '9.3', duration: '2h 22m', hue: 195 },
  { title: 'The Last Shore',    year: '2024', genre: 'Drama',     rating: '8.5', duration: '1h 47m', hue: 160 },
  { title: 'Crimson Meridian',  year: '2023', genre: 'Western',   rating: '8.8', duration: '2h 38m', hue: 340 },
]

export function FilmGrid() {
  return (
    <section className="py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <motion.div
          variants={staggerContainerVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.08 }}
        >
          {/* Section header */}
          <motion.div
            variants={fadeUpVariants}
            className="mb-16 flex items-end justify-between"
          >
            <div>
              <span className="mb-3 block font-sans text-[10px] tracking-[0.4em] uppercase text-gold">
                The Collection
              </span>
              <h2 className="font-serif text-display-sm text-foreground">
                Current Showcase
              </h2>
            </div>
            <button className="font-sans text-sm text-muted transition-colors hover:text-gold">
              View All &rarr;
            </button>
          </motion.div>

          {/* Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {films.map((film, i) => (
              <motion.article
                key={film.title}
                variants={fadeUpVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.28 }}
                className="group cursor-pointer"
              >
                {/* Poster area */}
                <div className="relative mb-4 overflow-hidden" style={{ aspectRatio: '2/3' }}>
                  {/* Aesthetic gradient placeholder */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(150deg,
                        hsl(${film.hue},12%,7%) 0%,
                        hsl(${film.hue + 20},16%,11%) 60%,
                        hsl(${film.hue + 40},10%,6%) 100%)`,
                    }}
                  />

                  {/* Catalogue number watermark */}
                  <span className="absolute bottom-4 right-4 select-none font-serif text-[5rem] leading-none text-foreground/[0.04]">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="font-sans text-[11px] tracking-[0.3em] uppercase text-foreground">
                      View Film
                    </span>
                  </div>

                  {/* Rating chip */}
                  <span className="absolute left-3 top-3 bg-background/80 px-2 py-0.5 font-sans text-[11px] text-gold">
                    ★ {film.rating}
                  </span>
                </div>

                {/* Meta */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg text-foreground transition-colors group-hover:text-gold">
                      {film.title}
                    </h3>
                    <span className="font-sans text-[11px] text-muted">{film.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-[11px] text-muted">{film.year}</span>
                    <span className="h-1 w-1 rounded-full bg-gold/30" />
                    <Badge variant="minimal">{film.genre}</Badge>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
