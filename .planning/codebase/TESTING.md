# Testing Patterns

**Analysis Date:** 2026-01-12

## Test Framework

**Runner:**
- Not configured - No test framework installed

**Assertion Library:**
- Not configured

**Run Commands:**
```bash
# No test commands available
# Recommended to add:
# npm test                    # Run all tests
# npm test -- --watch         # Watch mode
# npm run test:coverage       # Coverage report
```

## Test File Organization

**Location:**
- Not established - No test files exist

**Naming:**
- Recommended: `*.test.ts` or `*.test.tsx` alongside source files

**Structure:**
- Not established

## Test Structure

**Suite Organization:**
- Not established

**Patterns:**
- Not established

## Mocking

**Framework:**
- Not configured

**Patterns:**
- Not established

**What to Mock (Recommendations):**
- External API calls (n8n webhook)
- Environment variables
- Next.js navigation
- Contentlayer data

**What NOT to Mock:**
- Pure utility functions (`lib/utils.ts`)
- Component rendering logic

## Fixtures and Factories

**Test Data:**
- Not established

**Location:**
- Recommended: `tests/fixtures/` or co-located with tests

## Coverage

**Requirements:**
- Not enforced - No coverage tooling

**Configuration:**
- Not configured

**View Coverage:**
- Not available

## Test Types

**Unit Tests:**
- Not implemented
- Recommended targets:
  - `lib/utils.ts` - `cn()` function
  - `lib/schema.ts` - JSON-LD schema generators
  - `context/PricingContext.tsx` - Context logic
  - `components/sections/pricing/types.ts` - Type utilities

**Integration Tests:**
- Not implemented
- Recommended targets:
  - Contact form + API route flow
  - Pricing calculator state management
  - Blog filtering logic

**E2E Tests:**
- Not implemented
- Recommended targets:
  - Contact form submission
  - Pricing selection to contact form
  - Blog navigation and filtering
  - Language switching

## Code Quality Tools (In Use)

**Linting:**
- ESLint 9 with Next.js TypeScript rules
- Config: `eslint.config.mjs`
- Run: `npm run lint`

**Type Checking:**
- TypeScript 5 with strict mode
- Config: `tsconfig.json`
- Run: Checked during build

**Build Verification:**
- Next.js build with Turbopack
- Run: `npm run build`

**Bundle Analysis:**
- @next/bundle-analyzer available
- Run: `npm run analyze`

## Testing Gaps

**Critical Paths Without Tests:**
- `app/api/contact/route.ts` - Form submissions, webhook integration
- `context/PricingContext.tsx` - Pricing state management
- `components/sections/Contact.tsx` - Form validation, submission
- `lib/schema.ts` - JSON-LD schema generation

**Priority Recommendations:**
1. **High:** Add API route tests for contact form
2. **High:** Add context tests for PricingContext
3. **Medium:** Add component tests for Contact form
4. **Medium:** Add utility tests for schema generation
5. **Low:** Add E2E tests for critical user flows

## Recommended Test Setup

**Framework Recommendations:**
- Vitest - Fast, Vite-native, good TypeScript support
- @testing-library/react - Component testing
- Playwright or Cypress - E2E testing

**Suggested package.json Scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  }
}
```

**Suggested Dependencies:**
```json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "jsdom": "^22.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

---

*Testing analysis: 2026-01-12*
*Update when test patterns change*
