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
        surface: '#141414',
        accent: '#E8653A',
        teal: '#1D9E75',
        danger: '#E24B4A',
        warning: '#EF9F27',
        'text-primary': '#F5F5F5',
        'text-secondary': '#9CA3AF',
      },
      fontFamily: {
        serif: ['var(--font-instrument-serif)', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
    },
  },
  plugins: [],
}
export default config
