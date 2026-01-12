# Technology Stack

**Analysis Date:** 2026-01-12

## Languages

**Primary:**
- TypeScript 5 - All application code (`package.json`, `tsconfig.json`)

**Secondary:**
- MDX (Markdown with JSX) - Blog content (`contentlayer.config.ts`)
- JavaScript - Configuration files

## Runtime

**Environment:**
- Node.js 18+ - `package.json` engines requirement
- Next.js 16 Edge Runtime - OG image generation (`app/api/og/route.tsx`)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- Next.js 16.0.8 - App Router architecture with React Server Components (`next.config.ts`)
- React 19.0.0 - UI library with Server Components support
- Tailwind CSS 4 - Utility-first styling (`postcss.config.mjs`)

**Content:**
- Contentlayer2 0.5.8 - MDX content management (`contentlayer.config.ts`)
- next-intl 4.5.8 - Internationalization (EN/HE with RTL support) (`i18n/routing.ts`)

**Testing:**
- Not configured - No test framework installed

**Build/Dev:**
- Turbopack - Fast bundler (enabled via `--turbopack` flag)
- ESLint 9 - Linting with Next.js TypeScript rules (`eslint.config.mjs`)
- TypeScript 5 - Type checking with strict mode (`tsconfig.json`)

## Key Dependencies

**Critical:**
- next-intl 4.5.8 - Full internationalization with locale routing (`middleware.ts`)
- contentlayer2 0.5.8 - Type-safe MDX content (`content/blog/`)
- @vercel/analytics 1.6.1 - Web analytics (`components/analytics/AnalyticsWrapper.tsx`)
- @vercel/speed-insights 1.3.1 - Core Web Vitals monitoring

**UI/Graphics:**
- Three.js 0.182.0 - WebGL 3D backgrounds with bloom effects (`components/effects/ThreeBackground.tsx`)
- GSAP 3.13.0 - Animation framework with ScrollTrigger (`components/effects/ThreeBackground.tsx`)
- Radix UI - Accessible component primitives (`@radix-ui/react-popover`, `@radix-ui/react-select`)
- Lucide React 0.561.0 - Icon library

**Utilities:**
- clsx 2.1.1 + tailwind-merge 2.6.0 - Class name composition (`lib/utils.ts`)
- class-variance-authority 0.7.1 - Component variant styling (`components/ui/Button.tsx`)

**Content Processing:**
- react-markdown 10.1.0 - Markdown rendering
- remark-gfm 4.0.1 - GitHub Flavored Markdown
- rehype-highlight 7.0.2 - Code syntax highlighting
- rehype-slug 6.0.0 + rehype-autolink-headings 7.1.0 - Heading anchors

## Configuration

**Environment:**
- `.env` / `.env.local` files for secrets
- Key variable: `N8N_WEBHOOK_URL` for contact form webhook

**Build:**
- `next.config.ts` - Image optimization, security headers, experimental CSS optimization
- `tsconfig.json` - Strict TypeScript with path aliases (`@/*`, `contentlayer/generated`)
- `contentlayer.config.ts` - MDX document schema with locale-aware fields
- `postcss.config.mjs` - Tailwind CSS 4 processing

## Platform Requirements

**Development:**
- macOS/Linux/Windows with Node.js 18+
- No external dependencies required

**Production:**
- Vercel - Hosting platform with Edge Functions
- Automatic deployment on main branch push
- Image optimization with AVIF/WebP formats, 30-day cache TTL

---

*Stack analysis: 2026-01-12*
*Update after major dependency changes*
