import { Activity, ArrowUp, Cpu, GitBranch, Shield, Terminal } from 'lucide-react'
import { PAGES, PAGE_CODE, useRouter } from '../router'
import type { PageId } from '../router'
import { lenisRef } from '../utils/lenis'

export default function Footer() {
  const { navigate } = useRouter()

  const scrollToTop = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 1.0 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navPages: PageId[] = [
    'platform',
    'solutions',
    'playground',
    'architecture',
    'pricing',
    'docs',
    'security',
    'console',
  ]

  return (
    <footer className="relative z-10 border-t border-slate-800/80 bg-[#040508] text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        {/* Top Operational Status Banner */}
        <div className="mb-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-[#090c13] p-6 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <div>
              <p className="font-mono text-xs font-semibold text-white">ALL SYSTEMS OPERATIONAL</p>
              <p className="font-mono text-[11px] text-slate-400">
                P99 Global Latency: 0.22ms · Active Nodes: 48,912 · Zero Packet Loss
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('security')}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-[#0f1422] px-4 py-2 font-mono text-xs text-cyan-400 hover:border-cyan-500/40 hover:text-white transition-colors"
          >
            <Shield size={14} />
            <span>SOC2 Type II &amp; Uptime Center [06]</span>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/30">
                <Cpu className="h-5 w-5 text-cyan-400" />
              </div>
              <span className="font-sans text-xl font-extrabold tracking-wider text-white">
                PRISM
              </span>
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              The next-generation distributed observability and autonomous agent telemetry
              kernel. Built for zero-overhead tracing and self-healing infrastructure.
            </p>

            <div className="mt-6 flex items-center gap-3 font-mono text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Terminal size={14} className="text-cyan-400" />
                <span>v2.8.4-PROD</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Activity size={14} className="text-emerald-400" />
                <span>99.999% SLA</span>
              </span>
            </div>
          </div>

          {/* Col 2: Modules Navigation */}
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
              Platform Modules
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navPages.slice(0, 4).map((p) => (
                <li key={p}>
                  <button
                    onClick={() => navigate(p)}
                    className="group flex items-center gap-2 text-slate-400 transition-colors hover:text-cyan-400"
                  >
                    <span className="font-mono text-[10px] text-slate-600 group-hover:text-cyan-400">
                      [{PAGE_CODE[p]}]
                    </span>
                    <span>{PAGES[p]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Enterprise & Developers */}
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
              Enterprise &amp; Dev
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {navPages.slice(4).map((p) => (
                <li key={p}>
                  <button
                    onClick={() => navigate(p)}
                    className="group flex items-center gap-2 text-slate-400 transition-colors hover:text-cyan-400"
                  >
                    <span className="font-mono text-[10px] text-slate-600 group-hover:text-cyan-400">
                      [{PAGE_CODE[p]}]
                    </span>
                    <span>{PAGES[p]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Telemetry Command */}
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
              Terminal Connect
            </p>
            <div className="mt-4 rounded-xl border border-slate-800 bg-[#090b10] p-3 font-mono text-xs text-slate-400">
              <p className="text-cyan-400">$ curl -s https://prism.io/mesh | sh</p>
              <p className="mt-2 text-[10px] text-slate-500">Autonomous edge deployment in seconds</p>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <GitBranch size={14} className="text-cyan-400" />
                <span>GitHub 28.4k ★</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 font-mono text-xs text-slate-500 sm:flex-row">
          <p>© 2026 PRISM Autonomous Systems, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('security')}
              className="hover:text-cyan-400 transition-colors"
            >
              Trust Center [06]
            </button>
            <button
              onClick={() => navigate('docs')}
              className="hover:text-cyan-400 transition-colors"
            >
              API Reference [05]
            </button>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <span>Back to Top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
