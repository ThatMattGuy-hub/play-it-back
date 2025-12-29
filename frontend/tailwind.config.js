/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Playful color palette based on logo
        playit: {
          purple: '#2D2A5E',
          navy: '#1a1744',
          pink: '#FF69B4',
          cyan: '#5ECDE4',
          yellow: '#FFD93D',
          orange: '#FF8C42',
          gold: '#F4B942',
        },
        spotify: {
          green: '#1DB954',
          black: '#191414',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
