# Coding Conventions

**Analysis Date:** 2026-01-12

## Naming Patterns

**Files:**
- PascalCase for React components: `Hero.tsx`, `Button.tsx`, `PricingCalculator.tsx`
- kebab-case for utilities: `utils.ts`, `schema.ts`
- lowercase for Next.js files: `page.tsx`, `layout.tsx`, `route.ts`, `middleware.ts`
- Test files: Not present (no testing configured)

**Functions:**
- camelCase for all functions: `cn()`, `usePricing()`, `getOrganizationSchema()`
- handle prefix for event handlers: `handleSubmit`, `handleClick`
- get prefix for data retrieval: `getServiceSelectedCount()`, `getArticleSchema()`
- is/has prefix for booleans: `isProductSelected()`, `isRtl()`

**Variables:**
- camelCase for variables: `selectedProducts`, `openService`, `webhookResponse`
- UPPER_SNAKE_CASE for constants: `BASE_URL`, `PRICING`, `ADD_ONS`
- No underscore prefix for private members

**Types:**
- PascalCase for interfaces: `ServiceSchemaInput`, `ArticleSchemaInput`
- PascalCase for type aliases: `ServiceType`, `AddOnType`, `SelectedProduct`
- Union types for enums: `type ServiceType = "customSoftware" | "businessAutomation" | "aiAgents"`
- No I prefix for interfaces

## Code Style

**Formatting:**
- 2-space indentation throughout
- Double quotes for strings: `"use client"`, `"application/json"`
- Semicolons required at end of statements
- No trailing commas in single-line, trailing commas in multi-line

**Linting:**
- ESLint 9 with flat config in `eslint.config.mjs`
- Extends: `"next/core-web-vitals"`, `"next/typescript"`
- Ignores: `node_modules/**`, `.next/**`, `out/**`, `build/**`
- Run: `npm run lint`

## Import Organization

**Order:**
1. React imports: `import { useState, useMemo } from "react"`
2. External packages: `import { useTranslations } from "next-intl"`
3. Internal modules with @/ alias: `import { cn } from "@/lib/utils"`
4. Relative imports: `import { PricingSelector } from "./pricing/index"`
5. Type imports: `import type { SelectedProduct } from "@/context/PricingContext"`

**Grouping:**
- Blank line between import groups
- Type imports can be combined with value imports using `import type`

**Path Aliases:**
- `@/*` maps to project root (configured in `tsconfig.json`)
- `contentlayer/generated` maps to `.contentlayer/generated`

## Error Handling

**Patterns:**
- Try/catch at API boundaries: `app/api/contact/route.ts`
- Early returns for validation: `if (!name || !email) return NextResponse.json(...)`
- Structured error responses: `{ error: "message" }` with HTTP status codes

**Error Types:**
- 400 for validation errors: Missing required fields
- 500 for server errors: Webhook failures, internal errors
- Console.error for logging: `console.error("n8n webhook failed:", error)`

## Logging

**Framework:**
- Console.log for development output
- Console.error for error logging

**Patterns:**
- Log before returning error: `console.error("Contact form error:", error)`
- Conditional logging: Development-only console.log when webhook not configured
- No console.log in production client code

## Comments

**When to Comment:**
- JSDoc blocks for complex components/functions
- Inline comments for section markers in complex files
- Explain "why" not "what"

**JSDoc/TSDoc:**
- Multi-line JSDoc for public APIs and complex functions
- Example from `components/sections/Pricing.tsx`:
  ```typescript
  /**
   * Main Pricing Section Component
   *
   * Orchestrates the pricing calculator interface with:
   * - Service/product selection
   * - Add-ons selection
   * - Real-time price calculation
   * - Context sync for contact form integration
   */
  ```

**Section Comments:**
- Used in complex components: `/* Left Content */`, `/* Badge */`, `/* CTAs */`
- Example from `components/sections/Hero.tsx`

**TODO Comments:**
- Format: `// TODO: description`
- None found in codebase (clean)

## Function Design

**Size:**
- Keep functions focused
- Extract callbacks with useCallback for optimization

**Parameters:**
- Destructure in function signature
- Use options object pattern for many params
- Example: `export function Pricing() { ... }` with context hook

**Return Values:**
- Explicit return statements
- Return early for guard clauses
- JSX returns for components

## Module Design

**Exports:**
- Named exports for components: `export function Hero()`
- Named exports for utilities: `export function cn()`
- Default exports occasionally: `export default eslintConfig`
- Barrel exports via index.ts: `components/sections/index.ts`

**Component Patterns:**
- `"use client"` directive for client components (first line)
- Server Components by default in App Router
- Dynamic imports for heavy libraries: `const ThreeBackground = dynamic(...)`

**Hook Usage:**
- useMemo for expensive calculations
- useCallback for stable function references
- useEffect for side effects with proper dependencies
- Custom hooks: `usePricing()` from context

## TypeScript Patterns

**Strict Mode:**
- `"strict": true` in `tsconfig.json`
- Explicit type annotations for function parameters
- Type inference for local variables

**Props Typing:**
- Inline types: `({ children }: { children: ReactNode })`
- Type aliases for complex props: `type ButtonProps = { ... }`
- Extend HTML attributes: `React.ButtonHTMLAttributes<HTMLButtonElement>`

**Context Typing:**
- Full context type definition: `type PricingContextType = { ... }`
- Undefined check in hook: `if (context === undefined) throw new Error(...)`

---

*Convention analysis: 2026-01-12*
*Update when patterns change*
