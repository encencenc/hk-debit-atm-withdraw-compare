import { useState } from 'react'
import {
  ATM_TYPES,
  BANKS,
  FeeStatus,
  type AtmKey,
  type Bank,
  type CardType,
  type Tier,
} from '../data/banks'
import { BankLogo } from './BankLogo'
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

const GRID = 'grid w-max grid-cols-[200px_240px_repeat(6,150px)]'

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
    <div className="max-h-[72vh] overflow-auto rounded-[14px] border border-bd bg-card">
      {/* 表头（吸顶） */}
      <div className={`${GRID} sticky top-0 z-[5] border-b border-bd bg-card`}>
        <div className="sticky left-0 z-[6] flex items-center bg-card p-3.5 text-[13px] font-bold">
          银行
        </div>
        <div className="sticky left-[200px] z-[6] flex items-center border-r border-bd2 bg-card p-3.5 text-[13px] font-bold">
          卡类 · 户口类别
        </div>
        {ATM_TYPES.map((a) => (
          <div key={a.key} className="px-3 py-[11px]">
            <div className="text-[13px] font-bold">{a.label}</div>
            <div className="mt-0.5 text-[11px] text-mut">{a.sub}</div>
          </div>
        ))}
      </div>

      {/* 数据行（前两列吸左） */}
      {rows.map((r, i) => (
        <div
          key={`${r.bank.id}-${r.card.id}-${i}`}
          className={GRID}
          style={{
            borderTop: r.firstOfBank ? '2px solid var(--bd)' : '1px solid var(--bd2)',
          }}
        >
          <div className="sticky left-0 z-[2] flex items-center gap-2.5 bg-card px-3.5 py-3">
            {r.firstOfBank && (
              <>
                <BankLogo bank={r.bank} size={30} />
                <span className="text-sm font-semibold leading-tight">{r.bank.name}</span>
              </>
            )}
          </div>
          <div className="sticky left-[200px] z-[2] flex flex-col justify-center gap-0.5 border-r border-bd2 bg-card px-3.5 py-2.5">
            <span className="text-sm font-semibold leading-tight">{r.tier.label}</span>
            <span className="text-xs text-mut">{r.card.label}</span>
          </div>
          {ATM_TYPES.map((a) => {
            const fee = r.tier.fees[a.key]
            return (
              <div key={a.key} className="flex items-center px-3 py-2.5">
                <StatusBadge status={fee.s} note={fee.n} contextLabel={a.label} />
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/** 移动端：每个卡类/户口组合一张卡片，六类 ATM 状态成片展示 */
function MobileCards({ rows }: { rows: FlatRow[] }) {
  return (
    <div className="mt-4 flex flex-col gap-2.5">
      {rows.map((r, i) => (
        <div
          key={`${r.bank.id}-${r.card.id}-${i}`}
          className="rounded-[14px] border border-bd bg-card p-3.5"
        >
          <div className="flex items-center gap-2.5">
            <BankLogo bank={r.bank} size={34} />
            <div className="min-w-0">
              <div className="text-[14.5px] font-semibold leading-tight">{r.bank.name}</div>
              <div className="mt-0.5 text-xs text-mut">
                {r.card.label} · {r.tier.label}
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-[7px] max-[359px]:grid-cols-2">
            {ATM_TYPES.map((a) => (
              <StatusChip
                key={a.key}
                atm={a}
                status={r.tier.fees[a.key].s}
                note={r.tier.fees[a.key].n}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/** 完整对比表：搜索 + 卡类 / 仅看免费筛选 + 桌面吸附表格 / 移动卡片 */
export function ComparisonTable() {
  const isDesktop = useIsDesktop()
  const [q, setQ] = useState('')
  const [cardFilter, setCardFilter] = useState<string>('all')
  const [freeKey, setFreeKey] = useState<AtmKey | null>(null)
  const [freeMode, setFreeMode] = useState<FreeFilterMode>('full')

  const cardTypes = [
    ...new Set([
      ...CARD_TYPE_ORDER,
      ...BANKS.flatMap((b) => b.cardTypes.map((c) => c.label)),
    ]),
  ]
  const query = q.trim()
  const matchesFreeMode = (status: FeeStatus) =>
    freeMode === 'full'
      ? status === FeeStatus.Free
      : status === FeeStatus.Free || status === FeeStatus.Currency || status === FeeStatus.Limited
  const pass = (b: Bank, c: CardType, t: Tier) =>
    (!query || b.name.includes(query)) &&
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

  return (
    <div>
      {/* 筛选栏 */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2.5 rounded-2xl border border-bd bg-card px-[18px] py-3.5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索银行…"
          aria-label="搜索银行"
          className="min-w-[130px] flex-[0_1_180px] rounded-[9px] border border-bd bg-card2 px-[13px] py-[7px] text-[13.5px] text-tx outline-none transition-colors focus:border-ac"
        />
        <div className="flex flex-wrap items-center gap-[7px]">
          <span className="text-[12.5px] text-mut">卡类</span>
          <Pill small label="全部" active={cardFilter === 'all'} onClick={() => setCardFilter('all')} />
          {cardTypes.map((ct) => (
            <Pill small key={ct} label={ct} active={cardFilter === ct} onClick={() => setCardFilter(ct)} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-[7px]">
          <span className="text-[12.5px] text-mut">免费口径</span>
          <Pill small label="完全免费" active={freeMode === 'full'} onClick={() => setFreeMode('full')} />
          <Pill small label="所有免费" active={freeMode === 'inclusive'} onClick={() => setFreeMode('inclusive')} />
        </div>
        <div className="flex flex-wrap items-center gap-[7px]">
          <span className="text-[12.5px] text-mut">免费 ATM</span>
          <Pill
            small
            label="不限"
            active={freeKey === null}
            onClick={() => {
              setFreeKey(null)
              setFreeMode('full')
            }}
          />
          {ATM_TYPES.map((a) => (
            <Pill small key={a.key} label={a.short} active={freeKey === a.key} onClick={() => setFreeKey(a.key)} />
          ))}
        </div>
        {hasFilter && (
          <button
            type="button"
            onClick={() => {
              setQ('')
              setCardFilter('all')
              setFreeKey(null)
              setFreeMode('full')
            }}
            className="ml-auto text-[13px] font-semibold text-ac hover:opacity-80"
          >
            ✕ 清除筛选
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="pb-6 pt-11 text-center text-sm text-mut">没有符合筛选条件的组合</div>
      ) : isDesktop ? (
        <>
          <div className="mx-1 mb-2 mt-4 flex flex-wrap items-center justify-between gap-2 text-[13px] text-mut">
            <span>
              共 <b className="text-tx">{rows.length}</b> 个卡类/户口组合
            </span>
            <span>表格可横向滚动 · 前两列已固定 · 悬停徽章查看费用详情</span>
          </div>
          <DesktopTable rows={rows} />
        </>
      ) : (
        <MobileCards rows={rows} />
      )}
    </div>
  )
}
