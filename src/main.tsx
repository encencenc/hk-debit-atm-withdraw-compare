import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import App from './App'
import './index.css'

// 背景柔光跟随鼠标（仅精确指针设备 + 未开启减弱动态效果时）
if (
  window.matchMedia('(pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  let frame = 0
  window.addEventListener(
    'pointermove',
    (e) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const root = document.documentElement.style
        root.setProperty('--mouse-x', `${e.clientX}px`)
        root.setProperty('--mouse-y', `${e.clientY}px`)
      })
    },
    { passive: true },
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* reducedMotion="user"：开启系统「减弱动态效果」后自动降级为瞬时切换 */}
    <MotionConfig reducedMotion="user">
      <main className="min-h-screen">
        <App />
      </main>
    </MotionConfig>
  </React.StrictMode>,
)
