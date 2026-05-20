'use client'

import { type ReactNode } from 'react'
import { TransitionProvider } from '@/lib/context/TransitionContext'
import { TransitionOverlay } from '@/components/ui/TransitionOverlay'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { CustomCursor } from '@/components/ui/CustomCursor'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TransitionProvider>
      <GrainOverlay />
      <TransitionOverlay />
      <CustomCursor />
      {children}
    </TransitionProvider>
  )
}
