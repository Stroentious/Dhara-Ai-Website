/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        agri: {
          950: '#07120c',
          900: '#0c1d14',
          850: '#11281c',
          800: '#163324',
          700: '#1f4833',
          600: '#2b6548',
          500: '#10b981',
          400: '#34d399',
          300: '#6ee7b7',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
