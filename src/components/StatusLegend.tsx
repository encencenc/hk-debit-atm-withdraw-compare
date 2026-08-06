import {
  ALL_STATUSES,
  STATUS_CSSVAR,
  STATUS_LEGEND,
  STATUS_SYMBOL,
} from '../lib/status'
import { FeeDetailTrigger } from './StatusBadge'

/** 顶部全局图例：六级状态 + 悬停提示 */
export function StatusLegend({ className = '' }: { className?: string }) {
  return (
    <div
      className={`mx-1 flex flex-wrap items-center gap-x-[18px] gap-y-2 text-[13px] text-mut ${className}`}
    >
      <span className="font-semibold">图例</span>
      {ALL_STATUSES.map((s) => (
        <FeeDetailTrigger
          key={s}
          status={s}
          ariaLabel={STATUS_LEGEND[s]}
          className="inline-flex cursor-help items-center gap-1.5"
        >
          <b className="mono" aria-hidden="true" style={{ color: STATUS_CSSVAR[s] }}>
            {STATUS_SYMBOL[s]}
          </b>
          {STATUS_LEGEND[s]}
        </FeeDetailTrigger>
      ))}
    </div>
  )
}
