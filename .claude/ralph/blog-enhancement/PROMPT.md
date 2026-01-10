# Blog Enhancement - Ralph Loop Prompt

## Mission
Fix blog section bugs (routing, layout, search), improve filter UI with shadcn components, set up MDX+Contentlayer2 for content management, add individual blog post pages, and integrate Vercel Analytics, Speed Insights, and OG image generation.

## Current State
Read `progress.txt` to understand what has been completed. Check `PRD.json` for the full task list and mark items as complete as you finish them.

## Tech Stack
- Next.js 16.0.8 (Turbopack)
- React 19.0.0
- Tailwind CSS v4
- next-intl 4.5.8 (en/he locales, RTL support)
- Lucide React icons
- GSAP animations
- Three.js effects
- Radix UI primitives
- CVA + clsx + tailwind-merge

## Design Guidelines

### Theme: Glassmorphism Dark
- Background: `bg-brand-gray/50` or `bg-[#111113]/80`
- Blur: `backdrop-blur-md`
- Border: `border-white/10`
- Accent: `accent-blue` (#3b82f6)
- Text: `text-white`, `text-white/60`, `text-white/40`
- Hover states: `hover:border-accent-blue/30`, `hover:-translate-y-1`

### RTL Support
- Use `rtl:` Tailwind prefixes for Hebrew layout adjustments
- Icons that indicate direction should flip: `rtl:rotate-180`
- Padding adjustments: `pl-10 rtl:pl-4 rtl:pr-10`

### File Paths
- Blog components: `components/sections/blog/`
- UI components: `components/ui/`
- Blog pages: `app/[locale]/blog/`
- Translations: `content/en.json`, `content/he.json`
- MDX content: `content/blog/`

## Your Task This Iteration

1. **Read `progress.txt`** to see what work has already been done
2. **Read `PRD.json`** and find the NEXT task where `pass: false`
   - Follow the `implementation_order` phases
   - Check `dependencies` - only work on tasks whose dependencies are all `pass: true`
3. **Use the appropriate agent** based on the task's `agent` field:

| Task Prefix | Agent | Purpose |
|-------------|-------|---------|
| `BUG-*` | senior-frontend-dev or ui-designer | Fix existing bugs |
| `SHADCN-*` | ui-designer or senior-frontend-dev | Install and implement shadcn components |
| `CL-*` | senior-frontend-dev | Contentlayer2 setup |
| `POST-*` | ui-designer | Blog post page components |
| `VERCEL-*` | senior-frontend-dev | Vercel integrations |
| `INT-*` | senior-frontend-dev | Integration tasks |
| `QA-*` | senior-frontend-dev | Testing and fixes |

4. **Complete that SINGLE task** following acceptance criteria
5. **Update `PRD.json`**: Set the completed task's `pass` to `true`
6. **Append to `progress.txt`** with what you accomplished
7. **Make a git commit**: `feat(blog): [TASK-ID] description`
8. **Check if ALL tasks are complete** - if yes, output:

```
<promise>BLOG-ENHANCEMENT COMPLETE</promise>
```

## Agent Instructions

### For ui-designer tasks:
- Focus on visual design, layout, styling
- Use Tailwind CSS with glassmorphism theme
- Ensure responsive design (mobile-first)
- Test RTL layout for Hebrew

### For senior-frontend-dev tasks:
- Focus on functionality, data flow, integrations
- Ensure TypeScript types are correct
- Handle errors gracefully
- Test with both locales

## Important Rules
- **ONE task per iteration** - don't try to do multiple
- **Always use the correct agent** - check the task's `agent` field
- **Always update progress.txt** - this is your memory between iterations
- **Always update PRD.json** - mark tasks complete with `"pass": true`
- **Always commit** - `feat(blog): [TASK-ID] brief description`
- **Check dependencies** - don't start a task until dependencies are done

## Key Files to Reference

### Existing Blog Components (for consistency):
- `components/sections/blog/BlogHero.tsx` - Hero section styling
- `components/sections/blog/BlogCard.tsx` - Card styling and structure
- `components/sections/blog/BlogFilters.tsx` - Current filter implementation
- `components/sections/blog/BlogGrid.tsx` - Grid layout

### i18n Routing Pattern:
```tsx
// Correct import for locale-aware links:
import { Link } from "@/i18n/routing";

// Usage (no locale prefix needed):
<Link href="/blog/my-post">...</Link>
```

### Contentlayer Usage:
```tsx
import { allPosts } from "contentlayer/generated";
import { useMDXComponent } from "next-contentlayer2/hooks";

// Get all posts
const posts = allPosts.filter(p => p.published);

// Render MDX
const MDXContent = useMDXComponent(post.body.code);
<MDXContent components={mdxComponents} />
```
