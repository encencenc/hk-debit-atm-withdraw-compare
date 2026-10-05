import { Fragment, useState, type ReactNode } from 'react'
import {
  ATM_TYPES,
  BANKS,
  FeeStatus,
  META,
  type AtmKey,
  type Bank,
  type CardType,
  type Tier,
} from '../data/banks'
import { BankLogo } from './BankLogo'
import { Icon } from './Icon'
import { InfoNotes } from './InfoNotes'
import { ToggleHint } from './MobileParts'
import { Panel } from './Panel'
import { Pill } from './Pill'
import { StatusBadge, StatusChip } from './StatusBadge'
import { useIsDesktop } from '../hooks/useMediaQuery'

interface FlatRow {
  bank: Bank
  card: CardType
  tier: Tier
  firstOfBank: boolean
}

type FreeFilterMode = 'full' | 'inclusive'

const GRID = 'grid w-max min-w-full grid-cols-[200px_236px_repeat(6,minmax(150px,1fr))]'

const CARD_TYPE_ORDER = [
  'MasterCard 扣账卡',
  'Visa 扣账卡',
  '银联扣账卡',
  '银联双币提款卡',
  '银联港币提款卡',
  '银联人民币提款卡',
  'PLUS提款卡',
  '银通提款卡',
]

function DesktopTable({ rows }: { rows: FlatRow[] }) {
  return (
    <div className="card max-h-[72vh] overflow-auto">
      {/* 表头（吸顶） */}
      <div className={`${GRID} sticky top-0 z-[5] border-b border-bd bg-card2`}>
        <div className="sticky left-0 z-[6] flex items-center bg-card2 px-4 py-3.5 text-xs font-bold text-mut">
          银行机构
        </div>
        <div className="sticky left-[200px] z-[6] flex items-center border-r border-bd bg-card2 px-4 py-3.5 text-xs font-bold text-mut">
          户口类别 · 卡类
        </div>
        {ATM_TYPES.map((a) => (
          <div key={a.key} className="px-3 py-3 text-center">
            <div className="text-[13.5px] font-bold text-tx">{a.label}</div>
            <div className="mt-0.5 text-[11px] text-mut">{a.sub}</div>
          </div>
        ))}
      </div>

      {/* 数据行（前两列吸左） */}
      {rows.map((r, i) => (
        <div
          key={`${r.bank.id}-${r.card.id}-${i}`}
          className={`${GRID} group`}
          style={{
            borderTop: i === 0 ? undefined : r.firstOfBank ? '1px solid var(--bd)' : '1px solid var(--bd2)',
          }}
        >
          <div className="sticky left-0 z-[2] flex items-center gap-2.5 bg-card px-4 py-3 transition-colors group-hover:bg-card2">
            {r.firstOfBank && (
              <>
                <BankLogo bank={r.bank} size={34} />
                <span className="text-[13.5px] font-semibold leading-tight">{r.bank.name}</span>
              </>
            )}
          </div>
          <div className="sticky left-[200px] z-[2] flex flex-col justify-center gap-0.5 border-r border-bd bg-card px-4 py-2.5 transition-colors group-hover:bg-card2">
            <span className="text-[13.5px] font-semibold leading-tight text-ac">{r.tier.label}</span>
            <span className="text-xs text-mut">{r.card.label}</span>
          </div>
          {ATM_TYPES.map((a) => {
            const fee = r.tier.fees[a.key]
            return (
              <div
                key={a.key}
                className="flex items-center justify-center px-3 py-2.5 transition-colors group-hover:bg-card2"
              >
                <StatusBadge status={fee.s} note={fee.n} contextLabel={a.label} />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/** 移动端：一个清单容器，按银行分组；每个卡类/户口组合一行，六类 ATM 状态点按看详情 */
function MobileList({ rows }: { rows: FlatRow[] }) {
  return (
    <section className="overflow-hidden rounded-[20px] border border-bd bg-card shadow-card">
      {rows.map((r, i) => (
        <Fragment key={`${r.bank.id}-${r.card.id}-${i}`}>
          {r.firstOfBank && (
            <div
              className={`flex items-center gap-2.5 bg-card2 px-4 py-2 ${i > 0 ? 'border-t border-bd' : ''}`}
            >
              <BankLogo bank={r.bank} size={28} />
              <span className="text-[13.5px] font-bold leading-tight">{r.bank.name}</span>
            </div>
          )}
          <div className="border-t border-bd2 px-4 py-2.5">
            <div className="text-[13px] leading-snug">
              <span className="font-semibold text-ac">{r.tier.label}</span>
              <span className="text-[12px] text-mut"> · {r.card.label}</span>
            </div>
            <div className="-mx-1 mt-1 grid grid-cols-3 gap-x-1.5 max-[359px]:grid-cols-2">
              {ATM_TYPES.map((a) => (
                <StatusChip
                  key={a.key}
                  bare
                  atm={a}
                  status={r.tier.fees[a.key].s}
                  note={r.tier.fees[a.key].n}
                />
              ))}
            </div>
          </div>
        </Fragment>
      ))}
    </section>
  )
}

/** 移动端筛选：搜索常显，其余筛选收成一行摘要，点按展开 */
function MobileFilters({
  q,
  setQ,
  summary,
  hasFilter,
  resetFilters,
  children,
}: {
  q: string
  setQ: (q: string) => void
  summary: string
  hasFilter: boolean
  resetFilters: () => void
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <section className="rounded-[18px] border border-bd2 bg-card shadow-card">
      <div className="p-3">
        <label className="relative flex items-center">
          <Icon name="search" size={17} className="pointer-events-none absolute left-3 text-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索银行（如 渣打、汇丰、Mox）…"
            aria-label="搜索银行"
            className="w-full rounded-[10px] border border-transparent bg-card2 py-2 pl-9 pr-3 text-sm font-medium text-tx outline-none transition-colors focus:border-ac focus:bg-card"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 border-t border-bd2 px-3.5 py-2.5 text-left"
      >
        <Icon name="filter" size={15} className="text-ac" />
        <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-tx">{summary}</span>
        <ToggleHint open={open} closedLabel="筛选" />
      </button>
      {open && (
        <div className="flex flex-col gap-3 border-t border-bd2 px-3.5 pb-3.5 pt-3">
          {children}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasFilter}
              className="tactile inline-flex items-center gap-1.5 rounded-[10px] border border-bd bg-card px-3 py-2 text-[13px] font-semibold text-tx disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="reset" size={15} />
              重置
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="tactile flex-1 rounded-[10px] bg-acs py-2 text-[13px] font-semibold text-white"
            >
              完成
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
      <span className="w-[72px] shrink-0 pt-1 text-[13px] font-semibold text-mut">{label}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

/** 完整资费矩阵：搜索 + 卡类 / 免费 ATM 筛选 + 桌面吸附表格 / 移动卡片 */
export function ComparisonTable() {
  const isDesktop = useIsDesktop()
  const [q, setQ] = useState('')
  const [cardFilter, setCardFilter] = useState<string>('all')
  const [freeKey, setFreeKey] = useState<AtmKey | null>(null)
  const [freeMode, setFreeMode] = useState<FreeFilterMode>('full')

  const existing = new Set(BANKS.flatMap((b) => b.cardTypes.map((c) => c.label)))
  const cardTypes = [...new Set([...CARD_TYPE_ORDER, ...existing])].filter((ct) => existing.has(ct))
  const query = q.trim().toLowerCase()
  const matchesFreeMode = (status: FeeStatus) =>
    freeMode === 'full'
      ? status === FeeStatus.Free
      : status === FeeStatus.Free || status === FeeStatus.Currency || status === FeeStatus.Limited
  const pass = (b: Bank, c: CardType, t: Tier) =>
    (!query || b.name.toLowerCase().includes(query)) &&
    (cardFilter === 'all' || c.label === cardFilter) &&
    (freeKey === null || matchesFreeMode(t.fees[freeKey].s))

  const rows: FlatRow[] = []
  for (const b of BANKS) {
    let first = true
    for (const c of b.cardTypes) {
      for (const t of c.tiers) {
        if (!pass(b, c, t)) continue
        rows.push({ bank: b, card: c, tier: t, firstOfBank: first })
        first = false
      }
    }
  }

  const hasFilter = !!query || cardFilter !== 'all' || freeKey !== null
  const resetFilters = () => {
    setQ('')
    setCardFilter('all')
    setFreeKey(null)
    setFreeMode('full')
  }

  const filterRows = (
    <>
      <FilterRow label="卡类">
        <Pill small group="tbl-card" label="全部" active={cardFilter === 'all'} onClick={() => setCardFilter('all')} />
        {cardTypes.map((ct) => (
          <Pill small group="tbl-card" key={ct} label={ct} active={cardFilter === ct} onClick={() => setCardFilter(ct)} />
        ))}
      </FilterRow>
      <FilterRow label="免费 ATM">
        <Pill
          small
          group="tbl-free"
          label="不限"
          active={freeKey === null}
          onClick={() => {
            setFreeKey(null)
            setFreeMode('full')
          }}
        />
        {ATM_TYPES.map((a) => (
          <Pill small group="tbl-free" key={a.key} label={a.short} active={freeKey === a.key} onClick={() => setFreeKey(a.key)} />
        ))}
      </FilterRow>
      <FilterRow label="免费口径">
        <Pill small group="tbl-mode" label="完全免费" active={freeMode === 'full'} onClick={() => setFreeMode('full')} />
        <Pill small group="tbl-mode" label="含限定免费" active={freeMode === 'inclusive'} onClick={() => setFreeMode('inclusive')} />
      </FilterRow>
    </>
  )
  // 移动端筛选收起时的一行摘要
  const freeAtm = ATM_TYPES.find((a) => a.key === freeKey)
  const filterSummary = [
    `卡类：${cardFilter === 'all' ? '全部' : cardFilter}`,
    `免费 ATM：${freeAtm ? `${freeAtm.short}（${freeMode === 'full' ? '完全免费' : '含限定免费'}）` : '不限'}`,
  ].join(' · ')

  return (
    <div>
      {/* 筛选卡片 */}
      {isDesktop ? (
      <Panel className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex flex-1 items-center">
            <Icon name="search" size={18} className="pointer-events-none absolute left-3 text-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜索银行（如 渣打、汇丰、Mox）…"
              aria-label="搜索银行"
              className="w-full rounded-xl border border-transparent bg-card2 py-2.5 pl-10 pr-3 text-sm font-medium text-tx outline-none transition-colors focus:border-ac focus:bg-card"
            />
          </label>
          <div className="flex shrink-0">
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasFilter}
              className="tactile inline-flex items-center gap-1.5 rounded-xl border border-bd bg-card px-3.5 py-2.5 text-[13px] font-semibold text-tx hover:border-ac/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="reset" size={16} />
              重置筛选
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-bd2 pt-4">{filterRows}</div>
      </Panel>
      ) : (
        <MobileFilters q={q} setQ={setQ} summary={filterSummary} hasFilter={hasFilter} resetFilters={resetFilters}>
          {filterRows}
        </MobileFilters>
      )}

      <div className="mx-1 mb-2 mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-mut">
        <span>
          共 <b className="mono text-sm text-ac">{rows.length}</b> 个卡类/户口组合
          {isDesktop && <span className="text-mut/80"> · 表格可横向滚动，前两列已固定，悬停徽章看详情</span>}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-ac" aria-hidden="true" />
          数据截至 {META.updatedAt}
        </span>
      </div>

      {rows.length === 0 ? (
        <div className="pb-6 pt-11 text-center text-sm text-mut">没有符合筛选条件的组合</div>
      ) : isDesktop ? (
        <DesktopTable rows={rows} />
      ) : (
        <MobileList rows={rows} />
      )}

      <InfoNotes variant={isDesktop ? 'default' : 'mobile'} className={isDesktop ? 'mt-6' : 'mt-5'} />
    </div>
  )
}
