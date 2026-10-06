import { useId, useState, type RefObject } from 'react'
import { motion } from 'motion/react'
import { ATM_TYPES, type AtmType, type Bank, type CardType, type Fee, type Tier } from '../data/banks'
import { STATUS_CSSVAR, STATUS_VERDICT } from '../lib/status'
import { tierHint, tierSummary } from '../lib/stats'
import { AtmIcon } from './AtmIcon'
import { BankLogo } from './BankLogo'
import { Icon } from './Icon'
import { InfoNotes } from './InfoNotes'
import {
  ConditionDetail,
  MobileEditButton,
  MobileFinishButton,
  MobileStep,
  ToggleHint,
  useCollapsibleQuery,
  useOpenSet,
} from './MobileParts'
import { Pill } from './Pill'
import { StatusBadge } from './StatusBadge'

/* 「按发卡行查询」移动端（<768px）专用视图。
   状态与判断逻辑全部由 BankWizard 持有，这里只负责移动端的信息组织：
   查询工作区（完成后收起）→ 已选条件 + 结果摘要 → 单一 ATM 收费清单（条件按需展开）→ 说明 */

interface Props {
  bank: Bank
  cardType: CardType
  tier: Tier
  cardIndex: number
  tierIndex: number
  pickBank: (id: string) => void
  pickCard: (i: number) => void
  pickTier: (i: number) => void
  q: string
  setQ: (q: string) => void
  searchRef: RefObject<HTMLInputElement>
  filtered: Bank[]
  signature: string
}

export function BankWizardMobile({
  bank,
  cardType,
  tier,
  cardIndex,
  tierIndex,
  pickBank,
  pickCard,
  pickTier,
  q,
  setQ,
  searchRef,
  filtered,
  signature,
}: Props) {
  const { editing, revealed, resultRef, edit, finish } = useCollapsibleQuery()
  // 移动端初始不预选银行：选定银行后才出现卡类 / 户口步骤
  const [picked, setPicked] = useState(false)
  const rows = useOpenSet()

  return (
    <div className="flex flex-col gap-4">
      {editing && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="rounded-[18px] border border-bd2 bg-card shadow-card"
        >
          {/* 搜索 */}
          <div className="px-3 pt-3">
            <label className="relative flex items-center">
              <Icon name="search" size={17} className="pointer-events-none absolute left-3 text-faint" />
              <input
                ref={searchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜索银行名称（如 渣打、汇丰、ZA）…"
                aria-label="搜索银行"
                className="w-full rounded-[10px] border border-transparent bg-card2 py-2 pl-9 pr-3 text-sm font-medium text-tx outline-none transition-colors focus:border-ac focus:bg-card"
              />
            </label>
          </div>

          {/* 1 发卡机构 */}
          <MobileStep step={1} title="选择发卡机构" aside={<span className="mono">共 {filtered.length} 家</span>}>
            <div className="grid max-h-[292px] grid-cols-2 gap-1.5 overflow-y-auto overscroll-contain">
              {filtered.map((b) => {
                const sel = picked && b.id === bank.id
                const tierCount = Math.max(...b.cardTypes.map((c) => c.tiers.length))
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      pickBank(b.id)
                      setPicked(true)
                    }}
                    aria-pressed={sel}
                    className={`tactile relative flex items-center gap-2 rounded-[10px] border px-2 py-1.5 text-left ${
                      sel ? 'border-ac/45 bg-acsoft' : 'border-transparent bg-card2 hover:border-ac/30'
                    }`}
                  >
                    <BankLogo bank={b} size={30} />
                    <span className="flex min-w-0 flex-col pr-2.5">
                      <span
                        className={`text-[12.5px] leading-tight ${sel ? 'font-bold text-ac' : 'font-semibold text-tx'}`}
                      >
                        {b.name}
                      </span>
                      <span className="mt-0.5 truncate text-[10.5px] text-mut">
                        {b.cardTypes.length} 种卡 · {tierCount} 种户口类型
                      </span>
                    </span>
                    {sel && <Icon name="check" size={13} className="absolute right-1 top-1 text-ac" />}
                  </button>
                )
              })}
            </div>
            {filtered.length === 0 && (
              <div className="py-5 text-center text-sm text-mut">没有匹配「{q.trim()}」的银行</div>
            )}
          </MobileStep>

          {picked && (
            <>
              {/* 2 卡类 */}
              <MobileStep step={2} title="银行卡类型" divided>
                <div className="grid grid-cols-2 gap-2">
                  {bank.cardTypes.map((c, i) => (
                    <Pill
                      key={c.id}
                      group="card-type"
                      label={c.label}
                      active={i === cardIndex}
                      onClick={() => pickCard(i)}
                    />
                  ))}
                </div>
              </MobileStep>

              {/* 3 户口：选定即视为条件填写完成，收起工作区 */}
              <MobileStep step={3} title="户口类别" divided>
                <div className="flex flex-col gap-1.5">
                  {cardType.tiers.map((t, i) => (
                    <Pill
                      key={t.label}
                      group="tier"
                      label={t.label}
                      hint={tierHint(t)}
                      active={i === tierIndex}
                      onClick={() => {
                        pickTier(i)
                        finish()
                      }}
                    />
                  ))}
                </div>
              </MobileStep>

              <MobileFinishButton label="查看收费结果" onClick={finish} />
            </>
          )}
        </motion.div>
      )}

      {/* 结果区：完成选择后才展开 */}
      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="flex flex-col gap-4"
        >
          <ResultSummary
            containerRef={resultRef}
            bank={bank}
            cardType={cardType}
            tier={tier}
            onEdit={editing ? undefined : edit}
          />

          {/* 单一收费清单：一行一类 ATM，行间仅用分隔线 */}
          <section className="overflow-hidden rounded-[20px] border border-bd bg-card shadow-card">
            <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-3.5">
              <h3 className="flex items-center gap-2 text-[14px] font-bold tracking-tight">
                <Icon name="atm" size={17} className="text-ac" />
                ATM 提款收费明细
              </h3>
              <span className="text-[11.5px] text-faint">点按查看具体条件</span>
            </div>
            {tier.note && (
              <p className="mx-4 mb-2 rounded-md border border-ac/50 bg-acsoft px-2 py-1 text-[11.5px] font-semibold text-ac">
                {tier.note}
              </p>
            )}
            <motion.ul
              key={signature}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="divide-y divide-bd2 border-t border-bd2"
            >
              {ATM_TYPES.map((a) => (
                <AtmRow
                  key={a.key}
                  atm={a}
                  fee={tier.fees[a.key]}
                  open={rows.isOpen(a.key)}
                  onToggle={() => rows.toggle(a.key)}
                />
              ))}
            </motion.ul>
          </section>
        </motion.div>
      )}

      <InfoNotes variant="mobile" className="mt-1" />
    </div>
  )
}

