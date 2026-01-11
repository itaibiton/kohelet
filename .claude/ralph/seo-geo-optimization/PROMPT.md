# SEO & GEO Optimization - Ralph Loop Prompt

## Mission
Optimize the Kohelet website for Total Search Dominance—ranking #1 on traditional search engines AND becoming the primary source for AI Answer Engines (ChatGPT, Perplexity, Gemini).

## Current State
Read `progress.txt` to understand completed work. Check `PRD.json` for full task list.

## Tech Stack
- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- Contentlayer for MDX blog
- next-intl for i18n (he/en)

## Key Files Reference
- `/app/[locale]/layout.tsx` - Root layout with metadata
- `/app/[locale]/page.tsx` - Home page
- `/app/[locale]/blog/[slug]/page.tsx` - Blog post pages
- `/components/sections/Hero.tsx` - Hero section
- `/components/sections/Navigation.tsx` - Navigation component
- `/components/blog/BlogCard.tsx` - Blog card component
- `/public/robots.txt` - Bot access rules (to create)
- `/app/sitemap.ts` - Dynamic sitemap (to create)
- `/lib/schema.ts` - JSON-LD utilities (to create)

## Your Task This Iteration
1. **Read `progress.txt`** to see completed work
2. **Read `PRD.json`** to find NEXT task where `pass: false`
3. **Check dependencies** - only work on tasks whose dependencies are all `pass: true`
4. **Use the appropriate agent** based on task's `agent` field

### Agent Routing
| Task Prefix | Agent | Purpose |
|-------------|-------|---------|
| `CRAWL-*` | direct | File creation, simple edits |
| `SCHEMA-*` | senior-frontend-dev | Next.js metadata, TypeScript |
| `META-*` | senior-frontend-dev | Metadata configuration |
| `SEMANTIC-*` | senior-frontend-dev | Component refactoring |
| `VERIFY-*` | direct | Build commands, testing |

5. **Complete that SINGLE task** following acceptance criteria
6. **Update PRD.json**: Set the completed task's `pass` to `true`
7. **Append to progress.txt** with what you accomplished
8. **Make a git commit** with message format: `seo(scope): [TASK-ID] description`
9. **Check if ALL tasks are complete** - if yes, output:
```
<promise>SEO_GEO_OPTIMIZATION_COMPLETE</promise>
```

## Important Rules
- **ONE task per iteration** - don't batch multiple tasks
- **Always use the correct agent** - check the task's `agent` field
- **Always update progress.txt** - this is your memory
- **Always update PRD.json** - mark tasks complete
- **Run type check** after code changes
- **Commit after each task**

## Verification Commands
- `npm run build` - Full build
- `npm run lint` - Lint check
- Visit `/robots.txt` after CRAWL-01
- Visit `/sitemap.xml` after CRAWL-02
