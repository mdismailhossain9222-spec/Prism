import { useState } from 'react'
import {
  Check,
  Cpu,
  Globe2,
  HardDrive,
  Network,
  Radio,
} from 'lucide-react'
import { GlowButton, SectionHeader } from '../components/shared'
import { useRouter } from '../router'

const REGIONS = [
  { id: 'us-east', name: 'US-East (N. Virginia)', code: 'iad1', ping: '2.1ms', status: 'Optimal', throughput: '4.8M QPS' },
  { id: 'us-west', name: 'US-West (Oregon)', code: 'pdx1', ping: '11.4ms', status: 'Optimal', throughput: '3.2M QPS' },
  { id: 'eu-central', name: 'EU-Central (Frankfurt)', code: 'fra1', ping: '14.2ms', status: 'Optimal', throughput: '4.1M QPS' },
  { id: 'ap-northeast', name: 'AP-Northeast (Tokyo)', code: 'nrt1', ping: '18.9ms', status: 'Optimal', throughput: '3.9M QPS' },
  { id: 'sa-east', name: 'SA-East (São Paulo)', code: 'gru1', ping: '26.4ms', status: 'Optimal', throughput: '1.8M QPS' },
  { id: 'ap-southeast', name: 'AP-Southeast (Sydney)', code: 'syd1', ping: '29.8ms', status: 'Optimal', throughput: '2.1M QPS' },
]

const COMPARISON = [
  {
    feature: 'eBPF Zero-Copy Kernel Hooking',
    prism: 'Sub-microsecond (< 0.02% CPU)',
    legacy: 'User-space agents (2.5% - 5% CPU)',
    otel: 'Varies with wrapper (1% - 3%)',
  },
  {
    feature: 'Trace Sampling Coverage',
    prism: '100% Deterministic (Zero Drop)',
    legacy: 'Head/Tail Sampling (1% - 10%)',
    otel: 'Probabilistic Sampling',
  },
  {
    feature: 'AI Agent Swarm & Tool Call Tracing',
    prism: 'Native Causal DAG Reconstruction',
    legacy: 'Uncorrelated HTTP Span Sprawl',
    otel: 'Manual Custom Attributes',
  },
  {
    feature: 'Self-Healing Automated Mitigation',
    prism: '< 15ms Autonomous Anycast Failover',
    legacy: 'Alert notification only (Human Pager)',
    otel: 'None (Collection Only)',
  },
  {
    feature: 'Data Encryption & BYOK Custody',
    prism: 'Hardware Enclaves + Customer KMS',
    legacy: 'Shared Cloud Storage Pool',
    otel: 'Self-Hosted Burden',
  },
]

