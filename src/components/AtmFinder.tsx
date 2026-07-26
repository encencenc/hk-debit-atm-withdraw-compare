import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ATM_TYPES, BANKS, FeeStatus, type AtmKey } from '../data/banks'
import {
  STATUS_CSSVAR,
  STATUS_LEGEND,
  STATUS_ORDER,
  STATUS_SYMBOL,
  noteLines,
} from '../lib/status'
import { AtmIcon } from './AtmIcon'
import { BankLogo } from './BankLogo'
import { Panel, StepEyebrow } from './Panel'
import { StatusBadge } from './StatusBadge'

const acMix = 'color-mix(in oklab, var(--ac) 12%, transparent)'

interface Row {
  bank: (typeof BANKS)[number]
  sub: string
  note?: string
  status: FeeStatus
}

function buildRows(key: AtmKey): Row[] {
  const rows: Row[] = []
  for (const bank of BANKS) {
    for (const card of bank.cardTypes) {
      // 把结果相同（状态 + 备注）的户口层级合并为一行
      const groups = new Map<string, { status: FeeStatus; note?: string; labels: string[] }>()
      for (const tier of card.tiers) {
        const fee = tier.fees[key]
        const sig = `${fee.s}|${fee.n ?? ''}`
        if (!groups.has(sig)) groups.set(sig, { status: fee.s, note: fee.n, labels: [] })
        groups.get(sig)!.labels.push(tier.label)
      }
      for (const g of groups.values()) {
        const sub =
          g.labels.length === card.tiers.length
            ? card.label
            : `${card.label} · ${g.labels.join(' / ')}`
        rows.push({ bank, sub, note: g.note, status: g.status })
      }
    }
  }
  return rows
}

/** 按 ATM 类型查找：选 ATM → 按状态分组列出各银行 */
export function AtmFinder() {
  const [key, setKey] = useState<AtmKey>(ATM_TYPES[0].key)
  const atm = ATM_TYPES.find((a) => a.key === key)!
  const rows = buildRows(key)
  const freeCount = rows.filter((r) => r.status === FeeStatus.Free).length

  const grouped = STATUS_ORDER.map((s) => ({
    status: s,
    items: rows.filter((r) => r.status === s),
  })).filter((g) => g.items.length > 0)

  return (
    <div>
      {/* STEP 1 · 选择 ATM 类型 */}
      <Panel className="mt-4">
        <StepEyebrow className="mb-4">STEP 1 · 选择 ATM 类型</StepEyebrow>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-2.5">
          {ATM_TYPES.map((a) => {
            const sel = a.key === key
            return (
              <button
                key={a.key}
                type="button"
                onClick={() => setKey(a.key)}
                aria-pressed={sel}
                className="flex flex-col items-center gap-[5px] rounded-xl border px-3.5 py-[18px] transition-colors hover:border-ac"
                style={{
                  borderColor: sel ? 'var(--ac)' : 'var(--bd)',
                  background: sel ? acMix : 'var(--card2)',
                }}
              >
                <span className="inline-flex items-center gap-2 text-base font-bold">
                  <AtmIcon atm={a} size={20} />
                  {a.label}
                  <span
                    aria-hidden="true"
                    className="text-ac transition-opacity"
                    style={{ opacity: sel ? 1 : 0 }}
                  >
                    ✓
                  </span>
                </span>
                <span className="text-[12.5px] text-mut">{a.sub}</span>
              </button>
            )
          })}
        </div>
      </Panel>

      {/* STEP 2 · 各银行收费情况 */}
      <Panel className="mt-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <StepEyebrow>STEP 2 · 各银行收费情况</StepEyebrow>
          <span className="ml-auto text-sm text-mut">
            {atm.label} ·{' '}
            <b className="mono" style={{ color: 'var(--stF)' }}>
              {freeCount}
            </b>{' '}
            个卡类/户口组合免费
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {grouped.map((g) => (
              <div key={g.status}>
                <div className="mb-2.5 mt-5 flex items-center gap-2.5">
                  <b
                    className="mono text-[15px]"
                    aria-hidden="true"
                    style={{ color: STATUS_CSSVAR[g.status] }}
                  >
                    {STATUS_SYMBOL[g.status]}
                  </b>
                  <span className="text-[15px] font-bold">{STATUS_LEGEND[g.status]}</span>
                  <span className="text-[13px] text-mut">{g.items.length} 项</span>
                  <span className="flex-1 border-t border-dashed border-bd" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-2">
                  {g.items.map((r, i) => {
                    const lines = noteLines(r.note)
                    return (
                      <div
                        key={`${r.bank.id}-${i}`}
                        className="flex items-center gap-3 rounded-xl border border-bd2 bg-card2 px-3.5 py-2.5"
                      >
                        <BankLogo bank={r.bank} size={34} />
                        <div className="min-w-0">
                          <div className="text-[14.5px] font-semibold leading-tight">
                            {r.bank.name}
                          </div>
                          <div className="mt-0.5 text-[12.5px] text-mut">{r.sub}</div>
                        </div>
                        <span className="ml-auto flex min-w-0 items-center gap-3">
                          {lines.length > 0 && (
                            <span className="hidden max-w-[min(360px,40vw)] text-right text-[12.5px] leading-snug text-mut sm:inline">
                              {lines.join('；')}
                            </span>
                          )}
                          <StatusBadge status={r.status} note={r.note} className="shrink-0" />
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </Panel>
    </div>
  )
}
