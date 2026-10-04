import { ALL_STATUSES, STATUS_LEGEND } from '../lib/status'
import { FeeDetailTrigger, StatusMark } from './StatusBadge'

/** 全局图例：六级状态 + 悬停提示 */
export function StatusLegend({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-mut ${className}`}
    >
      {ALL_STATUSES.map((s) => (
        <FeeDetailTrigger
          key={s}
          status={s}
          ariaLabel={STATUS_LEGEND[s]}
          className="inline-flex cursor-help items-center gap-1.5 hover:text-tx"
        >
          <StatusMark status={s} size={13} />
          {STATUS_LEGEND[s]}
        </FeeDetailTrigger>
      ))}
    </div>
  )
}
