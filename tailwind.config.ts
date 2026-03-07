import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          base: 'rgb(var(--cyber-base) / <alpha-value>)',
          panel: 'rgb(var(--cyber-panel) / <alpha-value>)',
          line: 'rgb(var(--cyber-line) / <alpha-value>)',
          neon: 'rgb(var(--cyber-neon) / <alpha-value>)',
          electric: 'rgb(var(--cyber-electric) / <alpha-value>)',
          warn: 'rgb(var(--cyber-warn) / <alpha-value>)',
          glow: 'rgb(var(--cyber-glow) / <alpha-value>)',
        },
      },
      boxShadow: {
        neon: '0 0 18px rgb(var(--cyber-neon) / 0.35)',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Rajdhani', 'sans-serif'],
      },
      backgroundImage: {
        grid: 'linear-gradient(to right, rgb(var(--cyber-electric) / 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--cyber-electric) / 0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '30px 30px',
      },
    },
  },
  plugins: [],
};

export default config;
