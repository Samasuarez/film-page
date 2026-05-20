import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'minimal'
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-sans text-[10px] tracking-[0.22em] uppercase',
        variant === 'default' && 'px-3 py-1 bg-gold/10 text-gold border border-gold/20',
        variant === 'outline' && 'px-3 py-1 border border-foreground/20 text-foreground/60',
        variant === 'minimal' && 'text-muted',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
