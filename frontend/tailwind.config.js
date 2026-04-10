/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0c0e14',
        card: '#131620',
        cardborder: '#2a2e42',
        accent: {
          cyan: '#00d4ff',
          green: '#00ff88',
          orange: '#f7931e',
          red: '#ff4d6d',
          purple: '#a78bfa',
        }
      },
      fontFamily: {
        grotesk: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
