import dynamic from 'next/dynamic'
import { Hero } from '@/components/sections/Hero'
import { FeaturedFilm } from '@/components/sections/FeaturedFilm'
import { StorySection } from '@/components/sections/StorySection'
import { FilmGrid } from '@/components/sections/FilmGrid'

/* Three.js must be loaded client-side only */
const ThreeScene = dynamic(() => import('@/components/ui/ThreeScene'), { ssr: false })

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <ThreeScene />
      <Hero />
      <FeaturedFilm />
      <StorySection />
      <FilmGrid />

      {/* Footer */}
      <footer className="border-t border-foreground/[0.06] py-12">
        <div className="container mx-auto max-w-6xl px-6 flex items-center justify-between">
          <span className="font-serif italic text-foreground/40 text-sm">Cinémascope</span>
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted/50">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </main>
  )
}
