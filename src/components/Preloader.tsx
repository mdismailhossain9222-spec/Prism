import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu } from 'lucide-react'

const BOOT_LOGS = [
  'INITIALIZING PRISM eBPF KERNEL v2.8.4',
  'ALLOCATING RING BUFFERS: 64MB DMA MEMORY',
  'VERIFYING BGP ANYCAST MESH (48 GLOBAL REGIONS)',
  'RAFT CONSENSUS QUORUM ESTABLISHED: 0.18ms',
  'HARDWARE ENCLAVE (AMD SEV-SNP) ARMED',
  'AUTONOMOUS AGENT TELEMETRY RUNTIME ONLINE',
]

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [logIndex, setLogIndex] = useState(0)

  useEffect(() => {
    let p = 0
    const interval = window.setInterval(() => {
      p += Math.floor(Math.random() * 6) + 3
      if (p >= 100) {
        p = 100
        window.clearInterval(interval)
        window.setTimeout(onDone, 400)
      }
      setProgress(p)
      setLogIndex(Math.min(BOOT_LOGS.length - 1, Math.floor((p / 100) * BOOT_LOGS.length)))
    }, 30)

    return () => window.clearInterval(interval)
  }, [onDone])

  return (
    <motion.div
      className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-[#040508] font-mono text-slate-200"
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Background Cyber Grid */}
      <div className="cyber-grid pointer-events-none absolute inset-0 opacity-40" />

      {/* Center Quantum Terminal Container */}
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center p-8 text-center">
        {/* Pulsing Core Icon */}
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-950/30 shadow-[0_0_40px_rgba(0,240,255,0.3)]">
          <Cpu className="h-8 w-8 text-cyan-400" />
          <span className="absolute -inset-1 rounded-2xl border border-cyan-400/20 animate-ping" />
        </div>

        {/* Brand Name */}
        <h1 className="font-sans text-4xl font-extrabold tracking-wider text-white md:text-5xl">
          PRISM
        </h1>
        <p className="mt-1 font-mono text-[10px] tracking-[0.3em] text-cyan-400">
          AUTONOMOUS CLOUD TELEMETRY
        </p>

        {/* Terminal Boot Log Output */}
        <div className="mt-8 h-8 w-full overflow-hidden text-left font-mono text-xs text-slate-400">
          <p className="text-cyan-300 truncate">
            <span className="text-emerald-400 font-bold">&gt;</span> {BOOT_LOGS[logIndex]}
          </p>
        </div>

        {/* Segmented Progress Bar */}
        <div className="mt-4 flex w-full gap-1">
          {Array.from({ length: 32 }).map((_, i) => {
            const filled = i < Math.floor((progress / 100) * 32)
            return (
              <div
                key={i}
                className={`h-2 flex-1 rounded-sm transition-colors duration-100 ${
                  filled ? 'bg-cyan-400 shadow-[0_0_8px_#00F0FF]' : 'bg-slate-800/80'
                }`}
              />
            )
          })}
        </div>

        {/* Progress Percent Readout */}
        <div className="mt-4 flex w-full items-center justify-between font-mono text-xs text-slate-500">
          <span>KERNEL_INIT: {progress}%</span>
          <span className="text-emerald-400">STATE: OPTIMAL</span>
        </div>
      </div>
    </motion.div>
  )
}
