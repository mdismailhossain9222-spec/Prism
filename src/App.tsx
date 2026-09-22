import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import GlobalCanvas from './components/three/GlobalCanvas'
import { lenisRef } from './utils/lenis'
import { RouterProvider, useRouter } from './router'
import { AuthProvider } from './auth'

// 8 Dedicated SaaS Pages
import Platform from './pages/Platform'
import Solutions from './pages/Solutions'
import Playground from './pages/Playground'
import Architecture from './pages/Architecture'
import Pricing from './pages/Pricing'
import Docs from './pages/Docs'
import Security from './pages/Security'
import Console from './pages/Console'

function ActivePageRenderer() {
  const { page } = useRouter()

  return (
    <main className="relative z-10 min-h-screen">
      {page === 'platform' && <Platform />}
      {page === 'solutions' && <Solutions />}
      {page === 'playground' && <Playground />}
      {page === 'architecture' && <Architecture />}
      {page === 'pricing' && <Pricing />}
      {page === 'docs' && <Docs />}
      {page === 'security' && <Security />}
      {page === 'console' && <Console />}
    </main>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const finishLoading = useCallback(() => setLoading(false), [])

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })
    lenisRef.current = lenis

    let rafId = 0
    const rafLoop = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(rafLoop)
    }
    rafId = requestAnimationFrame(rafLoop)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [loading])

  return (
    <RouterProvider>
      <AuthProvider>
        <div className="relative min-h-screen bg-[#06070a] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
          <AnimatePresence>
            {loading && <Preloader key="preloader" onDone={finishLoading} />}
          </AnimatePresence>

          {/* 3D Global Space Particles Canvas */}
          <GlobalCanvas />

          {/* High-Precision Reticle Cursor */}
          <Cursor />

          {/* Autonomous Telemetry Header */}
          <Navbar />

          {/* Active SaaS Page Container */}
          <ActivePageRenderer />

          {/* Telemetry Footer */}
          <Footer />
        </div>
      </AuthProvider>
    </RouterProvider>
  )
}
