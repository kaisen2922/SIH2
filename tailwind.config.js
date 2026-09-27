/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#08111F', // Main background
          900: '#071A2F', // Deep navy
          850: '#0B223D',
          800: '#0F1B2D', // Cards background
          750: '#14253E',
          700: '#1A304F',
          600: '#23416B',
        },
        surface: {
          dark: '#08111F',
          card: '#0F1B2D',
          border: '#1E334D',
          hover: '#192C44',
          subtle: '#122339',
        },
        brand: {
          blue: '#2563EB',
          cyan: '#06B6D4',
          teal: '#14B8A6',
          green: '#22C55E',
          amber: '#F59E0B',
          orange: '#F97316',
          red: '#EF4444',
        },
        risk: {
          low: '#22C55E',
          moderate: '#F59E0B',
          high: '#F97316',
          critical: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
