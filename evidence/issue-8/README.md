# Hebrew website verification — issue #8

Combined production build of the parent bilingual landing (PR #5) and the remaining website translations (PR #9). Preview: http://127.0.0.1:3108.

- `npm ci` and `npm run build` pass, including TypeScript and all 26 routes.
- All four Hebrew article bodies, headings, and lists are translated. English article files and all nine fenced code examples are unchanged; translation flags removed.
- Native Next ESLint passes the edited UI, article page, and content schema. For MDXContent only, the temporary config disables the unchanged `react-hooks/static-components` compiler finding; that same finding was reproduced on the parent branch. The repository lint command remains blocked by the existing FlatCompat circular-configuration issue (#3 / #7). No lint configuration was changed in this PR.
- Eleven browser checks pass in Chrome: desktop 1440px and mobile 390px; Hebrew prose/bio/labels, explicit route-locale dates in an English Los Angeles browser, article language switching, English preservation, both landing routes, and Hebrew 404 metadata inherited from the locale layout. No page errors.
- Code is LTR, contained, keyboard focusable, and horizontally scrollable with ArrowRight. No horizontal document overflow at the tested widths.
- Axe reports the existing unnamed blog category selector and footer copyright contrast, tracked separately in #10. The newly scrollable code region has no remaining focusability finding. These scans do not establish whole-site accessibility compliance.

Screenshots and machine-readable browser results are in this directory. No contact form submission, email sending, deployment, or merge was performed for this issue.

Merge order: PR #5, then PR #9. Only Itai merges.
