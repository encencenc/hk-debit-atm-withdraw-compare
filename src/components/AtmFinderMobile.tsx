import { useId } from 'react'
import { motion } from 'motion/react'
import { ATM_TYPES, FeeStatus, type AtmKey, type AtmType, type Fee } from '../data/banks'
import { STATUS_CSSVAR, STATUS_LEGEND, STATUS_VERDICT, noteLines } from '../lib/status'
import type { CardRow, StatusFilter } from './AtmFinder'
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
import { StatusBadge, StatusMark } from './StatusBadge'

/* 「按 ATM 类型查找」移动端（<768px）专用视图。筛选、排序、户口选择逻辑全部由 AtmFinder 持有：
   选择 ATM（完成后收起）→ ATM 摘要 + 收费分布 → 单一银行卡清单（条件按需展开）→ 说明 */

interface Props {
  atm: AtmType
  pickAtm: (key: AtmKey) => void
  filters: { key: StatusFilter; label: string }[]
  filter: StatusFilter
  setFilter: (f: StatusFilter) => void
  q: string
  setQ: (q: string) => void
  rowCount: number
  simpleRows: CardRow[]
  detailRows: CardRow[]
  tierIndexOf: (r: CardRow) => number
  onTier: (rowId: string, i: number) => void
  allFees: Fee[]
  dist: { status: FeeStatus; count: number }[]
}

