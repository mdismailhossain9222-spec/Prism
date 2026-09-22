import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { lenisRef } from './utils/lenis'

export const PAGES = {
  platform: 'Platform Overview',
  solutions: 'Enterprise Solutions',
  playground: '3D Node Playground',
  architecture: 'Architecture & Engine',
  pricing: 'Pricing & Calculator',
  docs: 'API & Documentation',
  security: 'Security & Trust Center',
  console: 'Cluster Console',
} as const

export type PageId = keyof typeof PAGES

export const PAGE_CODE: Record<PageId, string> = {
  platform: '00',
  solutions: '01',
  playground: '02',
  architecture: '03',
  pricing: '04',
  docs: '05',
  security: '06',
  console: '07',
}

export const PAGE_SUBTITLE: Record<PageId, string> = {
  platform: 'Sub-millisecond Autonomous Infrastructure',
  solutions: 'AI Swarms, High-Frequency Fintech & Edge',
  playground: 'Interactive 3D Cluster Simulation & Stress Testing',
  architecture: 'Zero-Copy Pipeline & Global Low-Latency Mesh',
  pricing: 'Predictable Consumption & Dynamic Volume Calculator',
  docs: 'REST, GraphQL, gRPC & Multi-Language SDKs',
  security: 'SOC2 Type II, HIPAA, ISO 27001 & BYOK Encryption',
  console: 'Live Cluster Telemetry & Developer Keys',
}

type VeilState = {
  target: PageId
  phase: 'in' | 'hold' | 'out'
} | null

const RouterCtx = createContext<{
  page: PageId
  navigate: (p: PageId) => void
  isNavigating: boolean
} | null>(null)

export function useRouter() {
  const ctx = useContext(RouterCtx)
  if (!ctx) throw new Error('useRouter must be used within RouterProvider')
  return ctx
}

/* ------------------------------------------------------------------ */
/*  Hyper-Futuristic Telemetry Warp / Quantum Iris Transition         */
/* ------------------------------------------------------------------ */
function QuantumWarpVeil({ state }: { state: VeilState }) {
  if (!state) return null
  const isEntering = state.phase === 'in' || state.phase === 'hold'

  return (
    <div className="pointer-events-none fixed inset-0 z-[120] overflow-hidden">
      {/* Background Dim & Blur Shield */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isEntering ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-[#06070a]/90 backdrop-blur-xl"
      />

      {/* Cybernetic Wireframe Grid Sweep */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isEntering ? 0.35 : 0, scale: isEntering ? 1 : 1.15 }}
        transition={{ duration: 0.5 }}
        className="cyber-grid absolute inset-0"
      />

      {/* High-speed Horizontal Scan Beam */}
      <motion.div
        initial={{ top: '-10%' }}
        animate={{ top: isEntering ? '110%' : '120%' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-x-0 h-40 bg-gradient-to-b from-transparent via-cyan-400/25 to-transparent blur-md"
      />

      {/* Expanding/Contracting Quantum Aperture */}
      <div className="relative flex h-full w-full items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.7, opacity: 0, rotate: -20 }}
          animate={{
            scale: isEntering ? 1 : 1.4,
            opacity: isEntering ? 1 : 0,
            rotate: isEntering ? 0 : 25,
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex max-w-xl flex-col items-center justify-center rounded-2xl border border-cyan-500/30 bg-[#0c0e14]/90 p-10 text-center shadow-[0_0_80px_rgba(0,240,255,0.2)] backdrop-blur-2xl"
        >
          {/* Top Telemetry Header */}
          <div className="flex w-full items-center justify-between border-b border-slate-800 pb-4 font-mono text-xs text-slate-400">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 animate-ping rounded-full bg-cyan-400" />
              <span className="text-cyan-400">PRISM_KERNEL_WARP</span>
            </span>
            <span className="text-slate-500">SYS_LATENCY: 0.18ms</span>
          </div>

          {/* Central Holographic Coordinates & Target Page */}
          <div className="my-8 flex flex-col items-center">
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded bg-cyan-500/10 px-2.5 py-1 font-mono text-xs font-semibold tracking-wider text-cyan-400 border border-cyan-500/30">
                MODULE [{PAGE_CODE[state.target]}]
              </span>
              <span className="font-mono text-xs text-slate-500">HASH: 0x8FA4...</span>
            </div>

            <h2 className="font-sans text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              {PAGES[state.target]}
            </h2>

            <p className="mt-2 font-mono text-xs text-slate-400">
              {PAGE_SUBTITLE[state.target]}
            </p>
          </div>

          {/* Bottom Diagnostics Progress Bar */}
          <div className="w-full">
            <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: isEntering ? '100%' : '100%' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 shadow-[0_0_12px_#00F0FF]"
              />
            </div>
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span>ZERO_PACKET_LOSS</span>
              <span>STATE: SYNCHRONIZED</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>('platform')
  const [veil, setVeil] = useState<VeilState>(null)
  const isNavigatingRef = useRef(false)

  const navigate = useCallback(
    (target: PageId) => {
      if (isNavigatingRef.current) return
      if (target === page) {
        if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 0.8 })
        else window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      isNavigatingRef.current = true
      setVeil({ target, phase: 'in' })

      // Phase 1: Swarm/Aperture locks in
      window.setTimeout(() => {
        setVeil({ target, phase: 'hold' })
        setPage(target)
        if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true })
        window.scrollTo(0, 0)
      }, 550)

      // Phase 2: Fade out & release
      window.setTimeout(() => {
        setVeil({ target, phase: 'out' })
      }, 950)

      window.setTimeout(() => {
        setVeil(null)
        isNavigatingRef.current = false
      }, 1300)
    },
    [page]
  )

  const value = useMemo(
    () => ({
      page,
      navigate,
      isNavigating: Boolean(veil),
    }),
    [page, navigate, veil]
  )

  return (
    <RouterCtx.Provider value={value}>
      {children}
      <QuantumWarpVeil state={veil} />
    </RouterCtx.Provider>
  )
}
