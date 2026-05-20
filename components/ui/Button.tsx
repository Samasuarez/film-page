import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center px-8 py-3 text-xs font-sans font-medium tracking-[0.18em] uppercase transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 active:scale-95 disabled:opacity-40 disabled:pointer-events-none',
        variant === 'primary'  && 'bg-gold text-background hover:bg-gold-light',
        variant === 'outline'  && 'border border-gold/40 text-gold hover:border-gold hover:bg-gold/[0.06]',
        variant === 'ghost'    && 'text-muted hover:text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)

Button.displayName = 'Button'
