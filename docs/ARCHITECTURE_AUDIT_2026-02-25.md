# Application Architecture Audit (2026-02-25)

## Scope
- Runtime: Next.js 14 App Router on Vercel
- Data: Neon Postgres
- ORM: Prisma
- Auth: Custom cookie session model (`auth_sessions`)

## Standards Baseline
- OWASP ASVS v4.0.3 (V2 Authentication, V3 Session, V4 Access Control, V5 Validation, V7 Error Handling, V14 Config)
- Twelve-Factor App (Config, Backing services, Build/Release/Run, Logs)
- Operational supportability for serverless production on Vercel + managed Postgres

## Architecture Decision
Prisma is required for this codebase in current form.
- Reason: API handlers and domain models are implemented directly using Prisma across auth/session/profile/bookings.
- Replacing Prisma would require a full repository-layer and migration rewrite.

## Findings Status

### Remediated in this audit
1. IDOR in bookings API removed.
- `/api/bookings` and `/api/bookings/[id]` now derive user identity from session cookie, not client-submitted `userId`.

2. Password reset code leakage removed by default.
- `/api/auth/password/request` no longer returns reset code unless explicitly enabled for non-production debugging.

3. Baseline security headers added globally.
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Strict-Transport-Security`.

4. Booking payload validation and error redaction improved.
- Date/time format checks added on booking creation.
- Internal exception messages no longer returned to clients in booking handlers.

### Remaining gaps (must-do)
1. Distributed rate limiting is now implemented via shared Postgres table.
- Limiter state is stored in `api_rate_limits`, so enforcement is shared across serverless instances.
- Next action: add observability around throttle hits and evaluate dedicated Redis for very high write volume.

2. CSRF protections are incomplete for cookie-authenticated mutating routes.
- Current model relies on `SameSite=Lax` but does not enforce origin/token checks.
- Action: enforce origin allowlist and CSRF token on all state-changing authenticated endpoints.

3. Password reset delivery channel is not integrated.
- Reset token generation exists, but production-grade email delivery and anti-abuse telemetry are not in place.
- Action: integrate transactional email provider and add event/audit logs for reset lifecycle.

4. Lint governance is not yet codified.
- `next lint` currently requires initial ESLint config setup.
- Action: add org-standard ESLint config and enforce in CI.

## Deployment Controls (Vercel)
- Required env vars:
  - `DATABASE_URL` (Neon pooler)
  - `DIRECT_DATABASE_URL` (Neon direct host)
- Migration execution:
  - Run `npm run db:migrate:deploy:env` in CI/deploy phase (not `migrate dev`).
- Secret hygiene:
  - Rotate any credential exposed outside secure secret management.

## Supportability KPIs to track
- API 5xx rate and p95 latency per route
- Authentication failure and lockout rates
- Password reset request and completion rates
- Migration success/failure per deploy

