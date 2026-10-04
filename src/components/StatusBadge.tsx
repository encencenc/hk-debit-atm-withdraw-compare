import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { type AtmType, FeeStatus } from '../data/banks'
import {
  STATUS_CSSVAR,
  STATUS_LABEL,
  STATUS_VERDICT,
  noteLines,
  statusTitle,
} from '../lib/status'

interface BadgeProps {
  status: FeeStatus
  note?: string
  className?: string
  contextLabel?: string
  showDetails?: boolean
}

interface PopoverPosition {
  top: number
  left: number
  arrowTop: number
  side: 'left' | 'right'
}

interface FeeTooltipTriggerProps {
  status: FeeStatus
  note?: string
  className?: string
  style?: CSSProperties
  ariaLabel: string
  contextLabel?: string
  showDetails?: boolean
  children: ReactNode
}

function FeeDetailPopover({
  status,
  note,
  id,
  anchorRef,
  popoverRef,
  contextLabel,
  onPointerEnter,
  onPointerLeave,
}: {
  status: FeeStatus
  note?: string
  id: string
  anchorRef: React.RefObject<HTMLSpanElement>
  popoverRef: React.RefObject<HTMLDivElement>
  contextLabel?: string
  onPointerEnter: () => void
  onPointerLeave: () => void
}) {
  const [position, setPosition] = useState<PopoverPosition | null>(null)
  const lines = noteLines(note)
  const color = STATUS_CSSVAR[status]
  const verdict = STATUS_VERDICT[status]
  const hasAttention = status !== FeeStatus.Free && status !== FeeStatus.NotApplicable

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current
    const popover = popoverRef.current
    if (!anchor || !popover) return

    const anchorRect = anchor.getBoundingClientRect()
    const popoverRect = popover.getBoundingClientRect()
    const viewportPadding = 12
    const gap = 10
    const fitsRight = anchorRect.right + gap + popoverRect.width <= window.innerWidth - viewportPadding
    const side = fitsRight ? 'right' : 'left'
    const preferredLeft = side === 'right'
      ? anchorRect.right + gap
      : anchorRect.left - popoverRect.width - gap
    const maxLeft = Math.max(viewportPadding, window.innerWidth - popoverRect.width - viewportPadding)
    const left = Math.min(Math.max(preferredLeft, viewportPadding), maxLeft)
    const preferredTop = anchorRect.top + (anchorRect.height - popoverRect.height) / 2
    const maxTop = Math.max(viewportPadding, window.innerHeight - popoverRect.height - viewportPadding)
    const top = Math.min(Math.max(preferredTop, viewportPadding), maxTop)
    const arrowTop = Math.min(
      Math.max(anchorRect.top + anchorRect.height / 2 - top, 14),
      Math.max(14, popoverRect.height - 14),
    )

    setPosition({ top, left, arrowTop, side })
  }, [anchorRef])

  useLayoutEffect(() => {
    updatePosition()
    const animationFrame = window.requestAnimationFrame(updatePosition)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [updatePosition])

  const popoverStyle = {
    top: position?.top ?? 0,
    left: position?.left ?? 0,
    visibility: position ? 'visible' : 'hidden',
    '--fee-arrow-y': `${position?.arrowTop ?? 0}px`,
  } as CSSProperties

  return createPortal(
    <div
      ref={popoverRef}
      id={id}
      role="tooltip"
      className={`fee-popover fee-popover--${position?.side ?? 'right'}`}
      style={popoverStyle}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerLeave}
    >
      <div className="fee-popover__header flex items-start gap-3">
        <span
          className="fee-popover__icon flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
          aria-hidden="true"
          style={{ background: `color-mix(in oklab, ${color} 12%, var(--card))` }}
        >
          <StatusMark status={status} size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="fee-popover__title text-[14px] font-bold leading-tight">{STATUS_LABEL[status]}</div>
            <div className="fee-popover__code mono text-[9px] font-semibold tracking-[0.14em] text-mut">FEE STATUS</div>
          </div>
        </div>
      </div>

      {contextLabel && (
        <div className="fee-popover__context mt-3 flex items-center justify-between gap-3 rounded-[9px] bg-card2 px-2.5 py-2 text-[11px] text-mut">
          <span>适用 ATM</span>
          <strong className="text-right text-[11.5px] font-semibold text-tx">{contextLabel}</strong>
        </div>
      )}

      <div
        className={`fee-popover__verdict ${hasAttention ? 'fee-popover__verdict--attention' : ''}`}
        style={{
          color,
          background: `color-mix(in oklab, ${color} 10%, var(--card))`,
          borderColor: `color-mix(in oklab, ${color} 42%, transparent)`,
        }}
      >
        <div className="fee-popover__verdict-label">{verdict.label}</div>
        <div className="fee-popover__verdict-detail">{verdict.detail}</div>
      </div>

      {lines.length > 0 && (
        <div className={`fee-popover__notes mt-3 rounded-[10px] border border-bd2 bg-card2/70 px-3 py-2.5 ${hasAttention ? 'fee-popover__notes--attention' : ''}`}>
          <div className="fee-popover__notes-label mb-1.5 text-[10px] font-bold tracking-[0.12em] text-mut">
            {hasAttention ? '具体费用 / 条件' : '补充说明'}
          </div>
          <div className="fee-popover__notes-list space-y-1">
            {lines.map((line, lineIndex) => (
              <div key={`${line}-${lineIndex}`} className="fee-popover__note mono text-[11.5px] leading-relaxed text-tx [overflow-wrap:anywhere]">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fee-popover__footer mt-3 flex items-center gap-1.5 border-t border-dashed border-bd2 pt-2.5 text-[10.5px] text-mut">
        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-bd font-bold">i</span>
        <span>费用规则以银行最新公告为准</span>
      </div>
    </div>,
    document.body,
  )
}

export function FeeDetailTrigger({
  status,
  note,
  className = '',
  style,
  ariaLabel,
  contextLabel,
  showDetails = true,
  children,
}: FeeTooltipTriggerProps) {
  const anchorRef = useRef<HTMLSpanElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<number | null>(null)
  const [open, setOpen] = useState(false)
  const popoverId = useId()

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const showPopover = useCallback(() => {
    clearCloseTimer()
    setOpen(true)
  }, [clearCloseTimer])

  const hidePopover = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false)
      closeTimerRef.current = null
    }, 100)
  }, [clearCloseTimer])

  const togglePopover = useCallback(() => {
    clearCloseTimer()
    setOpen((currentOpen) => !currentOpen)
  }, [clearCloseTimer])

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer])

  useEffect(() => {
    if (!open) return

    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (anchorRef.current?.contains(target) || popoverRef.current?.contains(target)) return

      clearCloseTimer()
      setOpen(false)
    }

    document.addEventListener('pointerdown', handleOutsidePointerDown)
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown)
  }, [open, clearCloseTimer])

  return (
    <>
      <span
        ref={anchorRef}
        tabIndex={showDetails ? 0 : undefined}
        aria-label={ariaLabel}
        aria-describedby={showDetails && open ? popoverId : undefined}
        className={className}
        style={style}
        onPointerEnter={showDetails ? (event) => {
          if (event.pointerType === 'mouse') showPopover()
        } : undefined}
        onPointerLeave={showDetails ? (event) => {
          if (event.pointerType === 'mouse') hidePopover()
        } : undefined}
        onPointerUp={showDetails ? (event) => {
          if (event.pointerType !== 'mouse') {
            clearCloseTimer()
            setOpen((currentOpen) => !currentOpen)
          }
        } : undefined}
        onFocus={showDetails ? showPopover : undefined}
        onBlur={showDetails ? hidePopover : undefined}
        onKeyDown={showDetails ? (event) => {
          if (event.key === 'Escape') {
            clearCloseTimer()
            setOpen(false)
          }
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            togglePopover()
          }
        } : undefined}
      >
        {children}
      </span>
      {showDetails && open && (
        <FeeDetailPopover
          status={status}
          note={note}
          id={popoverId}
          anchorRef={anchorRef}
          popoverRef={popoverRef}
          contextLabel={contextLabel}
          onPointerEnter={showPopover}
          onPointerLeave={hidePopover}
        />
      )}
    </>
  )
}

