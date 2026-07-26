import type { AtmType, FeeStatus } from '../data/banks'
import {
  STATUS_CSSVAR,
  STATUS_LABEL,
  STATUS_SYMBOL,
  noteLines,
  statusTitle,
} from '../lib/status'

interface BadgeProps {
  status: FeeStatus
  /** 原始备注（含 `<br>`），用于悬停提示 */
  note?: string
  /** 仅显示符号（紧凑场景） */
  compact?: boolean
  className?: string
}

/** 状态徽章：符号 + 文字，悬停显示费用详情。状态不只靠颜色区分。 */
export function StatusBadge({ status, note, compact = false, className = '' }: BadgeProps) {
  const cv = STATUS_CSSVAR[status]
  return (
    <span
      title={statusTitle(status, note)}
      className={`inline-flex cursor-default items-center whitespace-nowrap rounded-full py-1 text-[12.5px] font-semibold leading-normal ${
        compact ? 'px-[9px]' : 'gap-1.5 px-[11px]'
      } ${className}`}
      style={{
        color: cv,
        background: `color-mix(in oklab, ${cv} 13%, transparent)`,
        border: `1px solid color-mix(in oklab, ${cv} 40%, transparent)`,
      }}
    >
      <span className="mono" aria-hidden="true">
        {STATUS_SYMBOL[status]}
      </span>
      {compact ? (
        <span className="sr-only">{STATUS_LABEL[status]}</span>
      ) : (
        <span>{STATUS_LABEL[status]}</span>
      )}
    </span>
  )
}

/** 六类 ATM 覆盖小片（免费覆盖卡 / 移动端对比卡） */
export function StatusChip({
  atm,
  status,
  note,
}: {
  atm: AtmType
  status: FeeStatus
  note?: string
}) {
  const cv = STATUS_CSSVAR[status]
  const lines = noteLines(note)
  const title = `${atm.label}：${STATUS_LABEL[status]}${lines.length ? `（${lines.join('；')}）` : ''}`
  return (
    <span
      title={title}
      className="inline-flex cursor-default items-center justify-center gap-1.5 whitespace-nowrap rounded-[9px] px-2 py-1.5 text-[12.5px] font-semibold"
      style={{
        color: cv,
        background: `color-mix(in oklab, ${cv} 12%, transparent)`,
        border: `1px solid color-mix(in oklab, ${cv} 38%, transparent)`,
      }}
    >
      <b className="mono" aria-hidden="true">
        {STATUS_SYMBOL[status]}
      </b>
      <span>{atm.short}</span>
    </span>
  )
}
