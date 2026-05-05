/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'void':      '#050403',
        'walnut': {
          50:  '#f5ede3',
          100: '#e8d5be',
          200: '#c9a87a',
          300: '#b08040',
          400: '#8b5e2a',
          500: '#6b4420',
          600: '#4e2f14',
          700: '#321e0b',
          800: '#1e1108',
          900: '#0e0804',
        },
        'gold': {
          50:  '#fdf8ed',
          100: '#f9edcc',
          200: '#f0d28a',
          300: '#e5b84a',
          400: '#d4973a',
          500: '#b87a28',
          600: '#8f5c18',
          700: '#6b420f',
          800: '#4a2d08',
          900: '#2a1904',
        },
        'champagne': '#d4af72',
        'bronze':    '#8c5e2a',
        'beige':     '#e8d5b7',
        'cream':     '#f5f0e8',
      },
      fontFamily: {
        'playfair':  ['"Playfair Display"', 'Georgia', 'serif'],
        'cormorant': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'inter':     ['Inter', 'sans-serif'],
        'manrope':   ['Manrope', 'sans-serif'],
      },
      animation: {
        'float':      'float 8s ease-in-out infinite',
        'float-slow': 'float 14s ease-in-out infinite',
        'pulse-gold': 'pulseGold 3s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '33%':      { transform: 'translateY(-18px) translateX(8px)' },
          '66%':      { transform: 'translateY(-8px) translateX(-6px)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-400% center' },
          '100%': { backgroundPosition:  '400% center' },
        },
      },
    },
  },
  plugins: [],
};
