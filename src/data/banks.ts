// ============================================================================
//  香港借记卡境外提款收费 — 数据源（唯一需要维护的文件）
//  以后调价 / 更新只改本文件，UI 无需改动。
//  数据根据各银行公开资料整理，仅供参考，请以银行官网为准。
// ============================================================================

/** 费用状态五级体系。符号：✓ ◇ ◑ △ ✗ */
export enum FeeStatus {
  /** ✓ 免费 */
  Free = 'free',
  /** ◇ 限指定币种免费 */
  Currency = 'currency',
  /** ◑ 限指定 ATM 免费 */
  Limited = 'limited',
  /** △ 有 FTF 存在 */
  Ftf = 'ftf',
  /** ✗ 收费 */
  Fee = 'fee',
}

/** 六类 ATM 的键 */
export type AtmKey =
  | 'hkBankTong'
  | 'hkHSBCHS'
  | 'macauBankTong'
  | 'macauOther'
  | 'mainland'
  | 'overseas'

/** 单个 ATM 类型在某户口下的费用 */
export interface Fee {
  /** 费用状态 */
  s: FeeStatus
  /** 备注文字，可含 `<br>` 换行标记 */
  n?: string
}

/** 户口层级 */
export interface Tier {
  label: string
  fees: Record<AtmKey, Fee>
  /** 层级级备注（如「不含 ATM Fee」） */
  note?: string
}

/** 卡种 */
export interface CardType {
  id: string
  label: string
  tiers: Tier[]
}

/** 银行 */
export interface Bank {
  id: string
  name: string
  cardTypes: CardType[]
}

/** ATM 类型图标渲染方式 */
export type AtmIconKind = 'svg' | 'pair'

/** ATM 类型定义 */
export interface AtmType {
  key: AtmKey
  label: string
  /** 短名（覆盖图 / 移动端徽章） */
  short: string
  /** 副标题（卡片 / 表头第二行） */
  sub: string
  icon?: string
  icons?: string[]
  iconKind: AtmIconKind
}

// ---------------------------------------------------------------------------
//  全局元信息
// ---------------------------------------------------------------------------

export interface DataMeta {
  /** 数据截至日期（请更新为实际整理日期） */
  updatedAt: string
  /** 可选：来源说明 */
  source?: string
}

export const META: DataMeta = {
  updatedAt: '2026年7月',
  source: '根据各银行公开资料整理，仅供参考，请以银行官网为准',
}

// ---------------------------------------------------------------------------
//  ATM 类型（六类）
// ---------------------------------------------------------------------------

export const ATM_TYPES: AtmType[] = [
  {
    key: 'hkBankTong',
    label: '香港银通',
    short: '香港银通',
    sub: 'JETCO · 香港',
    icon: 'icon/Jetco_logo.svg',
    iconKind: 'svg',
  },
  {
    key: 'hkHSBCHS',
    label: '香港汇丰 / 恒生',
    short: '汇丰恒生',
    sub: '汇丰集团 ATM',
    icons: ['icon/汇丰银行.svg', 'icon/Hang_Seng_Bank.svg'],
    iconKind: 'pair',
  },
  {
    key: 'macauBankTong',
    label: '澳门银通',
    short: '澳门银通',
    sub: 'JETCO · 澳门',
    icon: 'icon/Jetco_logo.svg',
    iconKind: 'svg',
  },
  {
    key: 'macauOther',
    label: '澳门其他',
    short: '澳门其他',
    sub: '非银通澳门 ATM',
    icon: 'icon/Flag_of_Macau.svg',
    iconKind: 'svg',
  },
  {
    key: 'mainland',
    label: '内地 ATM',
    short: '内地ATM',
    sub: '中国内地银行',
    icon: 'icon/UnionPay_logo.svg',
    iconKind: 'svg',
  },
  {
    key: 'overseas',
    label: '境外 ATM',
    short: '境外ATM',
    sub: '港澳及内地以外',
    icon: 'icon/overseas.svg',
    iconKind: 'svg',
  },
]

// ---------------------------------------------------------------------------
//  银行 Logo 路径
// ---------------------------------------------------------------------------

