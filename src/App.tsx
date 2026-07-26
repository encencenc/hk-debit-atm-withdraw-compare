import { useState } from 'react'
import { motion } from 'motion/react'
import { Hero } from './components/Hero'
import { Footer } from './components/Footer'
import { BankWizard } from './components/BankWizard'
import { AtmFinder } from './components/AtmFinder'
import { ComparisonTable } from './components/ComparisonTable'
import { StatusLegend } from './components/StatusLegend'
import { useTheme } from './hooks/useTheme'

type TabKey = 'bank' | 'atm' | 'table'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'bank', label: '按银行查找' },
  { key: 'atm', label: '按 ATM 类型查找' },
  { key: 'table', label: '完整对比表' },
]

export default function App() {
  const { mode, setTheme } = useTheme()
  const [tab, setTab] = useState<TabKey>('bank')

  return (
    <div className="mx-auto w-full max-w-[1280px] px-[clamp(14px,4vw,32px)] pb-14 pt-[clamp(14px,4vw,26px)]">
      <Hero mode={mode} setTheme={setTheme} />

      {/* 查询方式切换（滑动胶囊指示） */}
      <div
        role="tablist"
        aria-label="查询方式"
        className="mt-5 grid grid-cols-3 gap-1 rounded-[13px] border border-bd bg-card p-1"
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
              className={`relative rounded-[9px] px-0.5 py-[11px] text-center text-[clamp(12.5px,3.6vw,15px)] font-semibold transition-colors ${
                active ? 'text-white' : 'text-mut hover:text-tx'
              }`}
            >
              {active && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-[9px] bg-ac"
                  transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-[1]">{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* 全局图例 */}
      <StatusLegend className="mt-3.5" />

      {/* 仅入场动画：外层若用 AnimatePresence 等退场，会被 BankWizard 内嵌套的
          AnimatePresence（凭条打印）卡住 onExitComplete，导致切换后内容空白 */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {tab === 'bank' && <BankWizard />}
        {tab === 'atm' && <AtmFinder />}
        {tab === 'table' && <ComparisonTable />}
      </motion.div>

      <Footer />
    </div>
  )
}
