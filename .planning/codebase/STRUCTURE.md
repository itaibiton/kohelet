# Codebase Structure

**Analysis Date:** 2026-01-12

## Directory Layout

```
kohelet/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (passthrough)
│   ├── sitemap.ts               # SEO sitemap generator
│   ├── [locale]/                # Locale-prefixed routes
│   │   ├── layout.tsx           # Main layout with providers
│   │   ├── page.tsx             # Home page
│   │   ├── about/               # About page
│   │   └── blog/                # Blog section
│   │       ├── page.tsx         # Blog listing
│   │       └── [slug]/          # Individual posts
│   └── api/                     # API routes
│       ├── contact/             # Contact form handler
│       └── og/                  # OG image generator
├── components/                   # React components
│   ├── sections/                # Page sections
│   │   ├── about/              # About page sections
│   │   ├── blog/               # Blog sections
│   │   └── pricing/            # Pricing calculator
│   ├── ui/                      # Base UI components
│   ├── effects/                 # Visual effects
│   ├── analytics/               # Analytics wrapper
│   ├── mdx/                     # MDX components
│   └── icons/                   # Icon library
├── context/                     # React Context providers
├── i18n/                        # Internationalization
├── lib/                         # Utilities and helpers
├── content/                     # MDX content
│   └── blog/                    # Blog posts
├── public/                      # Static assets
└── .planning/                   # Project planning docs
```

## Directory Purposes

**app/**
- Purpose: Next.js App Router pages and API routes
- Contains: Layouts, pages, API routes, sitemap
- Key files: `[locale]/layout.tsx` (main layout), `[locale]/page.tsx` (home)
- Subdirectories: `[locale]/` (locale routes), `api/` (API handlers)

**components/sections/**
- Purpose: Page-level section components
- Contains: Navigation, Hero, Pricing, Contact, Footer, and feature-specific sections
- Key files: `Navigation.tsx`, `Hero.tsx`, `Pricing.tsx`, `Contact.tsx`
- Subdirectories: `about/`, `blog/`, `pricing/` (feature-organized)

**components/ui/**
- Purpose: Reusable UI primitives (Radix-based)
- Contains: Button, Card, Input, Select, Popover, LanguageSwitcher
- Key files: `Button.tsx`, `Card.tsx`, `Input.tsx`
- Subdirectories: None (flat structure)

**components/effects/**
- Purpose: Visual effects with device capability detection
- Contains: Three.js background, gradient fallback, mouse glow, starfield
- Key files: `ThreeBackgroundWrapper.tsx`, `ThreeBackground.tsx`, `GradientFallback.tsx`
- Subdirectories: None

**components/analytics/**
- Purpose: Analytics and monitoring wrappers
- Contains: Lazy-loaded Vercel Analytics and Speed Insights
- Key files: `AnalyticsWrapper.tsx`
- Subdirectories: None

**context/**
- Purpose: React Context providers for shared state
- Contains: Pricing calculator state management
- Key files: `PricingContext.tsx`
- Subdirectories: None

**i18n/**
- Purpose: Internationalization configuration
- Contains: Locale definitions, routing config, server-side message loading
- Key files: `config.ts`, `routing.ts`, `request.ts`
- Subdirectories: None

**lib/**
- Purpose: Utilities and helper functions
- Contains: Class name helper, JSON-LD schema builders
- Key files: `utils.ts`, `schema.ts`
- Subdirectories: None

**content/blog/**
- Purpose: MDX blog post content
- Contains: Blog posts with frontmatter (title, excerpt, date, author, etc.)
- Key files: Individual `.mdx` files
- Subdirectories: None

## Key File Locations

**Entry Points:**
- `app/layout.tsx` - Root layout (minimal passthrough)
- `app/[locale]/layout.tsx` - Main layout with fonts, providers, metadata
- `app/[locale]/page.tsx` - Home page entry
- `middleware.ts` - Locale detection and routing

**Configuration:**
- `next.config.ts` - Next.js configuration with plugins
- `tsconfig.json` - TypeScript strict mode configuration
- `contentlayer.config.ts` - MDX document schema
- `eslint.config.mjs` - ESLint flat config
- `postcss.config.mjs` - Tailwind CSS processing

**Core Logic:**
- `components/sections/Pricing.tsx` - Pricing calculator orchestrator
- `components/sections/Contact.tsx` - Contact form with webhook
- `app/api/contact/route.ts` - Contact form API handler
- `lib/schema.ts` - JSON-LD schema generation

**Testing:**
- Not configured - No test files or directories

**Documentation:**
- `README.md` - Project documentation (if exists)
- `.planning/` - Project planning documents

## Naming Conventions

**Files:**
- PascalCase.tsx - React components (`Hero.tsx`, `Button.tsx`)
- kebab-case.ts - Utility modules (`utils.ts`, `schema.ts`)
- lowercase.tsx - Next.js pages (`page.tsx`, `layout.tsx`)
- route.ts - API routes (`route.ts`)

**Directories:**
- kebab-case - All directories (`components`, `sections`, `pricing`)
- Plural names - Collections (`components`, `sections`, `effects`)

**Special Patterns:**
- index.ts - Barrel exports for directories
- `[param]` - Dynamic route segments (`[locale]`, `[slug]`)
- `*.mdx` - MDX content files

## Where to Add New Code

**New Page:**
- Implementation: `app/[locale]/your-page/page.tsx`
- Tests: Not configured
- Config: Add to sitemap in `app/sitemap.ts`

**New Section Component:**
- Implementation: `components/sections/YourSection.tsx`
- Types: Inline or in component file
- Export: Add to `components/sections/index.ts`

**New UI Component:**
- Implementation: `components/ui/YourComponent.tsx`
- Types: Inline with component
- Export: Import directly or add to barrel

**New API Route:**
- Implementation: `app/api/your-route/route.ts`
- Handler: Export `GET`, `POST`, etc. functions

**New Blog Post:**
- Implementation: `content/blog/your-post.mdx`
- Frontmatter: title, excerpt, date, author, category, published

**Utilities:**
- Shared helpers: `lib/utils.ts` or new file in `lib/`
- Type definitions: Inline or in component files

## Special Directories

**.contentlayer/**
- Purpose: Generated Contentlayer types and data
- Source: Auto-generated from `content/` at build time
- Committed: No (in .gitignore)

**.next/**
- Purpose: Next.js build output and cache
- Source: Generated by Next.js build
- Committed: No (in .gitignore)

**node_modules/**
- Purpose: npm dependencies
- Source: Installed via `npm install`
- Committed: No (in .gitignore)

**.planning/**
- Purpose: Project planning and documentation
- Source: Manual planning documents
- Committed: Yes

---

*Structure analysis: 2026-01-12*
*Update when directory structure changes*
