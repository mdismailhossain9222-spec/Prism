import { useState } from 'react'
import {
  ArrowRight,
  Cpu,
  Layers,
  Network,
  Play,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react'
import QuantumCore from '../components/three/QuantumCore'
import { GlowButton, MetricCard, SectionHeader, TerminalWindow } from '../components/shared'
import { useRouter } from '../router'

const LOGOS = [
  'VERCEL',
  'STRIPE',
  'LINEAR',
  'DATADOG',
  'SNOWFLAKE',
  'FIGMA',
  'SUPABASE',
  'CLOUDFLARE',
]

const ARCH_LAYERS = [
  {
    step: '01',
    title: 'Zero-Overhead Ingestion',
    tech: 'eBPF & Kernel Ring Buffers',
    desc: 'Captures L4/L7 packets and kernel context at wire speed without wrapping user code or modifying binaries.',
    metric: '< 0.02% CPU impact',
  },
  {
    step: '02',
    title: 'Distributed Raft Consensus',
    tech: 'Memory-Mapped Journaling',
    desc: 'Synchronizes cluster state across 48 global regions with zero-copy pipelining and microsecond lock handoffs.',
    metric: '0.18ms quorum time',
  },
  {
    step: '03',
    title: 'Neural Anomaly Engine',
    tech: 'Vectorized Time-Series Transformers',
    desc: 'Auto-correlates metrics, traces, and log spikes into unified root-cause causal graphs before human alerts fire.',
    metric: '99.4% precision',
  },
  {
    step: '04',
    title: 'Autonomous Self-Healing',
    tech: 'BGP Anycast & Hot Re-routing',
    desc: 'Isolates degraded instances, spins up replica state, and reroutes mission-critical traffic in single-digit milliseconds.',
    metric: '< 12ms mitigation',
  },
]

const FEATURES = [
  {
    id: 'tracing',
    icon: Network,
    badge: 'CORE_ENGINE',
    title: 'Sub-Millisecond Distributed Tracing',
    desc: 'Track every microservice hop, database query, and neural inference call with complete context and zero sampling loss.',
    stat: '100% Trace Coverage',
  },
  {
    id: 'ai',
    icon: Sparkles,
    badge: 'NEURAL_OPS',
    title: 'AI Agent Swarm Observability',
    desc: 'Prevent hallucination deadlocks and track cascading LLM agent tool-call latency across multi-modal pipelines.',
    stat: '0.04ms Context Sync',
  },
  {
    id: 'scaling',
    icon: Cpu,
    badge: 'AUTO_SCALE',
    title: 'Self-Healing Kubernetes Mesh',
    desc: 'Autonomous pod resizing and traffic shedding that prevents cascade failures before user latency spikes.',
    stat: 'Zero Downtime Failover',
  },
  {
    id: 'security',
    icon: ShieldCheck,
    badge: 'ZERO_TRUST',
    title: 'Cryptographic Air-Gap Isolation',
    desc: 'Hardware-enforced enclave processing with customer-managed keys (BYOK) and full SOC2 Type II compliance.',
    stat: 'AES-256-GCM + TLS 1.3',
  },
]

export default function Platform() {
  const { navigate } = useRouter()
  const [activeLayer, setActiveLayer] = useState(0)

  return (
    <div className="relative pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-12 pb-20 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Hero Content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1.5 font-mono text-xs text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>KERNEL v2.8.4 DEPLOYED</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">P99: 0.19ms</span>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Autonomous Cloud <br />
              <span className="text-gradient-cyan">Observability Engine</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              PRISM eliminates microservice blindspots with zero-overhead distributed tracing,
              sub-millisecond metric ingestion, and automated self-healing cloud clusters.
            </p>

            {/* Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <GlowButton size="lg" onClick={() => navigate('playground')}>
                <Play size={16} fill="currentColor" />
                <span>Launch 3D Playground [02]</span>
              </GlowButton>

              <GlowButton size="lg" variant="secondary" onClick={() => navigate('pricing')}>
                <span>View Plans &amp; Calculator [04]</span>
                <ArrowRight size={16} />
              </GlowButton>
            </div>

            {/* Terminal One-liner */}
            <div className="mt-8 max-w-xl">
              <TerminalWindow
                title="quickstart — install prism cluster daemon"
                code="curl -fsSL https://get.prism.io | sh -s -- --cluster=prod-alpha"
                badge="curl · bash"
              />
            </div>
          </div>

          {/* Right 3D Interactive Holographic Cluster */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500/10 to-purple-600/10 blur-2xl -z-10" />
            <QuantumCore className="h-[440px] w-full max-w-md sm:h-[520px]" />
            <div className="mt-2 text-center font-mono text-[11px] text-slate-500">
              Interactive 3D Core · Drag to rotate · Click nodes to inspect telemetry
            </div>
          </div>
        </div>

        {/* Global Stats Ticker Bar */}
        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          <MetricCard
            value="0.18ms"
            label="Global P99 Latency"
            sub="Across 48 edge availability zones"
            highlight="99.999% SLA Guarantee"
            badge="BENCHMARK"
          />
          <MetricCard
            value="1.4M+"
            label="Events / Second"
            sub="Sustained throughput per node"
            highlight="Zero Packet Loss"
            badge="THROUGHPUT"
          />
          <MetricCard
            value="< 0.02%"
            label="Agent CPU Overhead"
            sub="Kernel-level eBPF instrumentation"
            highlight="No Code Modification"
            badge="ZERO-IMPACT"
          />
          <MetricCard
            value="48"
            label="Autonomous Regions"
            sub="Global Anycast low-latency mesh"
            highlight="Sub-second Failover"
            badge="MULTI-CLOUD"
          />
        </div>
      </section>

      {/* Customer Trust Marquee */}
      <section className="border-y border-slate-800/80 bg-[#040508]/60 py-8 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
            Trusted by Engineering Leaders Orchestrating Critical Infrastructure
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {LOGOS.map((name) => (
              <span
                key={name}
                className="font-mono text-sm font-bold tracking-widest text-slate-500 hover:text-cyan-400 transition-colors cursor-default"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Layered Architecture */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <SectionHeader
          code="00.1"
          badge="ARCHITECTURE_STACK"
          title="Engineered from the Silicon to the Edge"
          subtitle="A four-stage zero-copy pipeline that ingests, correlates, and resolves cloud anomalies in single-digit milliseconds."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-12 items-center">
          {/* Layer Selector */}
          <div className="lg:col-span-5 space-y-3">
            {ARCH_LAYERS.map((layer, idx) => {
              const active = activeLayer === idx
              return (
                <button
                  key={layer.step}
                  onClick={() => setActiveLayer(idx)}
                  className={`w-full rounded-2xl border p-5 text-left transition-all duration-300 ${
                    active
                      ? 'border-cyan-500/50 bg-[#0f1422] shadow-[0_0_25px_rgba(0,240,255,0.15)]'
                      : 'border-slate-800/80 bg-[#090b10] hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-cyan-400">
                      STAGE {layer.step}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">{layer.metric}</span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-white">{layer.title}</h3>
                  <p className="mt-0.5 font-mono text-xs text-slate-400">{layer.tech}</p>
                </button>
              )
            })}
          </div>

          {/* Active Layer Deep Dive Card */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#0b0e17] p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 h-40 w-40 bg-cyan-500/10 blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
              <Layers size={14} />
              <span>DEEP_DIVE: STAGE {ARCH_LAYERS[activeLayer].step}</span>
            </div>

            <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
              {ARCH_LAYERS[activeLayer].title}
            </h3>

            <p className="mt-4 text-base leading-relaxed text-slate-300">
              {ARCH_LAYERS[activeLayer].desc}
            </p>

            <div className="mt-8 rounded-xl border border-slate-800 bg-[#06070a] p-5 font-mono text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>EXECUTION_MODEL:</span>
                <span className="text-white">{ARCH_LAYERS[activeLayer].tech}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>VERIFIED_METRIC:</span>
                <span className="text-emerald-400 font-bold">{ARCH_LAYERS[activeLayer].metric}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>ISOLATION_LEVEL:</span>
                <span className="text-cyan-400">Hardware Kernel Ring-0</span>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <GlowButton
                size="sm"
                variant="secondary"
                onClick={() => navigate('architecture')}
              >
                <span>Read Full Technical Architecture [03]</span>
                <ArrowRight size={14} />
              </GlowButton>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Matrix Grid */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader
          code="00.2"
          badge="CAPABILITIES"
          title="Autonomous Capabilities"
          subtitle="Everything modern engineering organizations need to eliminate operational drag."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.id}
                className="glass-card glass-card-hover flex flex-col justify-between rounded-2xl p-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
                      <Icon size={20} />
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">[{feat.badge}]</span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white">{feat.title}</h3>
                  <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>

                <div className="mt-6 border-t border-slate-800/80 pt-4 font-mono text-xs font-semibold text-emerald-400">
                  {feat.stat}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Conversion Banner */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0c121e] to-[#06070a] p-10 md:p-16 text-center shadow-[0_0_60px_rgba(0,240,255,0.15)]">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-3 py-1 font-mono text-xs text-cyan-300">
            <Zap size={14} />
            <span>INSTANT CLOUD PROVISIONING</span>
          </div>

          <h2 className="mt-6 text-3xl font-extrabold text-white md:text-5xl">
            Experience Sub-Millisecond Cloud Telemetry Today
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300 md:text-base">
            Spin up a zero-overhead cluster in under 60 seconds with 10,000,000 free events
            every month. No credit card required.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <GlowButton size="lg" onClick={() => navigate('pricing')}>
              <span>Deploy Production Cluster [04]</span>
              <ArrowRight size={16} />
            </GlowButton>
            <GlowButton size="lg" variant="secondary" onClick={() => navigate('docs')}>
              <span>Read API Docs [05]</span>
            </GlowButton>
          </div>
        </div>
      </section>
    </div>
  )
}
