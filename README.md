# Probe — Automated Website Auditor (Next.js port)

A full Next.js/TypeScript/shadcn port of the Python `analyze.py` script. Point
it at a URL, it runs the same automated checks (performance, SEO,
accessibility, security, mobile-friendliness, broken links, real Core Web
Vitals via PageSpeed Insights) and streams an AI-written report with
prioritized fixes — all through a web UI backed by Postgres.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind v4** + hand-wired **shadcn/ui** primitives (the `shadcn` CLI's
  registry wasn't reachable from the build sandbox, so the components in
  `src/components/ui` were written to match exactly what the CLI generates —
  swap in the CLI once you have normal network access if you want to add
  more components: `npx shadcn@latest add <component>`)
- **Prisma 7** + **PostgreSQL** for persistence (via `@prisma/adapter-pg` — Prisma 7 requires an explicit driver adapter and moved connection config to `prisma.config.ts`)
- **cheerio** (Node's BeautifulSoup equivalent) for HTML parsing
- **Server-Sent Events** for live scan progress + streaming report text
- Pluggable **LLM provider** layer: LM Studio (local) today, Claude/OpenAI
  (hosted) with a one-line env change for production

## Getting started

### 1. Install dependencies

```bash
npm install
```

This also runs `prisma generate` automatically via `postinstall`.

### 2. Set up Postgres

Create a database, then copy the env file:

```bash
cp .env.example .env
```

Set `DATABASE_URL` to point at your Postgres instance, e.g.:

```
DATABASE_URL="postgresql://user:password@localhost:5432/site_analyzer"
```

This is read by `prisma.config.ts` (Prisma 7 moved connection config out of
`schema.prisma` into this file) and by `src/lib/prisma.ts`, which builds a
`@prisma/adapter-pg` driver adapter from it at runtime — Prisma 7 requires
an explicit adapter rather than reading `url` from the schema directly.

Push the schema:

```bash
npm run db:push
```

(Use `npx prisma migrate dev` instead if you want tracked migrations for
production deploys.)

### 3. Configure the LLM provider

For local dev, leave `LLM_PROVIDER=lmstudio` in `.env` and make sure LM
Studio's local server is running (Developer tab → Start Server) with a
model loaded — same as the original Python script.

For production, switch to a hosted model with no other code changes:

```
LLM_PROVIDER="anthropic"
ANTHROPIC_API_KEY="sk-ant-..."
```

or

```
LLM_PROVIDER="openai"
OPENAI_API_KEY="sk-..."
```

See `src/lib/analyzer/llm-provider.ts` — that's the only file this touches.

### 4. (Optional) PageSpeed Insights API key

Works without a key at low volume. For production traffic, get a free key
and set `PAGESPEED_API_KEY` to raise rate limits.

### 5. Run it

```bash
npm run dev
```

Open `http://localhost:3000`, enter a URL, watch it scan.

## How it maps to the original script

| Python (`analyze.py`)                 | TypeScript                                                 |
| -------------------------------------- | ----------------------------------------------------------- |
| `fetch_page()`                         | `src/lib/analyzer/checks/fetch-page.ts`                     |
| `check_ssl()`                          | `src/lib/analyzer/checks/check-ssl.ts`                      |
| `check_security_headers()`             | `src/lib/analyzer/checks/check-security-headers.ts`         |
| `check_seo()`                          | `src/lib/analyzer/checks/check-seo.ts`                      |
| `check_accessibility()`                | `src/lib/analyzer/checks/check-accessibility.ts`            |
| `check_performance()`                  | `src/lib/analyzer/checks/check-performance.ts`               |
| `check_broken_links()`                 | `src/lib/analyzer/checks/check-broken-links.ts`              |
| `check_pagespeed()`                    | `src/lib/analyzer/checks/check-pagespeed.ts`                 |
| `check_mobile_friendliness()`          | `src/lib/analyzer/checks/check-mobile-friendliness.ts`       |
| `run_all_checks()`                     | `src/lib/analyzer/run-checks.ts`                              |
| `SYSTEM_PROMPT` / `generate_report()`  | `src/lib/analyzer/report-prompt.ts` + `generate-report.ts`    |
| `STANDARDS` dict                       | `src/lib/analyzer/standards.ts`                                |
| writing `findings_*.json`/`report_*.md` to disk | `Analysis` row in Postgres (`prisma/schema.prisma`)   |
| `main()` orchestration                 | `src/lib/analyzer/pipeline.ts` (`processAnalysis`)             |

## Architecture notes for productionizing

- **Background processing**: `POST /api/analyses` currently kicks off
  `processAnalysis()` as a fire-and-forget async call within the same Node
  process. That's fine for a single long-running server (e.g. a VM, or
  `next start` on a persistent host) but **will not survive serverless
  function timeouts** (Vercel, etc. kill the function once the HTTP response
  is sent). Before deploying to serverless, swap this for a real job queue —
  Inngest, QStash, or a Postgres-backed queue with a worker — and have the
  worker call `processAnalysis(analysisId)`.
- **Live updates**: `GET /api/analyses/[id]/stream` polls Postgres every
  700ms and forwards changes as SSE. This avoids needing Redis/pubsub for a
  v1, but if you outgrow polling, swap it for `LISTEN/NOTIFY` or a real
  pubsub layer feeding the same SSE endpoint.
- **Broken-link checks** run concurrently (`Promise.all`) rather than the
  Python script's serial loop, so this step is meaningfully faster.
- **SSL check** uses Node's `tls` module directly (fetch doesn't expose
  certs), so it only runs server-side — already the case here since it's in
  an API route.
- **Auth/billing**: not included. The `User` model in `prisma/schema.prisma`
  is a minimal placeholder — wire up your auth provider of choice (Clerk,
  Auth.js, Supabase Auth) and a billing provider (Stripe) before charging
  people. `Analysis.userId` is already there to scope results per account.