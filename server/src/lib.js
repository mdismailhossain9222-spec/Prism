/* ------------------------------------------------------------------ */
/*  PRISM Kernel API — Core Library                                   */
/*  Config · In-memory/JSON store · Tokens · Zod Schemas · Middleware  */
/* ------------------------------------------------------------------ */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const isProd = process.env.NODE_ENV === 'production'

function secret(name, devFallback) {
  const value = process.env[name]
  if (value && value.length >= 32) return value
  if (isProd) throw new Error(`[config] ${name} must be set (min 32 chars) in production`)
  return devFallback
}

export const config = {
  isProd,
  port: Number(process.env.PORT ?? 4000),
  clientOrigins: (process.env.CLIENT_ORIGIN ?? 'http://localhost:5173,http://localhost:4173')
    .split(',')
    .map((s) => s.trim()),
  accessSecret: secret('JWT_ACCESS_SECRET', 'prism-access-secret-32-chars-kernel-auth-dev'),
  refreshSecret: secret('JWT_REFRESH_SECRET', 'prism-refresh-secret-32-chars-kernel-auth-dev'),
  dataFile: process.env.DATA_FILE ?? path.resolve(process.cwd(), 'prism-data.json'),
  accessTtlSec: 15 * 60, // 15 mins
  refreshTtlSec: 7 * 24 * 60 * 60, // 7 days
  lockAfter: 5,
  lockMinutes: 15,
}

let cache = null

function load() {
  if (cache) return cache
  try {
    cache = JSON.parse(fs.readFileSync(config.dataFile, 'utf8'))
  } catch {
    cache = { users: [], clusters: [], apiKeys: [], telemetrySpans: [], refreshTokens: [] }
  }
  cache.users ??= []
  cache.clusters ??= []
  cache.apiKeys ??= []
  cache.telemetrySpans ??= []
  cache.refreshTokens ??= []
  return cache
}

function persist() {
  const tmp = `${config.dataFile}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(cache, null, 2))
  fs.renameSync(tmp, config.dataFile)
}

export const store = {
  users: {
    byEmail(email) {
      return load().users.find((u) => u.email === email) ?? null
    },
    byId(id) {
      return load().users.find((u) => u.id === id) ?? null
    },
    insert(user) {
      load().users.push(user)
      persist()
      return user
    },
    update(email, patch) {
      const u = this.byEmail(email)
      if (!u) return null
      Object.assign(u, patch)
      persist()
      return u
    },
  },
  apiKeys: {
    insert(k) {
      load().apiKeys.push(k)
      persist()
      return k
    },
    forUser(userId) {
      return load().apiKeys.filter((k) => k.userId === userId)
    },
  },
  refresh: {
    put(rec) {
      const db = load()
      db.refreshTokens = db.refreshTokens.filter((t) => t.exp > Date.now())
      db.refreshTokens.push(rec)
      persist()
    },
    get(jti) {
      return load().refreshTokens.find((t) => t.jti === jti) ?? null
    },
    revoke(jti) {
      const t = this.get(jti)
      if (t) {
        t.revoked = true
        persist()
      }
    },
  },
}

export const newJti = () => crypto.randomUUID()

export const signAccess = (user) =>
  jwt.sign({ sub: user.id, name: user.name, email: user.email }, config.accessSecret, {
    expiresIn: config.accessTtlSec,
  })

export const signRefresh = (userId, jti) =>
  jwt.sign({ sub: userId, jti }, config.refreshSecret, { expiresIn: config.refreshTtlSec })

export const verifyAccess = (token) => jwt.verify(token, config.accessSecret)
export const verifyRefresh = (token) => jwt.verify(token, config.refreshSecret)

const baseCookie = {
  httpOnly: true,
  sameSite: 'strict',
  secure: config.isProd,
}

export function setAuthCookies(res, { access, refresh }) {
  res.cookie('prism_access', access, { ...baseCookie, maxAge: config.accessTtlSec * 1000, path: '/' })
  res.cookie('prism_refresh', refresh, {
    ...baseCookie,
    maxAge: config.refreshTtlSec * 1000,
    path: '/api/auth',
  })
}

export function clearAuthCookies(res) {
  res.clearCookie('prism_access', { ...baseCookie, path: '/' })
  res.clearCookie('prism_refresh', { ...baseCookie, path: '/api/auth' })
}

const sanitize = (s) => s.replace(/[<>"`]/g, '').trim()
const email = z.string().trim().toLowerCase().email('Valid corporate email required').max(120)
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72)
  .regex(/[A-Za-z]/, 'Password requires at least one letter')
  .regex(/\d/, 'Password requires at least one number')

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(60).transform(sanitize),
  email,
  password,
})

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(72),
})

export const telemetryIngestSchema = z.object({
  clusterId: z.string().min(1).max(64),
  timestampNs: z.number().int().positive().optional(),
  spans: z
    .array(
      z.object({
        traceId: z.string().max(64),
        durationUs: z.number().nonnegative(),
        service: z.string().max(64),
        status: z.string().max(32),
      })
    )
    .min(1)
    .max(500),
  company: z.string().max(64).optional().default(''), // honeypot
})

export const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(422).json({
      error: 'Validation failed',
      issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    })
  }
  req.data = parsed.data
  next()
}

function bearer(req) {
  const h = req.headers.authorization
  return h?.startsWith('Bearer ') ? h.slice(7) : null
}

export function authRequired(req, res, next) {
  const token = req.cookies?.prism_access ?? bearer(req)
  if (!token) return res.status(401).json({ error: 'Kernel authorization required' })
  try {
    const p = verifyAccess(token)
    req.user = { id: p.sub, name: p.name, email: p.email }
    next()
  } catch {
    return res.status(401).json({ error: 'Session expired' })
  }
}

export const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email })

export function notFound(_req, res) {
  res.status(404).json({ error: 'Endpoint not found' })
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status ?? 500
  if (status >= 500 && !config.isProd) console.error(err)
  res.status(status).json({ error: status >= 500 ? 'Internal kernel error' : err.message })
}
