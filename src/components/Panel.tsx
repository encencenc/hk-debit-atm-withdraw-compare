import type { ReactNode } from 'react'

/** 统一的卡片容器 */
export function Panel({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-2xl border border-bd bg-card p-[22px] ${className}`}>
      {children}
    </div>
  )
}

/** 步骤眉标：主题色小字 + 竖条 */
export function StepEyebrow({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex items-center gap-2.5 text-[12.5px] font-bold tracking-[2.5px] text-ac ${className}`}
    >
      <span className="inline-block h-3.5 w-[3px] rounded-sm bg-ac" aria-hidden="true" />
      {children}
    </div>
  )
}
