# PRISM Kernel API — Autonomous Observability Engine

High-performance, hardened Express API for the PRISM Observability SaaS platform. Includes secure cookie-based JWT sessions with rotating refresh tokens, eBPF telemetry ingestion validation, brute-force lockouts, and rate-limiting.

## Quick Start

```bash
cd server
npm install
npm run dev # http://localhost:4000
```

## Security Architecture

- **bcrypt (12 rounds)** password hashing for corporate tenants.
- **JWT access (15 min) + rotating refresh (7 days)** in `httpOnly`, `SameSite=Strict`, `Secure` cookies.
- **Brute-force lockout** after 5 failed logins with dummy-hash constant-time execution.
- **Rate limiting** on API ingestion and credential endpoints.
- **Helmet**: Strict Content Security Policy, HSTS, frameguard, and nosniff.
- **Honeypot protection** on telemetry and enquiry endpoints.
- **Zero-knowledge client mode** in frontend with Web Crypto SHA-256 fallback.

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Provision new tenant identity |
| POST | `/api/auth/login` | — | Authenticate with lockout protection |
| POST | `/api/auth/refresh` | Cookie | Rotate refresh token |
| POST | `/api/auth/logout` | — | Clear authenticated session |
| GET | `/api/auth/me` | Bearer/Cookie | Current authenticated operator |
| POST | `/api/telemetry/ingest` | Optional | Ingest eBPF spans (honeypot protected) |
| GET | `/api/telemetry/health` | — | Global Anycast cluster health check |
| GET | `/api/health` | — | Liveness & uptime probe |
