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
        faint: 'var(--faint)',
        // ac：强调文字 / 描边；acs：实心按钮底色；acsoft：选中态浅底
        ac: 'var(--ac)',
        acs: 'var(--acs)',
        acsoft: 'var(--acsoft)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans SC"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
      },
    },
  },
  plugins: [],
}
