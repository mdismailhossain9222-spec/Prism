import { useState } from 'react'
import {
  ArrowRight,
  Bot,
  CheckCircle,
  Database,
  Globe2,
  LineChart,
  Lock,
  Server,
} from 'lucide-react'
import { GlowButton, SectionHeader, TerminalWindow } from '../components/shared'
import { useRouter } from '../router'

const SOLUTIONS = [
  {
    id: 'ai-agents',
    badge: 'AUTONOMOUS_SWARMS',
    icon: Bot,
    title: 'Autonomous AI Agent Swarm Tracing',
    tagline: 'Observe multi-agent reasoning graphs, tool-calling chains, and prevent LLM deadlocks.',
    overview:
      'When agents collaborate asynchronously, small hallucinations trigger cascading loops. PRISM reconstructs the full causal graph of reasoning steps, token costs, and tool execution in real-time.',
    metrics: [
      { k: 'Context Sync Overhead', v: '< 0.04ms' },
      { k: 'Deadlock Detection', v: 'Autonomous' },
      { k: 'Token Waste Reduction', v: 'Up to 34%' },
    ],
    codeTitle: 'agent_swarm_trace.py',
    code: `from prism.agents import AgentMesh, TraceSession

mesh = AgentMesh(cluster="prod-neural-1", protocol="v2")

@mesh.instrument(track_tokens=True, auto_rollback=True)
async def execute_agent_step(agent_id: str, context: dict):
    # PRISM automatically maps causal dependencies & latency
    step = await mesh.dispatch(agent_id, context)
    return step.result`,
  },
  {
    id: 'fintech',
    badge: 'MICROSECOND_FINTECH',
    icon: LineChart,
    title: 'High-Frequency Fintech & Order Routing',
    tagline: 'Deterministic microsecond observability for trading desks and high-throughput payment rails.',
    overview:
      'Every microsecond of latency jitter impacts fill rates and execution quality. PRISM kernel hooks provide jitter-free L4/L7 order tracking with complete regulatory audit compliance.',
    metrics: [
      { k: 'Timestamp Precision', v: '10 Nanoseconds' },
      { k: 'Throughput', v: '10M+ msgs/sec' },
      { k: 'Audit Storage', v: 'WORM Immutable' },
    ],
    codeTitle: 'order_pipeline.rs',
    code: `use prism_kernel::prelude::*;

#[prism_hotpath(channel = "ny4-equinix", max_latency_ns = 500)]
fn process_order_ticket(order: &OrderPacket) -> Result<ExecutionReport> {
    // Zero-overhead ring buffer telemetry
    let ack = MATCH_ENGINE.submit(order)?;
    Ok(ack)
}`,
  },
  {
    id: 'edge',
    badge: 'GLOBAL_ANYCAST_EDGE',
    icon: Globe2,
    title: 'Global Edge & IoT Mesh Telemetry',
    tagline: 'Decentralized telemetry across 48 worldwide edge PoPs with automatic failover.',
    overview:
      'Observe CDN workers, edge inference containers, and remote IoT gateways as a single unified fabric. Automated peer-to-peer gossip gossip protocols heal disconnected partitions.',
    metrics: [
      { k: 'Global Edge PoPs', v: '48 Regions' },
      { k: 'Cold Start Tracing', v: 'Sub-millisecond' },
      { k: 'Offline Resilience', v: 'Local Ring Buffers' },
    ],
    codeTitle: 'edge_worker.ts',
    code: `import { createEdgeMesh } from '@prism/edge';

export default {
  async fetch(req: Request): Promise<Response> {
    const mesh = createEdgeMesh({ region: 'auto' });
    return mesh.wrap(req, async () => {
      return new Response('Edge synthesized in 0.8ms');
    });
  }
};`,
  },
  {
    id: 'k8s',
    badge: 'KUBERNETES_AUTONOMY',
    icon: Server,
    title: 'Self-Healing Kubernetes & Multi-Cloud',
    tagline: 'Autonomous pod resizing, cascade failure isolation, and zero-downtime mesh re-routing.',
    overview:
      'Traditional APMs alert you after your cluster crashes. PRISM leverages continuous predictive modeling to shed non-critical load and scale instances before SLOs breach.',
    metrics: [
      { k: 'Mitigation Time', v: '< 15 Milliseconds' },
      { k: 'Cluster Noise', v: '96% Alert Reduction' },
      { k: 'Supported Clouds', v: 'AWS, GCP, Azure, Bare-Metal' },
    ],
    codeTitle: 'prism-operator.yaml',
    code: `apiVersion: prism.io/v2beta1
kind: AutonomousCluster
metadata:
  name: payments-production
spec:
  targetSLO: 99.999
  selfHealing:
    enabled: true
    maxJitterMs: 2.0
    autoRebalance: true`,
  },
]

