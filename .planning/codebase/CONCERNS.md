# Codebase Concerns

**Analysis Date:** 2026-01-12

## Tech Debt

**Missing `.env.example` file:**
- Issue: Project has `.env` and `.env.local` files but no `.env.example` template
- Files: Root directory missing `.env.example`
- Why: Development oversight during rapid prototyping
- Impact: New developers cannot see what environment variables are needed
- Fix approach: Create `.env.example` with `N8N_WEBHOOK_URL=` placeholder

**No automated test coverage:**
- Issue: Zero test files, no test framework installed
- Files: Entire codebase lacks tests
- Why: Focus on feature delivery over test infrastructure
- Impact: No safety net for refactoring, regression risk
- Fix approach: Add Vitest, create tests for critical paths (API routes, context, forms)

## Known Bugs

**No known bugs documented**

The codebase appears functionally stable. Monitor for:
- Race conditions in form submission
- Locale detection edge cases
- Three.js initialization on various devices

## Security Considerations

**Webhook timeout not configured:**
- Risk: `fetch()` to n8n webhook could hang indefinitely if webhook unresponsive
- File: `app/api/contact/route.ts`
- Current mitigation: None
- Recommendations: Add `AbortSignal.timeout(5000)` to fetch call

**Weak email validation:**
- Risk: Malformed emails could be sent to webhook (only checks presence)
- File: `app/api/contact/route.ts` (line 24)
- Current mitigation: HTML5 form validation on client (can be bypassed)
- Recommendations: Add regex validation or use a validation library

**dangerouslySetInnerHTML usage:**
- Risk: Pattern could be copied to unsafe contexts by future developers
- File: `lib/schema.ts` (line 247)
- Current mitigation: Only used with JSON.stringify output (safe)
- Recommendations: Add comment explaining why this usage is safe

## Performance Bottlenecks

**Three.js background:**
- Problem: Particle animation updates every frame (Float32Array needsUpdate always true)
- File: `components/effects/ThreeBackground.tsx`
- Measurement: Not profiled - device capability detection helps
- Cause: Animation loop doesn't check if update is needed
- Improvement path: Add conditional updates, skip when particles haven't meaningfully changed

**No issues detected:**
- Pages are statically generated
- Images optimized with Next.js
- Analytics lazy-loaded
- Three.js has device capability detection fallback

## Fragile Areas

**Middleware locale chain:**
- File: `middleware.ts`
- Why fragile: Single point of failure for all route handling
- Common failures: Locale detection can fail with unusual Accept-Language headers
- Safe modification: Test with various browser locales before deploying
- Test coverage: None

**Contact form + pricing context integration:**
- Files: `components/sections/Contact.tsx`, `context/PricingContext.tsx`
- Why fragile: Tight coupling between pricing state and form submission
- Common failures: State not cleared properly, stale pricing data sent
- Safe modification: Verify full flow (pricing selection -> form -> webhook)
- Test coverage: None

## Scaling Limits

**No external services:**
- Current capacity: Static site with single webhook endpoint
- Limit: n8n webhook rate limits (if any)
- Symptoms at limit: 429 errors from webhook
- Scaling path: n8n workflow handles scaling, no action needed

**Contentlayer build time:**
- Current capacity: Works well with few blog posts
- Limit: Large number of MDX files could slow builds
- Symptoms at limit: Slow build times
- Scaling path: Not a concern for marketing site scale

## Dependencies at Risk

**contentlayer2:**
- Risk: Fork of original contentlayer, maintenance uncertain
- Impact: MDX content processing could break
- Migration plan: Monitor for issues, consider alternatives like Velite if needed

**No critical dependencies at risk:**
- React 19 is stable
- Next.js 16 is current
- Radix UI actively maintained

## Missing Critical Features

**No test infrastructure:**
- Problem: Cannot verify code changes safely
- Current workaround: Manual testing
- Blocks: Confident refactoring, CI/CD quality gates
- Implementation complexity: Medium - Add Vitest, write initial tests

**No .env.example:**
- Problem: Environment setup not documented
- Current workaround: Ask other developers
- Blocks: Smooth onboarding
- Implementation complexity: Low - Create file with variable names

## Test Coverage Gaps

**API route not tested:**
- What's not tested: `app/api/contact/route.ts` - validation, webhook call, error handling
- Risk: Form submission could break silently
- Priority: High
- Difficulty to test: Low - straightforward request/response testing

**Context logic not tested:**
- What's not tested: `context/PricingContext.tsx` - state management, calculations
- Risk: Pricing calculator bugs
- Priority: High
- Difficulty to test: Low - unit tests for context hooks

**Schema generation not tested:**
- What's not tested: `lib/schema.ts` - JSON-LD output correctness
- Risk: SEO structured data could be malformed
- Priority: Medium
- Difficulty to test: Low - snapshot tests for schema output

**Three.js effects not tested:**
- What's not tested: `components/effects/ThreeBackground.tsx` - initialization, fallback
- Risk: Visual effects could fail silently
- Priority: Low
- Difficulty to test: High - requires WebGL mocking

---

## Summary: Clean Areas

- No TODO/FIXME/HACK comments found
- No hardcoded secrets
- No eval() or dynamic code execution
- No console.log in production components
- Security headers configured in `next.config.ts`
- TypeScript strict mode enabled
- API routes have try/catch error handling

---

*Concerns audit: 2026-01-12*
*Update as issues are fixed or new ones discovered*
