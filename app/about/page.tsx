import { TransitionLink } from '@/components/ui/TransitionLink'

export default function About() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="space-y-8 text-center">
        <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold">
          The Studio
        </p>
        <h1 className="font-serif text-display-md text-foreground">
          About Us
        </h1>
        <p className="mx-auto max-w-md text-muted leading-relaxed">
          Cinémascope curates the finest contemporary cinema — from
          Palme d&apos;Or laureates to singular debut films that redefine the form.
        </p>
        <TransitionLink
          href="/"
          className="inline-flex font-sans text-sm text-gold transition-colors hover:text-gold-light"
        >
          &larr; Back to Films
        </TransitionLink>
      </div>
    </main>
  )
}
