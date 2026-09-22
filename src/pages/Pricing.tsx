import { useState } from 'react'
import {
  Check,
  ChevronDown,
  Sliders,
} from 'lucide-react'
import { GlowButton, SectionHeader } from '../components/shared'
import { useRouter } from '../router'

const FAQS = [
  {
    q: 'How does PRISM count ingestion events?',
    a: 'An event is defined as any single distributed trace span, eBPF socket lifecycle metric, or structured log packet ingested by our kernel ring buffers. Heartbeats and health probes are always free.',
  },
  {
    q: 'What happens if our cluster spikes beyond our plan?',
    a: 'PRISM never drops mission-critical data. If you exceed your event allocation, our cluster automatically switches to dynamic burst pricing ($0.000002 per event) without service throttling or dropped spans.',
  },
  {
    q: 'Can we hold our own encryption keys (BYOK)?',
    a: 'Yes. Enterprise plans include full Customer-Managed Key (BYOK) custody via AWS KMS, Google Cloud KMS, or HashiCorp Vault. Data is encrypted before leaving your memory enclave.',
  },
  {
    q: 'Is there a free trial for the Scale tier?',
    a: 'Every new account starts with 14 days of unrestricted Scale access and 50,000,000 free events. No credit card is required to explore or run live playground tests.',
  },
]

