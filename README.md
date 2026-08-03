# Probe — Automated Website Auditor

Probe is a Next.js website auditing app that analyzes a URL and generates a client-friendly SEO report with actionable fixes. It checks performance, SEO, accessibility, security, mobile-friendliness, broken links, and Core Web Vitals, then streams the report as it runs.

## Features

- Audit any public website by URL
- Check SEO signals like title, meta description, H1s, canonical tags, and robots meta tags
- Review accessibility issues such as missing alt text, unlabeled form inputs, and heading structure
- Inspect security signals including SSL/TLS and missing security headers
- Measure performance and page quality with HTML, response, and resource analysis
- Fetch real Core Web Vitals from Google PageSpeed Insights when enabled
- Stream scan progress and the report in real time
- Store analysis results in PostgreSQL
- Generate an AI-written report with prioritized, practical fixes

## Tech stack

- Next.js 16 App Router
- TypeScript
- React 19
- Tailwind CSS v4
- Prisma 7 with PostgreSQL
- cheerio for HTML parsing
- SSE for live progress updates
- LM Studio, Anthropic, or OpenAI for report generation
- bcrypt, jose, and nodemailer for authentication and email features

## Getting started

### 1. Install dependencies

```bash
npm install
```

This also runs `prisma generate` automatically via `postinstall`.

### 2. Set up environment variables

Copy the example env file:

```bash
cp .env.example .env
```

Set at least the following values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/site_analyzer"
SESSION_SECRET="your-long-random-secret"
LLM_PROVIDER="lmstudio"
```

Optional provider settings:

```env
LLM_PROVIDER="anthropic"
ANTHROPIC_API_KEY="sk-ant-..."
```

or

```env
LLM_PROVIDER="openai"
OPENAI_API_KEY="sk-..."
```

If you want live Core Web Vitals from Google PageSpeed Insights, add:

```env
PAGESPEED_API_KEY="your-api-key"
```

If you plan to use email features, also configure:

```env
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Prepare the database

Push the Prisma schema to your database:

```bash
npm run db:push
```

### 4. Run the app

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

## Scripts

- `npm run dev` — start the development server
- `npm run build` — build the app for production
- `npm run start` — start the production server
- `npm run lint` — run ESLint
- `npm run db:push` — push the Prisma schema to the database
- `npm run db:studio` — open Prisma Studio

## Project notes

- Prisma 7 uses `prisma.config.ts` and `@prisma/adapter-pg` for database connectivity.
- The report generation prompt is tuned for client-facing audit reports with severity, impact, and fix recommendations.
- Real-user Core Web Vitals are preferred when PageSpeed data is available.
- The app includes auth-related utilities and email helpers, so extra configuration may be needed depending on which features you use.

## License

No license has been specified yet.