export const BANK_LOGOS: Record<string, string> = {
  hsbc: 'icon/汇丰银行.svg',
  hase: 'icon/Hang_Seng_Bank.svg',
  bochk: 'icon/中国银行.svg',
  icbc: 'icon/工商银行.svg',
  ccb: 'icon/建设银行.svg',
  ncb: 'icon/南洋商业银行.svg',
  scb: 'icon/渣打银行.svg',
  bea: 'icon/东亚银行.svg',
  dahsing: 'icon/大新银行.svg',
  cncbi: 'icon/中信银行.svg',
  citi: 'icon/花旗银行.svg',
  dbs: 'icon/星展银行.svg',
  za: 'icon/ZA_Bank_logo.svg',
  airstar: 'icon/象象银行.png',
  welab: 'icon/汇立银行.png',
  mox: 'icon/Mox Bank.png',
  bdo: 'icon/东莞银行.svg',
}

// ---------------------------------------------------------------------------
//  银行数据
// ---------------------------------------------------------------------------

const F = FeeStatus

export const BANKS: Bank[] = [
  {
    id: 'hsbc',
    name: '汇丰银行',
    cardTypes: [
      {
        id: 'debit',
        label: 'MasterCard 扣账卡',
        tiers: [
          {
            label: '普通客户',
            fees: {
              hkBankTong: { s: F.Fee, n: '每次25港元' },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Fee, n: '每次40港元' },
              macauOther: { s: F.Limited, n: '仅汇丰ATM免费<br>其余每次40港元' },
              mainland: { s: F.Limited, n: '仅汇丰恒生ATM免费<br>其余每次40港元' },
              overseas: { s: F.Limited, n: '仅汇丰ATM免费<br>其余每次40港元' },
            },
            note: '不含ATM Fee',
          },
          {
            label: '卓越理财',
            fees: {
              hkBankTong: { s: F.Fee, n: '每次25港元' },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Free },
              macauOther: { s: F.Free },
              mainland: { s: F.Free },
              overseas: { s: F.Free },
            },
            note: '不含ATM Fee',
          },
          {
            label: '卓越理财尊尚 / 环球私人银行',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Free },
              macauOther: { s: F.Free },
              mainland: { s: F.Free },
              overseas: { s: F.Free },
            },
            note: '包含ATM Fee',
          },
        ],
      },
      {
        id: 'atm',
        label: '银联提款卡',
        tiers: [
          {
            label: '普通客户',
            fees: {
              hkBankTong: { s: F.Fee, n: '每次15港元' },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Fee, n: '每次50港元' },
              macauOther: { s: F.Fee, n: '汇丰ATM每次20港元<br>其余每次50港元' },
              mainland: { s: F.Fee, n: '汇丰恒生ATM每次20港元<br>其余每次50港元' },
              overseas: { s: F.Fee, n: '汇丰ATM每次20港元<br>其余每次50港元' },
            },
            note: '不含ATM Fee',
          },
          {
            label: '卓越理财 / 卓越理财尊尚 / 环球私人银行',
            fees: {
              hkBankTong: { s: F.Fee, n: '每次15港元' },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Fee, n: '每次50港元' },
              macauOther: { s: F.Limited, n: '仅汇丰ATM免费<br>其余每次50港元' },
              mainland: { s: F.Limited, n: '仅汇丰恒生ATM免费<br>其余每次50港元' },
              overseas: { s: F.Limited, n: '仅汇丰ATM免费<br>其余每次50港元' },
            },
            note: '不含ATM Fee',
          },
        ],
      },
    ],
  },
  {
    id: 'hase',
    name: '恒生银行',
    cardTypes: [
      {
        id: 'debit',
        label: 'MasterCard 扣账卡',
        tiers: [
          {
            label: '普通客户',
            fees: {
              hkBankTong: { s: F.Fee, n: '每次25港元' },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Fee, n: '每次40港元' },
              macauOther: { s: F.Limited, n: '仅汇丰ATM免费<br>其余每次40港元' },
              mainland: { s: F.Limited, n: '仅汇丰恒生ATM免费<br>其余每次40港元' },
              overseas: { s: F.Limited, n: '仅汇丰ATM免费<br>其余每次40港元' },
            },
            note: '不含ATM Fee',
          },
          {
            label: '优越理财',
            fees: {
              hkBankTong: { s: F.Fee, n: '每次25港元' },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Free },
              macauOther: { s: F.Free },
              mainland: { s: F.Free },
              overseas: { s: F.Free },
            },
            note: '不含ATM Fee',
          },
          {
            label: '优越私人理财 / 私人银行',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Free },
              macauOther: { s: F.Free },
              mainland: { s: F.Free },
              overseas: { s: F.Free },
            },
            note: '包含ATM Fee',
          },
        ],
      },
      {
        id: 'atm',
        label: '银联提款卡',
        tiers: [
          {
            label: '普通客户',
            fees: {
              hkBankTong: { s: F.Fee, n: '每次15港元' },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Fee, n: '每次50港元' },
              macauOther: { s: F.Fee, n: '汇丰ATM每次20港元<br>其余每次50港元' },
              mainland: { s: F.Fee, n: '汇丰恒生ATM每次20港元<br>其余每次50港元' },
              overseas: { s: F.Fee, n: '汇丰ATM每次20港元<br>其余每次50港元' },
            },
            note: '不含ATM Fee',
          },
          {
            label: '优越理财 / 优越私人理财 / 私人银行',
            fees: {
              hkBankTong: { s: F.Fee, n: '每次15港元' },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Fee, n: '每次50港元' },
              macauOther: { s: F.Limited, n: '仅汇丰ATM免费<br>其余每次50港元' },
              mainland: { s: F.Limited, n: '仅汇丰恒生ATM免费<br>其余每次50港元' },
              overseas: { s: F.Limited, n: '仅汇丰ATM免费<br>其余每次50港元' },
            },
            note: '不含ATM Fee',
          },
        ],
      },
    ],
  },
  {
    id: 'bochk',
    name: '中国银行（香港）',
    cardTypes: [
      {
        id: 'debit',
        label: 'MasterCard 扣账卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '通过港元账户每次25港元<br>通过人民币账户每次25人民币' },
              macauBankTong: { s: F.Fee, n: '每次20港元' },
              macauOther: { s: F.Free },
              mainland: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
              overseas: { s: F.Free },
            },
          },
        ],
      },
      {
        id: 'atm',
        label: '银联提款卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '通过港元账户每次15港元<br>通过人民币账户每次15人民币' },
              macauBankTong: { s: F.Fee, n: '每次20港元' },
              macauOther: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
              mainland: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
              overseas: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'icbc',
    name: '中国工商银行（亚洲）',
    cardTypes: [
      {
        id: 'atm',
        label: '银联提款卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '通过港元账户每次15港元<br>通过人民币账户每次15人民币' },
              macauBankTong: { s: F.Fee, n: '每次10港元' },
              macauOther: { s: F.Fee, n: '通过港元账户每次15港元<br>通过人民币账户每次15人民币' },
              mainland: {
                s: F.Limited,
                n: '工商银行ATM免费<br>通过港元账户每次15港元<br>通过人民币账户每次15人民币',
              },
              overseas: { s: F.Fee, n: '通过港元账户每次15港元<br>通过人民币账户每次15人民币' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ccb',
    name: '中国建设银行（亚洲）',
    cardTypes: [
      {
        id: 'atm',
        label: '银联提款卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '通过港元账户每次15港元<br>通过人民币账户每次15人民币' },
              macauBankTong: { s: F.Limited, n: '建设银行ATM免费<br>其余每次25港元' },
              macauOther: { s: F.Fee, n: '通过港元账户每次15港元<br>通过人民币账户每次15人民币' },
              mainland: {
                s: F.Limited,
                n: '建设银行ATM免费<br>通过港元账户每次15港元<br>通过人民币账户每次15人民币',
              },
              overseas: { s: F.Fee, n: '通过港元账户每次15港元<br>通过人民币账户每次15人民币' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'ncb',
    name: '南洋商业银行',
    cardTypes: [
      {
        id: 'atm',
        label: '银联提款卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '通过港元账户每次15港元<br>通过人民币账户每次15人民币' },
              macauBankTong: { s: F.Fee, n: '每次20港元' },
              macauOther: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
              mainland: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
              overseas: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'scb',
    name: '渣打银行',
    cardTypes: [
      {
        id: 'debit',
        label: 'MasterCard 扣账卡',
        tiers: [
          {
            label: '普通客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee },
              macauBankTong: { s: F.Fee },
              macauOther: { s: F.Fee },
              mainland: { s: F.Fee },
              overseas: { s: F.Fee },
            },
          },
          {
            label: 'Premium 理财及以上',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Free },
              macauOther: { s: F.Ftf, n: '免手续费但有 0.95% FTF' },
              mainland: { s: F.Free },
              overseas: {
                s: F.Currency,
                n: '仅限支援货币：港元、美元、人民币、澳元、加元、瑞士法郎、欧元、英镑、日元、新西兰元、新加坡元<br>其余币种收取 0.95% FTF',
              },
            },
          },
        ],
      },
      {
        id: 'atm',
        label: '银联提款卡',
        tiers: [
          {
            label: '普通客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '每次15港元' },
              macauBankTong: { s: F.Fee, n: '每次15港元 + 0.5% FTF' },
              macauOther: { s: F.Fee, n: '每次15港元 + 0.5% FTF' },
              mainland: { s: F.Fee, n: '每次15港元 + 0.5% FTF' },
              overseas: { s: F.Fee, n: '每次15港元 + 0.5% FTF' },
            },
          },
          {
            label: 'Premium 理财及以上',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '每次15港元' },
              macauBankTong: { s: F.Ftf, n: '免手续费但有 0.5% FTF' },
              macauOther: { s: F.Ftf, n: '免手续费但有 0.5% FTF' },
              mainland: { s: F.Ftf, n: '免手续费但有 0.5% FTF' },
              overseas: { s: F.Ftf, n: '免手续费但有 0.5% FTF' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'bea',
    name: '东亚银行',
    cardTypes: [
      {
        id: 'debit',
        label: 'MasterCard 扣账卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '每次30港元' },
              macauBankTong: { s: F.Free },
              macauOther: { s: F.Ftf, n: '免手续费但有 FTF' },
              mainland: { s: F.Free },
              overseas: {
                s: F.Currency,
                n: '仅限支援货币：港元、美元、人民币、澳元、加元、瑞士法郎、欧元、英镑、日元、新西兰元、新加坡元<br>其余币种收取 1.95% FTF',
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dahsing',
    name: '大新银行',
    cardTypes: [
      {
        id: 'debit',
        label: 'MasterCard 扣账卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Ftf, n: '免手续费但有FTF' },
              macauOther: { s: F.Ftf, n: '免手续费但有FTF' },
              mainland: { s: F.Free },
              overseas: {
                s: F.Currency,
                n: '仅限支援货币：港元、美元、人民币、澳元、加元、瑞士法郎、欧元、英镑、日元、新西兰元、新加坡元<br>其余币种收取 1.95% FTF',
              },
            },
          },
        ],
      },
      {
        id: 'atm',
        label: '银联提款卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '每次20港元' },
              macauBankTong: { s: F.Fee, n: '每次28港元' },
              macauOther: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
              mainland: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
              overseas: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'cncbi',
    name: '信银国际',
    cardTypes: [
      {
        id: 'debit',
        label: 'MasterCard 扣账卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Free },
              macauOther: { s: F.Free },
              mainland: { s: F.Free },
              overseas: {
                s: F.Currency,
                n: '仅限支援货币：港元、美元、人民币、澳元、加元、瑞士法郎、欧元、英镑、日元、新西兰元、新加坡元<br>其余币种收取 1.95% FTF',
              },
            },
          },
        ],
      },
      {
        id: 'atm',
        label: '银联提款卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Fee, n: '每次25港元' },
              macauOther: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
              mainland: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
              overseas: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'citi',
    name: '花旗银行',
    cardTypes: [
      {
        id: 'debit',
        label: 'MasterCard 扣账卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee },
              macauBankTong: { s: F.Ftf, n: '免手续费但有FTF' },
              macauOther: { s: F.Ftf, n: '免手续费但有FTF' },
              mainland: { s: F.Free },
              overseas: {
                s: F.Currency,
                n: '仅限支援货币：港元、美元、人民币、澳元、加元、瑞士法郎、欧元、英镑、日元、新西兰元、新加坡元、泰铢',
              },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'dbs',
    name: '星展银行',
    cardTypes: [
      {
        id: 'debit',
        label: '银联扣账卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '免手续费但有FTF' },
              macauBankTong: { s: F.Fee, n: '每次25港元' },
              macauOther: { s: F.Fee, n: '每次50港元' },
              mainland: { s: F.Fee, n: '每次50港元' },
              overseas: { s: F.Fee, n: '每次50港元' },
            },
          },
        ],
      },
      {
        id: 'atm',
        label: '银联提款卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '免手续费但有FTF' },
              macauBankTong: { s: F.Fee, n: '每次25港元' },
              macauOther: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
              mainland: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
              overseas: { s: F.Fee, n: '通过港元账户每次50港元<br>通过人民币账户每次50人民币' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'za',
    name: '众安银行',
    cardTypes: [
      {
        id: 'debit',
        label: 'Visa 扣账卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free, n: '每月80000 HKD免费额度，超出收取1%手续费' },
              hkHSBCHS: { s: F.Free, n: '每月80000 HKD免费额度，超出收取1%手续费' },
              macauBankTong: { s: F.Fee, n: '每次50港元 + 0.5% FTF' },
              macauOther: { s: F.Fee, n: '每次50港元 + 0.5% FTF' },
              mainland: { s: F.Fee, n: '每次50港元 + 0.5% FTF' },
              overseas: { s: F.Fee, n: '每次50港元 + 0.5% FTF' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'airstar',
    name: '象象银行',
    cardTypes: [
      {
        id: 'debit',
        label: 'Visa 扣账卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Free },
              macauBankTong: { s: F.Fee, n: '每笔交易金额 3% + 0.5% FTF' },
              macauOther: { s: F.Fee, n: '每笔交易金额 3% + 0.5% FTF' },
              mainland: { s: F.Fee, n: '每笔交易金额 3% + 0.5% FTF' },
              overseas: { s: F.Fee, n: '每笔交易金额 3% + 0.5% FTF' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'welab',
    name: '汇立银行',
    cardTypes: [
      {
        id: 'debit',
        label: 'MasterCard 扣账卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '每笔交易金额 1%，最低10港元' },
              macauBankTong: { s: F.Fee, n: '每笔交易金额 1.5%，最低25港元' },
              macauOther: { s: F.Fee, n: '每笔交易金额 1.5%，最低25港元' },
              mainland: { s: F.Fee, n: '每笔交易金额 1.5%，最低25港元' },
              overseas: { s: F.Fee, n: '每笔交易金额 1.5%，最低25港元' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'mox',
    name: 'Mox Bank',
    cardTypes: [
      {
        id: 'debit',
        label: 'MasterCard 扣账卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '每次20港元' },
              macauBankTong: { s: F.Fee, n: '每次30港元' },
              macauOther: { s: F.Fee, n: '每次30港元 + 1.95% FTF' },
              mainland: { s: F.Fee, n: '每次30港元 + 1.95% FTF' },
              overseas: { s: F.Fee, n: '每次30港元 + 1.95% FTF' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'bdo',
    name: '东莞银行（国际）',
    cardTypes: [
      {
        id: 'unionpay-debit',
        label: '银联扣账卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '每次25港元' },
              macauBankTong: { s: F.Fee, n: '每次20港元' },
              macauOther: { s: F.Fee, n: '每次50港元' },
              mainland: { s: F.Fee, n: '每次50港元' },
              overseas: { s: F.Fee, n: '每次50港元' },
            },
          },
        ],
      },
      {
        id: 'mastercard-debit',
        label: 'MasterCard 扣账卡',
        tiers: [
          {
            label: '所有客户',
            fees: {
              hkBankTong: { s: F.Free },
              hkHSBCHS: { s: F.Fee, n: '每次25港元' },
              macauBankTong: { s: F.Fee, n: '每次20港元' },
              macauOther: { s: F.Fee, n: '每次50港元' },
              mainland: { s: F.Fee, n: '每次50港元' },
              overseas: { s: F.Fee, n: '每次50港元' },
            },
          },
        ],
      },
    ],
  },
]
