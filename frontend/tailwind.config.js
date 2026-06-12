/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  safelist: [
    // Urban Blue colors
    { pattern: /bg-urban-blue-\d+/ },
    { pattern: /text-urban-blue-\d+/ },
    { pattern: /border-urban-blue-\d+/ },
    { pattern: /from-urban-blue-\d+/ },
    { pattern: /to-urban-blue-\d+/ },
    { pattern: /hover:bg-urban-blue-\d+/ },
    { pattern: /hover:text-urban-blue-\d+/ },
    // Urban Dark colors
    { pattern: /bg-urban-dark-\d+/ },
    { pattern: /text-urban-dark-\d+/ },
    { pattern: /border-urban-dark-\d+/ },
    { pattern: /from-urban-dark-\d+/ },
    { pattern: /to-urban-dark-\d+/ },
  ],
  theme: {
    extend: {
      colors: {
        'urban-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a8a',
          900: '#1e3a8a',
          950: '#172554',
        },
        'urban-dark': {
          100: '#1a1a1a',
          200: '#0f0f0f',
          300: '#0a0a0a',
          400: '#050505',
          500: '#000000',
        }
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 3s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(45deg)' },
          '100%': { transform: 'translateX(100%) translateY(100%) rotate(45deg)' },
        }
      },
      boxShadow: {
        'blue-glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'blue-glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
      }
    },
  },
  plugins: [],
}