/** 状态标记内的线性符号（16×16 画布，绘制于实心圆之上） */
const MARK_GLYPH: Record<FeeStatus, string> = {
  [FeeStatus.Free]: 'M4.9 8.2 7 10.3l4.1-4.5',
  [FeeStatus.Currency]: 'M8 4.9 11.1 8 8 11.1 4.9 8Z',
  [FeeStatus.Limited]: 'M8 4.7a3.3 3.3 0 0 1 0 6.6M8 4.7a3.3 3.3 0 0 0 0 6.6',
  [FeeStatus.Ftf]: 'M8 4.8v3.6M8 11.1v.1',
  [FeeStatus.Fee]: 'm5.6 5.6 4.8 4.8m0-4.8-4.8 4.8',
  [FeeStatus.NotApplicable]: 'M5.2 8h5.6',
}

/** 状态标记：状态色实心圆 + 反白符号。形状与颜色双重编码，色弱也能区分 */
export function StatusMark({ status, size = 14 }: { status: FeeStatus; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className="shrink-0"
      aria-hidden="true"
      style={{ color: 'var(--on-st)' }}
    >
      <circle cx="8" cy="8" r="8" fill={STATUS_CSSVAR[status]} />
      {status === FeeStatus.Limited && <path d="M8 4.7a3.3 3.3 0 0 1 0 6.6Z" fill="currentColor" />}
      <path
        d={MARK_GLYPH[status]}
        fill={status === FeeStatus.Currency ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function StatusBadge({
  status,
  note,
  className = '',
  contextLabel,
  showDetails = true,
}: BadgeProps) {
  const color = STATUS_CSSVAR[status]
  return (
    <FeeDetailTrigger
      status={status}
      note={note}
      contextLabel={contextLabel}
      showDetails={showDetails}
      ariaLabel={statusTitle(status, note)}
      className={`inline-flex cursor-default items-center gap-1.5 whitespace-nowrap rounded-full py-[3px] pl-[4px] pr-2.5 text-[12.5px] font-medium leading-normal ${className}`}
      style={{
        color: `color-mix(in oklab, ${color} 82%, var(--tx))`,
        background: `color-mix(in oklab, ${color} 11%, var(--card))`,
      }}
    >
      <StatusMark status={status} />
      <span>{STATUS_LABEL[status]}</span>
    </FeeDetailTrigger>
  )
}

export function StatusChip({
  atm,
  status,
  note,
  showDetails = true,
}: {
  atm: AtmType
  status: FeeStatus
  note?: string
  showDetails?: boolean
}) {
  return (
    <FeeDetailTrigger
      status={status}
      note={note}
      contextLabel={atm.label}
      showDetails={showDetails}
      ariaLabel={`${atm.label}: ${statusTitle(status, note)}`}
      className="inline-flex cursor-default items-center gap-1.5 whitespace-nowrap rounded-lg border border-bd bg-card2 px-2 py-1.5 text-[12.5px] font-medium text-tx"
    >
      <StatusMark status={status} />
      <span>{atm.short}</span>
    </FeeDetailTrigger>
  )
}
