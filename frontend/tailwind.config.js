/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary accent — Deep Gold spectrum
        primary: {
          50:  '#FAF6EE',
          100: '#F5EDD8', // champagne
          200: '#EDE0C4', // parchment
          300: '#D9C89A', // sand gold
          400: '#C4A870',
          500: '#9A7A40',
          600: '#7A5C28', // deep gold — CTAs, links, logo
          700: '#5E4520',
          800: '#3D2D15',
          900: '#2C2418', // espresso
        },
        // Named AUREM palette tokens
        champagne:   '#F5EDD8',
        parchment:   '#EDE0C4',
        'sand-gold': '#D9C89A',
        // mid-gold darkened from #A8926A (2.5:1) to #6B5840 (5.9:1 on champagne — WCAG AA)
        'mid-gold':  '#6B5840',
        // decorative-only gold for borders, dividers, ornamental chars
        'deco-gold': '#A8926A',
        espresso:    '#2C2418',
        claret:      '#6B1F1F',
        // Warm gray overrides (replaces cool Tailwind grays)
        gray: {
          50:  '#FAF7F2',
          100: '#F2EAD8',
          200: '#E5D8C0',
          300: '#CFC0A0',
          400: '#B09A78',
          500: '#8C7A5A',
          600: '#6B5840',
          700: '#4A3D28',
          800: '#2C2418',
          900: '#1A160E',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans:    ['Montserrat', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.3em',
        ultra:  '0.42em',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },
  plugins: [],
};
