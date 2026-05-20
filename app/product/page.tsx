import type { Metadata } from 'next'
import { ProductViewer } from '@/components/sections/ProductViewer'

export const metadata: Metadata = {
  title: "L'Éternelle Lumière — Maison Cinémascope",
  description: "Une fragrance d'exception. Quatre interprétations d'un même instant suspendu.",
}

export default function ProductPage() {
  return (
    <main className="overflow-hidden">
      <ProductViewer />
    </main>
  )
}
