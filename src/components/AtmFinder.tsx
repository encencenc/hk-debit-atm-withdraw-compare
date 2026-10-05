import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ATM_TYPES,
  BANKS,
  FeeStatus,
  type AtmKey,
  type AtmType,
  type Bank,
  type CardType,
  type Fee,
} from '../data/banks'
import { useIsDesktop } from '../hooks/useMediaQuery'
import {
  STATUS_CSSVAR,
  STATUS_LEGEND,
  STATUS_ORDER,
  STATUS_VERDICT,
  noteLines,
} from '../lib/status'
import { CHARGED, CONDITIONAL_FREE } from '../lib/stats'
import { AtmFinderMobile } from './AtmFinderMobile'
import { AtmIcon } from './AtmIcon'
import { BankLogo } from './BankLogo'
import { Icon } from './Icon'
import { InfoNotes } from './InfoNotes'
import { Panel, StepTitle } from './Panel'
import { StatusBadge, StatusMark } from './StatusBadge'

export interface CardRow {
  id: string
  bank: Bank
  card: CardType
  /** 该卡在当前 ATM 上各户口的收费；所有户口结果相同时无需切换 */
  fees: Fee[]
  uniform: boolean
  /** 各户口中最优的状态（用于排序） */
  best: FeeStatus
}

export type StatusFilter = 'all' | 'free' | 'conditional' | 'charged'

const SEARCH_ALIASES: [string, string][] = [
  ['premier', '卓越'],
  ['priority', '优先'],
  ['prestige', '优越'],
  ['private', '私人银行'],
]

const STATUS_FILTERS: { key: StatusFilter; label: string; match: (s: FeeStatus) => boolean }[] = [
  { key: 'all', label: '全部', match: () => true },
  { key: 'free', label: '完全免费', match: (s) => s === FeeStatus.Free },
  { key: 'conditional', label: '限定免费', match: (s) => CONDITIONAL_FREE.includes(s) },
  { key: 'charged', label: '收费', match: (s) => CHARGED.includes(s) },
]

const rank = (st: FeeStatus) => STATUS_ORDER.indexOf(st)

function buildRows(key: AtmKey): CardRow[] {
  const rows: CardRow[] = []
  for (const bank of BANKS) {
    for (const card of bank.cardTypes) {
      const fees = card.tiers.map((t) => t.fees[key])
      const sig = (f: Fee) => `${f.s}|${f.n ?? ''}`
      rows.push({
        id: `${bank.id}|${card.id}`,
        bank,
        card,
        fees,
        uniform: fees.every((f) => sig(f) === sig(fees[0])),
        best: fees.reduce((m, f) => (rank(f.s) < rank(m) ? f.s : m), fees[0].s),
      })
    }
  }
  return rows.sort((x, y) => rank(x.best) - rank(y.best))
}

