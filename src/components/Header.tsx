import { motion } from 'motion/react'
import type { ThemeMode } from '../hooks/useTheme'
import { Icon } from './Icon'
import { ThemeSwitch } from './ThemeSwitch'

export type TabKey = 'bank' | 'atm' | 'table'

export const TABS: { key: TabKey; label: string; short: string }[] = [
  { key: 'atm', label: '按 ATM 类型查找', short: 'ATM 类型' },
  { key: 'bank', label: '按发卡行查找', short: '按发卡行' },
  { key: 'table', label: '完整资费矩阵', short: '资费矩阵' },
]

interface TabProps {
  tab: TabKey
  setTab: (t: TabKey) => void
}

/** 查询方式切换（滑动胶囊指示）。桌面端居中于顶栏，移动端独立一行 */
export function TabSwitch({ tab, setTab, mobile = false }: TabProps & { mobile?: boolean }) {
  return (
    <div
      role="tablist"
      aria-label="查询方式"
      className={
        mobile
          ? 'grid grid-cols-3 gap-1 rounded-2xl border border-bd bg-card2 p-1.5 shadow-inner'
          : 'flex items-center rounded-xl border border-bd bg-card2/80 p-1 shadow-inner'
      }
    >
      {TABS.map((t) => {
        const active = t.key === tab
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setTab(t.key)}
            className={`tactile relative flex items-center justify-center gap-2 rounded-lg tracking-wide ${
              mobile ? 'px-2 py-2 text-[13px]' : 'px-6 py-2.5 text-sm'
            } ${active ? 'font-semibold text-white' : 'font-medium text-mut hover:text-ac'}`}
          >
            {active && (
              <motion.span
                layoutId={mobile ? 'tab-pill-mobile' : 'tab-pill'}
                className="absolute inset-0 rounded-lg bg-acs shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                aria-hidden="true"
              />
            )}
            {active && (
              <span
                className="relative z-[1] h-1.5 w-1.5 rounded-full bg-emerald-400"
                aria-hidden="true"
              />
            )}
            <span className="relative z-[1]">{mobile ? t.short : t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/** 吸顶顶栏：品牌 + 查询方式 + 主题切换 */
export function Header({
  tab,
  setTab,
  mode,
  setTheme,
}: TabProps & { mode: ThemeMode; setTheme: (m: ThemeMode) => void }) {
  return (
    <header className="header-glass animate-entrance sticky top-0 z-40">
      <div className="relative mx-auto flex h-[72px] max-w-[1560px] items-center justify-between gap-4 px-4 sm:h-[88px] sm:px-6 lg:px-8">
        <a href="./" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-acs text-white shadow-sm transition-transform group-hover:scale-[1.03] sm:h-12 sm:w-12">
            <Icon name="bank" size={25} />
          </span>
          <span className="flex flex-col">
            <span className="text-base font-bold leading-tight tracking-tight text-tx transition-colors group-hover:text-ac sm:text-lg">
              HK ATM Fee Comparator
            </span>
            <span className="mt-0.5 text-xs font-medium text-mut sm:text-[13px]">
              香港借记卡提款收费对比
            </span>
          </span>
        </a>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <TabSwitch tab={tab} setTab={setTab} />
        </nav>

        <ThemeSwitch mode={mode} setTheme={setTheme} />
      </div>
    </header>
  )
}
