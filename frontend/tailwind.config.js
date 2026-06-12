/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'urban-blue': {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a8a',
        },
        'urban-dark': {
          100: '#1a1a1a',
          200: '#0f0f0f',
          300: '#0a0a0a',
          400: '#050505',
          500: '#000000',
        },
        'light-bg': '#f8fafc',
        'light-card': '#ffffff',
        'light-text': '#1e293b',
        'light-muted': '#64748b',
      },
      boxShadow: {
        'blue-glow': '0 0 20px rgba(59, 130, 246, 0.3)',
        'dark-card': '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}