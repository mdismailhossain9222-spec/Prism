import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Cpu, LogOut, Menu, Terminal, User, X } from 'lucide-react'
import { cn } from '../utils/cn'
import { PAGE_CODE, useRouter } from '../router'
import type { PageId } from '../router'
import { useAuth } from '../auth'
import { GlowButton } from './shared'

const NAV_ITEMS: { id: PageId; label: string }[] = [
  { id: 'platform', label: 'Platform' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'playground', label: '3D Playground' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'docs', label: 'Docs & API' },
  { id: 'security', label: 'Security' },
]

export default function Navbar() {
  const { page, navigate } = useRouter()
  const { user, logout } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const go = (target: PageId) => {
    if (mobileOpen) {
      setMobileOpen(false)
      window.setTimeout(() => navigate(target), 280)
    } else {
      navigate(target)
    }
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled && !mobileOpen
            ? 'border-b border-slate-800/80 bg-[#06070a]/85 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
            : 'border-b border-transparent bg-transparent'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo Brand */}
          <button
            onClick={() => go('platform')}
            className="group flex items-center gap-3 text-left"
            aria-label="PRISM Platform Home"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/40 bg-gradient-to-br from-cyan-500/20 to-purple-600/30 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-transform duration-300 group-hover:scale-105">
              <Cpu className="h-5 w-5 text-cyan-400 transition-colors group-hover:text-white" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-sans text-xl font-extrabold tracking-wider text-white">
                  PRISM
                </span>
                <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-cyan-400 border border-cyan-500/20">
                  AI-CORE
                </span>
              </div>
              <span className="font-mono text-[9px] text-slate-500 block">
                AUTONOMOUS TELEMETRY
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-1 xl:flex rounded-full border border-slate-800/70 bg-[#0c0e15]/75 px-3 py-1.5 backdrop-blur-md">
            {NAV_ITEMS.map((item) => {
              const active = page === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className={cn(
                    'relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-sans text-xs font-semibold transition-all duration-300',
                    active
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span className="font-mono text-[10px] text-cyan-400/70 font-normal">
                    {PAGE_CODE[item.id]}
                  </span>
                  <span>{item.label}</span>
                  {active && (
                    <motion.span
                      layoutId="nav-glow-active"
                      className="absolute inset-0 -z-10 rounded-full border border-cyan-500/40 bg-cyan-500/15 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative group hidden sm:block">
                <button
                  onClick={() => go('console')}
                  className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3.5 py-2 font-mono text-xs text-emerald-300 transition-colors hover:border-emerald-400"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{user.name.split(' ')[0]}</span>
                  <span className="text-slate-500 text-[10px]">[{PAGE_CODE.console}]</span>
                </button>
                <div className="pointer-events-none absolute right-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                  <div className="w-56 rounded-xl border border-slate-800 bg-[#0e111a] p-3 text-xs shadow-2xl backdrop-blur-xl">
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="font-mono text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-3 space-y-1 border-t border-slate-800 pt-2">
                      <button
                        onClick={() => go('console')}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-slate-300 hover:bg-slate-800/60 hover:text-white"
                      >
                        <Activity size={13} className="text-cyan-400" />
                        <span>Cluster Manager</span>
                      </button>
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-rose-400 hover:bg-rose-950/30"
                      >
                        <LogOut size={13} />
                        <span>Disconnect Session</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => go('console')}
                className="hidden items-center gap-1.5 rounded-xl border border-slate-800 bg-[#0e111a]/80 px-4 py-2 font-mono text-xs font-semibold text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-white sm:flex"
              >
                <User size={13} className="text-cyan-400" />
                <span>Console</span>
              </button>
            )}

            <GlowButton
              size="sm"
              variant="primary"
              onClick={() => go('pricing')}
              className="hidden sm:inline-flex"
            >
              <span>Deploy Cluster</span>
            </GlowButton>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-[#0e111a] text-slate-300 hover:text-white xl:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[73px] z-40 border-b border-slate-800 bg-[#06070a]/95 px-6 py-6 shadow-2xl backdrop-blur-2xl xl:hidden"
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-4 py-3 text-left font-sans text-sm font-semibold transition-colors',
                    page === item.id
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-300 hover:bg-slate-900'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">
                      [{PAGE_CODE[item.id]}]
                    </span>
                    <span>{item.label}</span>
                  </span>
                  <Terminal size={14} className="text-slate-600" />
                </button>
              ))}

              <div className="mt-4 flex flex-col gap-2 border-t border-slate-800/80 pt-4">
                <button
                  onClick={() => go('console')}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 py-3 font-mono text-xs font-semibold text-slate-300 hover:bg-slate-900"
                >
                  <User size={14} className="text-cyan-400" />
                  <span>{user ? `Connected as ${user.name}` : 'Open Cluster Console [07]'}</span>
                </button>
                <GlowButton
                  size="md"
                  onClick={() => go('pricing')}
                  className="w-full justify-center"
                >
                  Deploy High-Throughput Node
                </GlowButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