export function AtmFinderMobile({
  atm,
  pickAtm,
  filters,
  filter,
  setFilter,
  q,
  setQ,
  rowCount,
  simpleRows,
  detailRows,
  tierIndexOf,
  onTier,
  allFees,
  dist,
}: Props) {
  // 初始不预选 ATM、不展示结果：选定 ATM 后结果区才展开
  const { editing, revealed, resultRef, edit, finish } = useCollapsibleQuery()
  const open = useOpenSet()
  const freeCount = allFees.filter((f) => f.s === FeeStatus.Free).length

  const renderRow = (r: CardRow) => (
    <BankRow
      key={r.id}
      row={r}
      tierIndex={tierIndexOf(r)}
      onTier={(i) => onTier(r.id, i)}
      open={open.isOpen(r.id)}
      onToggle={() => open.toggle(r.id)}
    />
  )

  return (
    <div className="flex flex-col gap-4">
      {editing && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="rounded-[18px] border border-bd2 bg-card shadow-card"
        >
          {/* 选定 ATM 即视为条件填写完成，收起工作区 */}
          <MobileStep step={1} title="选择提款 ATM 类型">
            <div className="grid grid-cols-2 gap-1.5">
              {ATM_TYPES.map((a) => {
                const sel = revealed && a.key === atm.key
                return (
                  <button
                    key={a.key}
                    type="button"
                    onClick={() => {
                      pickAtm(a.key)
                      finish()
                    }}
                    aria-pressed={sel}
                    className={`tactile relative flex items-center gap-2 rounded-[10px] border px-2 py-1.5 text-left ${
                      sel ? 'border-ac/45 bg-acsoft' : 'border-transparent bg-card2 hover:border-ac/30'
                    }`}
                  >
                    <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border border-bd2 bg-white p-1 dark:border-white/10 dark:bg-white/90">
                      <AtmIcon atm={a} size={a.iconKind === 'pair' ? 10 : 16} />
                    </span>
                    <span className="flex min-w-0 flex-col pr-2.5">
                      <span
                        className={`text-[12.5px] leading-tight ${sel ? 'font-bold text-ac' : 'font-semibold text-tx'}`}
                      >
                        {a.label}
                      </span>
                      <span className="mt-0.5 truncate text-[10.5px] text-mut">{a.sub}</span>
                    </span>
                    {sel && <Icon name="check" size={13} className="absolute right-1 top-1 text-ac" />}
                  </button>
                )
              })}
            </div>
          </MobileStep>
          {revealed && <MobileFinishButton label="查看各行收费" onClick={finish} />}
        </motion.div>
      )}

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="flex flex-col gap-4"
        >
          {/* ATM 摘要 + 收费分布：合并原先的两张卡片 */}
          <div ref={resultRef} className="rounded-[20px] border border-bd bg-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-bd2 bg-white p-1.5 dark:border-white/10 dark:bg-white/90">
                <AtmIcon atm={atm} size={atm.iconKind === 'pair' ? 13 : 20} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-bold leading-snug tracking-tight">{atm.label}</h2>
                <p className="text-[12.5px] leading-snug text-mut">{atm.sub}</p>
              </div>
              {!editing && <MobileEditButton onClick={edit} label="换 ATM" />}
            </div>

            <div className="mt-3 border-t border-bd2 pt-3">
              <p className="text-[13.5px] font-semibold leading-snug text-tx">
                <span className="text-mut">{allFees.length} 个卡类/户口组合：</span>
                <span className="mono font-bold" style={{ color: 'var(--stF)' }}>
                  {freeCount}
                </span>{' '}
                个完全免费
              </p>
              <div className="mt-2 flex h-1.5 overflow-hidden rounded-full bg-card2">
                {dist.map((d) => (
                  <motion.span
                    key={d.status}
                    className="h-full"
                    initial={false}
                    animate={{ width: `${(d.count / allFees.length) * 100}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{ background: STATUS_CSSVAR[d.status] }}
                  />
                ))}
              </div>
              <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-mut">
                {dist.map((d) => (
                  <li key={d.status} className="flex items-center gap-1">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: STATUS_CSSVAR[d.status] }}
                      aria-hidden="true"
                    />
                    {STATUS_LEGEND[d.status]}
                    <b className="mono text-tx">{d.count}</b>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 单一银行卡清单：搜索与筛选并入清单头部，行间仅用分隔线 */}
          <section className="overflow-hidden rounded-[20px] border border-bd bg-card shadow-card">
            <div className="flex flex-col gap-2.5 px-3 pb-3 pt-3">
              <label className="relative flex items-center">
                <Icon name="search" size={17} className="pointer-events-none absolute left-3 text-faint" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="搜索银行、卡类或户口（如 渣打、银联、Premium）…"
                  aria-label="搜索银行、卡类或户口"
                  className="w-full rounded-[10px] border border-transparent bg-card2 py-2 pl-9 pr-3 text-sm font-medium text-tx outline-none transition-colors focus:border-ac focus:bg-card"
                />
              </label>
              <div className="grid grid-cols-4 gap-1 rounded-[10px] bg-card2 p-1" role="group" aria-label="按收费状态筛选">
                {filters.map((f) => {
                  const active = f.key === filter
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setFilter(f.key)}
                      aria-pressed={active}
                      className={`tactile whitespace-nowrap rounded-lg px-1 py-1.5 text-[12.5px] ${
                        active ? 'bg-card font-semibold text-tx shadow-sm' : 'font-medium text-mut hover:text-tx'
                      }`}
                    >
                      {f.label}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center justify-between px-1 text-[11.5px] text-mut">
                <span>
                  共 <b className="mono text-[13px] text-tx">{rowCount}</b> 张银行卡
                </span>
                <span>按收费由低到高排列</span>
              </div>
            </div>

            <motion.div
              key={`${atm.key}|${filter}`}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {simpleRows.length > 0 && (
                <ul className="divide-y divide-bd2 border-t border-bd2">{simpleRows.map(renderRow)}</ul>
              )}
              {detailRows.length > 0 && (
                <>
                  <div className="flex items-center justify-between border-y border-bd2 bg-card2 px-4 py-1.5 text-[11.5px] font-medium text-mut">
                    <span>收费 / 带条件</span>
                    <span className="mono">{detailRows.length}</span>
                  </div>
                  <ul className="divide-y divide-bd2">{detailRows.map(renderRow)}</ul>
                </>
              )}
              {rowCount === 0 && (
                <div className="border-t border-bd2 py-10 text-center text-sm text-mut">没有符合条件的银行卡</div>
              )}
            </motion.div>
          </section>
        </motion.div>
      )}

      <InfoNotes variant="mobile" className="mt-1" />
    </div>
  )
}

/** 清单中的一张银行卡：银行 / 卡类 / 状态常显；各户口收费不同时显示户口切换；条件点按展开 */
function BankRow({
  row,
  tierIndex,
  onTier,
  open,
  onToggle,
}: {
  row: CardRow
  tierIndex: number
  onTier: (i: number) => void
  open: boolean
  onToggle: () => void
}) {
  const detailId = useId()
  const fee = row.uniform ? row.fees[0] : row.fees[tierIndex]
  // 与桌面卡片同一口径：免费、无条件且各户口一致时只有标题行，不需要展开
  const expandable = !row.uniform || noteLines(fee.n).length > 0 || fee.s !== FeeStatus.Free

  const head = (
    <>
      <BankLogo bank={row.bank} size={34} className="mt-0.5" />
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="block text-[12px] leading-snug text-mut">{row.bank.name}</span>
            <span className="block text-[14px] font-bold leading-snug">{row.card.label}</span>
          </span>
          <StatusBadge status={fee.s} note={fee.n} showDetails={false} className="mt-px shrink-0" />
        </span>
        {expandable && (
          <span className="mt-1.5 flex items-center justify-between gap-2">
            <span className="text-[14px] font-bold leading-tight" style={{ color: STATUS_CSSVAR[fee.s] }}>
              {STATUS_VERDICT[fee.s].label}
            </span>
            <ToggleHint open={open} />
          </span>
        )}
      </span>
    </>
  )

  if (!expandable) {
    return <li className="flex items-start gap-3 px-4 py-3">{head}</li>
  }

  return (
    <li className={`transition-colors duration-200 ${open ? 'bg-card2' : ''}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={detailId}
        className="flex w-full items-start gap-3 px-4 pb-3 pt-3 text-left active:bg-card2"
      >
        {head}
      </button>
      {/* 户口切换会改变本行结果，常显而不折叠 */}
      {!row.uniform && (
        <div className="-mt-1 mb-3 ml-[62px] mr-4 flex flex-wrap gap-1" role="group" aria-label="切换客户等级">
          {row.card.tiers.map((t, i) => {
            const active = i === tierIndex
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => onTier(i)}
                aria-pressed={active}
                className={`tactile inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-left text-xs ${
                  active
                    ? 'border-ac/40 bg-acsoft font-semibold text-tx'
                    : 'border-bd2 bg-card font-medium text-mut hover:text-tx'
                }`}
              >
                <StatusMark status={row.fees[i].s} size={12} />
                {t.label}
              </button>
            )
          })}
        </div>
      )}
      <ConditionDetail
        id={detailId}
        open={open}
        label={`${row.bank.name}${row.card.label}具体条件`}
        status={fee.s}
        note={fee.n}
        indentClass="ml-[62px]"
      />
    </li>
  )
}
