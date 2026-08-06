import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react'
import { ATM_TYPES, FeeStatus, type Bank, type CardType, type Tier } from '../data/banks'
import { noteLines } from '../lib/status'
import { BankLogo } from './BankLogo'
import { ReceiptEdge } from './ReceiptEdge'
import { StatusBadge } from './StatusBadge'

interface Props {
  bank: Bank
  cardType: CardType
  tier: Tier
  updatedAt: string
}

export function Receipt({ bank, cardType, tier, updatedAt }: Props) {
  const reduce = useReducedMotion()

  const signature = `${bank.id}|${cardType.id}|${tier.label}`
  const freeAtmCount = ATM_TYPES.filter((atm) => tier.fees[atm.key].s === FeeStatus.Free).length
  const limitedFreeAtmCount = ATM_TYPES.filter((atm) =>
    [FeeStatus.Currency, FeeStatus.Limited].includes(tier.fees[atm.key].s),
  ).length
  const chargedAtmCount = ATM_TYPES.filter((atm) =>
    [FeeStatus.Fee, FeeStatus.Ftf].includes(tier.fees[atm.key].s),
  ).length
  const notApplicableAtmCount = ATM_TYPES.filter(
    (atm) => tier.fees[atm.key].s === FeeStatus.NotApplicable,
  ).length

  const container: Variants = {
    hidden: { y: reduce ? '0%' : '-102%', opacity: 1 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: reduce
        ? { duration: 0 }
        : {
            type: 'spring',
            stiffness: 90,
            damping: 14,
            mass: 0.9,
            delayChildren: 0.18,
            staggerChildren: 0.05,
          },
    },
    exit: {
      y: reduce ? '0%' : '-102%',
      opacity: reduce ? 0 : 1,
      transition: reduce ? { duration: 0 } : { duration: 0.26, ease: [0.4, 0, 1, 1] },
    },
  }

  const item: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduce ? { duration: 0 } : { duration: 0.28, ease: 'easeOut' },
    },
  }

  return (
    <div className="bank-receipt mt-4 flex flex-col items-center">
      {/* 出票口 */}
      <div className="bank-receipt__outlet mb-3 w-full max-w-[560px]" aria-hidden="true">
        <div className="mx-auto h-2.5 w-[86%] rounded-full bg-neutral-800/85 shadow-inner dark:bg-black/70" />
        <div className="mx-auto mt-1 h-px w-[92%] bg-black/10 dark:bg-white/10" />
      </div>

      {/* 打印视口：clip-path 只裁上边（制造「从缝中打出」效果），负值给左右和下方的投影留空间 */}
      <div
        className="bank-receipt__frame w-full max-w-[560px]"
        style={{ clipPath: 'inset(0 -60px -60px -60px)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={signature}
            variants={container}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full"
            style={{ filter: 'var(--receipt-shadow)' }}
          >
            <ReceiptEdge side="top" />

            <div className="bg-card2 px-[clamp(16px,5vw,30px)] pb-4 pt-6">
              {/* 银行 logo + 名称 + 卡种 · 户口 */}
              <motion.div
                variants={item}
                className="receipt-header flex flex-col items-center gap-1.5 border-b border-dashed border-bd pb-3.5 text-center"
              >
                <BankLogo bank={bank} size={54} />
                <div className="text-[clamp(18px,5.6vw,21px)] font-bold tracking-tight">{bank.name}</div>
                <div className="text-sm text-mut">
                  {cardType.label} · {tier.label}
                </div>
                <div className="receipt-free-summary mt-1.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[12px] leading-relaxed text-mut">
                  <span className="receipt-free-summary__full whitespace-nowrap font-semibold" style={{ color: 'var(--stF)' }}>
                    全额免费 <b className="mono text-[14px]">{freeAtmCount}</b> 类
                  </span>
                  {limitedFreeAtmCount > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="whitespace-nowrap">
                        限定免费 <b className="mono text-[13px]">{limitedFreeAtmCount}</b> 类
                      </span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span className="whitespace-nowrap">
                    收费 <b className="mono text-[13px]">{chargedAtmCount}</b> 类
                  </span>
                  {notApplicableAtmCount > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="whitespace-nowrap" style={{ color: 'var(--stN)' }}>
                        不适用 <b className="mono text-[13px]">{notApplicableAtmCount}</b> 类
                      </span>
                    </>
                  )}
                </div>
              </motion.div>

              {/* 六类 ATM 费用逐行 */}
              {ATM_TYPES.map((a) => {
                const fee = tier.fees[a.key]
                const lines = noteLines(fee.n)
                return (
                  <motion.div
                    key={a.key}
                    variants={item}
                    className="flex items-start justify-between gap-3.5 border-b border-dashed border-bd py-[13px]"
                  >
                    <div className="min-w-0">
                      <div className="text-[15px] font-semibold">{a.label}</div>
                      {lines.map((line, i) => (
                        <div key={i} className="mono mt-[3px] text-[12.5px] leading-normal text-mut [overflow-wrap:anywhere]">
                          {line}
                        </div>
                      ))}
                    </div>
                    <StatusBadge
                      status={fee.s}
                      note={fee.n}
                      contextLabel={a.label}
                      showDetails={false}
                      className="shrink-0"
                    />
                  </motion.div>
                )
              })}

              {/* 层级备注 */}
              {tier.note && (
                <motion.div variants={item} className="pt-3 text-[12.5px] text-mut">
                  备注：{tier.note}
                </motion.div>
              )}

              {/* 底部小字 */}
              <motion.div
                variants={item}
                className="mono pb-1 pt-4 text-center text-xs leading-relaxed text-mut"
              >
                数据截至 {updatedAt} · 以银行官网为准
              </motion.div>
            </div>

            <ReceiptEdge side="bottom" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
