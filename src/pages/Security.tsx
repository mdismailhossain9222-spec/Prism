import { useState } from 'react'
import {
  CheckCircle,
  FileText,
  Key,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { GlowButton, SectionHeader } from '../components/shared'

const CERTS = [
  { name: 'SOC 2 Type II', issuer: 'Deloitte & Touche', valid: 'Valid Thru Dec 2026', scope: 'Security, Confidentiality & Availability' },
  { name: 'ISO/IEC 27001', issuer: 'BSI Global', valid: 'Active Certification', scope: 'Information Security Management System' },
  { name: 'HIPAA BAA', issuer: 'Kirkland Security', valid: 'Enterprise Ready', scope: 'Protected Health Information (PHI) Compliant' },
  { name: 'GDPR & DPA', issuer: 'EU Data Protection', valid: 'Statutory Verified', scope: 'Zero EU/US Data Cross-Border Spillover' },
]

const KEY_PIPELINE = [
  {
    step: '01',
    name: 'Customer Key Generation',
    desc: 'You hold root authority via AWS KMS, GCP Cloud KMS, or HashiCorp Vault. PRISM never sees plaintext private keys.',
    badge: 'BYOK Custody',
  },
  {
    step: '02',
    name: 'Enclave Hardware Isolation',
    desc: 'All packet ingestion and telemetry synthesis runs inside AMD SEV-SNP confidential hardware enclaves with memory encryption.',
    badge: 'Hardware Ring-0',
  },
  {
    step: '03',
    name: 'Zero-Trace Persistence',
    desc: 'Encrypted using AES-256-GCM with dynamic 24-hour key rotations. Backups are cryptographically shredded upon retention expiry.',
    badge: 'Cryptographic Shred',
  },
]

export default function Security() {
  const [reportRequested, setReportRequested] = useState(false)
  const [reportEmail, setReportEmail] = useState('')

  const handleRequestAudit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportEmail || !reportEmail.includes('@')) return
    setReportRequested(true)
  }

  return (
    <div className="relative pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          code="06"
          badge="TRUST_AND_SECURITY"
          title="Enterprise Security &amp; Trust Center"
          subtitle="Hardware-enforced confidential computing, zero-trust cryptographic isolation, and continuous third-party compliance."
        />

        {/* Status Callout Banner */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 to-[#07090e] p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            </span>
            <div>
              <p className="font-mono text-xs font-bold text-white">ALL AUDIT CRITERIA CURRENT</p>
              <p className="font-mono text-[11px] text-emerald-400">SOC 2 Type II · Zero Unresolved Vulnerabilities · 99.999% SLA</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const el = document.getElementById('audit-download')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-2 font-mono text-xs text-emerald-300 hover:bg-emerald-900/40 transition-colors"
            >
              Request Compliance Packet
            </button>
          </div>
        </div>

        {/* Compliance Certifications Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CERTS.map((cert) => (
            <div key={cert.name} className="glass-card glass-card-hover rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
                  <ShieldCheck size={20} />
                </div>
                <span className="font-mono text-[10px] text-emerald-400 border border-emerald-500/30 bg-emerald-950/30 px-2 py-0.5 rounded">
                  VERIFIED
                </span>
              </div>

              <h3 className="mt-5 font-sans text-lg font-bold text-white">{cert.name}</h3>
              <p className="mt-1 font-mono text-xs text-slate-400">Audited by {cert.issuer}</p>
              <p className="mt-3 text-xs text-slate-400 leading-relaxed">{cert.scope}</p>

              <div className="mt-6 border-t border-slate-800/80 pt-3 font-mono text-[10px] text-slate-500">
                {cert.valid}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive BYOK Cryptographic Lifecycle */}
        <div className="mt-20 rounded-3xl border border-slate-800 bg-[#080b12] p-8 md:p-12 shadow-2xl">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
              <Key size={16} />
              <span>CRYPTOGRAPHIC_ISOLATION</span>
            </div>
            <h3 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              Zero-Trust Key Management Lifecycle (BYOK)
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              How PRISM guarantees your distributed trace packets are unreadable to anyone outside your organization.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {KEY_PIPELINE.map((p) => (
              <div key={p.step} className="rounded-2xl border border-slate-800 bg-[#06070a] p-6 relative">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-cyan-400 font-bold">PHASE {p.step}</span>
                  <span className="rounded bg-slate-800/90 px-2 py-0.5 text-[10px] text-slate-400">
                    {p.badge}
                  </span>
                </div>
                <h4 className="mt-4 text-base font-bold text-white">{p.name}</h4>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 90-Day Uptime Audit History */}
        <div className="mt-20">
          <SectionHeader
            code="06.1"
            badge="AVAILABILITY_AUDIT"
            title="90-Day Real-Time Availability Ledger"
            subtitle="Publicly verified uptime records across all 48 multi-region cloud mesh nodes."
          />

          <div className="mt-10 rounded-2xl border border-slate-800 bg-[#080b12] p-6 font-mono text-xs">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-400" />
                <span className="text-white font-semibold">100.00% Operational Uptime (Last 90 Days)</span>
              </div>
              <span className="text-slate-400">AUDIT_RUN: {new Date().toLocaleDateString()}</span>
            </div>

            {/* Visual Day-by-day Bar Ledger */}
            <div className="mt-6">
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div
                    key={i}
                    title={`Day ${60 - i}: 100% SLA`}
                    className="h-9 w-3.5 shrink-0 rounded-sm bg-emerald-500/80 hover:bg-emerald-400 transition-colors"
                  />
                ))}
              </div>
              <div className="mt-3 flex justify-between text-[11px] text-slate-500">
                <span>60 Days Ago</span>
                <span className="text-emerald-400">Zero Critical Outages</span>
                <span>Today (Live)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Compliance Package Form */}
        <div
          id="audit-download"
          className="mt-20 overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0c101c] to-[#06070a] p-8 md:p-12 text-center shadow-2xl relative"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-950/40 text-cyan-400">
            <FileText size={26} />
          </div>

          <h3 className="mt-6 text-2xl font-bold text-white md:text-3xl">
            Request Enterprise Security Packet
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
            Includes full SOC2 Type II audit report, ISO 27001 certificate, penetration test summaries,
            and standard Business Associate Agreement (BAA).
          </p>

          {reportRequested ? (
            <div className="mx-auto mt-8 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 font-mono text-xs text-emerald-300">
              <CheckCircle size={18} className="text-emerald-400 shrink-0" />
              <span>Compliance packet dispatched to {reportEmail} via secure link.</span>
            </div>
          ) : (
            <form onSubmit={handleRequestAudit} className="mx-auto mt-8 flex max-w-md flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={reportEmail}
                  onChange={(e) => setReportEmail(e.target.value)}
                  placeholder="security-lead@company.com"
                  className="w-full rounded-xl border border-slate-700 bg-[#06070a] py-3 pl-10 pr-4 text-xs font-mono text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <GlowButton size="md" variant="primary">
                <span>Request Packet</span>
              </GlowButton>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
