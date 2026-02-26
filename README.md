# glambox-online

Glambox Online Web & Mobile Portal.

## Database stack

- ORM: Prisma
- DB: managed Postgres (Neon recommended)
- Runtime DB client: `lib/db.ts` (`PrismaClient` singleton for Next.js server/serverless)
- Prisma CLI config: `prisma.config.ts`

## Environment variables

Create `.env.local` in project root (local dev):

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx-pooler.us-east-2.aws.neon.tech/DB?sslmode=require&pgbouncer=true&connect_timeout=15"
DIRECT_DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx.us-east-2.aws.neon.tech/DB?sslmode=require&connect_timeout=15"
```

For Neon:

- `DATABASE_URL`: pooled/transaction URL (recommended for serverless)
- `DIRECT_DATABASE_URL`: direct non-pooled URL (used by Prisma migrations)
- `DATABASE_URL` should use host containing `-pooler.`
- `DIRECT_DATABASE_URL` must be non-pooler host
- Optional: `CSRF_TRUSTED_ORIGINS` as comma-separated origins if your frontend origin differs from API origin (for strict CSRF checks).

Example for Neon:

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx-pooler.us-east-2.aws.neon.tech/DB?sslmode=require&pgbouncer=true&connect_timeout=15"
DIRECT_DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx.us-east-2.aws.neon.tech/DB?sslmode=require&connect_timeout=15"
```

## Local setup (step by step)

1. Install dependencies:
   - `npm install`
2. Create `.env.local` from `.env.example` and set your Neon connection strings.
3. Validate DB env config:
   - `npm run db:check`
4. Generate Prisma client:
   - `npm run db:generate`
5. Run migrations:
   - `npm run db:migrate`
6. Seed demo data:
   - `npm run db:seed`
7. Start app:
   - `npm run dev`

`npm run dev` now validates env vars and applies `db:migrate:deploy` before starting Next.js.

Optional:

- Prisma Studio: `npm run db:studio`

## Vercel setup (step by step)

1. Provision managed Postgres (Neon/Supabase).
2. In Vercel project settings, add:
   - `DATABASE_URL` (pooled URL)
   - `DIRECT_DATABASE_URL` (direct URL)
3. Run migrations during deployment using `prisma migrate deploy`.

### Best practice for migrations on deploy

- Do not run `prisma migrate dev` in production.
- Prefer running `prisma migrate deploy` in CI/CD before or during deploy.
- For CI/Vercel where env vars are injected by platform, use:
  - `npm run db:migrate:deploy:env`
- Safer pattern: run migrations in a dedicated CI job to avoid concurrent migration races across parallel deploys.

## Persistence confirmation

- Persistence: data lives in managed Postgres (not Vercel filesystem), so it survives serverless instance restarts/redeploys.

## Serverless caveats (Vercel)

- Vercel functions are stateless/ephemeral; never store DB files on local disk.
- Use pooled Postgres URL for request traffic (`DATABASE_URL`).
- Keep a single Prisma client instance per runtime process (`lib/db.ts` already does this).
- Use `DIRECT_DATABASE_URL` for migrations because many poolers do not support migration transaction behavior.
- Rate limiting uses shared Postgres storage (`api_rate_limits`) so limits apply across serverless instances.

## Do you need Prisma?

Yes for this codebase as-is. Auth and booking APIs are implemented with Prisma models and queries throughout `app/api/**`.
Removing Prisma would require replacing every DB call with another data layer and rewriting migrations.