export default function Pricing() {
  const { navigate } = useRouter()
  const [annual, setAnnual] = useState(true)
  const [eventsM, setEventsM] = useState(25) // in millions
  const [clusters, setClusters] = useState(4)
  const [retentionDays, setRetentionDays] = useState(30)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Real-time calculation formula
  const baseRate = 99
  const eventsCost = Math.max(0, (eventsM - 10) * 8.5)
  const clusterCost = (clusters - 1) * 35
  const retentionMultiplier = retentionDays > 60 ? 1.4 : retentionDays > 14 ? 1.15 : 1.0

  const calculatedMonthly = Math.round((baseRate + eventsCost + clusterCost) * retentionMultiplier)
  const finalPrice = annual ? Math.round(calculatedMonthly * 0.8) : calculatedMonthly

  return (
    <div className="relative pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          code="04"
          badge="PREDICTABLE_CONSUMPTION"
          title="Transparent, Sub-Millisecond Cloud Pricing"
          subtitle="Zero hidden ingress fees, zero penalty for bursting, and 100% trace fidelity across all plans."
        />

        {/* Billing Cadence Toggle */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className={`font-mono text-xs ${!annual ? 'text-white font-bold' : 'text-slate-500'}`}>
            MONTHLY
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative h-7 w-14 rounded-full border border-slate-700 bg-slate-900 p-1 transition-colors hover:border-cyan-500/50"
            aria-label="Toggle annual billing discount"
          >
            <div
              className={`h-5 w-5 rounded-full bg-cyan-400 transition-transform ${
                annual ? 'translate-x-7 shadow-[0_0_12px_#00F0FF]' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`flex items-center gap-2 font-mono text-xs ${annual ? 'text-white font-bold' : 'text-slate-500'}`}>
            <span>ANNUAL BILLING</span>
            <span className="rounded-full bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 text-[10px] text-emerald-400 font-semibold">
              SAVE 20%
            </span>
          </span>
        </div>

        {/* 3 Tier Cards */}
        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {/* Tier 1: Developer */}
          <div className="glass-card flex flex-col justify-between rounded-3xl p-8 relative">
            <div>
              <span className="font-mono text-xs text-slate-500">TIER_01 // DEV</span>
              <h3 className="mt-2 text-2xl font-bold text-white">Developer</h3>
              <p className="mt-2 text-xs text-slate-400">
                For individual engineers, side projects, and local development clusters.
              </p>

              <div className="my-6">
                <span className="font-sans text-4xl font-extrabold text-white">$0</span>
                <span className="text-xs text-slate-500"> / month forever</span>
              </div>

              <div className="space-y-3 border-t border-slate-800/80 pt-6 text-xs text-slate-300">
                {[
                  '10,000,000 Events / month',
                  '1 Active Autonomous Cluster',
                  '7-Day Trace & Metrics Retention',
                  'Sub-millisecond Local eBPF Hooking',
                  'Community Discord Support',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5">
                    <Check size={14} className="text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/60">
              <GlowButton
                variant="outline"
                size="md"
                className="w-full justify-center"
                onClick={() => navigate('console')}
              >
                Start Free with Developer [07]
              </GlowButton>
            </div>
          </div>

          {/* Tier 2: Scale (Highlighted) */}
          <div className="rounded-3xl border-2 border-cyan-500/50 bg-[#090d18] p-8 shadow-[0_0_50px_rgba(0,240,255,0.2)] flex flex-col justify-between relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-cyan-400 bg-cyan-400 px-3 py-0.5 font-mono text-[10px] font-bold text-black uppercase tracking-wider">
              MOST POPULAR FOR TEAMS
            </div>

            <div>
              <span className="font-mono text-xs text-cyan-400">TIER_02 // SCALE</span>
              <h3 className="mt-2 text-2xl font-bold text-white">Scale Growth</h3>
              <p className="mt-2 text-xs text-slate-400">
                For fast-growing engineering teams requiring zero packet loss &amp; high availability.
              </p>

              <div className="my-6 flex items-baseline gap-1">
                <span className="font-sans text-4xl font-extrabold text-white">
                  ${annual ? '199' : '249'}
                </span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>

              <div className="space-y-3 border-t border-slate-800/80 pt-6 text-xs text-slate-200">
                {[
                  '100,000,000 Events / month included',
                  'Up to 8 Multi-Region Clusters',
                  '30-Day High-Resolution Retention',
                  'Autonomous Self-Healing Failover',
                  'AI Agent Swarm & LLM Tracing',
                  '99.999% Availability SLA Guarantee',
                  'Priority Engineering Slack Channel',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5">
                    <Check size={14} className="text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/60">
              <GlowButton
                variant="primary"
                size="md"
                className="w-full justify-center"
                onClick={() => navigate('console')}
              >
                Deploy Scale Cluster [07]
              </GlowButton>
            </div>
          </div>

          {/* Tier 3: Enterprise */}
          <div className="glass-card flex flex-col justify-between rounded-3xl p-8 relative">
            <div>
              <span className="font-mono text-xs text-purple-400">TIER_03 // HYPERSCALE</span>
              <h3 className="mt-2 text-2xl font-bold text-white">Enterprise Mesh</h3>
              <p className="mt-2 text-xs text-slate-400">
                For global enterprises, high-frequency trading desks, and regulated healthcare.
              </p>

              <div className="my-6">
                <span className="font-sans text-4xl font-extrabold text-white">Custom</span>
                <span className="text-xs text-slate-500"> / bespoke SLA</span>
              </div>

              <div className="space-y-3 border-t border-slate-800/80 pt-6 text-xs text-slate-300">
                {[
                  'Bespoke Multi-Billion Event Quotas',
                  'Unlimited Global Anycast Clusters',
                  'Customer-Managed Keys (BYOK)',
                  'Hardware Enclave Air-Gap Isolation',
                  'Dedicated Technical Account Manager',
                  'Custom On-Prem or VPC Deployment',
                  '15-Minute Guaranteed Response SLA',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5">
                    <Check size={14} className="text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/60">
              <GlowButton
                variant="secondary"
                size="md"
                className="w-full justify-center"
                onClick={() => navigate('security')}
              >
                Request Enterprise Audit [06]
              </GlowButton>
            </div>
          </div>
        </div>

        {/* Interactive Volume Calculator */}
        <div className="mt-24 rounded-3xl border border-slate-800 bg-[#080b12] p-8 md:p-12 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                <Sliders size={16} />
                <span>DYNAMIC COST ESTIMATOR</span>
              </div>
              <h3 className="mt-1 text-2xl font-bold text-white md:text-3xl">
                Interactive Volume &amp; Retention Calculator
              </h3>
            </div>

            <div className="rounded-2xl border border-cyan-500/40 bg-cyan-950/30 p-4 text-right">
              <p className="font-mono text-xs text-slate-400">ESTIMATED INVOICE</p>
              <p className="font-sans text-3xl font-extrabold text-cyan-400">
                ${finalPrice}
                <span className="text-xs font-normal text-slate-400"> / month</span>
              </p>
              {annual && (
                <p className="font-mono text-[10px] text-emerald-400 mt-0.5">
                  Reflects 20% Annual Contract Discount
                </p>
              )}
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            {/* Slider 1: Events */}
            <div className="space-y-3">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-400">MONTHLY EVENT LOAD:</span>
                <span className="font-bold text-white">{eventsM}M events</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={eventsM}
                onChange={(e) => setEventsM(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-[#00F0FF]"
              />
              <p className="text-[11px] text-slate-500">Sub-microsecond kernel ingestion</p>
            </div>

            {/* Slider 2: Clusters */}
            <div className="space-y-3">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-400">ACTIVE REGION CLUSTERS:</span>
                <span className="font-bold text-white">{clusters} clusters</span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                step="1"
                value={clusters}
                onChange={(e) => setClusters(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-[#00F0FF]"
              />
              <p className="text-[11px] text-slate-500">Autonomous multi-region mesh</p>
            </div>

            {/* Slider 3: Retention */}
            <div className="space-y-3">
              <div className="flex justify-between font-mono text-xs">
                <span className="text-slate-400">ANALYTICS RETENTION:</span>
                <span className="font-bold text-white">{retentionDays} days</span>
              </div>
              <input
                type="range"
                min="7"
                max="90"
                step="7"
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-[#00F0FF]"
              />
              <p className="text-[11px] text-slate-500">Zero-copy NVMe time-series storage</p>
            </div>
          </div>
        </div>

        {/* Pricing FAQs */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="font-sans text-2xl font-bold text-white md:text-3xl">
              Frequently Asked Questions
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Clear answers regarding event metering, SLAs, and data retention.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-slate-800 bg-[#090c13] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left font-sans text-sm font-semibold text-white hover:text-cyan-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-800/80 p-6 pt-4 text-xs text-slate-300 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
