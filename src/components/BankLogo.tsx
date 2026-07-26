import type { Bank } from '../data/banks'
import { BANK_LOGOS } from '../data/banks'
import { assetUrl } from '../lib/assets'

interface Props {
  bank: Bank
  size?: number
  className?: string
}

/** 银行 logo，放在浅色纸片衬底上，保证深色模式下彩色 logo 依然清晰 */
export function BankLogo({ bank, size = 34, className = '' }: Props) {
  const src = BANK_LOGOS[bank.id]
  if (!src) return null
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-lg border border-black/10 bg-white/90 p-1 dark:border-white/10 dark:bg-white/10 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={assetUrl(src)}
        alt={`${bank.name} logo`}
        className="h-full w-full object-contain"
      />
    </span>
  )
}
