# GlobalNest Landing Page Redesign - Ralph Loop Prompt

## Mission
Redesign the GlobalNest landing page by replacing the middle sections with new components while keeping the existing Hero and Footer.

## Current State
Read `progress.txt` to understand what has been completed. Check `PRD.json` for the full task list and mark items as complete as you finish them.

## Tech Stack
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4
- Framer Motion for animations
- shadcn/ui components (especially Accordion)
- Phosphor Icons (use @phosphor-icons/react)
- next-intl for i18n

## Design Guidelines

### Theme: Glassmorphism Dark
1. **Backgrounds**:
   - Cards: `bg-card/30 dark:bg-card/20` or `bg-secondary/50 dark:bg-secondary/30`
   - Add `backdrop-blur-sm` or `backdrop-blur-md`
2. **Borders**: `border border-border`
3. **Typography**:
   - Headings: `text-foreground`
   - Body: `text-muted-foreground`
4. **Corners**: `rounded-2xl` or `rounded-3xl`
5. **Spacing**: Section padding `py-20 md:py-32`, container `max-w-7xl mx-auto px-4 md:px-6`

## Reference Files (for styling patterns)
- Hero style: `/src/components/landing/globalnest/hero.tsx`
- Footer style: `/src/components/landing/globalnest/footer.tsx`
- Existing features: `/src/components/landing/globalnest/features.tsx`
- Accordion: `/src/components/ui/accordion.tsx`
- Translations: `/src/messages/en.json`

## Your Task This Iteration

1. **Read `progress.txt`** to see what work has already been done
2. **Read `PRD.json`** and find the NEXT task where `pass: false`
   - Follow the `implementation_order` phases
   - Check `dependencies` - only work on tasks whose dependencies are all `pass: true`
3. **Complete that SINGLE task**
   - Follow the acceptance_criteria exactly
   - Write clean, typed code
4. **Update `PRD.json`**: Set the completed task's `pass` to `true`
5. **Append to `progress.txt`** with what you accomplished
6. **Make a git commit** with a descriptive message
7. **Check if ALL tasks are complete** - if yes, output:

```
<promise>LANDING REDESIGN COMPLETE</promise>
```

## Important Rules

- **ONE task per iteration** - don't try to do multiple
- **Always update progress.txt** - this is your memory
- **Always update PRD.json** - mark tasks complete
- **Run type check** after code changes: `npm run type-check` or `npx tsc --noEmit`
- **Commit after each task** with message format: `feat(landing): [TASK-ID] description`

## Verification Before Marking Complete
Before setting `pass: true` on any task:
- [ ] All acceptance criteria are met
- [ ] No TypeScript errors in the file
- [ ] File exists at correct path (for SETUP tasks)
- [ ] Follows design guidelines

## File Paths Quick Reference
```
/src/app/[locale]/page.tsx                           # Main page
/src/components/landing/globalnest/index.ts          # Barrel exports
/src/components/landing/globalnest/about.tsx         # NEW
/src/components/landing/globalnest/features-new.tsx  # NEW
/src/components/landing/globalnest/social-proof.tsx  # NEW
/src/components/landing/globalnest/faq.tsx           # NEW
/src/components/ui/accordion.tsx                     # shadcn accordion
/src/messages/en.json                                # Translations
```
