import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import App from './App'
import './index.css'

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
