import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'slate-brand': '#334155',
        'deep-blue': '#1e3a8a',
        'action-orange': '#f97316',
      },
    },
  },
  plugins: [],
}
export default config
