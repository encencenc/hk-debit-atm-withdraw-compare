import { motion } from 'motion/react'

/** 圆角胶囊选择按钮（卡类 / 户口 / 筛选）。传入 group 时，同组内的选中背景会弹性滑动。 */
export function Pill({
  label,
  active,
  onClick,
  small = false,
  group,
}: {
  label: string
  active: boolean
  onClick: () => void
  small?: boolean
  group?: string
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      className={`relative rounded-full border font-semibold transition-colors ${
        small ? 'px-[13px] py-1.5 text-[13px]' : 'px-[18px] py-[9px] text-sm'
      } ${
        active ? 'border-ac text-white' : 'border-bd text-tx hover:border-ac'
      } ${active && !group ? 'bg-ac' : 'bg-transparent'}`}
    >
      {group && active && (
        <motion.span
          layoutId={`pill-${group}`}
          className="absolute -inset-px rounded-full bg-ac"
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          aria-hidden="true"
        />
      )}
      <span className="relative z-[1]">{label}</span>
    </motion.button>
  )
}
