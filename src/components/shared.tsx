import { useState } from 'react'
import type { ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '../utils/cn'

export const EASE = [0.16, 1, 0.3, 1] as const

/* ------------------------------------------------------------------ */
/*  Section Header with Telemetry Index & Glowing Accent               */
/* ------------------------------------------------------------------ */
export function SectionHeader({
  code,
  badge,
  title,
  subtitle,
  align = 'center',
}: {
  code: string
  badge?: string
  title: ReactNode
  subtitle?: string
  align?: 'center' | 'left'
}) {
  return (
    <div
      className={cn(
        'relative z-10 flex flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start text-left'
      )}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 px-3 py-1 font-mono text-xs font-semibold text-cyan-400">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400" />
          [{code}] {badge || 'SYSTEM_CORE'}
        </span>
      </div>

      <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl max-w-4xl">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 max-w-2xl text-base text-slate-400 md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Cyber Glow Button                                                 */
/* ------------------------------------------------------------------ */
export function GlowButton({
  children,
  onClick,
  variant = 'primary',
  className,
  size = 'md',
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'glow'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm font-semibold',
    lg: 'px-8 py-4 text-base font-bold',
  }[size]

  if (variant === 'primary' || variant === 'glow') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-sans text-black transition-all duration-300',
          'bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400 bg-[length:200%_auto] hover:bg-right hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:scale-[1.02]',
          sizeClasses,
          className
        )}
      >
        <span className="relative z-10 flex items-center gap-2 font-bold tracking-tight">
          {children}
        </span>
      </button>
    )
  }

  if (variant === 'secondary') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-[#0c0e14]/80 text-white transition-all duration-300',
          'hover:border-cyan-500/40 hover:bg-[#121622] hover:text-cyan-300 hover:shadow-[0_0_25px_rgba(0,240,255,0.15)]',
          sizeClasses,
          className
        )}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'group inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 text-slate-300 transition-all duration-300 hover:border-white/30 hover:text-white',
        sizeClasses,
        className
      )}
    >
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Terminal Window with Live Code & Copy                             */
/* ------------------------------------------------------------------ */
export function TerminalWindow({
  title = 'prism-cli — bash',
  code,
  badge = 'v2.8.0-stable',
  className,
}: {
  title?: string
  code: string
  badge?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-800/80 bg-[#090b10]/95 font-mono shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl',
        className
      )}
    >
      {/* Terminal Top Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/70 bg-[#0c0e15] px-4 py-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-500/80" />
          <span className="h-3 w-3 rounded-full bg-amber-500/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-mono text-[11px] text-slate-400">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          {badge && (
            <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-cyan-400 border border-cyan-500/20">
              {badge}
            </span>
          )}
          <button
            onClick={copy}
            className="flex items-center gap-1.5 text-slate-400 transition-colors hover:text-white"
            title="Copy command"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span className="text-[11px]">{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>
      </div>

      {/* Code Body */}
      <div className="p-5 overflow-x-auto text-sm text-cyan-300 leading-relaxed">
        <pre className="font-mono">{code}</pre>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Telemetry Metric Card                                             */
/* ------------------------------------------------------------------ */
export function MetricCard({
  value,
  label,
  sub,
  highlight,
  badge,
}: {
  value: string
  label: string
  sub?: string
  highlight?: string
  badge?: string
}) {
  return (
    <div className="glass-card glass-card-hover relative flex flex-col justify-between overflow-hidden rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-wider text-slate-400">{label}</span>
        {badge && (
          <span className="rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-400">
            {badge}
          </span>
        )}
      </div>

      <div className="my-4">
        <div className="font-sans text-4xl font-extrabold tracking-tight text-white md:text-5xl">
          {value}
        </div>
        {highlight && (
          <div className="mt-1 font-mono text-xs text-cyan-400">{highlight}</div>
        )}
      </div>

      {sub && <p className="text-xs text-slate-400 leading-relaxed">{sub}</p>}
    </div>
  )
}
