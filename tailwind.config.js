/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 全部取自 CSS 变量，深浅色主题在 index.css 中切换
        bg: 'var(--bg)',
        card: 'var(--card)',
        card2: 'var(--card2)',
        bd: 'var(--bd)',
        bd2: 'var(--bd2)',
        tx: 'var(--tx)',
        mut: 'var(--mut)',
        ac: 'var(--ac)',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
}
