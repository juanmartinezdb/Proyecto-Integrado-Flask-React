/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6a4dbc',
        secondary: '#f0e6d2',
        accent: '#ffcc33',
        success: '#4caf50',
        warning: '#ff9800',
        danger: '#f44336',
        info: '#2196f3',
        background: '#f8f5f0',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}