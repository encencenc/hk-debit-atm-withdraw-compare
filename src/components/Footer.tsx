import { META } from '../data/banks'
import { Icon } from './Icon'

export function Footer() {
  return (
    <footer className="mt-16 border-t border-bd bg-card">
      <div className="mx-auto grid max-w-[1560px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_1fr_1.6fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-acs text-white">
              <Icon name="bank" size={20} />
            </span>
            <span className="text-base font-bold">HK ATM Fee Comparator</span>
          </div>
          <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-mut">
            查一查你的香港卡在各地 ATM 取现要不要钱：按发卡行、按 ATM 类型，或直接看完整资费矩阵。
          </p>
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-tx">数据来源</h2>
          <ul className="mt-3.5 space-y-2 text-sm text-mut">
            <li>· {META.source}</li>
            <li>· 数据截至 {META.updatedAt}</li>
          </ul>
        </div>
        <div>
          <h2 className="text-[15px] font-bold text-tx">免责声明</h2>
          <p className="mt-3.5 text-sm leading-relaxed text-mut">
            本站收录的收费标准整理自各银行公开资料，仅供参考，不构成任何金融建议。实际手续费以发卡行及 ATM
            运营方的最新公布与交易单据为准。
          </p>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1560px] justify-center border-t border-bd2 px-4 py-6 text-center text-[13px] leading-relaxed text-mut sm:px-6 lg:px-8">
        <span className="max-w-4xl [text-wrap:balance]">
          本网站属于 encmasuta 频道。本网站内的原创内容，如无特殊说明，均以{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans"
            target="_blank"
            rel="noopener noreferrer license"
            className="underline decoration-bd underline-offset-4 hover:text-ac hover:decoration-ac"
          >
            CC BY-NC-SA 4.0
          </a>{' '}
          协议发布。转载时，敬请保留原始来源。
        </span>
      </div>
    </footer>
  )
}
