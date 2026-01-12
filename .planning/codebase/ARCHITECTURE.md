# Architecture

**Analysis Date:** 2026-01-12

## Pattern Overview

**Overall:** Monolithic, Layered Web Application (Next.js App Router)

**Key Characteristics:**
- Server/Client Component hybrid with React 19
- Static content generation with MDX (Contentlayer)
- Locale-prefixed routing for internationalization
- Context-based state management for interactive features
- Edge Functions for dynamic OG image generation

## Layers

**Routing & Middleware Layer:**
- Purpose: Handle locale detection and route matching
- Contains: Middleware for i18n routing, locale configuration
- Location: `middleware.ts`, `i18n/routing.ts`, `i18n/config.ts`, `i18n/request.ts`
- Depends on: next-intl library
- Used by: All page routes

**Layout Layer:**
- Purpose: Provide shared layout, metadata, providers, and fonts
- Contains: Root layout, locale layout with providers
- Location: `app/layout.tsx`, `app/[locale]/layout.tsx`
- Depends on: Routing layer, Context providers
- Used by: All page components

**Page Layer (Server Components):**
- Purpose: Generate static pages with metadata and structured data
- Contains: Home, Blog, About pages with SSG
- Location: `app/[locale]/page.tsx`, `app/[locale]/blog/page.tsx`, `app/[locale]/about/page.tsx`
- Depends on: Section components, Contentlayer data
- Used by: Direct user requests

**Section Layer (Client Components):**
- Purpose: Interactive page sections with client-side logic
- Contains: Navigation, Hero, Pricing, Contact, Footer
- Location: `components/sections/*.tsx`
- Depends on: UI components, Context, Utilities
- Used by: Page components

**UI Component Layer:**
- Purpose: Reusable, styled UI primitives
- Contains: Button, Card, Input, Select, Popover
- Location: `components/ui/*.tsx`
- Depends on: Radix UI, Tailwind utilities
- Used by: Section components

**Effects Layer:**
- Purpose: Visual effects with device capability detection
- Contains: ThreeBackground, GradientFallback, MouseGlow, Starfield
- Location: `components/effects/*.tsx`
- Depends on: Three.js, GSAP
- Used by: Page layouts

**State Layer:**
- Purpose: Shared state management via React Context
- Contains: PricingContext for calculator state
- Location: `context/PricingContext.tsx`
- Depends on: React hooks
- Used by: Pricing section, Contact form

**API Layer:**
- Purpose: Server-side request handling
- Contains: Contact form webhook, OG image generation
- Location: `app/api/contact/route.ts`, `app/api/og/route.tsx`
- Depends on: External services (n8n)
- Used by: Client form submissions

**Content Layer:**
- Purpose: MDX content management with type safety
- Contains: Blog posts with locale-aware fields
- Location: `content/blog/*.mdx`, `contentlayer.config.ts`
- Depends on: Contentlayer, remark/rehype plugins
- Used by: Blog pages

**Utility Layer:**
- Purpose: Shared helpers and schema builders
- Contains: cn() helper, JSON-LD schema functions
- Location: `lib/utils.ts`, `lib/schema.ts`
- Depends on: clsx, tailwind-merge
- Used by: All layers

## Data Flow

**Page Request Flow:**

1. Request hits `middleware.ts` - Detects locale from URL/preferences
2. Routes to `app/[locale]/layout.tsx` - Loads fonts, providers, metadata
3. Renders page component (e.g., `app/[locale]/page.tsx`)
4. Imports section components (Navigation, Hero, Pricing, Contact, Footer)
5. Client components hydrate with interactive features
6. Effects layer initializes (ThreeBackground with device detection)

**Blog Request Flow:**

1. Static params generated at build time via `generateStaticParams()`
2. Page loads all posts from Contentlayer (`allPosts`)
3. Transforms posts with locale-aware field selection
4. Client-side filtering via URL params (category, search)
5. Debounced search (300ms) with memoized filtering

**Contact Form Flow:**

1. User fills form in `Contact.tsx`
2. Pricing selections pulled from `PricingContext`
3. POST to `/api/contact` with JSON payload
4. API route validates required fields
5. Forwards to n8n webhook if configured
6. Returns success/error response
7. Form resets, pricing context clears on success

**State Management:**
- PricingContext: Shared pricing calculator state (products, addOns, total)
- URL Params: Blog filters persisted for shareability
- Local State: Form fields, UI toggles (mobile menu, popovers)

## Key Abstractions

**Section Components:**
- Purpose: Self-contained page sections
- Examples: `Navigation.tsx`, `Hero.tsx`, `Pricing.tsx`, `Contact.tsx`, `Footer.tsx`
- Pattern: Functional components with hooks, JSDoc documentation

**Wrapper Components:**
- Purpose: Cross-cutting concerns (effects, analytics)
- Examples: `EffectsWrapper`, `ThreeBackgroundWrapper`, `AnalyticsWrapper`
- Pattern: Composition with conditional rendering based on device capability

**Context Providers:**
- Purpose: Distribute shared state
- Examples: `PricingProvider`, `NextIntlClientProvider`
- Pattern: Standard React Context with custom hooks

**Schema Builders:**
- Purpose: Generate JSON-LD for SEO
- Examples: `getOrganizationSchema()`, `getArticleSchema()`, `getServiceSchema()`
- Pattern: Functions returning structured objects

## Entry Points

**Application Entry:**
- Location: `app/layout.tsx` (root), `app/[locale]/layout.tsx` (main)
- Triggers: Initial page load
- Responsibilities: Font loading, provider setup, metadata generation

**Page Entry:**
- Location: `app/[locale]/page.tsx`, `app/[locale]/blog/page.tsx`
- Triggers: Route match
- Responsibilities: Static generation, section composition

**API Entry:**
- Location: `app/api/contact/route.ts`
- Triggers: Form submission POST
- Responsibilities: Validation, webhook forwarding

**Middleware Entry:**
- Location: `middleware.ts`
- Triggers: Every request
- Responsibilities: Locale detection, routing

## Error Handling

**Strategy:** Try/catch at API boundaries, graceful UI fallbacks

**Patterns:**
- API routes wrap handlers in try/catch, return structured errors
- Contact form shows error status on failure, preserves form data
- ThreeBackground falls back to CSS gradient on capability failure

## Cross-Cutting Concerns

**Logging:**
- Console.error for API errors
- Console.log for development (webhook fallback)

**Validation:**
- Basic presence checks in API routes
- HTML5 form validation on client

**Internationalization:**
- Route-based locale detection via `middleware.ts`
- next-intl hooks: `useTranslations()`, `useLocale()`
- Conditional field selection for locale-aware content
- RTL support with `dir="rtl"` on HTML element

**Performance:**
- useMemo/useCallback for expensive calculations
- Dynamic imports for Three.js, Analytics
- Static generation for all pages
- Image optimization with AVIF/WebP

---

*Architecture analysis: 2026-01-12*
*Update when major patterns change*
