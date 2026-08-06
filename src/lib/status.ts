import { FeeStatus } from '../data/banks'

/** 状态符号（无障碍：状态不只靠颜色区分） */
export const STATUS_SYMBOL: Record<FeeStatus, string> = {
  [FeeStatus.Free]: '✓',
  [FeeStatus.Currency]: '◇',
  [FeeStatus.Limited]: '◑',
  [FeeStatus.Ftf]: '△',
  [FeeStatus.Fee]: '✗',
  [FeeStatus.NotApplicable]: '—',
}

/** 徽章短标签 */
export const STATUS_LABEL: Record<FeeStatus, string> = {
  [FeeStatus.Free]: '免费',
  [FeeStatus.Currency]: '限定币种',
  [FeeStatus.Limited]: '限定ATM',
  [FeeStatus.Ftf]: '有FTF',
  [FeeStatus.Fee]: '收费',
  [FeeStatus.NotApplicable]: '不适用',
}

/** 图例标签 */
export const STATUS_LEGEND: Record<FeeStatus, string> = {
  [FeeStatus.Free]: '免费',
  [FeeStatus.Currency]: '限定币种免费',
  [FeeStatus.Limited]: '限定ATM免费',
  [FeeStatus.Ftf]: '有FTF（外币交易费）',
  [FeeStatus.Fee]: '收费',
  [FeeStatus.NotApplicable]: '不适用',
}

/** 完整说明（悬停提示） */
export const STATUS_DESC: Record<FeeStatus, string> = {
  [FeeStatus.Free]: '该 ATM 提款完全免手续费',
  [FeeStatus.Currency]: '仅提取指定币种时免手续费',
  [FeeStatus.Limited]: '仅在指定银行的 ATM 上免手续费',
  [FeeStatus.Ftf]: '免提款手续费，但按金额收取外币交易费（Foreign Transaction Fee）',
  [FeeStatus.Fee]: '每笔提款收取手续费',
  [FeeStatus.NotApplicable]: '不适用：该卡不支持在该类型ATM提款',
}

export const STATUS_VERDICT: Record<FeeStatus, { label: string; detail: string }> = {
  [FeeStatus.Free]: {
    label: '全额免费',
    detail: '该类 ATM 提款完全免手续费',
  },
  [FeeStatus.Currency]: {
    label: '指定币种免费',
    detail: '只有指定币种免提款手续费，其余币种可能收取 FTF',
  },
  [FeeStatus.Limited]: {
    label: '指定 ATM 免费',
    detail: '只有指定 ATM 免提款手续费，其余 ATM 收取手续费',
  },
  [FeeStatus.Ftf]: {
    label: '提款免费 · FTF 收费',
    detail: '提款本身免费，但外币交易会按金额收费',
  },
  [FeeStatus.Fee]: {
    label: '每笔提款收费',
    detail: '使用该类 ATM 提款时会收取手续费',
  },
  [FeeStatus.NotApplicable]: {
    label: '不适用',
    detail: '该卡不支持在该类型ATM提款',
  },
}

/** 状态语义色对应的 CSS 变量 */
export const STATUS_CSSVAR: Record<FeeStatus, string> = {
  [FeeStatus.Free]: 'var(--stF)',
  [FeeStatus.Currency]: 'var(--stC)',
  [FeeStatus.Limited]: 'var(--stA)',
  [FeeStatus.Ftf]: 'var(--stT)',
  [FeeStatus.Fee]: 'var(--stP)',
  [FeeStatus.NotApplicable]: 'var(--stN)',
}

/** 结果排序：免费优先 */
export const STATUS_ORDER: FeeStatus[] = [
  FeeStatus.Free,
  FeeStatus.Currency,
  FeeStatus.Limited,
  FeeStatus.Ftf,
  FeeStatus.Fee,
  FeeStatus.NotApplicable,
]

export const ALL_STATUSES = STATUS_ORDER

/** 把备注中的 `<br>` 拆成多行 */
export function noteLines(note?: string): string[] {
  if (!note) return []
  return note.split(/<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean)
}

/** 悬停提示文字：状态标签 + 备注（或完整说明） */
export function statusTitle(status: FeeStatus, note?: string): string {
  const lines = noteLines(note)
  return lines.length
    ? `${STATUS_LABEL[status]}｜${lines.join('；')}`
    : STATUS_DESC[status]
}
