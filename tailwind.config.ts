import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050508',
        foreground: '#f5f0e8',
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e8c97a',
          dark: '#9a7a2e',
        },
        surface: {
          DEFAULT: '#0d0d12',
          elevated: '#141420',
        },
        muted: '#6b6b7a',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-vignette':
          'radial-gradient(ellipse at center, transparent 40%, rgba(5,5,8,0.9) 100%)',
      },
      container: {
        center: true,
        padding: '1.5rem',
      },
    },
  },
  plugins: [],
}
export default config
