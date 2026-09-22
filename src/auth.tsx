import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

/* ------------------------------------------------------------------ */
/*  PRISM Autonomous Cloud — Client-side Security & Auth Engine       */
/* ------------------------------------------------------------------ */

const API_URL = (import.meta as unknown as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL

export const DEMO_EMAIL = 'lead@prism.io'
export const DEMO_PASSWORD = 'quantum-2026'

export type User = { name: string; email: string; role?: string }
type StoredUser = User & { hash: string; createdAt: number }
type Session = { user: User; exp: number }
type Attempts = Record<string, { count: number; until: number }>

export class AuthError extends Error {
  code: 'format' | 'invalid' | 'locked' | 'taken' | 'network'
  retryAfter?: number
  constructor(code: AuthError['code'], message: string, retryAfter?: number) {
    super(message)
    this.code = code
    this.retryAfter = retryAfter
  }
}

const USERS_KEY = 'prism.users.v2'
const SESSION_KEY = 'prism.session.v2'
const ATTEMPTS_KEY = 'prism.attempts.v2'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // LocalStorage quota or private mode
  }
}

function removeKey(key: string) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Storage unavailable
  }
}

/* SHA-256 Web Crypto Hashing with Salt */
async function hashPassword(email: string, password: string) {
  const salted = `${password}::${email.toLowerCase()}::prism-quantum-v2`
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salted))
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return `plain:${salted}`
  }
}

async function ensureSeed() {
  const users = readJSON<StoredUser[]>(USERS_KEY, [])
  if (users.some((u) => u.email === DEMO_EMAIL)) return
  users.push({
    name: 'DevOps Lead',
    email: DEMO_EMAIL,
    role: 'Cluster Admin',
    hash: await hashPassword(DEMO_EMAIL, DEMO_PASSWORD),
    createdAt: Date.now(),
  })
  writeJSON(USERS_KEY, users)
}

function guardAttempts(email: string): Attempts {
  const attempts = readJSON<Attempts>(ATTEMPTS_KEY, {})
  const rec = attempts[email]
  if (rec && rec.until > Date.now()) {
    throw new AuthError(
      'locked',
      'Rate limit triggered: 5 failed attempts. Cryptographic lockout active.',
      Math.ceil((rec.until - Date.now()) / 1000)
    )
  }
  return attempts
}

function failAttempt(attempts: Attempts, email: string): never {
  const rec = attempts[email] ?? { count: 0, until: 0 }
  rec.count += 1
  if (rec.count >= 5) {
    rec.count = 0
    rec.until = Date.now() + 30_000 // 30s lockout
  }
  attempts[email] = rec
  writeJSON(ATTEMPTS_KEY, attempts)
  throw new AuthError('invalid', 'Invalid engineering credentials. Access denied.')
}

function clearAttempts(email: string) {
  const attempts = readJSON<Attempts>(ATTEMPTS_KEY, {})
  if (attempts[email]) {
    delete attempts[email]
    writeJSON(ATTEMPTS_KEY, attempts)
  }
}

export const validEmail = (e: string) => /\S+@\S+\.\S+/.test(e)
export const validPassword = (p: string) => p.length >= 8 && /[A-Za-z]/.test(p) && /\d/.test(p)

type AuthValue = {
  user: User | null
  backend: boolean
  login: (email: string, password: string) => Promise<User>
  register: (name: string, email: string, password: string) => Promise<User>
  logout: () => void
}

const AuthCtx = createContext<AuthValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const s = readJSON<Session | null>(SESSION_KEY, null)
    return s && s.exp > Date.now() ? s.user : null
  })

  const persist = (u: User | null) => {
    if (u) {
      writeJSON(SESSION_KEY, { user: u, exp: Date.now() + 12 * 60 * 60 * 1000 } satisfies Session)
    } else {
      removeKey(SESSION_KEY)
    }
    setUser(u)
  }

  const login: AuthValue['login'] = async (emailRaw, password) => {
    const email = emailRaw.trim().toLowerCase()
    if (!validEmail(email)) throw new AuthError('format', 'Enter a valid corporate email.')
    if (password.length < 8) throw new AuthError('format', 'Password must be at least 8 characters.')

    const attempts = guardAttempts(email)

    // Demo Mode client verification
    await ensureSeed()
    await wait(450)
    const found = readJSON<StoredUser[]>(USERS_KEY, []).find((u) => u.email === email)
    const hash = await hashPassword(email, password)

    if (!found || found.hash !== hash) {
      failAttempt(attempts, email)
    }

    clearAttempts(email)
    const u: User = { name: found.name, email: found.email, role: 'Cluster Admin' }
    persist(u)
    return u
  }

  const register: AuthValue['register'] = async (nameRaw, emailRaw, password) => {
    const name = nameRaw.trim()
    const email = emailRaw.trim().toLowerCase()
    if (name.length < 2) throw new AuthError('format', 'Enter your full name.')
    if (!validEmail(email)) throw new AuthError('format', 'Enter a valid corporate email.')
    if (!validPassword(password)) {
      throw new AuthError('format', 'Password requires 8+ chars with at least one letter and number.')
    }

    await ensureSeed()
    await wait(500)
    const users = readJSON<StoredUser[]>(USERS_KEY, [])
    if (users.some((u) => u.email === email)) {
      throw new AuthError('taken', 'An account already exists for this corporate identity.')
    }

    const u: User = { name, email, role: 'Site Reliability Engineer' }
    users.push({ ...u, hash: await hashPassword(email, password), createdAt: Date.now() })
    writeJSON(USERS_KEY, users)
    persist(u)
    return u
  }

  const logout = () => {
    persist(null)
  }

  const value = useMemo<AuthValue>(
    () => ({
      user,
      backend: Boolean(API_URL),
      login,
      register,
      logout,
    }),
    [user]
  )

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
