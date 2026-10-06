import { ATM_TYPES, BANKS, FeeStatus, type Tier } from '../data/banks'

/** 卡类/户口组合总数 */
export const COMBO_COUNT = BANKS.reduce(
  (n, b) => n + b.cardTypes.reduce((m, c) => m + c.tiers.length, 0),
  0,
)

/** 有条件免费（限定币种 / 限定 ATM） */
export const CONDITIONAL_FREE = [FeeStatus.Currency, FeeStatus.Limited]
/** 需付费（手续费 / FTF） */
export const CHARGED = [FeeStatus.Fee, FeeStatus.Ftf]

/** 某户口在六类 ATM 上的状态计数 */
export function tierSummary(tier: Tier) {
  const statuses = ATM_TYPES.map((a) => tier.fees[a.key].s)
  return {
    free: statuses.filter((s) => s === FeeStatus.Free).length,
    conditional: statuses.filter((s) => CONDITIONAL_FREE.includes(s)).length,
    charged: statuses.filter((s) => CHARGED.includes(s)).length,
    na: statuses.filter((s) => s === FeeStatus.NotApplicable).length,
  }
}

/** 户口按钮旁的提示：完全免费 X/6，有限定免费时追加 · 限定免费 Y/6 */
export function tierHint(tier: Tier) {
  const { free, conditional } = tierSummary(tier)
  const total = ATM_TYPES.length
  return conditional > 0
    ? `完全免费 ${free}/${total} · 限定免费 ${conditional}/${total}`
    : `完全免费 ${free}/${total}`
}
