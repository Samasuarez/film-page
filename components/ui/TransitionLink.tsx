'use client'

import { type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { usePageTransition } from '@/lib/context/TransitionContext'

interface TransitionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

/**
 * Drop-in anchor that triggers the page-transition overlay before navigating.
 * Use in place of <Link> or <a> whenever you want the wipe animation.
 */
export function TransitionLink({ href, children, onClick, className, ...props }: TransitionLinkProps) {
  const { navigateTo, phase } = usePageTransition()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    /* Allow modifier-key opens (new tab etc.) to pass through */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    onClick?.(e)
    if (phase === 'idle') navigateTo(href)
  }

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  )
}
