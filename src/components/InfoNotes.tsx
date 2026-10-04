import type { ReactNode } from 'react'
import { Icon } from './Icon'
import { Panel } from './Panel'

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: 'swap' | 'shield'
  title: string
  children: ReactNode
}) {
  return (
    <Panel className="p-5">
      <div className="flex items-center gap-2 text-sm font-bold">
        <Icon name={icon} size={17} className="text-ac" />
        {title}
      </div>
      <p className="mt-2.5 text-[12.5px] leading-relaxed text-mut">{children}</p>
    </Panel>
  )
}

/** 页面底部的两条提款须知（三种查询方式共用） */
export function InfoNotes({ className = '' }: { className?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${className}`}>
      <InfoCard icon="swap" title="「银通 ATM」指什么？">
        本网站所称“银通 ATM”，是指加入银通（JETCO）网络的会员银行所设 ATM，并非指提款交易实际使用的银联、Visa、Mastercard
        等网络。同一部银通 ATM 上，不同卡走不同清算网络，收费也可能不同。
      </InfoCard>
      <InfoCard icon="shield" title="境外提款避坑：拒绝 DCC">
        在境外 ATM 提款时，若屏幕询问是否以港币结算（动态货币转换，DCC），建议选择以<b className="text-tx">当地货币</b>
        扣账，否则 ATM 运营方可能按较差的汇率额外收取差价。部分境外 ATM 运营方亦可能另收附加费。
      </InfoCard>
    </div>
  )
}
