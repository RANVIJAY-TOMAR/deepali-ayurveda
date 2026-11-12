/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          espresso: '#35251F',
          walnut: '#49352B',
          mocha: '#725543',
          sand: '#D8C3A5',
          cream: '#F5EFE5',
          ivory: '#FBF8F2',
          bronze: '#A7835E',
          charcoal: '#29231F',
          // Backwards-compatible aliases mapping to the luxury earthy palette
          forest: '#35251F',
          emerald: '#49352B',
          beige: '#F5EFE5',
          gold: '#A7835E',
          goldLight: '#D8C3A5',
          goldDark: '#725543',
        },
        surface: {
          canvas: '#FBF8F2',
          panel: '#FFFFFF',
          card: '#F5EFE5',
          subtle: '#EFE7DA',
          border: 'rgba(53, 37, 31, 0.12)',
          'border-dark': 'rgba(53, 37, 31, 0.22)',
          'border-bronze': 'rgba(167, 131, 94, 0.35)',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Manrope"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        hindi: ['"Tiro Devanagari Hindi"', 'serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px -1px rgba(53, 37, 31, 0.05), 0 1px 3px -1px rgba(53, 37, 31, 0.03)',
        'premium': '0 16px 40px -4px rgba(53, 37, 31, 0.12), 0 4px 16px -2px rgba(53, 37, 31, 0.04)',
        'lift': '0 25px 60px -8px rgba(53, 37, 31, 0.20), 0 10px 28px -4px rgba(53, 37, 31, 0.08)',
        'glow-bronze': '0 0 35px -5px rgba(167, 131, 94, 0.35)',
        'glow-espresso': '0 0 40px -6px rgba(53, 37, 31, 0.4)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'zoom-subtle': 'zoomSubtle 20s ease-in-out infinite alternate',
        'line-draw': 'lineDraw 1.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
        zoomSubtle: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.06)' },
        },
        lineDraw: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        }
      }
    },
  },
  plugins: [],
}
