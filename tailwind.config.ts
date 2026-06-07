import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8E7',
        border: '#2E2E2E',
        main: '#6B8ECA',
        accent: '#F4A7B9',
        ink: '#2B2B2B',
        muted: '#8A8A8A',
        progress: '#E8E1D3',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
