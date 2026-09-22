import { useState } from 'react'
import {
  BookOpen,
  Code2,
  Terminal,
} from 'lucide-react'
import { GlowButton, SectionHeader, TerminalWindow } from '../components/shared'
import { useRouter } from '../router'

const LANG_SNIPPETS = {
  typescript: {
    title: 'client.ts — @prism/sdk',
    code: `import { PrismClient } from '@prism/sdk';

const prism = new PrismClient({
  apiKey: process.env.PRISM_API_KEY,
  cluster: 'us-east-alpha',
  mode: 'autonomous'
});

// Instrument high-throughput async workload
await prism.trace('order-processing-v2', async (span) => {
  span.setAttribute('order.amount_usd', 450.00);
  span.setAttribute('customer.tier', 'enterprise');
  
  const result = await processPayment();
  return result;
});`,
  },
  python: {
    title: 'tracer.py — prism-telemetry',
    code: `from prism import PrismAgent

agent = PrismAgent(
    api_key="pr_live_9f8402...",
    auto_heal=True,
    p99_threshold_ms=1.5
)

# Zero-overhead context manager
with agent.span("neural-agent-dispatch", tags={"model": "gpt-4o"}) as s:
    embeddings = compute_embeddings(prompt)
    s.log_event("embeddings_ready", dimensions=len(embeddings))`,
  },
  curl: {
    title: 'REST API Ingestion endpoint',
    code: `curl -X POST https://api.prism.io/v2/telemetry/ingest \\
  -H "Authorization: Bearer pr_live_9f8402..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "cluster_id": "us-east-prod",
    "timestamp_ns": 1718049281900000000,
    "spans": [
      {
        "trace_id": "0x4a9f82bc",
        "duration_us": 182,
        "service": "auth-gateway",
        "status": "OK"
      }
    ]
  }'`,
  },
  go: {
    title: 'main.go — github.com/prism-io/prism-go',
    code: `package main

import (
    "context"
    "github.com/prism-io/prism-go/tracer"
)

func main() {
    client, _ := tracer.New(tracer.Config{
        Cluster: "eu-central-1",
        ZeroCopy: true,
    })
    defer client.Close()

    ctx, span := client.Start(context.Background(), "kafka-consumer-hotpath")
    defer span.End()
}`,
  },
}

const ENDPOINTS = [
  { method: 'POST', path: '/v2/telemetry/ingest', desc: 'Direct kernel ring buffer stream ingestion' },
  { method: 'GET', path: '/v2/clusters/health', desc: 'Query consensus state and node partition status' },
  { method: 'POST', path: '/v2/neural/trace-dag', desc: 'Reconstruct causal DAG for AI swarm reasoning loops' },
  { method: 'DELETE', path: '/v2/clusters/{id}/nodes', desc: 'Gracefully isolate and drain degraded instances' },
]

export default function Docs() {
  const { navigate } = useRouter()
  const [lang, setLang] = useState<'typescript' | 'python' | 'curl' | 'go'>('typescript')

  return (
    <div className="relative pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          code="05"
          badge="DEVELOPER_ECOSYSTEM"
          title="Engineered for Developers"
          subtitle="Explore our first-party SDKs, OpenAPI specifications, and sub-millisecond REST/gRPC endpoints."
        />

        {/* Multi-language Interactive Playground */}
        <div className="mt-14 overflow-hidden rounded-3xl border border-slate-800 bg-[#090c13] shadow-2xl">
          {/* Header & Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 bg-[#0c101a] p-4">
            <div className="flex items-center gap-2">
              {(['typescript', 'python', 'curl', 'go'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-xl px-4 py-2 font-mono text-xs font-semibold uppercase transition-colors ${
                    lang === l
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div className="font-mono text-xs text-slate-500">
              OPENAPI 3.1 &amp; PROTOBUF SPEC COMPATIBLE
            </div>
          </div>

          <div className="p-6">
            <TerminalWindow
              title={LANG_SNIPPETS[lang].title}
              code={LANG_SNIPPETS[lang].code}
              badge={`lang: ${lang}`}
            />
          </div>
        </div>

        {/* Core Endpoints Grid */}
        <div className="mt-20">
          <SectionHeader
            code="05.1"
            badge="API_ENDPOINTS"
            title="Core REST &amp; gRPC Endpoints"
            subtitle="Deterministic sub-millisecond endpoints backed by Anycast edge routing."
          />

          <div className="mt-10 space-y-3 font-mono text-xs">
            {ENDPOINTS.map((ep) => (
              <div
                key={ep.path}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800/80 bg-[#07090e] p-5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-lg px-2.5 py-1 font-bold ${
                      ep.method === 'POST'
                        ? 'bg-cyan-950/60 border border-cyan-500/30 text-cyan-400'
                        : ep.method === 'GET'
                        ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-950/60 border border-rose-500/30 text-rose-400'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="text-white font-semibold text-sm">{ep.path}</span>
                </div>
                <span className="text-slate-400 font-sans text-xs">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quickstart Callout Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/30 text-cyan-400">
              <BookOpen size={18} />
            </div>
            <h3 className="mt-4 font-sans text-base font-bold text-white">Full Guides &amp; Tutorials</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Step-by-step guides for instrumenting Next.js, Kubernetes clusters, LangChain
              agent swarms, and FastAPI backends.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-950/30 text-purple-400">
              <Code2 size={18} />
            </div>
            <h3 className="mt-4 font-sans text-base font-bold text-white">OpenTelemetry Exporter</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Drop-in exporter plugin for existing OTel SDKs. Route your existing traces into
              PRISM without changing a line of business logic.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-400">
              <Terminal size={18} />
            </div>
            <h3 className="mt-4 font-sans text-base font-bold text-white">Interactive CLI Tool</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Run <code className="text-cyan-400">prism cluster tail</code> to stream live
              sub-millisecond spans right in your shell.
            </p>
          </div>
        </div>

        {/* Action Link to Console */}
        <div className="mt-14 flex items-center justify-center gap-4">
          <GlowButton onClick={() => navigate('console')}>
            <span>Generate Production API Keys in Console [07]</span>
          </GlowButton>
        </div>
      </div>
    </div>
  )
}
