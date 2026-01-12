# External Integrations

**Analysis Date:** 2026-01-12

## APIs & External Services

**Workflow Automation:**
- n8n - Contact form webhook integration
  - SDK/Client: Native fetch API
  - Auth: Webhook URL in `N8N_WEBHOOK_URL` env var
  - Endpoints used: POST webhook for contact form submissions
  - Implementation: `app/api/contact/route.ts`

**External APIs:**
- None detected (no third-party API integrations beyond n8n webhook)

**Payment Processing:**
- Not detected

**Email/SMS:**
- Not detected - Email handling delegated to n8n workflow

## Data Storage

**Databases:**
- Not detected - Static site with no persistent database

**File Storage:**
- Local file system - MDX blog content in `content/blog/`
- Contentlayer generates types at build time to `.contentlayer/generated`

**Caching:**
- Not detected - No Redis or external cache

## Authentication & Identity

**Auth Provider:**
- Not detected - No authentication system

**OAuth Integrations:**
- Not detected

## Monitoring & Observability

**Analytics:**
- Vercel Analytics - Web analytics via `@vercel/analytics`
  - Implementation: `components/analytics/AnalyticsWrapper.tsx`
  - Loading: Lazy-loaded post-hydration for performance

**Speed Insights:**
- Vercel Speed Insights - Core Web Vitals monitoring
  - Implementation: `components/analytics/AnalyticsWrapper.tsx`
  - Loading: Lazy-loaded, non-blocking

**Error Tracking:**
- Not detected - No Sentry or similar service

**Logs:**
- Vercel logs - stdout/stderr only
- Console.error for error logging in API routes

## CI/CD & Deployment

**Hosting:**
- Vercel - Next.js app hosting
  - Deployment: Automatic on main branch push (inferred)
  - Environment vars: Configured in Vercel dashboard

**CI Pipeline:**
- Not detected - No GitHub Actions workflows found

**Build Configuration:**
- Turbopack enabled for development and build
- Bundle analyzer available via `npm run analyze`

## Environment Configuration

**Development:**
- Required env vars: `N8N_WEBHOOK_URL` (optional for dev - falls back to console.log)
- Secrets location: `.env.local` (gitignored)
- Mock/stub services: Console logging when webhook URL not configured

**Staging:**
- Not detected - Single environment

**Production:**
- Secrets management: Vercel environment variables
- Webhook URL: `https://kohelet.app.n8n.cloud/webhook/contact-form`

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- n8n Contact Form Webhook - `app/api/contact/route.ts`
  - Endpoint: Configured via `N8N_WEBHOOK_URL`
  - Data sent: name, email, phone, service, message, submittedAt, pricingSelections
  - Verification: None (trusts n8n endpoint)
  - Retry logic: None implemented

## Image & Asset Handling

**Image Optimization:**
- Next.js Image component configuration in `next.config.ts`
  - Formats: AVIF, WebP
  - Cache TTL: 30 days (2592000 seconds)
  - Device sizes: 640, 750, 828, 1080, 1200, 1920, 2048
  - Image sizes: 16, 32, 48, 64, 96, 128, 256

**Dynamic Images:**
- Open Graph Image Generation - `app/api/og/route.tsx`
  - Runtime: Vercel Edge Functions
  - Supports: RTL (Hebrew) and LTR layouts
  - Query params: title, type, locale

## SEO Infrastructure

**Schema Markup:**
- JSON-LD Schema implementation in `lib/schema.ts`
  - Organization schema (knowledge graph)
  - WebSite schema (locale-aware)
  - Service schema (3 service types)
  - Article schema (blog posts)
  - BreadcrumbList schema
  - FAQPage schema
  - LocalBusiness schema

**Sitemap:**
- Dynamic sitemap generation - `app/sitemap.ts`
  - Includes all locales and blog posts
  - Alternate language links

---

*Integration audit: 2026-01-12*
*Update when adding/removing external services*
