/**
 * 凭条锯齿撕边（纯 SVG，非图片）。
 * 齿用纸面色填充，齿间为透明，与纸面矩形一起构成锯齿轮廓。
 */
const W = 522
const TOOTH = 18
const H = 9
const N = W / TOOTH

export function ReceiptEdge({ side }: { side: 'top' | 'bottom' }) {
  let d = ''
  if (side === 'top') {
    d = `M0 ${H}`
    for (let i = 0; i < N; i++) d += ` L ${i * TOOTH + TOOTH / 2} 0 L ${(i + 1) * TOOTH} ${H}`
    d += ' Z'
  } else {
    d = 'M0 0'
    for (let i = 0; i < N; i++) d += ` L ${i * TOOTH + TOOTH / 2} ${H} L ${(i + 1) * TOOTH} 0`
    d += ' Z'
  }
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      style={{ display: 'block', width: '100%', height: H, color: 'var(--card2)' }}
      aria-hidden="true"
    >
      <path d={d} fill="currentColor" />
    </svg>
  )
}
