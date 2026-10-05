import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ATM_TYPES, BANKS, type AtmType, type Fee } from '../data/banks'
import { useIsDesktop } from '../hooks/useMediaQuery'
import { STATUS_CSSVAR, STATUS_VERDICT, noteLines } from '../lib/status'
import { tierSummary } from '../lib/stats'
import { AtmIcon } from './AtmIcon'
import { BankLogo } from './BankLogo'
import { BankWizardMobile } from './BankWizardMobile'
import { Icon } from './Icon'
import { InfoNotes } from './InfoNotes'
import { Panel, StepTitle } from './Panel'
import { Pill } from './Pill'
import { StatusBadge } from './StatusBadge'

/** 按发卡行查找：左栏选银行 / 卡类 / 户口，右栏展示六类 ATM 收费明细 */
export function BankWizard() {
  const [bankId, setBankId] = useState(BANKS[0].id)
  const [cardIndex, setCardIndex] = useState(0)
  const [tierIndex, setTierIndex] = useState(0)
  const [q, setQ] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const isDesktop = useIsDesktop()

  const bank = BANKS.find((b) => b.id === bankId) ?? BANKS[0]
  const cardType = bank.cardTypes[Math.min(cardIndex, bank.cardTypes.length - 1)]
  const tier = cardType.tiers[Math.min(tierIndex, cardType.tiers.length - 1)]
  const summary = tierSummary(tier)
  const signature = `${bank.id}|${cardType.id}|${tier.label}`

  const query = q.trim().toLowerCase()
  const filtered = BANKS.filter(
    (b) => !query || b.name.toLowerCase().includes(query) || b.id.includes(query),
  )

  // 按「/」聚焦搜索框
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (e.key !== '/' || t?.closest('input, textarea, [contenteditable="true"]')) return
      e.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function pickBank(id: string) {
    setBankId(id)
    setCardIndex(0)
    setTierIndex(0)
  }

  // 移动端：同一份状态与判断逻辑，换成清单式的信息结构（桌面 / 平板布局保持不变）
  if (!isDesktop) {
    return (
      <BankWizardMobile
        bank={bank}
        cardType={cardType}
        tier={tier}
        cardIndex={cardIndex}
        tierIndex={tierIndex}
        pickBank={pickBank}
        pickCard={(i) => {
          setCardIndex(i)
          setTierIndex(0)
        }}
        pickTier={setTierIndex}
        q={q}
        setQ={setQ}
        searchRef={searchRef}
        filtered={filtered}
        signature={signature}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      {/* ============ 左栏：选择器 ============ */}
      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:col-span-4">
        <Panel className="p-3">
          <label className="relative flex items-center">
            <Icon name="search" size={18} className="pointer-events-none absolute left-3 text-faint" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索银行名称（如 渣打、汇丰、ZA）…"
              aria-label="搜索银行"
              className="w-full rounded-xl border border-transparent bg-card2 py-2.5 pl-10 pr-9 text-sm font-medium text-tx outline-none transition-colors focus:border-ac focus:bg-card"
            />
            <kbd className="mono absolute right-2.5 hidden rounded border border-bd bg-card px-1.5 py-0.5 text-[10px] text-faint sm:block">
              /
            </kbd>
          </label>
        </Panel>

        <Panel className="flex flex-col gap-3 p-4">
          <StepTitle step={1} aside={<span className="mono">共 {filtered.length} 家</span>}>
            选择发卡机构
          </StepTitle>
          <div className="grid max-h-[400px] grid-cols-2 gap-2 overflow-y-auto pr-1">
            {filtered.map((b) => {
              const sel = b.id === bank.id
              const tierCount = b.cardTypes.reduce((n, c) => n + c.tiers.length, 0)
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => pickBank(b.id)}
                  aria-pressed={sel}
                  className={`tactile relative flex items-center gap-2.5 rounded-xl border p-2.5 text-left ${
                    sel
                      ? 'border-ac/45 bg-acsoft shadow-sm'
                      : 'border-bd bg-card hover:-translate-y-px hover:border-ac/35 hover:shadow-sm'
                  }`}
                >
                  <BankLogo bank={b} size={38} />
                  <span className="flex min-w-0 flex-col">
                    <span className={`text-[13px] leading-tight text-tx ${sel ? 'font-bold' : 'font-semibold'}`}>
                      {b.name}
                    </span>
                    <span className="mt-0.5 truncate text-[11px] text-mut">
                      {b.cardTypes.length} 种卡 · {tierCount} 个户口
                    </span>
                  </span>
                  {sel && (
                    <Icon name="check" size={15} className="absolute right-1.5 top-1.5 text-ac" />
                  )}
                </button>
              )
            })}
          </div>
          {filtered.length === 0 && (
            <div className="py-6 text-center text-sm text-mut">没有匹配「{q.trim()}」的银行</div>
          )}
        </Panel>

        <Panel className="flex flex-col gap-3 p-4">
          <StepTitle step={2}>银行卡类型</StepTitle>
          <div className="grid grid-cols-2 gap-2">
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

        <Panel className="flex flex-col gap-3 p-4">
          <StepTitle step={3}>户口类别</StepTitle>
          <div className="flex flex-col gap-1.5">
            {cardType.tiers.map((t, i) => (
              <Pill
                key={t.label}
                group="tier"
                label={t.label}
                hint={`免费 ${tierSummary(t).free}/${ATM_TYPES.length}`}
                active={i === tierIndex}
                onClick={() => setTierIndex(i)}
              />
            ))}
          </div>
        </Panel>
      </aside>

      {/* ============ 右栏：结果 ============ */}
      <section className="flex flex-col gap-4 lg:col-span-8">
        <Panel className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <BankLogo bank={bank} size={52} className="rounded-xl" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">{bank.name}</h2>
                <span className="rounded border border-ac/25 bg-acsoft px-2 py-0.5 text-xs font-semibold text-ac">
                  {cardType.label}
                </span>
              </div>
              <p className="mt-1 text-[13px] text-mut">
                {tier.label}
                {tier.note && <span> · 备注：{tier.note}</span>}
              </p>
            </div>
          </div>
          <div className="flex w-full shrink-0 divide-x divide-bd overflow-hidden rounded-xl border border-bd bg-card2 sm:w-auto">
            <SummaryStat label="完全免费" value={summary.free} color="var(--stF)" />
            {summary.conditional > 0 && (
              <SummaryStat label="限定免费" value={summary.conditional} color="var(--stC)" />
            )}
            <SummaryStat label="收费" value={summary.charged} color="var(--stP)" />
            {summary.na > 0 && <SummaryStat label="不适用" value={summary.na} color="var(--stN)" />}
          </div>
        </Panel>

        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <Icon name="atm" size={18} className="text-ac" />
            <h3 className="text-sm font-bold tracking-tight">各类 ATM 提款收费明细</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {ATM_TYPES.map((a, i) => (
            <motion.div
              key={`${signature}|${a.key}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.04, ease: 'easeOut' }}
              className="h-full"
            >
              <AtmFeeCard
                atm={a}
                fee={tier.fees[a.key]}
                stacked={
                  needsStack(tier.fees[a.key]) ||
                  // 双栏时同一行的另一张卡片若需上下排布，本卡也跟随
                  (isDesktop && needsStack(tier.fees[ATM_TYPES[i ^ 1]?.key ?? a.key]))
                }
              />
            </motion.div>
          ))}
        </div>

        <InfoNotes className="mt-2" />
      </section>
    </div>
  )
}

function SummaryStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-2 sm:flex-none sm:px-5">
      <span className="flex items-baseline gap-0.5">
        <span className="mono text-xl font-bold leading-none" style={{ color }}>
          {value}
        </span>
        <span className="text-[11px] text-mut">/{ATM_TYPES.length}</span>
      </span>
      <span className="mt-1 whitespace-nowrap text-[11px] font-medium text-mut">{label}</span>
    </div>
  )
}

/** 单类 ATM 的收费卡片：判定 + 具体条件 */
/** 多行或较长的条件说明：并排时会把「收费标准」块拉高留白，需改为上下排布 */
function needsStack(fee: Fee): boolean {
  const lines = noteLines(fee.n)
  return lines.length > 1 || lines.join('').length > 24
}

function AtmFeeCard({
  atm,
  fee,
  stacked,
}: {
  atm: AtmType
  fee: Fee
  /** 由父级按「同一行」统一决定，保证并排两张卡片排布一致、无空白 */
  stacked: boolean
}) {
  const verdict = STATUS_VERDICT[fee.s]
  const color = STATUS_CSSVAR[fee.s]
  const lines = noteLines(fee.n)
  const conditionBlock = (
    <div className="stat-block flex flex-1 flex-col justify-center p-2.5">
      <span className="mb-1 text-[11px] font-medium text-mut">具体条件</span>
      {lines.length > 0 ? (
        lines.map((line, i) => (
          <span key={i} className="font-semibold leading-snug text-tx [overflow-wrap:anywhere]">
            {line}
          </span>
        ))
      ) : (
        <span className="leading-snug text-mut">{verdict.detail}</span>
      )}
    </div>
  )
  return (
    <Panel hover className="flex h-full flex-col p-5">
      <div className="flex items-start justify-between gap-3 border-b border-bd2 pb-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-bd bg-white p-1.5 dark:border-white/10 dark:bg-white/90">
            <AtmIcon atm={atm} size={atm.iconKind === 'pair' ? 14 : 21} />
          </span>
          <div className="min-w-0">
            <h4 className="text-sm font-bold leading-snug">{atm.label}</h4>
            <span className="text-xs text-mut">{atm.sub}</span>
          </div>
        </div>
        <StatusBadge
          status={fee.s}
          note={fee.n}
          contextLabel={atm.label}
          showDetails={false}
          className="shrink-0"
        />
      </div>
      {stacked ? (
        // 条件较长：收费标准收成一行，条件独占整行
        <div className="flex flex-1 flex-col gap-2 pt-4 text-[13px]">
          {/* 本卡条件较短、只是跟随同行上下排布时，两个框平分多出的高度 */}
          <div
            className={`stat-block flex items-center justify-between gap-3 px-2.5 py-2 ${
              needsStack(fee) ? '' : 'flex-1'
            }`}
          >
            <span className="text-[11px] font-medium text-mut">收费标准</span>
            <span className="text-sm font-bold leading-tight" style={{ color }}>
              {verdict.label}
            </span>
          </div>
          {conditionBlock}
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-1 gap-2 pt-4 text-[13px] sm:grid-cols-[2fr_3fr]">
          <div className="stat-block flex flex-col justify-center p-2.5">
            <span className="mb-1 text-[11px] font-medium text-mut">收费标准</span>
            <span className="text-[15px] font-bold leading-tight" style={{ color }}>
              {verdict.label}
            </span>
          </div>
          {conditionBlock}
        </div>
      )}
    </Panel>
  )
}
