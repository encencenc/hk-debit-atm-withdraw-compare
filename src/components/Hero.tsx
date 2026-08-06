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
          香港借记卡提款收费对比
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
        <p className="mt-2.5 max-w-[760px] rounded-[10px] border border-ac/25 bg-ac/5 px-3 py-2 text-[12px] leading-relaxed text-mut">
          <span className="font-semibold text-ac">银通 ATM 说明：</span>
          本网站所称“银通 ATM”，是指加入银通网络的会员银行所设 ATM，并非指提款交易实际使用的银联、Visa、Mastercard 等网络。
        </p>
      </div>
      <ThemeSwitch mode={mode} setTheme={setTheme} />
    </header>
  )
}
