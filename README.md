# Probe

### Automated website audits with actionable fixes.

A **Next.js** website auditor that scans any URL, runs 8 automated checks, and streams an AI-written client-friendly report. SEO, accessibility, performance, security, Core Web Vitals — all in one shot.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## Why Probe?

Most website audit tools either require expensive subscriptions, send your data to third parties, or give you vague scores without clear next steps. Probe runs on your own infrastructure, generates reports written for clients (not developers), and gives you severity ratings with concrete fixes.

> "A report your client can actually read."

---

## Features

### 8 Automated Checks

Probe runs a battery of checks on every URL: SSL/TLS validity, security headers (HSTS, CSP, X-Frame-Options, and more), SEO signals (title, meta description, H1s, canonical, Open Graph), accessibility issues (alt text, form labels, heading order), performance metrics (response time, compression, caching, render-blocking resources), mobile-friendliness, and broken link detection.

### Real Core Web Vitals

Fetches real-user data from Google PageSpeed Insights when enabled — LCP, INP, CLS from the Chrome User Experience Report, plus Lighthouse lab scores. No synthetic benchmarks.

### Full Website Audit

Toggle "Full website audit" to crawl an entire site (up to 50 pages, depth 3). Probe discovers pages via BFS, runs checks on each, and compiles a combined report with averaged scores.

### AI-Generated Reports

An LLM writes the report in plain language, graded for client audiences. Each finding gets a severity rating (Critical / High / Medium / Low), business impact, and a specific fix recommendation.

### Streaming Progress

Scan stages and report chunks stream to the browser in real time via SSE. A terminal-style console shows 10 check stages with animated progress. No page reloads.

### Authentication

JWT-based accounts with email verification, password reset, avatar upload, and profile management. Reports persist per-user in PostgreSQL.

### Multi-Provider LLM

Use LM Studio (local, no API key), Anthropic Claude, OpenAI GPT, or Mistral. Switch with one env var.

### And more

- **shadcn/ui** components with Tailwind CSS
- **Responsive** dashboard with analysis history
- **Landing page** with pricing tiers (Free / Pro / Team)
- **Dark mode** CSS variables ready

---

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL database
- An LLM provider (LM Studio for local, or an API key for Anthropic/OpenAI/Mistral)

### 1. Install dependencies

```bash
git clone https://github.com/your-username/site-analyzer.git
cd site-analyzer
npm install
```

This also runs `prisma generate` automatically via `postinstall`.

### 2. Set up environment variables

```bash
cp .env.example .env
```

Set at minimum:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/probe"
SESSION_SECRET="your-long-random-secret"
LLM_PROVIDER="lmstudio"
```

### 3. Prepare the database

```bash
npm run db:push
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How it works

```
User enters URL
    ↓
Crawler (optional)    BFS discovers pages, creates child Analysis records
    ↓
Pipeline              Runs 8 checks sequentially with progress callbacks
    ├─ Fetch          15s timeout, captures HTML + headers + timing
    ├─ SSL            Node.js tls module checks cert validity/expiry
    ├─ Security       6 security headers verified
    ├─ SEO            Title, meta, H1, canonical, robots, OG tags
    ├─ Accessibility  Alt text, lang, headings, form labels, empty links
    ├─ Performance    Size, compression, caching, render-blocking resources
    ├─ Mobile         Viewport meta + responsive design check
    ├─ Broken links   Sample-checks up to 25 internal links
    └─ PageSpeed      Google CrUX data + Lighthouse lab scores
    ↓
LLM Provider         Streams AI report token-by-token
    ↓
SSE                  Status updates + report chunks to the browser
    ↓
Database             Throttled writes (~500ms) save findings + report
```

**Full site audit:** Crawler discovers pages → child records created → processed in parallel batches of 3 → combined report with averaged scores.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | **Next.js 16** App Router + Turbopack |
| UI | **React 19** + **Tailwind CSS 4** + shadcn/ui |
| Database | **Prisma 7** + PostgreSQL |
| Auth | **jose** JWT + **bcrypt** |
| HTML parsing | **cheerio** |
| Email | **nodemailer** |
| Validation | **zod** |
| LLM | **LM Studio** / **Anthropic** / **OpenAI** / **Mistral** |
| Reports | AI-generated markdown with GFM rendering |

---

## Project Structure

```
site-analyzer/
├── src/
│   ├── app/
│   │   ├── (marketing)/     Landing, features, pricing, about
│   │   ├── (dashboard)/     New audit, analysis detail, settings
│   │   ├── (auth)/          Login, register, forgot/reset password
│   │   └── api/             REST endpoints (analyses, auth, avatar)
│   ├── lib/
│   │   ├── analyzer/        Audit engine, checks, pipeline, LLM providers
│   │   ├── auth.ts          JWT sessions, bcrypt hashing
│   │   ├── crawler.ts       BFS site crawler (50 pages, depth 3)
│   │   ├── email.ts         Nodemailer with retry logic
│   │   └── prisma.ts        Prisma client singleton
│   ├── components/          UI components (shadcn, auth, dashboard, landing)
│   └── hooks/               use-analysis (SSE + analysis lifecycle)
├── prisma/
│   └── schema.prisma        User, Analysis, AnalysisStatus
├── proxy.ts                 Route middleware (auth guards)
├── package.json
└── .env
```

---

## Configuration

All settings via environment variables:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | — | JWT signing secret |
| `LLM_PROVIDER` | Yes | `lmstudio` | `lmstudio`, `anthropic`, `openai`, `mistral` |
| `LM_STUDIO_URL` | No | `http://localhost:1234/v1/chat/completions` | LM Studio endpoint |
| `LM_STUDIO_MODEL` | No | `local-model` | LM Studio model name |
| `ANTHROPIC_API_KEY` | No | — | Anthropic API key |
| `ANTHROPIC_MODEL` | No | `claude-sonnet-4-6` | Claude model |
| `OPENAI_API_KEY` | No | — | OpenAI API key |
| `OPENAI_MODEL` | No | `gpt-4o` | OpenAI model |
| `MISTRAL_API_KEY` | No | — | Mistral API key |
| `MISTRAL_MODEL` | No | `mistral-large-latest` | Mistral model |
| `USE_PAGESPEED` | No | `true` | Enable PageSpeed checks |
| `PAGESPEED_API_KEY` | No | — | Google API key (optional) |
| `SMTP_HOST` | No | — | SMTP hostname (email disabled if unset) |
| `SMTP_PORT` | No | `587` | SMTP port |
| `SMTP_SECURE` | No | `false` | Use TLS |
| `SMTP_USER` | No | — | SMTP username |
| `SMTP_PASS` | No | — | SMTP password |
| `SMTP_FROM` | No | — | Sender address (falls back to SMTP_USER) |
| `NEXT_PUBLIC_APP_URL` | No | `http://localhost:3000` | Public URL for email links |

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:studio` | Open Prisma Studio |

---

## Contributing

1. Fork it
2. Create a branch (`git checkout -b feat/my-thing`)
3. Commit (`git commit -m 'Add my thing'`)
4. Push (`git push origin feat/my-thing`)
5. Open a PR

---

## License

No license specified yet.

---

**Probe saves you from guessing what's wrong with a website. Give it a star.**

[⭐ Star this repo](https://github.com/your-username/site-analyzer/stargazers)
