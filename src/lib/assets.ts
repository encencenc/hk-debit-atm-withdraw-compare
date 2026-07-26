/**
 * 把数据文件里的相对路径（如 `icon/汇丰银行.svg`）解析成实际可用的 URL，
 * 兼顾 GitHub Pages 的子路径部署（Vite base）与文件名中的空格 / 中文。
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL // 例如 './' 或 '/repo/'
  const clean = path.replace(/^\/+/, '')
  return encodeURI(base + clean)
}