/** 已选条件 + 总体结果：页面上层级最高的结果对象；收起工作区后兼作「修改条件」入口 */
function ResultSummary({
  containerRef,
  bank,
  cardType,
  tier,
  onEdit,
}: {
  containerRef: RefObject<HTMLDivElement>
  bank: Bank
  cardType: CardType
  tier: Tier
  onEdit?: () => void
}) {
  const summary = tierSummary(tier)
  const parts: { n: number; label: string; color: string }[] = [
    { n: summary.free, label: '类免费', color: 'var(--stF)' },
    ...(summary.conditional > 0 ? [{ n: summary.conditional, label: '类限定免费', color: 'var(--stC)' }] : []),
    { n: summary.charged, label: '类收费', color: 'var(--stP)' },
    ...(summary.na > 0 ? [{ n: summary.na, label: '类不适用', color: 'var(--stN)' }] : []),
  ]

  return (
    <div ref={containerRef} className="rounded-[20px] border border-bd bg-card p-4 shadow-card">
      <div className="flex items-center gap-3">
        <BankLogo bank={bank} size={40} className="rounded-[10px]" />
        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-bold leading-snug tracking-tight">{bank.name}</h2>
          <p className="text-[12.5px] leading-snug text-mut">
            <span className="font-semibold text-ac">{cardType.label}</span> · {tier.label}
          </p>
        </div>
        {onEdit && <MobileEditButton onClick={onEdit} />}
      </div>

      <div className="mt-3 border-t border-bd2 pt-3">
        <p className="text-[13.5px] font-semibold leading-snug text-tx">
          <span className="text-mut">{ATM_TYPES.length} 类 ATM：</span>
          {parts.map((p, i) => (
            <span key={p.label}>
              {i > 0 && <span className="px-1 text-faint">·</span>}
              <span className="mono font-bold" style={{ color: p.color }}>
                {p.n}
              </span>{' '}
              {p.label}
            </span>
          ))}
        </p>
        {/* 与下方清单同序的状态条，一眼看出免费 / 收费分布 */}
        <div className="mt-2 flex gap-1" aria-hidden="true">
          {ATM_TYPES.map((a) => (
            <span
              key={a.key}
              className="h-1.5 flex-1 rounded-full"
              style={{ background: STATUS_CSSVAR[tier.fees[a.key].s] }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

/** 清单中的一行：名称 / 网络 / 状态 / 收费标准常显，具体条件点按展开 */
function AtmRow({
  atm,
  fee,
  open,
  onToggle,
}: {
  atm: AtmType
  fee: Fee
  open: boolean
  onToggle: () => void
}) {
  const detailId = useId()

  return (
    <li className={`transition-colors duration-200 ${open ? 'bg-card2' : ''}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={detailId}
        className="flex w-full items-start gap-3 px-4 py-3 text-left active:bg-card2"
      >
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-bd2 bg-white p-1 dark:border-white/10 dark:bg-white/90">
          <AtmIcon atm={atm} size={atm.iconKind === 'pair' ? 12 : 18} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-2">
            <span className="min-w-0">
              <span className="block text-[14px] font-bold leading-snug">{atm.label}</span>
              <span className="block text-[12px] leading-snug text-mut">{atm.sub}</span>
            </span>
            <StatusBadge status={fee.s} note={fee.n} showDetails={false} className="mt-px shrink-0" />
          </span>
          <span className="mt-1.5 flex items-center justify-between gap-2">
            <span className="text-[14px] font-bold leading-tight" style={{ color: STATUS_CSSVAR[fee.s] }}>
              {STATUS_VERDICT[fee.s].label}
            </span>
            <ToggleHint open={open} />
          </span>
        </span>
      </button>
      <ConditionDetail
        id={detailId}
        open={open}
        label={`${atm.label}具体条件`}
        status={fee.s}
        note={fee.n}
      />
    </li>
  )
}