/** 按 ATM 类型查找：左栏选 ATM，右栏列出各银行卡在该 ATM 上的收费 */
export function AtmFinder() {
  const [key, setKey] = useState<AtmKey>(ATM_TYPES[0].key)
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [q, setQ] = useState('')
  // 每张卡片当前选中的户口（跨 ATM 类型保留，切换 ATM 后仍看同一户口）
  const [tierSel, setTierSel] = useState<Record<string, number>>({})
  const isDesktop = useIsDesktop()

  const atm = ATM_TYPES.find((a) => a.key === key)!
  const allRows = buildRows(key)
  const query = q.trim().toLowerCase()
  // 英文关键词模糊映射到中文户口名（如 premier → 卓越）
  const terms = [query, ...SEARCH_ALIASES.filter(([en]) => query && en.startsWith(query)).map(([, zh]) => zh)]
  const hit = (s: string) => terms.some((t) => s.toLowerCase().includes(t))
  const match = STATUS_FILTERS.find((f) => f.key === filter)!.match
  const rows = allRows.filter(
    (r) =>
      r.fees.some((f) => match(f.s)) &&
      (!query ||
        hit(r.bank.name) ||
        hit(r.card.label) ||
        r.card.tiers.some((t) => hit(t.label))),
  )

  // 只有「免费且无附加条件」才是一行卡片；收费 / 不适用即使没有备注也要说明情况
  const isSimple = (r: CardRow) =>
    r.uniform && r.fees[0].s === FeeStatus.Free && noteLines(r.fees[0].n).length === 0
  const simpleRows = rows.filter(isSimple)

  // 估算卡片底部信息区的行数（半栏宽约 26 字一行），按估算高度排列，
  // 使并排两张卡片高度相近，避免一张被撑高显得臃肿
  const wrapLines = (text: string, perLine: number) => Math.max(1, Math.ceil(text.length / perLine))
  const estHeight = (r: CardRow) => {
    const noteRows = Math.max(
      ...r.fees.map((f) => noteLines(f.n).reduce((n, l) => n + wrapLines(l, 26), 0) || 1),
    )
    const tierRows = r.uniform ? 0 : 1 + wrapLines(r.card.tiers.map((t) => t.label).join('  '), 38)
    return noteRows + tierRows
  }
  // 收费 / 带条件分栏排序：免费但有条件 → 限定币种 → 限定 ATM → 有 FTF → 收费 → 不适用；
  // 有等级切换的卡片按各等级中最优的状态归类（切换等级时位置不跳动），同类内按估算高度排列
  const DETAIL_ORDER = [
    FeeStatus.Free,
    FeeStatus.Currency,
    FeeStatus.Limited,
    FeeStatus.Ftf,
    FeeStatus.Fee,
    FeeStatus.NotApplicable,
  ]
  const detailRows = rows
    .filter((r) => !isSimple(r))
    .sort(
      (x, y) =>
        DETAIL_ORDER.indexOf(x.best) - DETAIL_ORDER.indexOf(y.best) ||
        estHeight(x) - estHeight(y) ||
        Number(x.uniform) - Number(y.uniform),
    )

  // 选中户口：用户手动选过则沿用，否则取第一个符合筛选条件的户口
  const tierIndexOf = (r: CardRow) =>
    tierSel[r.id] ?? Math.max(0, r.fees.findIndex((f) => match(f.s)))

  const renderCard = (r: CardRow) => (
    <BankCardResult
      key={r.id}
      row={r}
      atm={atm}
      tierIndex={tierIndexOf(r)}
      onTier={(i) => setTierSel((m) => ({ ...m, [r.id]: i }))}
    />
  )

  // 状态分布（按卡类/户口组合统计，用于左栏比例条）
  const allFees = allRows.flatMap((r) => r.fees)
  const dist = STATUS_ORDER.map((s) => ({
    status: s,
    count: allFees.filter((f) => f.s === s).length,
  })).filter((d) => d.count > 0)

  // 移动端：同一份筛选 / 排序 / 户口逻辑，换成清单式的信息结构（桌面 / 平板布局保持不变）
  if (!isDesktop) {
    return (
      <AtmFinderMobile
        atm={atm}
        pickAtm={setKey}
        filters={STATUS_FILTERS}
        filter={filter}
        setFilter={setFilter}
        q={q}
        setQ={setQ}
        rowCount={rows.length}
        simpleRows={simpleRows}
        detailRows={detailRows}
        tierIndexOf={tierIndexOf}
        onTier={(id, i) => setTierSel((m) => ({ ...m, [id]: i }))}
        allFees={allFees}
        dist={dist}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      {/* ============ 左栏 ============ */}
      <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:col-span-4">
        <Panel className="flex flex-col gap-3 p-4">
          <StepTitle step={1}>选择提款 ATM 类型</StepTitle>
          <div className="flex flex-col gap-2">
            {ATM_TYPES.map((a) => {
              const sel = a.key === key
              return (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => setKey(a.key)}
                  aria-pressed={sel}
                  className={`tactile flex items-center gap-3 rounded-xl border p-3 text-left ${
                    sel
                      ? 'border-ac/45 bg-acsoft shadow-sm'
                      : 'border-bd bg-card hover:border-ac/35 hover:shadow-sm'
                  }`}
                  style={sel ? { boxShadow: 'inset 3px 0 0 var(--ac)' } : undefined}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-bd bg-white p-1.5 dark:border-white/10 dark:bg-white/90">
                    <AtmIcon atm={a} size={a.iconKind === 'pair' ? 14 : 21} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-tx">{a.label}</span>
                    <span className="mt-0.5 block truncate text-xs text-mut">{a.sub}</span>
                  </span>
                  {sel && <Icon name="check" size={16} className="text-ac" />}
                </button>
              )
            })}
          </div>
        </Panel>

        <Panel className="p-4">
          <StepTitle aside={<span className="mono">{allFees.length} 项</span>}>
            {atm.label} · 收费分布
          </StepTitle>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full bg-card2">
            {dist.map((d) => (
              <motion.span
                key={d.status}
                className="h-full"
                initial={false}
                animate={{ width: `${(d.count / allFees.length) * 100}%` }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ background: STATUS_CSSVAR[d.status] }}
                title={`${STATUS_LEGEND[d.status]}：${d.count}`}
              />
            ))}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-mut">
            {dist.map((d) => (
              <li key={d.status} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: STATUS_CSSVAR[d.status] }}
                  aria-hidden="true"
                />
                <span className="truncate">{STATUS_LEGEND[d.status]}</span>
                <b className="mono ml-auto text-tx">{d.count}</b>
              </li>
            ))}
          </ul>
        </Panel>
      </aside>

      {/* ============ 右栏 ============ */}
      <section className="flex flex-col gap-4 lg:col-span-8">
        <Panel className="flex items-center gap-4 p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-bd bg-white p-2 dark:border-white/10 dark:bg-white/90">
            <AtmIcon atm={atm} size={atm.iconKind === 'pair' ? 15 : 24} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold tracking-tight">{atm.label}</h2>
            <p className="mt-0.5 text-xs text-mut">
              {atm.sub} ·{' '}
              <b className="mono" style={{ color: 'var(--stF)' }}>
                {allFees.filter((f) => f.s === FeeStatus.Free).length}
              </b>{' '}
              个卡类/户口组合完全免费
            </p>
          </div>
        </Panel>

        <Panel className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
          <label className="relative flex flex-1 items-center">
            <Icon name="search" size={18} className="pointer-events-none absolute left-3 text-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索银行、卡类或户口（如 渣打、银联、Premium）…"
              aria-label="搜索银行、卡类或户口"
              className="w-full rounded-xl border border-transparent bg-card2 py-2.5 pl-10 pr-3 text-sm font-medium text-tx outline-none transition-colors focus:border-ac focus:bg-card"
            />
          </label>
          <div className="grid shrink-0 grid-cols-4 gap-1 rounded-xl bg-card2 p-1" role="group" aria-label="按收费状态筛选">
            {STATUS_FILTERS.map((f) => {
              const active = f.key === filter
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  aria-pressed={active}
                  className={`tactile whitespace-nowrap rounded-lg px-3 py-1.5 text-[12.5px] ${
                    active ? 'bg-card font-semibold text-tx shadow-sm' : 'font-medium text-mut hover:text-tx'
                  }`}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </Panel>

        <div className="flex items-center justify-between px-1 text-xs text-mut">
          <span>
            共 <b className="mono text-sm text-tx">{rows.length}</b> 张银行卡
          </span>
          <span className="hidden sm:inline">按收费由低到高排列</span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${key}|${filter}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-col gap-5"
          >
            {simpleRows.length > 0 && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {simpleRows.map((r) => renderCard(r))}
              </div>
            )}
            {detailRows.length > 0 && (
              <div>
                <div className="mb-2.5 flex items-center gap-3 px-1 text-xs font-medium text-mut">
                  <span>收费 / 带条件</span>
                  <span className="h-px flex-1 bg-bd" aria-hidden="true" />
                  <span className="mono">{detailRows.length}</span>
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {detailRows.map((r) => renderCard(r))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {rows.length === 0 && (
          <div className="py-10 text-center text-sm text-mut">没有符合条件的银行卡</div>
        )}

        <InfoNotes className="mt-2" />
      </section>
    </div>
  )
}

/**
 * 一张银行卡在当前 ATM 上的收费。
 * 默认只有标题行（logo · 银行卡 · 状态）；仅当各客户等级收费不同时出现等级切换，
 * 仅当有具体条件时出现条件说明框，两者共用一个底部信息区。
 */
function BankCardResult({
  row,
  atm,
  tierIndex,
  onTier,
}: {
  row: CardRow
  atm: AtmType
  tierIndex: number
  onTier: (i: number) => void
}) {
  const fee = row.uniform ? row.fees[0] : row.fees[tierIndex]
  const lines = noteLines(fee.n)
  const hasFooter = !row.uniform || lines.length > 0 || fee.s !== FeeStatus.Free
  const isShort = lines.length === 1 && lines[0].length <= 16
  return (
    <Panel hover className={`flex h-full flex-col p-4 ${hasFooter ? '' : 'justify-center'}`}>
      <div className="flex items-center gap-3">
        <BankLogo bank={row.bank} size={40} />
        <div className="min-w-0 flex-1">
          <div className="text-xs text-mut">{row.bank.name}</div>
          <div className="text-sm font-bold leading-snug">{row.card.label}</div>
        </div>
        <StatusBadge
          status={fee.s}
          note={fee.n}
          contextLabel={atm.label}
          showDetails={false}
          className="shrink-0"
        />
      </div>

      {hasFooter && (
        <div className="mt-3 flex flex-1 flex-col gap-2.5 border-t border-bd2 pt-3">
          {!row.uniform && (
            <div className="flex flex-wrap gap-1 rounded-lg bg-card2 p-1" role="group" aria-label="切换客户等级">
              {row.card.tiers.map((t, i) => {
                const active = i === tierIndex
                return (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => onTier(i)}
                    aria-pressed={active}
                    className={`tactile inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-left text-xs ${
                      active ? 'bg-card font-semibold text-tx shadow-sm' : 'font-medium text-mut hover:text-tx'
                    }`}
                  >
                    <StatusMark status={row.fees[i].s} size={12} />
                    {t.label}
                  </button>
                )
              })}
            </div>
          )}
          <div className="flex flex-1 items-center gap-2.5 rounded-lg border border-bd bg-card2 px-3 py-2 text-[13px] leading-snug">
            <span className="shrink-0 text-mut">条件</span>
            {lines.length > 0 ? (
              <div
                className={`min-w-0 text-tx [overflow-wrap:anywhere] ${
                  // 一句话的简短收费（如「每次50港元」）放大突出，避免框大字小
                  isShort ? 'text-[15px] font-semibold' : 'font-medium'
                }`}
              >
                {lines.map((line, j) => (
                  <div key={j}>{line}</div>
                ))}
              </div>
            ) : (
              <div className="min-w-0 text-mut">{STATUS_VERDICT[fee.s].detail}</div>
            )}
          </div>
        </div>
      )}
    </Panel>
  )
}
