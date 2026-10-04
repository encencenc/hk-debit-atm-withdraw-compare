import { motion } from 'motion/react'

/** 选择按钮（卡类 / 户口 / 筛选）。传入 group 时，同组内的选中背景会弹性滑动。 */
export function Pill({
  label,
  active,
  onClick,
  small = false,
  group,
  hint,
  className = '',
}: {
  label: string
  active: boolean
  onClick: () => void
  small?: boolean
  group?: string
  /** 右侧附注（如「标准费率」），用于纵向列表式按钮 */
  hint?: string
  className?: string
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className={`relative rounded-lg border font-semibold transition-colors ${
        small ? 'px-2.5 py-1 text-[12.5px]' : 'px-3 py-2 text-[13px]'
      } ${
        active
          ? 'border-acs text-white'
          : 'border-bd bg-card2 text-tx/80 hover:border-ac/40 hover:text-tx'
      } ${active && !group ? 'bg-acs' : ''} ${
        hint ? 'flex items-center justify-between gap-3 text-left' : 'text-center'
      } ${className}`}
    >
      {group && active && (
        <motion.span
          layoutId={`pill-${group}`}
          className="absolute -inset-px rounded-lg bg-acs shadow-sm"
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          aria-hidden="true"
        />
      )}
      <span className="relative z-[1]">{label}</span>
      {hint && (
        <span
          className={`mono relative z-[1] shrink-0 text-[11px] font-medium ${
            active ? 'text-white/80' : 'text-mut'
          }`}
        >
          {hint}
        </span>
      )}
    </motion.button>
  )
}
