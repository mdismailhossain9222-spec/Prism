import { useState } from 'react'
import {
  Activity,
  CheckCircle,
  Play,
  RefreshCw,
  Sliders,
  Terminal,
} from 'lucide-react'
import PlaygroundCluster3D from '../components/three/PlaygroundCluster3D'
import { GlowButton, SectionHeader } from '../components/shared'
import { useRouter } from '../router'

const QUERIES = [
  {
    id: 'vector',
    name: 'Neural Vector Search',
    q: 'QUERY SELECT * FROM traces WHERE vector_distance(embedding, $prompt) < 0.12 LIMIT 50',
    resp: {
      status: '200_OK',
      execution_ms: 0.18,
      matches_found: 48,
      consensus_latency_us: 42,
      nodes_queried: 16,
      shards: 'us-east-1a, us-east-1b, us-east-1c',
      verdict: 'NO_ANOMALY_DETECTED',
    },
  },
  {
    id: 'deadlock',
    name: 'Agent Deadlock Scan',
    q: 'ANALYZE AGENT_SWARM "checkout-orchestrator" --depth=8 --detect-cycles',
    resp: {
      status: 'CYCLE_AVOIDED',
      execution_ms: 0.24,
      agents_observed: 12,
      deadlocks_resolved: 2,
      token_savings_pct: 28.4,
      auto_rollback_invoked: false,
    },
  },
  {
    id: 'stream',
    name: 'Real-time eBPF Stream',
    q: 'LISTEN kernel:tcp_retransmit | WHERE duration_us > 500 GROUP BY pod_ip',
    resp: {
      status: 'STREAM_ONLINE',
      execution_ms: 0.08,
      packets_analyzed_sec: '2,480,000',
      kernel_ring_head: '0x9FF4A',
      zero_copy_verified: true,
      cpu_overhead_pct: 0.018,
    },
  },
]

export default function Playground() {
  const { navigate } = useRouter()
  const [qps, setQps] = useState(1800)
  const [autoHeal, setAutoHeal] = useState(true)
  const [activeQuery, setActiveQuery] = useState(QUERIES[0])
  const [executing, setExecuting] = useState(false)
  const [queryOutput, setQueryOutput] = useState<unknown>(QUERIES[0].resp)

  const handleRunQuery = () => {
    setExecuting(true)
    setTimeout(() => {
      setQueryOutput({
        ...activeQuery.resp,
        timestamp: new Date().toISOString(),
        live_qps: `${qps.toLocaleString()} req/s`,
        cluster_health: autoHeal ? 'AUTONOMOUS_OPTIMAL' : 'MANUAL_HEED',
      })
      setExecuting(false)
    }, 280)
  }

  return (
    <div className="relative pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          code="02"
          badge="LIVE_3D_CONSOLE"
          title="3D Autonomous Cluster Playground"
          subtitle="Interact with live cluster topology, test high-throughput packet stress, and execute real-time telemetry queries in your browser."
        />

        {/* 3D Simulation & Control Canvas */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-slate-800 bg-[#07090e] shadow-2xl relative">
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 bg-[#0a0d15] p-5 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-white">CLUSTER SIMULATION: ACTIVE</span>
              <span className="text-slate-500">·</span>
              <span className="text-cyan-400">NODES: 36 INSTANCES</span>
            </div>

            <div className="flex items-center gap-5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={autoHeal}
                  onChange={(e) => setAutoHeal(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-0"
                />
                <span>Auto-Healing Enabled</span>
              </label>

              <span className="rounded bg-slate-800/90 px-2.5 py-1 text-slate-400">
                DRAG 3D TO ROTATE
              </span>
            </div>
          </div>

          {/* 3D Canvas Viewport */}
          <div className="h-[440px] md:h-[500px] w-full bg-gradient-to-b from-[#090b12] to-[#040508]">
            <PlaygroundCluster3D qpsRate={qps} autoHeal={autoHeal} className="h-full w-full" />
          </div>

          {/* Bottom Stress Slider Bar */}
          <div className="border-t border-slate-800 bg-[#090c13] p-6">
            <div className="grid gap-6 md:grid-cols-12 items-center">
              <div className="md:col-span-8 space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="flex items-center gap-2 text-slate-300 font-semibold">
                    <Sliders size={14} className="text-cyan-400" />
                    <span>SIMULATED CLUSTER QPS TRAFFIC:</span>
                  </span>
                  <span className="font-bold text-cyan-400 text-sm">
                    {qps.toLocaleString()} requests / sec
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="100"
                  value={qps}
                  onChange={(e) => setQps(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-[#00F0FF]"
                />
                <div className="flex justify-between font-mono text-[10px] text-slate-500">
                  <span>200 req/s (Idle)</span>
                  <span>2,500 req/s (Standard Load)</span>
                  <span>5,000 req/s (Black Friday Peak)</span>
                </div>
              </div>

              <div className="md:col-span-4 flex justify-end gap-3 font-mono text-xs">
                <div className="rounded-xl border border-slate-800 bg-[#0c101a] p-3 text-right w-full">
                  <p className="text-[10px] text-slate-500">ESTIMATED CORE LATENCY</p>
                  <p className="text-lg font-bold text-emerald-400">
                    {qps > 4000 ? '0.34ms' : qps > 2000 ? '0.22ms' : '0.18ms'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Query Interactive Terminal */}
        <div className="mt-16 grid gap-8 lg:grid-cols-12">
          {/* Query Selector */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="font-sans text-lg font-bold text-white flex items-center gap-2">
              <Terminal size={18} className="text-cyan-400" />
              <span>Select Query Scenario</span>
            </h3>

            {QUERIES.map((item) => {
              const selected = activeQuery.id === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveQuery(item)
                    setQueryOutput(item.resp)
                  }}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    selected
                      ? 'border-cyan-500/50 bg-[#0f1422] text-white shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                      : 'border-slate-800 bg-[#0a0d14] text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{item.name}</span>
                    <span className="font-mono text-[10px] text-cyan-400">RUN_SAMPLE</span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-slate-500 truncate">{item.q}</p>
                </button>
              )
            })}

            <div className="pt-2">
              <GlowButton
                onClick={handleRunQuery}
                variant="primary"
                className="w-full justify-center"
              >
                {executing ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Executing Over Mesh...</span>
                  </>
                ) : (
                  <>
                    <Play size={15} fill="currentColor" />
                    <span>Execute Over Live Topology</span>
                  </>
                )}
              </GlowButton>
            </div>
          </div>

          {/* Terminal Console Output */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#07090e] p-6 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-slate-400 flex items-center gap-2">
                <Activity size={14} className="text-cyan-400" />
                <span>EXECUTION_CONSOLE // RESULT_STREAM</span>
              </span>
              <span className="rounded bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 text-emerald-400 font-bold">
                P99 0.18ms
              </span>
            </div>

            <div className="mt-4 overflow-x-auto text-emerald-300 leading-relaxed max-h-72">
              <pre>{JSON.stringify(queryOutput, null, 2)}</pre>
            </div>

            <div className="mt-4 border-t border-slate-800/80 pt-3 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle size={13} className="text-emerald-400" />
                <span>Zero Packet Loss Verified</span>
              </span>
              <button
                onClick={() => navigate('pricing')}
                className="text-cyan-400 hover:underline"
              >
                Deploy this cluster configuration [04] →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
