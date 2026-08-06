import { useState } from 'react'
import { motion } from 'motion/react'
import { BANKS, META } from '../data/banks'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { BankLogo } from './BankLogo'
import { Panel, StepEyebrow } from './Panel'
import { Pill } from './Pill'
import { Receipt } from './Receipt'

const acMix = 'color-mix(in oklab, var(--ac) 12%, transparent)'

/** 按银行查找：选银行 → 选卡类 → 选户口 → 凭条 */
export function BankWizard() {
  const [bankId, setBankId] = useState(BANKS[0].id)
  const [cardIndex, setCardIndex] = useState(0)
  const [tierIndex, setTierIndex] = useState(0)
  const [q, setQ] = useState('')
  const compact = !useMediaQuery('(min-width: 640px)')

  const bank = BANKS.find((b) => b.id === bankId) ?? BANKS[0]
  const cardType = bank.cardTypes[Math.min(cardIndex, bank.cardTypes.length - 1)]
  const tier = cardType.tiers[Math.min(tierIndex, cardType.tiers.length - 1)]

  const query = q.trim()
  const filtered = BANKS.filter((b) => !query || b.name.includes(query))

  function pickBank(id: string) {
    setBankId(id)
    setCardIndex(0)
    setTierIndex(0)
  }

  return (
    <div>
      {/* STEP 1 · 选择银行 */}
      <Panel className="mt-4">
        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          <StepEyebrow>STEP 1 · 选择银行</StepEyebrow>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索银行…"
            aria-label="搜索银行"
            className="ml-auto min-w-[140px] flex-[0_1_220px] rounded-[10px] border border-bd bg-card2 px-3.5 py-2 text-sm text-tx outline-none transition-colors focus:border-ac"
          />
        </div>
        {/* 移动端两列紧凑卡片，避免单列 20+ 家银行把页面拉得过长 */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))] sm:gap-2.5">
          {filtered.map((b) => {
            const sel = b.id === bank.id
            return (
              <motion.button
                key={b.id}
                type="button"
                onClick={() => pickBank(b.id)}
                aria-pressed={sel}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                className="flex items-center gap-2 rounded-xl border px-2.5 py-2.5 text-left transition-colors hover:border-ac sm:gap-3 sm:px-4 sm:py-3"
                style={{
                  borderColor: sel ? 'var(--ac)' : 'var(--bd)',
                  background: sel ? acMix : 'var(--card2)',
                }}
              >
                <BankLogo bank={b} size={compact ? 26 : 36} />
                <span className="min-w-0 text-[13px] font-semibold leading-tight sm:text-[15px]">
                  {b.name}
                </span>
                <motion.span
                  aria-hidden="true"
                  className="ml-auto font-bold text-ac"
                  initial={false}
                  animate={{ scale: sel ? 1 : 0, opacity: sel ? 1 : 0 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                >
                  ✓
                </motion.span>
              </motion.button>
            )
          })}
        </div>
        {filtered.length === 0 && (
          <div className="py-6 text-center text-sm text-mut">没有匹配「{query}」的银行</div>
        )}
      </Panel>

      {/* STEP 2 · 银行卡类型 / STEP 3 · 户口类别 */}
      <div className="mt-4 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        <Panel>
          <StepEyebrow className="mb-3.5">STEP 2 · 银行卡类型</StepEyebrow>
          <div className="flex flex-wrap gap-2.5">
            {bank.cardTypes.map((c, i) => (
              <Pill
                key={c.id}
                group="card-type"
                label={c.label}
                active={i === cardIndex}
                onClick={() => {
                  setCardIndex(i)
                  setTierIndex(0)
                }}
              />
            ))}
          </div>
        </Panel>
        <Panel>
          <StepEyebrow className="mb-3.5">STEP 3 · 户口类别</StepEyebrow>
          <div className="flex flex-wrap gap-2.5">
            {cardType.tiers.map((t, i) => (
              <Pill
                key={t.label}
                group="tier"
                label={t.label}
                active={i === tierIndex}
                onClick={() => setTierIndex(i)}
              />
            ))}
          </div>
        </Panel>
      </div>

      {/* 凭条（保留打印动画） */}
      <Receipt bank={bank} cardType={cardType} tier={tier} updatedAt={META.updatedAt} />
    </div>
  )
}
