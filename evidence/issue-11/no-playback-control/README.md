# Playback button removal

Removed the Robot King Play/Pause button, manual playback state, unused English/Hebrew control copy and three control CSS rules at Itai’s request. Both routes share the updated component. Normal playback now follows the system reduced-motion preference directly; visibility suspension, lazy loading and cleanup are retained.

- `npm run build`: pass, TypeScript and all 26 routes.
- Focused native Next ESLint on `RobotKing.tsx`, `Landing.tsx` and `landing-copy.ts`; `git diff --check`: pass.
- Production browser: English desktop at 1600px and Hebrew mobile at 390px each show zero mascot buttons, `robotState=ready`, `playing=true` and no horizontal overflow. Browser warnings/errors: none. [Measurements](browser-results.json).
- Reduced-motion preference handling was checked in source, without changing the system preference. The existing repository-wide FlatCompat lint configuration failure (#3/#7) remains as previously documented.

[English desktop](english-desktop.jpg) · [Hebrew mobile](hebrew-mobile.jpg)
