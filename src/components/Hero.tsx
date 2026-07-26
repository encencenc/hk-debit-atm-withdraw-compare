import { BANKS, META } from '../data/banks'
import type { ThemeMode } from '../hooks/useTheme'
import { ThemeSwitch } from './ThemeSwitch'

/** 卡类/户口组合总数 */
export const COMBO_COUNT = BANKS.reduce(
  (n, b) => n + b.cardTypes.reduce((m, c) => m + c.tiers.length, 0),
  0,
)

export function Hero({
  mode,
  setTheme,
}: {
  mode: ThemeMode
  setTheme: (m: ThemeMode) => void
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="mb-2.5 mt-4 text-[clamp(22px,5.5vw,32px)] font-bold leading-[1.25] tracking-tight">
          香港借记卡境外提款收费对比
        </h1>
        <p className="mb-3 text-base text-mut">查一查你的香港卡在各地 ATM 取现要不要钱。</p>
        <div className="flex flex-wrap items-center gap-2 text-sm text-mut">
          <span>
            <b className="text-tx">{BANKS.length}</b> 家银行
          </span>
          <span aria-hidden="true">·</span>
          <span>
            <b className="text-tx">{COMBO_COUNT}</b> 个卡类/户口组合
          </span>
          <span aria-hidden="true">·</span>
          <span>3 种查询方式</span>
          <span aria-hidden="true">·</span>
          <span>数据截至 {META.updatedAt}</span>
        </div>
      </div>
      <ThemeSwitch mode={mode} setTheme={setTheme} />
    </header>
  )
}