export default function Solutions() {
  const { navigate } = useRouter()
  const [activeTab, setActiveTab] = useState(0)
  const current = SOLUTIONS[activeTab]
  const Icon = current.icon

  return (
    <div className="relative pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          code="01"
          badge="ENTERPRISE_SOLUTIONS"
          title="Architected for Mission-Critical Stacks"
          subtitle="Explore how PRISM delivers sub-millisecond observability across AI swarms, financial trading desks, and global edge topologies."
        />

        {/* Tab Navigation Buttons */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
          {SOLUTIONS.map((item, idx) => {
            const active = activeTab === idx
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'border border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                    : 'border border-slate-800 bg-[#0a0d14] text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>[{String(idx + 1).padStart(2, '0')}]</span>
                <span>{item.title.split(' ')[0]} {item.title.split(' ')[1]}</span>
              </button>
            )
          })}
        </div>

        {/* Active Solution Showcase */}
        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-800 bg-[#090c13] p-8 md:p-12 shadow-2xl relative">
          <div className="absolute right-0 top-0 h-64 w-64 bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="grid gap-12 lg:grid-cols-12 items-center">
            {/* Left Specs & Description */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 font-mono text-xs text-cyan-400">
                <Icon size={14} />
                <span>[{current.badge}]</span>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold text-white md:text-4xl">
                {current.title}
              </h2>

              <p className="mt-2 text-base font-semibold text-cyan-300/90">
                {current.tagline}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                {current.overview}
              </p>

              {/* Verified Metrics Grid */}
              <div className="mt-8 grid grid-cols-3 gap-3 rounded-2xl border border-slate-800 bg-[#06070a] p-4 font-mono">
                {current.metrics.map((m) => (
                  <div key={m.k}>
                    <p className="text-[10px] text-slate-500 uppercase">{m.k}</p>
                    <p className="mt-1 text-sm font-bold text-white">{m.v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <GlowButton onClick={() => navigate('playground')}>
                  <span>Run in 3D Playground [02]</span>
                  <ArrowRight size={14} />
                </GlowButton>
                <GlowButton variant="secondary" onClick={() => navigate('pricing')}>
                  <span>Get Started [04]</span>
                </GlowButton>
              </div>
            </div>

            {/* Right Live Code Implementation */}
            <div className="lg:col-span-6">
              <TerminalWindow
                title={current.codeTitle}
                code={current.code}
                badge="zero-overhead"
              />
            </div>
          </div>
        </div>

        {/* Enterprise Security Callout Grid */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/30 text-cyan-400">
              <Lock size={18} />
            </div>
            <h3 className="mt-4 font-sans text-base font-bold text-white">
              End-to-End Cryptographic Airgap
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Your telemetry traces and metrics remain strictly encrypted with customer-held
              KMS keys. Zero plaintext persistence.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-400">
              <CheckCircle size={18} />
            </div>
            <h3 className="mt-4 font-sans text-base font-bold text-white">
              Deterministic 99.999% SLA
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Backed by continuous BGP Anycast mesh routing and multi-region Raft state
              synchronization.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/30 text-purple-400">
              <Database size={18} />
            </div>
            <h3 className="mt-4 font-sans text-base font-bold text-white">
              100% Trace Coverage Guarantee
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Never miss an anomaly due to statistical down-sampling. PRISM records every
              single execution packet with zero dropped frames.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
