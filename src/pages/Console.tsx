import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Key,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Plus,
  Server,
  Shield,
  Trash2,
  User as UserIcon,
} from 'lucide-react'
import { AuthError, DEMO_EMAIL, DEMO_PASSWORD, useAuth } from '../auth'
import { GlowButton, SectionHeader } from '../components/shared'

function getStrength(p: string) {
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++
  if (/\d/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
}

type ApiKey = { id: string; name: string; key: string; created: string }

export default function Console() {
  const { user, login, register, logout, backend } = useAuth()
  const [mode, setMode] = useState<'signin' | 'join'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<{ msg: string; retry?: number } | null>(null)
  const [countdown, setCountdown] = useState(0)

  // Dashboard state for authenticated user
  const [activeCluster, setActiveCluster] = useState('us-east-alpha')
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: 'k1', name: 'Production Backend (Primary)', key: 'pr_live_9f82bc7102e84129', created: '2026-02-14' },
    { id: 'k2', name: 'Staging Next.js App', key: 'pr_test_418ab88901f4c718', created: '2026-03-01' },
  ])
  const [newKeyName, setNewKeyName] = useState('')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Countdown lockout ticker
  useEffect(() => {
    if (!error?.retry) return
    setCountdown(error.retry)
    const id = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(id)
          setError(null)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [error])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      if (mode === 'signin') {
        await login(email, password)
      } else {
        await register(name, email, password)
      }
    } catch (err) {
      if (err instanceof AuthError) {
        setError({ msg: err.message, retry: err.retryAfter })
      } else {
        setError({ msg: 'Authentication failed. Please verify credentials.' })
      }
    } finally {
      setBusy(false)
    }
  }

  const handleCreateKey = () => {
    if (!newKeyName.trim()) return
    const newK: ApiKey = {
      id: `k-${Date.now()}`,
      name: newKeyName.trim(),
      key: `pr_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 8)}`,
      created: new Date().toISOString().split('T')[0],
    }
    setApiKeys([newK, ...apiKeys])
    setNewKeyName('')
  }

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id))
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  /* ------------------------------------------------------------- */
  /* SIGNED IN: Real-time Cloud Management Dashboard               */
  /* ------------------------------------------------------------- */
  if (user) {
    return (
      <div className="relative pt-28 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          {/* Dashboard Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-8">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>ACTIVE_CLUSTER_CONSOLE // SESSION_SECURE</span>
              </div>
              <h1 className="mt-2 text-3xl font-extrabold text-white md:text-4xl">
                Welcome back, {user.name}
              </h1>
              <p className="mt-1 font-mono text-xs text-slate-400">
                Account Authority: {user.email} · Tier: Enterprise Mesh (BYOK)
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-800 bg-[#090c13] px-4 py-2 font-mono text-xs text-slate-400">
                STATUS: <span className="text-emerald-400 font-bold">HEALTHY (0.18ms)</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-rose-950/20 px-4 py-2 font-mono text-xs text-rose-300 hover:bg-rose-900/30 transition-colors"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Top Live Cluster Telemetry Metrics */}
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 font-mono text-xs">
            <div className="glass-card rounded-2xl p-5">
              <span className="text-slate-500">INGESTION VOLUME (LIVE)</span>
              <p className="mt-2 text-2xl font-bold text-cyan-400 font-sans">1.48M QPS</p>
              <p className="mt-1 text-[11px] text-emerald-400">↑ 14% vs previous hour</p>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <span className="text-slate-500">P99 GLOBAL JITTER</span>
              <p className="mt-2 text-2xl font-bold text-white font-sans">0.19 ms</p>
              <p className="mt-1 text-[11px] text-slate-400">Zero packet drop detected</p>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <span className="text-slate-500">ACTIVE POD MESH</span>
              <p className="mt-2 text-2xl font-bold text-white font-sans">48 Nodes</p>
              <p className="mt-1 text-[11px] text-emerald-400">100% Consensus quorum</p>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <span className="text-slate-500">RETAINED SPANS</span>
              <p className="mt-2 text-2xl font-bold text-purple-400 font-sans">48.2B</p>
              <p className="mt-1 text-[11px] text-slate-400">AES-256 encrypted at-rest</p>
            </div>
          </div>

          {/* Cluster Switcher & Health */}
          <div className="mt-10 rounded-3xl border border-slate-800 bg-[#080b12] p-6 md:p-8 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Server size={18} className="text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Cluster Region Mesh</h3>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                {['us-east-alpha', 'eu-frankfurt-1', 'ap-tokyo-2'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCluster(c)}
                    className={`rounded-lg px-3 py-1.5 transition-colors ${
                      activeCluster === c
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-400 hover:text-white bg-slate-900/60'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-3 font-mono text-xs">
              <div className="rounded-xl border border-slate-800/80 bg-[#06070a] p-4 space-y-2">
                <span className="text-slate-500">AUTONOMOUS FAILOVER:</span>
                <p className="text-emerald-400 font-semibold flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>HOT_STANDBY_ARMED (&lt; 15ms)</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-[#06070a] p-4 space-y-2">
                <span className="text-slate-500">KERNEL BUFFER STATE:</span>
                <p className="text-cyan-400 font-semibold flex items-center gap-2">
                  <Activity size={14} />
                  <span>RING_BUFFER_OPTIMAL (14% cap)</span>
                </p>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-[#06070a] p-4 space-y-2">
                <span className="text-slate-500">SECURITY PROTOCOL:</span>
                <p className="text-purple-400 font-semibold flex items-center gap-2">
                  <Shield size={14} />
                  <span>SEV-SNP HARDWARE ENCLAVE</span>
                </p>
              </div>
            </div>
          </div>

          {/* API Keys Management Section */}
          <div className="mt-10 rounded-3xl border border-slate-800 bg-[#080b12] p-6 md:p-8 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Key size={18} className="text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">Cluster API Ingestion Keys</h3>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Use these keys in your code or OpenTelemetry collector to authenticate streams.
                </p>
              </div>

              {/* Create Key Form */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Key name (e.g. Worker US-East)"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="rounded-xl border border-slate-700 bg-[#06070a] px-3.5 py-1.5 font-mono text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
                <button
                  onClick={handleCreateKey}
                  className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-3.5 py-1.5 font-mono text-xs text-cyan-300 hover:bg-cyan-900/40 transition-colors"
                >
                  <Plus size={14} />
                  <span>Generate Key</span>
                </button>
              </div>
            </div>

            {/* Keys Table */}
            <div className="mt-6 space-y-3 font-mono text-xs">
              {apiKeys.map((k) => (
                <div
                  key={k.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-[#06070a] p-4"
                >
                  <div>
                    <p className="font-semibold text-white">{k.name}</p>
                    <p className="mt-1 text-cyan-400 text-xs">{k.key}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-500">Created: {k.created}</span>
                    <button
                      onClick={() => handleCopyKey(k.key)}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white"
                      title="Copy Key"
                    >
                      {copiedKey === k.key ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedKey === k.key ? 'COPIED' : 'COPY'}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteKey(k.id)}
                      className="rounded-lg border border-slate-800 p-1.5 text-slate-500 hover:border-rose-900 hover:text-rose-400"
                      title="Revoke Key"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ------------------------------------------------------------- */
  /* SIGNED OUT: Security Gated Customer Login / Registration      */
  /* ------------------------------------------------------------- */
  const strengthScore = getStrength(password)
  const strengthLabels = ['Weak', 'Moderate', 'Good', 'Strong', 'Zero-Trust Secure']

  return (
    <div className="relative pt-28 pb-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          code="07"
          badge="SECURITY_GATEWAY"
          title="Cluster Management Console"
          subtitle="Authenticate to your autonomous telemetry mesh. Hardware-enforced sessions and brute-force protected."
        />

        <div className="mt-14 mx-auto max-w-xl">
          {/* Security Credentials Demo Callout Card */}
          <div className="mb-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 font-mono text-xs text-slate-300 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
              <Shield size={15} />
              <span>TEST CREDENTIALS (CLICK TO PREFILL)</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-slate-400">
                EMAIL: <code className="text-white">{DEMO_EMAIL}</code> · PASS: <code className="text-white">{DEMO_PASSWORD}</code>
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmail(DEMO_EMAIL)
                  setPassword(DEMO_PASSWORD)
                }}
                className="rounded-lg border border-cyan-500/40 bg-cyan-950/50 px-2.5 py-1 text-cyan-300 hover:bg-cyan-900/40"
              >
                Auto-fill
              </button>
            </div>
          </div>

          {/* Login Card */}
          <div className="glass-card rounded-3xl border border-slate-800 p-8 md:p-10 shadow-2xl relative">
            <div className="mb-8 grid grid-cols-2 border-b border-slate-800 text-center font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setMode('signin')
                  setError(null)
                }}
                className={`pb-3 font-semibold transition-colors relative ${
                  mode === 'signin' ? 'text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span>SIGN IN TO CONSOLE</span>
                {mode === 'signin' && (
                  <motion.div layoutId="auth-tab" className="absolute bottom-0 inset-x-0 h-0.5 bg-cyan-400" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('join')
                  setError(null)
                }}
                className={`pb-3 font-semibold transition-colors relative ${
                  mode === 'join' ? 'text-cyan-400 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span>PROVISION NEW ACCOUNT</span>
                {mode === 'join' && (
                  <motion.div layoutId="auth-tab" className="absolute bottom-0 inset-x-0 h-0.5 bg-cyan-400" />
                )}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {mode === 'join' && (
                <div>
                  <label className="block font-mono text-xs text-slate-400 mb-1.5">FULL NAME</label>
                  <div className="relative">
                    <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full rounded-xl border border-slate-800 bg-[#07090e] py-3 pl-10 pr-4 text-sm font-sans text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1.5">ENGINEERING EMAIL</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="lead@company.com"
                    className="w-full rounded-xl border border-slate-800 bg-[#07090e] py-3 pl-10 pr-4 text-sm font-sans text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs text-slate-400 mb-1.5">CLUSTER ACCESS KEY (PASSWORD)</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-800 bg-[#07090e] py-3 pl-10 pr-10 text-sm font-sans text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password strength meter */}
                {mode === 'join' && password.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 rounded-full ${
                            strengthScore >= step ? 'bg-cyan-400 shadow-[0_0_8px_#00F0FF]' : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-slate-500">
                      <span>Entropy rating:</span>
                      <span className="text-cyan-400">{strengthLabels[strengthScore]}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Error & Lockout Notification Banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3.5 text-xs text-rose-300 flex items-start gap-2.5 font-mono">
                      <AlertTriangle size={15} className="text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <p>{error.msg}</p>
                        {countdown > 0 && (
                          <p className="mt-1 text-cyan-400 font-bold">
                            Brute-force protection: Retry available in {countdown}s.
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <GlowButton
                size="lg"
                variant="primary"
                className="w-full justify-center mt-6"
              >
                {busy ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Verifying Hardware Ring...</span>
                  </>
                ) : countdown > 0 ? (
                  <span>Rate Limited ({countdown}s)</span>
                ) : mode === 'signin' ? (
                  <span>Connect to Cluster Console [07]</span>
                ) : (
                  <span>Provision New Tenant Mesh</span>
                )}
              </GlowButton>

              <div className="pt-2 text-center font-mono text-[11px] text-slate-500">
                {backend ? (
                  <span>Secured by production Express API with rotating JWT cookies.</span>
                ) : (
                  <span>Zero-knowledge client encryption via Web Crypto SHA-256.</span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