export default function Architecture() {
  const { navigate } = useRouter()
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0])
  const [testingPing, setTestingPing] = useState(false)
  const [pingResult, setPingResult] = useState<string | null>(null)

  const handleTestPing = (reg: typeof REGIONS[0]) => {
    setSelectedRegion(reg)
    setTestingPing(true)
    setPingResult(null)
    setTimeout(() => {
      setPingResult(reg.ping)
      setTestingPing(false)
    }, 220)
  }

  return (
    <div className="relative pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          code="03"
          badge="KERNEL_SPECIFICATIONS"
          title="Zero-Copy Autonomous Architecture"
          subtitle="How PRISM processes 100M+ events per minute with near-zero CPU footprint and deterministic global consensus."
        />

        {/* Global Anycast Mesh & PoP Explorer */}
        <div className="mt-16 rounded-3xl border border-slate-800 bg-[#090c13] p-8 md:p-12 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                <Globe2 size={16} />
                <span>GLOBAL BGP ANYCAST TOPOLOGY</span>
              </div>
              <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">
                48 Edge Mesh Availability Zones
              </h3>
            </div>
            <div className="rounded-xl border border-slate-800 bg-[#0c101a] px-4 py-2 font-mono text-xs text-slate-400">
              AVERAGE GLOBAL RTT: <span className="font-bold text-emerald-400">12.4ms</span>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-12 items-center">
            {/* Region List */}
            <div className="lg:col-span-5 space-y-2">
              <p className="font-mono text-xs text-slate-500 mb-2">SELECT EDGE ACCELERATOR POP:</p>
              {REGIONS.map((reg) => {
                const isSelected = selectedRegion.id === reg.id
                return (
                  <button
                    key={reg.id}
                    onClick={() => handleTestPing(reg)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 font-mono text-xs transition-all ${
                      isSelected
                        ? 'border-cyan-500/50 bg-[#0f1422] text-white shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                        : 'border-slate-800/80 bg-[#06070a] text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Radio size={14} className={isSelected ? 'text-cyan-400' : 'text-slate-600'} />
                      <span className="font-semibold text-white">{reg.name}</span>
                    </div>
                    <span className="text-emerald-400 font-bold">{reg.ping}</span>
                  </button>
                )
              })}
            </div>

            {/* Selected Region Telemetry Diagnostic */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#06070a] p-6 md:p-8 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-slate-400">ZONE_DESCRIPTOR: {selectedRegion.code}</span>
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{selectedRegion.status}</span>
                </span>
              </div>

              <div className="my-6 space-y-4">
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-500">REGION NAME:</span>
                  <span className="font-bold text-white">{selectedRegion.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-500">LIVE MEASURED P99 PING:</span>
                  <span className="font-bold text-cyan-400 text-sm">
                    {testingPing ? 'MEASURING RTT...' : pingResult || selectedRegion.ping}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-500">ZONE INGESTION THROUGHPUT:</span>
                  <span className="text-white">{selectedRegion.throughput}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-500">FAILOVER PROTOCOL:</span>
                  <span className="text-emerald-400">BGP Auto-Divert (&lt; 8ms)</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-[10px] text-slate-500">ENCRYPTION: TLS 1.3 + ChaCha20-Poly1305</span>
                <button
                  onClick={() => handleTestPing(selectedRegion)}
                  className="rounded-lg bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 text-cyan-400 hover:bg-cyan-500/20"
                >
                  Re-Verify Packet Latency
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Architectural Pillars */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="glass-card rounded-2xl p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
              <Cpu size={22} />
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">eBPF Kernel Ring Buffers</h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              By running directly in Linux kernel space, PRISM traces socket lifecycles, TCP
              retransmissions, and gRPC payload sizes without expensive context switches or user-space locks.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/40 text-purple-400">
              <Network size={22} />
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">Vectorized Stream Ingestion</h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Time-series metrics and span trees are columnar-compressed in L3 CPU cache. Query execution
              runs AVX-512 vector instructions for multi-gigabyte aggregation in sub-milliseconds.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
              <HardDrive size={22} />
            </div>
            <h3 className="mt-5 text-xl font-bold text-white">Zero-Copy Memory Journaling</h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-400">
              Data packets pass from network interface cards directly to consensus ring buffers using DMA.
              Zero intermediate memory copies guarantees sustained throughput during heavy traffic bursts.
            </p>
          </div>
        </div>

        {/* Competitive Benchmark Matrix */}
        <div className="mt-20">
          <SectionHeader
            code="03.1"
            badge="BENCHMARK_MATRIX"
            title="PRISM vs Traditional Telemetry"
            subtitle="Verified architectural comparison across overhead, sampling fidelity, and autonomous mitigation."
          />

          <div className="mt-12 overflow-x-auto rounded-3xl border border-slate-800 bg-[#090c13] shadow-2xl">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0c101a] font-mono text-[11px] uppercase text-slate-400">
                  <th className="p-5">Architectural Capability</th>
                  <th className="p-5 text-cyan-400 font-bold">PRISM Engine</th>
                  <th className="p-5 text-slate-400">Legacy APMs</th>
                  <th className="p-5 text-slate-400">Standard OpenTelemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-5 font-semibold text-white">{row.feature}</td>
                    <td className="p-5 font-mono font-bold text-emerald-400 flex items-center gap-2">
                      <Check size={14} className="text-cyan-400" />
                      <span>{row.prism}</span>
                    </td>
                    <td className="p-5 font-mono text-slate-400">{row.legacy}</td>
                    <td className="p-5 font-mono text-slate-400">{row.otel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 flex justify-center">
            <GlowButton size="lg" onClick={() => navigate('pricing')}>
              <span>Deploy Production Cluster [04]</span>
            </GlowButton>
          </div>
        </div>
      </div>
    </div>
  )
}
