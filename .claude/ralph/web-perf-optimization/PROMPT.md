# Web Performance Optimization - Ralph Loop

## Mission
Optimize this Next.js 16 website to achieve **Lighthouse 100/100**, instant load times, and **<50ms TBT** through aggressive code splitting, lazy loading, and main thread optimization.

## Current Progress
Read `progress.txt` for completed tasks. Continue from the next incomplete task in `PRD.json`.

## Tech Stack
- Next.js 16 with Turbopack
- React 19
- TypeScript
- Tailwind CSS v4
- THREE.js (3D effects)
- GSAP (animations)
- next-intl (i18n: en + he)

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/[locale]/layout.tsx` | Root layout, font loading |
| `app/[locale]/page.tsx` | Home page, section imports |
| `components/effects/ThreeBackground.tsx` | THREE.js 3D scene (1.5MB) |
| `components/effects/MouseGlow.tsx` | Mouse glow effect |
| `components/sections/Pricing.tsx` | 427-line pricing component |
| `components/sections/Contact.tsx` | Contact form |
| `next.config.ts` | Build configuration |
| `package.json` | Dependencies |

## Task Execution Rules

1. **Read PRD.json** to find the next task where `pass: false`
2. **Check dependencies** - only start if all dependencies have `pass: true`
3. **Execute ONE task** per iteration
4. **Update progress.txt** with detailed notes on what was done
5. **Update PRD.json** to set `pass: true` when task is complete
6. **Run `pnpm build`** after code changes to verify no errors
7. **Git commit** after each completed task

## Agent Delegation

Tasks have an `agent` field specifying execution method:
- `direct` - Execute directly without agent delegation
- `senior-frontend-dev` - Use the senior-frontend-dev agent for complex React/Next.js work
- `web-perf-architect` - Use for performance analysis tasks

When using an agent, provide full context from PRD.json and pass the acceptance criteria.

## Design Guidelines

- THREE.js fallback: CSS gradient background for mobile/low-end
- Maintain glassmorphism aesthetic
- Keep existing dark theme
- Preserve RTL support for Hebrew

## Completion Signal

When ALL tasks have `pass: true`, output:

```
<promise>WEB-PERF OPTIMIZATION COMPLETE</promise>
```

## Important Rules

- **One task per iteration** - Do not batch multiple tasks
- **Always verify** - Run `pnpm build` after changes
- **Update tracking** - Keep progress.txt and PRD.json in sync
- **No regressions** - Site must remain fully functional
- **Commit atomically** - One commit per task

## File Paths Quick Reference

```
/Users/Kohelet/Code/kohelet/
├── app/[locale]/
│   ├── layout.tsx         # Font loading, providers
│   ├── page.tsx           # Home page
│   ├── about/page.tsx     # About page
│   └── blog/
│       ├── page.tsx       # Blog list
│       └── [slug]/page.tsx # Blog post
├── components/
│   ├── effects/
│   │   ├── ThreeBackground.tsx  # TARGET: Dynamic import
│   │   ├── MouseGlow.tsx        # TARGET: Throttling
│   │   └── NoiseOverlay.tsx     # TARGET: Dynamic import
│   └── sections/
│       ├── Pricing.tsx          # TARGET: Split & memoize
│       └── Contact.tsx          # TARGET: Dynamic import
├── next.config.ts               # TARGET: Optimization config
└── package.json                 # TARGET: Bundle analyzer
```

## Now Execute

1. Read progress.txt
2. Find next incomplete task in PRD.json
3. Execute that ONE task
4. Update progress.txt
5. Update PRD.json
6. Commit changes
