import type { ReactNode } from 'react'

/** 统一的卡片容器：白底 + 发丝边框 + 极轻投影 */
export function Panel({
  children,
  className = '',
  hover = false,
}: {
  children: ReactNode
  className?: string
  /** 悬停时轻微抬升（用于信息卡片，不用于表单容器） */
  hover?: boolean
}) {
  return <div className={`card ${hover ? 'card-hover' : ''} ${className}`}>{children}</div>
}

/** 步骤标题：编号方块 + 加粗小标题，下方发丝分隔线；右侧可放附加信息 */
export function StepTitle({
  step,
  children,
  aside,
  className = '',
}: {
  step?: number
  children: ReactNode
  aside?: ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex items-center justify-between gap-2 border-b border-bd2 pb-2.5 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        {step !== undefined && (
          <span className="mono flex h-[22px] w-[22px] items-center justify-center rounded-md bg-acsoft text-xs font-bold text-ac">
            {step}
          </span>
        )}
        <span className="text-sm font-bold tracking-wide text-tx">{children}</span>
      </div>
      {aside && <span className="text-xs text-mut">{aside}</span>}
    </div>
  )
}

/** 页面眉标：短横线 + 强调色小字 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-ac">
      <span className="h-0.5 w-2 rounded-full bg-ac" aria-hidden="true" />
      {children}
    </div>
  )
}
