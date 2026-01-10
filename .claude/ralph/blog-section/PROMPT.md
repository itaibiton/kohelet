# Blog Section - Ralph Loop Prompt

## Mission
Build a full blog page with hero section, filterable grid of blog cards, and category/search filtering. The blog should match Kohelet's glassmorphism dark theme and support both English and Hebrew locales.

## Current State
Read `progress.txt` to understand what has been completed. Check `PRD.json` for the full task list and mark items as complete as you finish them.

## Tech Stack
- Next.js 16 (with Turbopack)
- React 19
- Tailwind CSS v4
- GSAP 3.13 (animations)
- next-intl 4.5 (i18n) - translations in `content/en.json` and `content/he.json`
- Lucide React (icons)
- TypeScript 5

## Design Guidelines

### Theme: Glassmorphism Dark (Match Existing)

**Color Palette** (from globals.css):
- `--brand-dark: #020204` - Main background
- `--brand-gray: #111113` - Secondary background
- `--brand-surface: #08080a` - Surface color
- `--accent-blue: #3b82f6` - Primary accent
- `--accent-blue-hover: #2563eb` - Accent hover state
- `--text-primary: #ffffff` - Primary text
- `--text-secondary: #a3a3a3` - Secondary text
- `--border-default: rgba(255, 255, 255, 0.1)` - Default borders

**Available Utility Classes**:
- `.glass-panel` - Glassmorphism effect with blur and border
- `.animate-fade-in-up` - Fade in from bottom animation
- `.text-glow` / `.text-glow-blue` - Text glow effects
- `.shadow-glow-blue` - Blue glow box shadow

**Styling Patterns** (reference existing components):
- Cards: `bg-brand-gray/50 backdrop-blur-md border border-white/10 rounded-xl`
- Buttons: See `components/ui/Button.tsx`
- Section spacing: `py-24` or `py-32`
- Container: `max-w-7xl mx-auto px-6`

## Your Task This Iteration

1. **Read `progress.txt`** to see what work has already been done
2. **Read `PRD.json`** and find the NEXT task where `pass: false`
   - Follow the `implementation_order` phases
   - Check `dependencies` - only work on tasks whose dependencies are all `pass: true`
3. **Use the appropriate agent** based on the task's `agent` field:

| Task Prefix | Agent | Purpose |
|-------------|-------|---------|
| `UI-*` | ui-designer | Implement UI components with Tailwind |
| `FE-*` | senior-frontend-dev | Frontend logic and architecture |
| `INT-*` | direct | Direct execution for integration |

4. **Complete that SINGLE task** following acceptance criteria
5. **Update `PRD.json`**: Set the completed task's `pass` to `true`
6. **Append to `progress.txt`** with what you accomplished
7. **Make a git commit**: `feat(blog): [TASK-ID] description`
8. **Check if ALL tasks are complete** - if yes, output:

```
<promise>BLOG-SECTION COMPLETE</promise>
```

## Component Reference

When creating components, reference these existing files for style consistency:
- `components/sections/Hero.tsx` - Hero section patterns, badges, CTAs
- `components/sections/Solutions.tsx` - Card grid layouts
- `components/ui/Card.tsx` - Card component base
- `components/ui/Button.tsx` - Button variants
- `components/sections/about/AboutHero.tsx` - Page-level hero pattern

## i18n Pattern

```tsx
import { useTranslations } from "next-intl";

export function BlogHero() {
  const t = useTranslations("blog");

  return (
    <h1>{t("hero.title")}</h1>
  );
}
```

Translations go in:
- `content/en.json` - English
- `content/he.json` - Hebrew (RTL supported via next-intl)

## Important Rules
- **ONE task per iteration** - don't try to do multiple
- **Always use the correct agent** - check the task's `agent` field
- **Always update progress.txt** - this is your memory
- **Always update PRD.json** - mark tasks complete
- **Match existing code style** - check similar components first
- **Use TypeScript** - proper types for all props and data
