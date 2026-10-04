import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Header, TABS, TabSwitch, type TabKey } from './components/Header'
import { Footer } from './components/Footer'
import { BankWizard } from './components/BankWizard'
import { AtmFinder } from './components/AtmFinder'
import { ComparisonTable } from './components/ComparisonTable'
import { StatusLegend } from './components/StatusLegend'
import { Eyebrow } from './components/Panel'
import { BANKS } from './data/banks'
import { COMBO_COUNT } from './lib/stats'
import { useTheme } from './hooks/useTheme'

const INTRO: Record<TabKey, { eyebrow: string; title: string; desc: string }> = {
  bank: {
    eyebrow: '发卡行提款规则透视',
    title: '按发卡银行查提款收费',
    desc: '选择你持有的发卡行、卡类与户口级别，一眼看清在香港银通、汇丰恒生、澳门、内地及境外 ATM 提款是否收费。',
  },
  atm: {
    eyebrow: 'ATM 网络收费透视',
    title: '按 ATM 类型查各行收费',
    desc: '先选你要用的 ATM，再比较各家银行借记卡在这类机器上提款的收费情况，帮你避开跨行费与外币交易费。',
  },
  table: {
    eyebrow: '全港借记卡跨行及境外提款矩阵',
    title: '完整资费矩阵',
    desc: `覆盖 ${BANKS.length} 家银行、${COMBO_COUNT} 个卡类/户口组合，在六类 ATM 上的提款收费一表看全。`,
  },
}

/** 地址栏 hash 与当前查询方式同步（#bank / #atm / #table），便于分享链接 */
function readHashTab(): TabKey {
  const h = window.location.hash.slice(1)
  return TABS.some((t) => t.key === h) ? (h as TabKey) : 'bank'
}

export default function App() {
  const { mode, setTheme } = useTheme()
  const [tab, setTabState] = useState<TabKey>(readHashTab)

  const setTab = (t: TabKey) => {
    setTabState(t)
    history.replaceState(null, '', `#${t}`)
  }

  useEffect(() => {
    const onHash = () => setTabState(readHashTab())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const intro = INTRO[tab]

  return (
    <div className="flex min-h-screen flex-col">
      <Header tab={tab} setTab={setTab} mode={mode} setTheme={setTheme} />

      <div className="mx-auto w-full max-w-[1560px] flex-1 px-4 sm:px-6 lg:px-8">
        <div className="mt-4 md:hidden">
          <TabSwitch tab={tab} setTab={setTab} mobile />
        </div>

        {/* 仅入场动画：外层若用 AnimatePresence 等退场，会被子组件内嵌套的
            AnimatePresence 卡住 onExitComplete，导致切换后内容空白 */}
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <section className="flex flex-col justify-between gap-4 border-b border-bd pb-4 pt-6 lg:flex-row lg:items-end">
            <div>
              <Eyebrow>{intro.eyebrow}</Eyebrow>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{intro.title}</h1>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-mut">{intro.desc}</p>
            </div>
            <StatusLegend className="lg:max-w-[46%] lg:justify-end" />
          </section>

          <div className="pt-6">
            {tab === 'bank' && <BankWizard />}
            {tab === 'atm' && <AtmFinder />}
            {tab === 'table' && <ComparisonTable />}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
