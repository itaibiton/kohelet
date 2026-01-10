# Kohelet About Page - Ralph Loop Prompt

## Mission
Build the Kohelet About page by implementing 5 missing components using specialized agents:
- **prd-architect** for requirements definition
- **ui-designer** for UI implementation
- **kohelet-copywriter** for content creation

## Current State
Read `progress.txt` to understand what has been completed. Check `PRD.json` for the full task list and mark items as complete as you finish them.

## Tech Stack
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4
- GSAP for animations
- Lucide Icons
- next-intl for i18n (English + Hebrew)

## Design Guidelines

### Theme: Glassmorphism Dark
1. **Backgrounds**:
   - Cards: `bg-[#111113]/80` with `backdrop-blur-md`
   - Section: `bg-transparent` (Three.js canvas behind)
2. **Borders**: `border border-white/10`
3. **Typography**:
   - Headings: `text-white`
   - Body: `text-neutral-400`
   - Accent: `text-accent-blue` (#3b82f6)
4. **Corners**: `rounded-xl` to `rounded-2xl`
5. **Spacing**: Section padding `py-20 md:py-32`, container `max-w-6xl mx-auto px-6`

## Reference Files (for styling patterns)
- Hero style: `/components/sections/about/AboutHero.tsx`
- Landing sections: `/components/sections/landing/`
- Global styles: `/app/globals.css`
- Translations: `/content/en.json`, `/content/he.json`

## Your Task This Iteration

1. **Read `progress.txt`** to see what work has already been done
2. **Read `PRD.json`** and find the NEXT task where `pass: false`
   - Follow the `implementation_order` phases
   - Check `dependencies` - only work on tasks whose dependencies are all `pass: true`
3. **Use the appropriate agent** based on the task's `agent` field:

### Agent Routing

| Task Prefix | Agent to Use | Purpose |
|-------------|--------------|---------|
| `PRD-*` | `prd-architect` | Define requirements, acceptance criteria, specifications |
| `UI-*` | `ui-designer` | Implement React components with Tailwind, GSAP |
| `COPY-*` | `kohelet-copywriter` | Write marketing copy in English and Hebrew |
| `INT-*` | Direct execution | Integration tasks (no agent needed) |

### How to Use Agents

Use the Task tool with the appropriate subagent_type:

```
For PRD tasks:
Task(subagent_type="prd-architect", prompt="Define requirements for [component]...")

For UI tasks:
Task(subagent_type="ui-designer", prompt="Implement [component] following these specs...")

For COPY tasks:
Task(subagent_type="kohelet-copywriter", prompt="Write copy for [section] in English and Hebrew...")
```

4. **Complete that SINGLE task**
   - Follow the acceptance_criteria exactly
   - For UI tasks: Write clean, typed code
   - For COPY tasks: Provide both English and Hebrew translations

5. **Update `PRD.json`**: Set the completed task's `pass` to `true`

6. **Append to `progress.txt`** with what you accomplished

7. **Make a git commit** with message format: `feat(about): [TASK-ID] description`

8. **Check if ALL tasks are complete** - if yes, output:

```
<promise>ABOUT PAGE COMPLETE</promise>
```

## Important Rules

- **ONE task per iteration** - don't try to do multiple
- **Always use the correct agent** - check the task's `agent` field
- **Always update progress.txt** - this is your memory
- **Always update PRD.json** - mark tasks complete
- **Run type check** after code changes: `npx tsc --noEmit`
- **Commit after each task** with message format: `feat(about): [TASK-ID] description`

## Verification Before Marking Complete

Before setting `pass: true` on any task:
- [ ] All acceptance criteria are met
- [ ] No TypeScript errors (for UI tasks)
- [ ] File exists at correct path (for UI tasks)
- [ ] Follows design guidelines
- [ ] Agent output was reviewed and incorporated

## File Paths Quick Reference
```
/app/[locale]/about/page.tsx              # About page (uses components)
/components/sections/about/index.ts       # Barrel exports
/components/sections/about/AboutHero.tsx  # Existing hero (reference)
/components/sections/about/CompanyStory.tsx  # NEW
/components/sections/about/Stats.tsx         # NEW
/components/sections/about/Values.tsx        # NEW
/components/sections/about/Team.tsx          # NEW
/components/sections/about/AboutCTA.tsx      # NEW
/content/en.json                          # English translations
/content/he.json                          # Hebrew translations
```

## Stats Values (for UI-02 and COPY-02)
Use these automation-focused metrics:
- Hours Saved: 10,000+
- Tasks Automated: 500+
- Efficiency Gain: 80%
- Clients Served: 50+

## Brand Voice (for copywriter agent)
- Expert and authoritative
- Results-oriented ("We deliver X")
- Clear and direct (no fluff)
- Hebrew should feel natural, not translated
