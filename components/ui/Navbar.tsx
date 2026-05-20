'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { TransitionLink } from '@/components/ui/TransitionLink'
import { MenuOverlay, type NavItem } from '@/components/ui/MenuOverlay'

const NAV_ITEMS: NavItem[] = [
  { num: '01', label: 'Films',    href: '/'      },
  { num: '02', label: 'Studio',   href: '/about' },
  { num: '03', label: 'Archives', href: '/about' },
  { num: '04', label: 'Contact',  href: '/about' },
]

export function Navbar() {
  const [isOpen,     setIsOpen]     = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  /* Scroll detection → frosted glass */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Prevent background scroll while menu is open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const open  = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return (
    <>
      {/* ── Top bar ────────────────────────────────────────────────────────── */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[8000] transition-all duration-500 will-change-[background-color,border-color]',
          isScrolled
            ? 'bg-background/80 backdrop-blur-md border-b border-foreground/[0.05]'
            : 'bg-transparent border-b border-transparent',
        )}
      >
        <div className="flex items-center justify-between px-8 md:px-14 h-[76px]">

          {/* Brand */}
          <TransitionLink
            href="/"
            className="font-sans text-[11px] font-semibold tracking-[0.32em] uppercase text-gold hover:text-gold-light transition-colors duration-300"
          >
            Cinémascope
          </TransitionLink>

          {/* Desktop nav links — Inter 300 */}
          <nav
            className="hidden md:flex items-center gap-10"
            aria-label="Primary"
          >
            {NAV_ITEMS.map(item => (
              <TransitionLink
                key={item.label}
                href={item.href}
                className="font-sans font-light text-[13px] tracking-wide text-foreground/50 hover:text-foreground/90 transition-colors duration-300 relative group"
              >
                {item.label}
                {/* Underline sweep */}
                <span className="absolute -bottom-px left-0 h-px w-0 bg-gold/60 group-hover:w-full transition-all duration-500" style={{ transitionTimingFunction: 'cubic-bezier(0.76,0,0.24,1)' }} />
              </TransitionLink>
            ))}
          </nav>

          {/* Hamburger — two asymmetric editorial lines */}
          <button
            ref={hamburgerRef}
            onClick={open}
            className="group flex flex-col items-end gap-[7px] w-8 h-5 justify-center"
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
          >
            <span
              className={cn(
                'block h-px bg-foreground/60 transition-all duration-300',
                'w-full group-hover:bg-foreground',
              )}
            />
            <span
              className={cn(
                'block h-px bg-foreground/60 transition-all duration-300',
                'w-[62%] group-hover:bg-foreground group-hover:w-full',
              )}
            />
          </button>
        </div>
      </header>

      {/* ── Full-screen overlay ─────────────────────────────────────────────── */}
      <MenuOverlay isOpen={isOpen} onClose={close} links={NAV_ITEMS} />
    </>
  )
}
