import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'
import { config, errorHandler, notFound } from './lib.js'
import { authRouter, telemetryRouter } from './routes.js'

const app = express()

app.set('trust proxy', 1)
app.disable('x-powered-by')

app.use(
  helmet({
    contentSecurityPolicy: { useDefaults: true },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
)

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || config.clientOrigins.includes(origin)) return cb(null, true)
      return cb(new Error('Rejected by PRISM CORS Guard'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  })
)

app.use(express.json({ limit: '15kb' }))
app.use(cookieParser())

// General Rate Limiter
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 600,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Rate limit exceeded — back off and retry' },
  })
)

// Auth strict rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts' },
})
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, service: 'prism-kernel-api', version: '2.8.4', timestamp: new Date().toISOString() })
)

app.use('/api/auth', authRouter)
app.use('/api/telemetry', telemetryRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`PRISM Kernel API running on port :${config.port} (${config.isProd ? 'production' : 'development'})`)
})
