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
        amf: {
          red:         '#E51E23', // vermelho exato da logo AMF
          'red-light': '#FF4A4A',
          'red-dark':  '#C0181C',
          green:       '#2B7A3C', // verde exato do "Fundada em 1990" da logo
          'green-dark':'#1A5C2D',
          'green-light':'#3A9B50',
          navy:        '#0D2436', // texto escuro, títulos
          light:       '#F6F4F4', // fundo alternado
          border:      '#E8E8E8', // bordas neutras
          text:        '#2B2B2B', // texto principal
          muted:       '#6B6B6B', // texto secundário
        },
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}
export default config
