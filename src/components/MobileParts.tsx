import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { FeeStatus } from '../data/banks'
import { STATUS_CSSVAR, STATUS_VERDICT, noteLines } from '../lib/status'

/* 三个查询页移动端（<768px）共用的小部件：工作区步骤标题、展开箭头、
   「填完条件 → 收起工作区 → 滚到结果」的状态管理 */

/** 收起工作区后，结果摘要顶部与视口顶端的距离（覆盖压缩 / 完整两种顶栏高度） */
const SCROLL_OFFSET = 80

/** 查询工作区的展开 / 收起；finish() 收起后若结果摘要不在视口上半部，平滑滚动过去。
 *  revealed：结果区是否显示——仅在工作区收起时显示，初始及每次点「修改」重新选择时都隐藏；
 *  done：是否已完成过一次选择（用于保留已选状态与「查看结果」按钮） */
export function useCollapsibleQuery() {
  const [editing, setEditing] = useState(true)
  const [done, setDone] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const scrollPending = useRef(false)

  useEffect(() => {
    if (editing || !scrollPending.current) return
    scrollPending.current = false
    const el = resultRef.current
    if (!el) return
    const top = el.getBoundingClientRect().top
    if (top < SCROLL_OFFSET || top > window.innerHeight * 0.45) {
      window.scrollTo({ top: window.scrollY + top - SCROLL_OFFSET, behavior: 'smooth' })
    }
  }, [editing])

  return {
    editing,
    revealed: !editing,
    done,
    resultRef,
    edit: () => setEditing(true),
    finish: () => {
      scrollPending.current = true
      setEditing(false)
      setDone(true)
    },
  }
}

/** 多项可同时展开的折叠状态（按 key 记录） */
export function useOpenSet() {
  const [open, setOpen] = useState<Set<string>>(() => new Set())
  return {
    isOpen: (key: string) => open.has(key),
    toggle: (key: string) =>
      setOpen((prev) => {
        const next = new Set(prev)
        if (next.has(key)) next.delete(key)
        else next.add(key)
        return next
      }),
  }
}

/** 工作区内的一个步骤：编号 + 标题，步骤之间用分隔线而非独立卡片 */
export function MobileStep({
  step,
  title,
  aside,
  divided = false,
  children,
}: {
  step?: number
  title: string
  aside?: ReactNode
  divided?: boolean
  children: ReactNode
}) {
  return (
    <div className={`mx-3 py-3 ${divided ? 'border-t border-bd2' : ''}`}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {step !== undefined && (
            <span className="mono flex h-5 w-5 items-center justify-center rounded-md bg-acsoft text-[11px] font-bold text-ac">
              {step}
            </span>
          )}
          <span className="text-[13px] font-bold tracking-wide text-tx">{title}</span>
        </div>
        {aside && <span className="text-[11.5px] text-mut">{aside}</span>}
      </div>
      {children}
    </div>
  )
}

/** 工作区底部的「查看结果」主按钮 */
export function MobileFinishButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div className="px-3 pb-3">
      <button
        type="button"
        onClick={onClick}
        className="tactile flex w-full items-center justify-center gap-1.5 rounded-[12px] bg-acs py-2.5 text-[13.5px] font-semibold text-white shadow-sm"
      >
        {label}
        <Chevron className="-rotate-90" />
      </button>
    </div>
  )
}

/** 结果摘要右上角的「修改」入口 */
export function MobileEditButton({ onClick, label = '修改' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="修改查询条件"
      className="tactile inline-flex h-9 shrink-0 items-center gap-1 rounded-[10px] border border-bd px-2.5 text-[12.5px] font-semibold text-ac hover:border-ac/40"
    >
      {label}
      <Chevron />
    </button>
  )
}

/** 行内「查看条件 / 收起」提示 */
export function ToggleHint({ open, closedLabel = '查看条件' }: { open: boolean; closedLabel?: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-0.5 text-[12px] font-medium text-mut">
      {open ? '收起' : closedLabel}
      <Chevron className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
    </span>
  )
}

export function Chevron({ className = '' }: { className?: string }) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/** 清单行的展开区：行的自然延伸——与文字列对齐缩进 + 状态色左侧细线，不再套一层卡片 */
export function ConditionDetail({
  id,
  open,
  label,
  status,
  note,
  indentClass = 'ml-16',
}: {
  id: string
  open: boolean
  /** 无障碍名称，如「香港银通具体条件」 */
  label: string
  status: FeeStatus
  note?: string
  indentClass?: string
}) {
  const verdict = STATUS_VERDICT[status]
  const color = STATUS_CSSVAR[status]
  const lines = noteLines(note)
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={id}
          role="region"
          aria-label={label}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="overflow-hidden"
        >
          <div
            className={`mb-3.5 mr-4 border-l-2 pl-3 ${indentClass}`}
            style={{ borderColor: `color-mix(in oklab, ${color} 45%, transparent)` }}
          >
            <div className="text-[11px] font-semibold tracking-wide text-mut">具体条件</div>
            {lines.length > 0 ? (
              lines.map((line, i) => (
                <p key={i} className="mt-0.5 text-[13px] font-semibold leading-snug text-tx [overflow-wrap:anywhere]">
                  {line}
                </p>
              ))
            ) : (
              <p className="mt-0.5 text-[13px] leading-snug text-mut">{verdict.detail}</p>
            )}
            {lines.length > 0 && <p className="mt-1.5 text-[12px] leading-relaxed text-mut">{verdict.detail}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
