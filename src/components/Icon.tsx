/** 线性图标（Material Symbols 风格的内联 SVG，避免额外加载图标字体） */
const PATHS = {
  bank: 'M4 10h16M5 10v8m4.67-8v8m4.66-8v8M19 10v8M3 20h18M12 3l8.5 4.5H3.5L12 3Z',
  search: 'm20 20-4.2-4.2M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  check: 'm8 12.5 2.8 2.8L16.5 9.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  verified: 'm9 12 2 2 4-4m5.6-3.4L12 3 3.4 6.6v5.1c0 4.6 3.6 8.5 8.6 9.3 5-.8 8.6-4.7 8.6-9.3V6.6Z',
  atm: 'M3 6h18v12H3zM3 10h18M7 14.5h3M15.5 14.5h1.5',
  sun: 'M12 3v1.5M12 19.5V21M4.6 4.6l1.1 1.1M18.3 18.3l1.1 1.1M3 12h1.5M19.5 12H21M4.6 19.4l1.1-1.1M18.3 5.7l1.1-1.1M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  moon: 'M20.4 14.5A8.5 8.5 0 0 1 9.5 3.6 8.5 8.5 0 1 0 20.4 14.5Z',
  auto: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 16l3.5-8.5 3.5 8.5M9.7 13h4.6',
  filter: 'M4 5h16l-6.2 7.4V19l-3.6-1.8v-4.8L4 5Z',
  info: 'M12 11v5.5M12 7.6v.1M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  swap: 'M7 16H20m0 0-3.5-3.5M20 16l-3.5 3.5M17 8H4m0 0 3.5-3.5M4 8l3.5 3.5',
  shield: 'M12 3 4 6.5V12c0 4.4 3.4 8.2 8 9 4.6-.8 8-4.6 8-9V6.5L12 3Zm0 6v4m0 3v.1',
  reset: 'M4 4v5h5M4.6 15a8 8 0 1 0 1.9-8.3L4 9',
  lightbulb: 'M9.5 18h5M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0c2.4-2.4 3.6-5.4 3.6-9S14.4 5.4 12 3m0 18c-2.4-2.4-3.6-5.4-3.6-9S9.6 5.4 12 3M3.5 9h17M3.5 15h17',
} as const

export type IconName = keyof typeof PATHS

export function Icon({
  name,
  size = 18,
  className = '',
  strokeWidth = 1.7,
}: {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
