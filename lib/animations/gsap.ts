import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function registerGSAP() {
  if (typeof window === 'undefined') return
  gsap.registerPlugin(ScrollTrigger)
}

/** Fade + rise from below, driven by ScrollTrigger */
export function scrollReveal(
  elements: gsap.TweenTarget,
  triggerEl: gsap.DOMTarget,
  options: gsap.TweenVars = {}
) {
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: triggerEl,
        start: 'top 82%',
        toggleActions: 'play none none none',
      },
      ...options,
    }
  )
}

/** Parallax vertical drift tied to scroll position */
export function parallaxDrift(
  element: gsap.DOMTarget,
  triggerEl: gsap.DOMTarget,
  speed = 0.3
) {
  return gsap.to(element, {
    y: () => window.innerHeight * speed * -1,
    ease: 'none',
    scrollTrigger: {
      trigger: triggerEl,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
    },
  })
}

/** Scale-in for a poster/image on entry */
export function scaleReveal(element: gsap.DOMTarget, triggerEl: gsap.DOMTarget) {
  return gsap.fromTo(
    element,
    { scale: 1.08, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: triggerEl,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    }
  )
}

/** Horizontal text marquee (infinite loop) */
export function marquee(track: gsap.DOMTarget, duration = 20) {
  return gsap.to(track, {
    xPercent: -50,
    ease: 'none',
    duration,
    repeat: -1,
  })
}
