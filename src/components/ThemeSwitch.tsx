import type { ThemeMode } from '../hooks/useTheme'
import { Icon, type IconName } from './Icon'

const MODES: Record<ThemeMode, { label: string; badge: string; icon: IconName; next: ThemeMode }> = {
  auto: { label: '自动', badge: 'AUTO', icon: 'auto', next: 'light' },
  light: { label: '浅色', badge: 'LIGHT', icon: 'sun', next: 'dark' },
  dark: { label: '深色', badge: 'DARK', icon: 'moon', next: 'auto' },
}

/** 单按钮循环切换主题：自动 → 浅色 → 深色 → 自动 */
export function ThemeSwitch({
  mode,
  setTheme,
  compact = false,
}: {
  mode: ThemeMode
  setTheme: (m: ThemeMode) => void
  /** 仅图标的精简按钮（移动端压缩顶栏用） */
  compact?: boolean
}) {
  const m = MODES[mode]
  return (
    <button
      type="button"
      onClick={() => setTheme(m.next)}
      title={`主题：${m.label}（点击切换为${MODES[m.next].label}）`}
      aria-label={`主题：${m.label}，点击切换为${MODES[m.next].label}`}
      className={
        compact
          ? 'tactile inline-flex h-9 w-9 select-none items-center justify-center rounded-[10px] border border-bd bg-card text-tx shadow-sm hover:border-ac/50'
          : 'tactile inline-flex select-none items-center gap-2 rounded-xl border border-bd bg-card px-3.5 py-2 text-[13px] font-semibold text-tx shadow-sm hover:border-ac/50'
      }
    >
      <Icon name={m.icon} size={18} className="text-ac" />
      {!compact && (
        <>
          <span>{m.label}</span>
          <span className="mono hidden rounded bg-card2 px-1 text-[10px] tracking-tight text-faint sm:inline">
            {m.badge}
          </span>
        </>
      )}
    </button>
  )
}
