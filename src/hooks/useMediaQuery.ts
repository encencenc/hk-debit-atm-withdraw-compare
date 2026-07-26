import { useEffect, useState } from 'react'

/** 响应式断点 hook（SSR 安全，默认 false） */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

/** 桌面端（≥768px） */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)')
}
