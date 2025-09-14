/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parasite: {
          dark: '#0a0a0a',
          green: '#00ff88',
          slime: '#8bff00',
          blood: '#ff0040',
          decay: '#404040',
        },
        worm: {
          pink: '#ff69b4',
          purple: '#8a2be2',
          blue: '#00bfff',
        }
      },
      animation: {
        'crawl': 'crawl 8s linear infinite',
        'wiggle': 'wiggle 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        crawl: {
          '0%': { transform: 'translateX(-100px) translateY(0px)' },
          '25%': { transform: 'translateX(25vw) translateY(-20px)' },
          '50%': { transform: 'translateX(50vw) translateY(10px)' },
          '75%': { transform: 'translateX(75vw) translateY(-15px)' },
          '100%': { transform: 'translateX(100vw) translateY(0px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        }
      }
    },
  },
  plugins: [],
}
