import type { ReactNode } from 'react'
import { Icon } from './Icon'

/** 说明 / 提醒框：浅绿底 + 浅绿描边的直角方框，与白底圆角的结果卡片区分开 */
function InfoCard({
  icon,
  title,
  compact,
  children,
}: {
  icon: 'swap' | 'shield'
  title: string
  compact: boolean
  children: ReactNode
}) {
  return (
    <section
      className={`border border-ac/15 bg-acsoft ${compact ? 'px-3.5 py-3' : 'p-5'}`}
    >
      <h4 className={`flex items-center gap-2 font-bold ${compact ? 'text-[13px]' : 'text-sm'}`}>
        <Icon name={icon} size={compact ? 16 : 17} className="text-ac" />
        {title}
      </h4>
      <p className={`text-[12.5px] leading-relaxed text-mut ${compact ? 'mt-1.5' : 'mt-2.5'}`}>{children}</p>
    </section>
  )
}

/** 页面底部的两条提款须知（三种查询方式共用）；variant="mobile" 为移动端的紧凑单列排布 */
export function InfoNotes({
  className = '',
  variant = 'default',
}: {
  className?: string
  variant?: 'default' | 'mobile'
}) {
  const compact = variant === 'mobile'
  return (
    <div className={`grid grid-cols-1 ${compact ? 'gap-2.5' : 'gap-4 md:grid-cols-2'} ${className}`}>
      <InfoCard icon="swap" title="「银通 ATM」指什么？" compact={compact}>
        本网站所称“银通 ATM”，是指加入银通（JETCO）网络的会员银行所设 ATM，并非指提款交易实际使用的银联、Visa、Mastercard
        等网络。同一部银通 ATM 上，不同卡走不同清算网络，收费也可能不同。
      </InfoCard>
      <InfoCard icon="shield" title="境外提款避坑：拒绝 DCC" compact={compact}>
        在境外 ATM 提款时，若屏幕询问是否以港币结算（动态货币转换，DCC），建议选择以<b className="text-tx">当地货币</b>
        扣账，否则 ATM 运营方可能按较差的汇率额外收取差价。部分境外 ATM 运营方亦可能另收附加费。
      </InfoCard>
    </div>
  )
}
