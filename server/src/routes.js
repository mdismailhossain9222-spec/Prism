/* ------------------------------------------------------------------ */
/*  PRISM Kernel API — Routes                                         */
/* ------------------------------------------------------------------ */
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import {
  authRequired,
  clearAuthCookies,
  config,
  loginSchema,
  newJti,
  publicUser,
  registerSchema,
  setAuthCookies,
  signAccess,
  signRefresh,
  store,
  telemetryIngestSchema,
  validate,
  verifyRefresh,
} from './lib.js'

const DUMMY_HASH = bcrypt.hashSync('placeholder-salt-password', 12)

const issueSession = (res, user) => {
  const jti = newJti()
  const access = signAccess(user)
  const refresh = signRefresh(user.id, jti)
  store.refresh.put({
    jti,
    userId: user.id,
    exp: Date.now() + config.refreshTtlSec * 1000,
    revoked: false,
  })
  setAuthCookies(res, { access, refresh })
}

export const authRouter = Router()

/* POST /api/auth/register */
authRouter.post('/register', validate(registerSchema), async (req, res) => {
  const { name, email, password } = req.data
  if (store.users.byEmail(email)) {
    return res.status(409).json({ error: 'Corporate tenant already registered' })
  }
  const hash = await bcrypt.hash(password, 12)
  const user = store.users.insert({
    id: newJti(),
    name,
    email,
    hash,
    failedCount: 0,
    lockUntil: 0,
    createdAt: Date.now(),
  })
  issueSession(res, user)
  res.status(201).json({ user: publicUser(user) })
})

/* POST /api/auth/login — generic error, brute-force lockout */
authRouter.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.data
  const user = store.users.byEmail(email)

  if (user?.lockUntil && user.lockUntil > Date.now()) {
    res.set('Retry-After', String(Math.ceil((user.lockUntil - Date.now()) / 1000)))
    return res
      .status(429)
      .json({ error: 'Too many authentication failures. Cryptographic lockout active.' })
  }

  const ok = await bcrypt.compare(password, user?.hash ?? DUMMY_HASH)
  if (!user || !ok) {
    if (user) {
      const failedCount = (user.failedCount ?? 0) + 1
      store.users.update(email, {
        failedCount: failedCount >= config.lockAfter ? 0 : failedCount,
        lockUntil: failedCount >= config.lockAfter ? Date.now() + config.lockMinutes * 60_000 : 0,
      })
    }
    return res.status(401).json({ error: 'Invalid corporate credentials' })
  }

  store.users.update(email, { failedCount: 0, lockUntil: 0 })
  issueSession(res, user)
  res.json({ user: publicUser(user) })
})

/* POST /api/auth/refresh */
authRouter.post('/refresh', (req, res) => {
  const token = req.cookies?.prism_refresh
  if (!token) return res.status(401).json({ error: 'No refresh token' })

  let payload
  try {
    payload = verifyRefresh(token)
  } catch {
    clearAuthCookies(res)
    return res.status(401).json({ error: 'Session expired' })
  }

  const record = store.refresh.get(payload.jti)
  if (!record || record.revoked || record.exp < Date.now()) {
    if (record) store.refresh.revoke(payload.jti)
    clearAuthCookies(res)
    return res.status(401).json({ error: 'Session revoked' })
  }

  const account = store.users.byId(payload.sub)
  if (!account) {
    clearAuthCookies(res)
    return res.status(401).json({ error: 'Account not found' })
  }

  store.refresh.revoke(payload.jti)
  issueSession(res, account)
  res.json({ user: publicUser(account) })
})

/* POST /api/auth/logout */
authRouter.post('/logout', (req, res) => {
  const token = req.cookies?.prism_refresh
  if (token) {
    try {
      store.refresh.revoke(verifyRefresh(token).jti)
    } catch {
      // ignore
    }
  }
  clearAuthCookies(res)
  res.json({ ok: true })
})

/* GET /api/auth/me */
authRouter.get('/me', authRequired, (req, res) => {
  res.json({ user: req.user })
})

/* ===================== Telemetry Ingestion Router ================== */
export const telemetryRouter = Router()

telemetryRouter.post('/ingest', validate(telemetryIngestSchema), (req, res) => {
  const { company, clusterId, spans } = req.data

  // Honeypot trap
  if (company && company.length > 0) {
    return res.status(200).json({ ok: true, ingested: 0 })
  }

  res.status(202).json({
    status: 'INGESTED_RING_BUFFER',
    clusterId,
    receivedSpans: spans.length,
    p99LatencyMs: 0.18,
    zeroCopyAck: true,
  })
})

/* GET /api/telemetry/health */
telemetryRouter.get('/health', (_req, res) => {
  res.json({
    status: 'OPTIMAL',
    kernelVersion: '2.8.4',
    p99Latency: '0.19ms',
    activePoPs: 48,
    globalConsensus: 'ESTABLISHED',
  })
})
