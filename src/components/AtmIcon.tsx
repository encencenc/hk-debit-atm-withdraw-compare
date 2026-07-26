import type { AtmType } from '../data/banks'
import { assetUrl } from '../lib/assets'

interface Props {
  atm: AtmType
  /** 单个图标的像素高度 */
  size?: number
  className?: string
}

/** 渲染 ATM 类型的真实机构 logo（单图或双图并排），绝不使用 emoji */
export function AtmIcon({ atm, size = 22, className = '' }: Props) {
  if (atm.iconKind === 'pair' && atm.icons) {
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        {atm.icons.map((src) => (
          <img
            key={src}
            src={assetUrl(src)}
            alt=""
            style={{ height: size, width: 'auto' }}
            className="object-contain"
          />
        ))}
      </span>
    )
  }
  return (
    <img
      src={assetUrl(atm.icon!)}
      alt=""
      style={{ height: size, width: 'auto' }}
      className={`object-contain ${className}`}
    />
  )
}
