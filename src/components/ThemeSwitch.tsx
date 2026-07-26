import { motion } from 'motion/react'
import type { ThemeMode } from '../hooks/useTheme'

const MODES: { key: ThemeMode; label: string }[] = [
  { key: 'light', label: '浅色' },
  { key: 'auto', label: '自动' },
  { key: 'dark', label: '深色' },
]

/** 主题切换胶囊组：浅色 / 自动 / 深色（滑动胶囊指示） */
export function ThemeSwitch({
  mode,
  setTheme,
}: {
  mode: ThemeMode
  setTheme: (m: ThemeMode) => void
}) {
  return (
    <div
      role="group"
      aria-label="主题模式"
      className="inline-flex gap-1 rounded-full border border-bd bg-card p-1"
    >
      {MODES.map((m) => {
        const active = m.key === mode
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => setTheme(m.key)}
            aria-pressed={active}
            className={`relative rounded-full px-4 py-[7px] text-[13.5px] font-semibold transition-colors ${
              active ? 'text-white' : 'text-mut hover:text-tx'
            }`}
          >
            {active && (
              <motion.span
                layoutId="theme-pill"
                className="absolute inset-0 rounded-full bg-ac"
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                aria-hidden="true"
              />
            )}
            <span className="relative z-[1]">{m.label}</span>
          </button>
        )
      })}
    </div>
  )
}
