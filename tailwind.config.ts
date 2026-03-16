import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        'bg-elevated': '#111111',
        'bg-card': '#161616',
        accent: '#E8653A',
        'accent-light': '#F28C5E',
        'accent-glow': 'rgba(232, 101, 58, 0.15)',
        'accent-subtle': 'rgba(232, 101, 58, 0.06)',
        border: 'rgba(255,255,255,0.06)',
        'border-hover': 'rgba(255,255,255,0.12)',
        'text-primary': '#F5F0EB',
        'text-secondary': '#8A8580',
        'text-muted': '#5A5550',
        teal: '#1D9E75',
        danger: '#E24B4A',
        warning: '#EF9F27',
        purple: '#7F77DD',
        pink: '#D4537E',
        blue: '#85B7EB',
      },
      fontFamily: {
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      animation: {
        fadeUp: 'fadeUp 0.6s ease forwards',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
        ticker: 'ticker 40s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
