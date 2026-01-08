# PRD-04: Team Component Requirements

**Component Location**: `/components/sections/about/Team.tsx`
**Date**: 2026-01-08
**Status**: Ready for Implementation

---

## Executive Summary

The Team component showcases Kohelet Digital's leadership and core team members (4-6 people) in a glassmorphism-styled card grid. Each team member is presented with an initials-based avatar, name, role, bio, and optional social links. The component uses responsive grid layout, CSS-based scroll animations, and full i18n support for English and Hebrew (RTL).

---

## Component Overview

### Purpose
- Humanize the Kohelet brand by introducing key team members
- Establish credibility through professional roles and expertise
- Enable potential clients to connect with team members via LinkedIn/Twitter
- Maintain visual consistency with the glassmorphism dark theme

### User Experience Goals
- Users can quickly scan team members' roles and expertise
- Smooth, non-intrusive scroll animations draw attention to cards
- Social links provide easy connection pathways
- Professional, modern presentation consistent with B2B automation/AI positioning

---

## 1. Team Member Data Structure

### TypeScript Interface

```typescript
interface TeamMember {
  id: string;                    // Unique identifier (e.g., "member-1")
  name: string;                  // Full name
  role: string;                  // Job title/role
  bio: string;                   // 1-2 sentence bio (40-80 words)
  initials: string;              // For avatar display (e.g., "JD")
  avatarColor: string;           // Tailwind color class for avatar bg
  socialLinks?: {                // Optional social media links
    linkedin?: string;           // LinkedIn profile URL
    twitter?: string;            // Twitter/X profile URL
  };
}
```

### Field Requirements

| Field | Required | Max Length | Validation |
|-------|----------|------------|------------|
| `id` | Yes | 50 chars | Unique, kebab-case |
| `name` | Yes | 50 chars | Non-empty string |
| `role` | Yes | 60 chars | Non-empty string |
| `bio` | Yes | 300 chars | Non-empty string |
| `initials` | Yes | 3 chars | 1-3 uppercase letters |
| `avatarColor` | Yes | N/A | Valid Tailwind color class |
| `socialLinks` | No | N/A | Valid URLs if provided |

---

## 2. Team Members (Placeholder Data)

Define **6 realistic team members** for a B2B automation/AI agency based in Israel.

### Team Member 1: Founder & CEO
```typescript
{
  id: "member-1",
  name: "David Katz",
  role: "Founder & CEO",
  bio: "Serial entrepreneur with 15+ years building automation systems for enterprise. Previously led engineering at TechCorp. Passionate about helping businesses scale through intelligent software.",
  initials: "DK",
  avatarColor: "bg-accent-blue/20",
  socialLinks: {
    linkedin: "https://linkedin.com/in/davidkatz",
    twitter: "https://twitter.com/davidkatz"
  }
}
```

### Team Member 2: Chief Technology Officer
```typescript
{
  id: "member-2",
  name: "Sarah Cohen",
  role: "Chief Technology Officer",
  bio: "Full-stack architect specializing in AI-powered systems and scalable infrastructure. Former Principal Engineer at Google. Holds 3 patents in workflow automation.",
  initials: "SC",
  avatarColor: "bg-purple-500/20",
  socialLinks: {
    linkedin: "https://linkedin.com/in/sarahcohen"
  }
}
```

### Team Member 3: Head of AI Engineering
```typescript
{
  id: "member-3",
  name: "Michael Levi",
  role: "Head of AI Engineering",
  bio: "AI researcher turned practitioner. Built conversational AI systems used by 10M+ users. PhD in Machine Learning from Tel Aviv University. Leads our agent development team.",
  initials: "ML",
  avatarColor: "bg-green-500/20",
  socialLinks: {
    linkedin: "https://linkedin.com/in/michaellevi",
    twitter: "https://twitter.com/michaellevi"
  }
}
```

### Team Member 4: Head of Product
```typescript
{
  id: "member-4",
  name: "Rachel Stein",
  role: "Head of Product",
  bio: "Product strategist who transforms complex business requirements into elegant solutions. 12 years in B2B SaaS. Previously at Microsoft and Salesforce.",
  initials: "RS",
  avatarColor: "bg-pink-500/20",
  socialLinks: {
    linkedin: "https://linkedin.com/in/rachelstein"
  }
}
```

### Team Member 5: Lead Automation Engineer
```typescript
{
  id: "member-5",
  name: "Yossi Friedman",
  role: "Lead Automation Engineer",
  bio: "Workflow architect who loves eliminating manual work. Designed automation systems that saved clients 50,000+ hours. Former consultant at Deloitte Digital.",
  initials: "YF",
  avatarColor: "bg-orange-500/20",
  socialLinks: {
    linkedin: "https://linkedin.com/in/yossifriedman"
  }
}
```

### Team Member 6: Customer Success Lead
```typescript
{
  id: "member-6",
  name: "Maya Goldberg",
  role: "Customer Success Lead",
  bio: "Client advocate ensuring every automation delivers measurable ROI. Onboarded 100+ businesses onto AI systems. Background in operations consulting and change management.",
  initials: "MG",
  avatarColor: "bg-cyan-500/20",
  socialLinks: {
    linkedin: "https://linkedin.com/in/mayagoldberg",
    twitter: "https://twitter.com/mayagoldberg"
  }
}
```

---

## 3. Card Layout & Design (Glassmorphism)

### Card Container Specs

```typescript
<article className="group relative p-6 rounded-xl border border-white/10 bg-[#111113]/80 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]">
```

#### CSS Classes Breakdown:
- `group`: Enable group-hover states for child elements
- `relative`: Position context for absolute children
- `p-6`: Internal padding (24px all sides)
- `rounded-xl`: Border radius (12px)
- `border border-white/10`: 1px border, 10% white opacity
- `bg-[#111113]/80`: Background color at 80% opacity (glassmorphism)
- `backdrop-blur-md`: Background blur effect (8px)
- `transition-all duration-300`: Smooth transitions (300ms)
- `hover:scale-105`: Scale to 105% on hover
- `hover:border-white/20`: Increase border opacity on hover
- `hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]`: Blue glow on hover

### Avatar Specs

**Size**: 80px × 80px (mobile), 96px × 96px (desktop)
**Position**: Top-center of card

```typescript
<div className="flex justify-center mb-6">
  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold text-white ${member.avatarColor} border border-white/10">
    {member.initials}
  </div>
</div>
```

#### Avatar Colors Rotation:
Use the following Tailwind classes (already defined in member data):
- `bg-accent-blue/20` (brand blue)
- `bg-purple-500/20`
- `bg-green-500/20`
- `bg-pink-500/20`
- `bg-orange-500/20`
- `bg-cyan-500/20`

### Typography Specs

#### Name
```typescript
<h3 className="text-xl md:text-2xl font-semibold text-white text-center mb-2 tracking-tight">
  {member.name}
</h3>
```
- Font size: `text-xl` (20px mobile), `text-2xl` (24px desktop)
- Font weight: `font-semibold` (600)
- Color: `text-white`
- Alignment: `text-center`
- Spacing: `mb-2` (8px bottom margin)
- Tracking: `tracking-tight` (-0.025em)

#### Role
```typescript
<p className="text-sm md:text-base text-accent-blue text-center mb-4 font-medium">
  {member.role}
</p>
```
- Font size: `text-sm` (14px mobile), `text-base` (16px desktop)
- Color: `text-accent-blue` (#3b82f6)
- Alignment: `text-center`
- Spacing: `mb-4` (16px bottom margin)
- Font weight: `font-medium` (500)

#### Bio
```typescript
<p className="text-sm text-neutral-400 text-center leading-relaxed mb-6">
  {member.bio}
</p>
```
- Font size: `text-sm` (14px)
- Color: `text-neutral-400` (light gray)
- Alignment: `text-center`
- Line height: `leading-relaxed` (1.625)
- Spacing: `mb-6` (24px bottom margin)

---

## 4. Responsive Grid Layout

### Container Specs

```typescript
<div className="max-w-6xl mx-auto px-6">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
    {/* Team member cards */}
  </div>
</div>
```

### Breakpoint Specifications

| Breakpoint | Screen Width | Columns | Gap | Max Width |
|------------|--------------|---------|-----|-----------|
| Mobile | < 640px | 1 | 24px (`gap-6`) | 100% - 48px padding |
| Tablet | 640px - 1023px | 2 | 24px | 100% - 48px padding |
| Desktop | ≥ 1024px | 3 | 32px (`md:gap-8`) | 1152px (6xl) |

### Grid Behavior

**For 6 Members**:
- Mobile: 6 rows × 1 column
- Tablet: 3 rows × 2 columns
- Desktop: 2 rows × 3 columns

**For 4 Members** (Alternative):
- Mobile: 4 rows × 1 column
- Tablet: 2 rows × 2 columns
- Desktop: 2 rows × 2 columns (recommend `lg:grid-cols-2` instead)

**Recommendation**: Use 6 members with `lg:grid-cols-3` for balanced layout.

### Section Wrapper

```typescript
<section className="w-full py-20 md:py-32 relative z-10">
  <div className="max-w-6xl mx-auto px-6">
    {/* Section header */}
    {/* Grid */}
  </div>
</section>
```

- Padding: `py-20` (80px vertical on mobile), `md:py-32` (128px on desktop)
- Z-index: `z-10` (above background effects)
- Max width: `max-w-6xl` (1152px)
- Horizontal padding: `px-6` (24px)

---

## 5. Social Links Implementation

### Social Links Container

```typescript
{member.socialLinks && (
  <div className="flex justify-center gap-4 pt-4 border-t border-white/10">
    {member.socialLinks.linkedin && (
      <a
        href={member.socialLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${member.name} on LinkedIn`}
        className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-accent-blue/50 transition-all duration-300 group/social"
      >
        <Linkedin className="w-4 h-4 text-neutral-400 group-hover/social:text-accent-blue transition-colors" />
      </a>
    )}
    {member.socialLinks.twitter && (
      <a
        href={member.socialLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${member.name} on Twitter`}
        className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:border-accent-blue/50 transition-all duration-300 group/social"
      >
        <Twitter className="w-4 h-4 text-neutral-400 group-hover/social:text-accent-blue transition-colors" />
      </a>
    )}
  </div>
)}
```

### Icon Specs
- **Icons**: Use Lucide's `Linkedin` and `Twitter` components
- **Size**: 16px (`w-4 h-4`)
- **Color**: `text-neutral-400` (default), `text-accent-blue` (hover)
- **Container**: 40px circle with glassmorphism effect
- **Hover states**: Background lightens, border becomes blue-tinted

### Import Statement
```typescript
import { Linkedin, Twitter } from "lucide-react";
```

---

## 6. Animation Requirements

### CSS Animation Keyframes

Add to component or global CSS:

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

### Staggered Animation Implementation

Apply inline styles to stagger card animations:

```typescript
{members.map((member, index) => (
  <article
    key={member.id}
    className="animate-fade-in-up [...]"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    {/* Card content */}
  </article>
))}
```

**Stagger Pattern**:
- Card 1: 0ms delay
- Card 2: 100ms delay
- Card 3: 200ms delay
- Card 4: 300ms delay
- Card 5: 400ms delay
- Card 6: 500ms delay

### Section Header Animation

```typescript
<div
  className="text-center mb-12 md:mb-16 animate-fade-in-up"
  style={{ animationDelay: "0.1s" }}
>
  <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tighter text-white mb-4">
    {t("about.team.sectionTitle")}
  </h2>
  <p className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl mx-auto">
    {t("about.team.sectionSubtitle")}
  </p>
</div>
```

---

## 7. Translation Keys Structure

### English (`/content/en.json`)

```json
{
  "about": {
    "team": {
      "sectionTitle": "Meet the Team",
      "sectionSubtitle": "The experts building your automation future",
      "members": [
        {
          "name": "David Katz",
          "role": "Founder & CEO",
          "bio": "Serial entrepreneur with 15+ years building automation systems for enterprise. Previously led engineering at TechCorp. Passionate about helping businesses scale through intelligent software."
        },
        {
          "name": "Sarah Cohen",
          "role": "Chief Technology Officer",
          "bio": "Full-stack architect specializing in AI-powered systems and scalable infrastructure. Former Principal Engineer at Google. Holds 3 patents in workflow automation."
        },
        {
          "name": "Michael Levi",
          "role": "Head of AI Engineering",
          "bio": "AI researcher turned practitioner. Built conversational AI systems used by 10M+ users. PhD in Machine Learning from Tel Aviv University. Leads our agent development team."
        },
        {
          "name": "Rachel Stein",
          "role": "Head of Product",
          "bio": "Product strategist who transforms complex business requirements into elegant solutions. 12 years in B2B SaaS. Previously at Microsoft and Salesforce."
        },
        {
          "name": "Yossi Friedman",
          "role": "Lead Automation Engineer",
          "bio": "Workflow architect who loves eliminating manual work. Designed automation systems that saved clients 50,000+ hours. Former consultant at Deloitte Digital."
        },
        {
          "name": "Maya Goldberg",
          "role": "Customer Success Lead",
          "bio": "Client advocate ensuring every automation delivers measurable ROI. Onboarded 100+ businesses onto AI systems. Background in operations consulting and change management."
        }
      ]
    }
  }
}
```

### Hebrew (`/content/he.json`)

```json
{
  "about": {
    "team": {
      "sectionTitle": "הכירו את הצוות",
      "sectionSubtitle": "המומחים שבונים את עתיד האוטומציה שלכם",
      "members": [
        {
          "name": "דייוויד כץ",
          "role": "מייסד ומנכ\"ל",
          "bio": "יזם סדרתי עם 15+ שנות ניסיון בבניית מערכות אוטומציה לארגונים. הוביל בעבר את מחלקת ההנדסה ב-TechCorp. נלהב מלעזור לעסקים לצמוח באמצעות תוכנה חכמה."
        },
        {
          "name": "שרה כהן",
          "role": "סמנכ\"לית טכנולוגיה",
          "bio": "אדריכלית Full-stack המתמחה במערכות מונעות AI ותשתיות ניתנות להרחבה. מהנדסת ראשית לשעבר ב-Google. בעלת 3 פטנטים באוטומציה של תהליכי עבודה."
        },
        {
          "name": "מיכאל לוי",
          "role": "ראש הנדסת AI",
          "bio": "חוקר AI שהפך לאיש מעשה. בנה מערכות AI שיחתיות המשמשות 10 מיליון+ משתמשים. דוקטור בלמידת מכונה מאוניברסיטת תל אביב. מוביל את צוות פיתוח הסוכנים."
        },
        {
          "name": "רחל שטיין",
          "role": "ראש מוצר",
          "bio": "אסטרטגית מוצר שהופכת דרישות עסקיות מורכבות לפתרונות אלגנטיים. 12 שנות ניסיון ב-B2B SaaS. עבדה בעבר ב-Microsoft וב-Salesforce."
        },
        {
          "name": "יוסי פרידמן",
          "role": "מהנדס אוטומציה ראשי",
          "bio": "אדריכל תהליכים שאוהב לחסל עבודה ידנית. תכנן מערכות אוטומציה שחסכו ללקוחות 50,000+ שעות. יועץ לשעבר ב-Deloitte Digital."
        },
        {
          "name": "מאיה גולדברג",
          "role": "ראש הצלחת לקוח",
          "bio": "סנגורית לקוחות שמבטיחה שכל אוטומציה מספקת ROI מדיד. הטמיעה 100+ עסקים על מערכות AI. רקע בייעוץ תפעולי וניהול שינויים."
        }
      ]
    }
  }
}
```

---

## 8. Accessibility Requirements

### Semantic HTML

```typescript
<section aria-labelledby="team-heading" className="...">
  <h2 id="team-heading" className="...">
    {t("about.team.sectionTitle")}
  </h2>

  <div className="grid ...">
    <article className="...">
      {/* Team member card */}
    </article>
  </div>
</section>
```

### ARIA Labels for Social Links

```typescript
<a
  href={member.socialLinks.linkedin}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={`${member.name} on LinkedIn`}
  className="..."
>
  <Linkedin className="..." aria-hidden="true" />
</a>
```

**Key Points**:
- Use `aria-label` on links to provide context (screen readers)
- Add `aria-hidden="true"` to decorative icons
- Use `target="_blank"` with `rel="noopener noreferrer"` for security

### Focus States

All interactive elements (social links) must have visible focus states:

```css
/* Already included in Tailwind focus utilities */
focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-[#111113]
```

Apply to social link buttons:

```typescript
<a className="... focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-[#111113]">
```

### Keyboard Navigation

- All social links must be keyboard accessible (native `<a>` behavior)
- Tab order follows visual order (top-to-bottom, left-to-right)
- Enter key activates links

---

## 9. RTL (Right-to-Left) Support

### Locale Detection

```typescript
import { useTranslations, useLocale } from "next-intl";

export function Team() {
  const t = useTranslations("about.team");
  const locale = useLocale();
  const isRTL = locale === "he";

  // ...
}
```

### RTL-Aware Classes

Apply conditional classes for Hebrew:

```typescript
<article className={`... ${isRTL ? "text-right" : "text-left"}`}>
  {/* Content */}
</article>
```

**Note**: For this component, most content is `text-center`, so RTL impact is minimal. However, if bio text wraps differently, consider adding direction attribute:

```typescript
<p
  className="text-sm text-neutral-400 text-center leading-relaxed mb-6"
  dir={isRTL ? "rtl" : "ltr"}
>
  {member.bio}
</p>
```

---

## 10. Component Implementation Checklist

### File Structure
- [ ] Create `/components/sections/about/Team.tsx`
- [ ] Export component as default export
- [ ] Add to `/components/sections/about/index.ts` barrel export

### TypeScript
- [ ] Define `TeamMember` interface
- [ ] Create `members` array with 6 placeholder team members
- [ ] Ensure strict typing for all props and variables

### Styling
- [ ] Implement glassmorphism card design (`bg-[#111113]/80 backdrop-blur-md`)
- [ ] Apply responsive grid layout (1/2/3 columns)
- [ ] Create initials-based avatars with color rotation
- [ ] Add hover effects (scale, border glow, social icon color change)
- [ ] Ensure proper spacing and typography

### Animation
- [ ] Add CSS keyframes for `fadeInUp` animation
- [ ] Apply staggered delays to cards (100ms intervals)
- [ ] Include `prefers-reduced-motion` support
- [ ] Animate section header

### Internationalization
- [ ] Use `useTranslations("about.team")` hook
- [ ] Add translation keys to `/content/en.json`
- [ ] Add translation keys to `/content/he.json`
- [ ] Implement RTL detection with `useLocale()`
- [ ] Apply conditional RTL classes where needed

### Social Links
- [ ] Import `Linkedin` and `Twitter` from `lucide-react`
- [ ] Conditionally render social links if `socialLinks` exists
- [ ] Add proper `aria-label` attributes
- [ ] Include `target="_blank"` and `rel="noopener noreferrer"`
- [ ] Implement hover states for icons

### Accessibility
- [ ] Use semantic HTML (`<section>`, `<article>`, `<h2>`, `<h3>`)
- [ ] Add `aria-labelledby` to section
- [ ] Include `aria-label` on social links
- [ ] Ensure focus states are visible
- [ ] Test keyboard navigation

---

## 11. Acceptance Criteria

### Visual Requirements
- [ ] Team section displays 6 team member cards
- [ ] Cards use glassmorphism style (translucent background, blur, border)
- [ ] Initials-based avatars display with colored backgrounds (6 different colors)
- [ ] Responsive grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- [ ] Hover effects work: scale, border glow, social icon color change
- [ ] Typography matches spec (sizes, colors, weights, spacing)

### Functional Requirements
- [ ] Component renders without TypeScript errors
- [ ] Translation keys load correctly in English and Hebrew
- [ ] Social links open in new tabs with proper security attributes
- [ ] RTL layout applies correctly for Hebrew locale
- [ ] Animations trigger on page load with staggered delays
- [ ] `prefers-reduced-motion` disables animations

### Accessibility Requirements
- [ ] Semantic HTML structure is correct
- [ ] ARIA labels are present on social links
- [ ] Focus states are visible on all interactive elements
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Screen reader can announce all content correctly

### Code Quality
- [ ] No TypeScript errors (`npx tsc --noEmit` passes)
- [ ] Component uses `"use client"` directive (animations require client-side)
- [ ] Imports are organized and unused imports removed
- [ ] Code follows existing patterns from other About components
- [ ] Comments explain complex logic (if any)

---

## 12. Design System Reference

### Color Palette

| Element | Color Class | Hex Value |
|---------|-------------|-----------|
| Card Background | `bg-[#111113]/80` | #111113 @ 80% opacity |
| Card Border | `border-white/10` | White @ 10% opacity |
| Card Border (Hover) | `border-white/20` | White @ 20% opacity |
| Text Primary | `text-white` | #FFFFFF |
| Text Secondary | `text-neutral-400` | Tailwind neutral-400 |
| Accent Blue | `text-accent-blue` | #3b82f6 |
| Avatar Colors | Various `/20` opacity | 20% opacity backgrounds |

### Typography Scale

| Element | Mobile | Desktop | Weight | Tracking |
|---------|--------|---------|--------|----------|
| Section Title | 36px (text-4xl) | 60px (text-6xl) | 600 (semibold) | -0.025em (tight) |
| Section Subtitle | 18px (text-lg) | 20px (text-xl) | 300 (light) | Normal |
| Member Name | 20px (text-xl) | 24px (text-2xl) | 600 (semibold) | -0.025em (tight) |
| Member Role | 14px (text-sm) | 16px (text-base) | 500 (medium) | Normal |
| Member Bio | 14px (text-sm) | 14px (text-sm) | 400 (normal) | Normal |

### Spacing Scale

| Context | Property | Value |
|---------|----------|-------|
| Section Vertical Padding | `py-20 md:py-32` | 80px mobile, 128px desktop |
| Container Horizontal Padding | `px-6` | 24px |
| Card Padding | `p-6` | 24px all sides |
| Grid Gap | `gap-6 md:gap-8` | 24px mobile, 32px desktop |
| Section Header Bottom Margin | `mb-12 md:mb-16` | 48px mobile, 64px desktop |

---

## 13. Implementation Notes for UI Designer

### Component Structure

```
Team.tsx
├── Section wrapper (padding, max-width)
│   ├── Header (title, subtitle, animation)
│   └── Grid container
│       └── Team member cards (map over members array)
│           ├── Avatar (initials, colored background)
│           ├── Name
│           ├── Role
│           ├── Bio
│           └── Social links (conditional)
```

### Data Management

**Option 1: Hardcoded in Component (Recommended for now)**
```typescript
const members: TeamMember[] = [
  { id: "member-1", name: "...", ... },
  // ... 5 more
];
```

**Option 2: Fetch from Translation Files (Future Enhancement)**
```typescript
const members = t.raw("members") as TeamMember[];
```

For this PRD, use **Option 1** with the placeholder data provided in Section 2. The team data is semi-static and doesn't need to be in translation files (only translatable text should be there).

### Translation Strategy

Only these fields need translation:
- `sectionTitle`
- `sectionSubtitle`
- `members[].name` (transliteration for Hebrew)
- `members[].role` (translated role title)
- `members[].bio` (fully translated bio)

The `id`, `initials`, `avatarColor`, and `socialLinks` should remain in the component code.

### Performance Considerations

- **Images**: Using initials avoids image loading overhead
- **Animations**: CSS-based (not GSAP) for lightweight implementation
- **No external API calls**: All data is static/hardcoded
- **Lazy loading**: Not needed (content is above-the-fold-adjacent)

### Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- Mobile browsers (iOS Safari 14+, Chrome Android)
- Glassmorphism (`backdrop-filter`) has 95%+ support (graceful degradation: solid background if unsupported)

---

## 14. Future Enhancements (Out of Scope)

These features are explicitly **NOT** included in the current implementation:

- [ ] CMS integration for dynamic team member management
- [ ] Team member detail modal/page
- [ ] Video introductions or GIFs
- [ ] Real photographs (using placeholders/initials)
- [ ] Filtering by role/department
- [ ] "Join Our Team" CTA section
- [ ] Team member testimonials/quotes
- [ ] Skills/tech stack tags per member
- [ ] Contact forms per team member

---

## 15. Dependencies

### NPM Packages (Already Installed)
- `next` (16.x)
- `react` (19.x)
- `next-intl` (i18n)
- `lucide-react` (icons)
- `tailwindcss` (v4)
- `typescript`

### Internal Dependencies
- `/content/en.json` (English translations)
- `/content/he.json` (Hebrew translations)
- `/app/globals.css` (global styles, animation keyframes)
- Existing About page layout (`/app/[locale]/about/page.tsx`)

### Design System
- Glassmorphism theme from existing components
- Color palette (accent-blue, neutral shades)
- Typography scale (Tailwind + custom font-display)

---

## 16. Testing Checklist

Before marking this task complete, verify:

### Visual Testing
- [ ] Component renders correctly on mobile (375px width)
- [ ] Component renders correctly on tablet (768px width)
- [ ] Component renders correctly on desktop (1440px width)
- [ ] Glassmorphism effects are visible
- [ ] Avatar colors are distinct and properly applied
- [ ] Typography is legible and properly sized
- [ ] Spacing feels balanced (not cramped, not too loose)

### Functional Testing
- [ ] All 6 team members display
- [ ] Social links open correct URLs in new tabs
- [ ] Hover effects work on cards and social icons
- [ ] Animations play on page load
- [ ] No console errors or warnings

### Internationalization Testing
- [ ] English content displays correctly
- [ ] Hebrew content displays correctly
- [ ] RTL layout applies for Hebrew
- [ ] Translation keys are present in both locale files

### Accessibility Testing
- [ ] Tab navigation works through all interactive elements
- [ ] Focus states are visible
- [ ] Screen reader announces content correctly (test with VoiceOver/NVDA)
- [ ] Color contrast passes WCAG AA standards
- [ ] Reduced motion preference is respected

### Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Android

---

## 17. File Paths Summary

**Component File**:
- `/components/sections/about/Team.tsx` (main component)

**Translation Files** (add keys):
- `/content/en.json` → `about.team.*`
- `/content/he.json` → `about.team.*`

**Integration Point**:
- `/app/[locale]/about/page.tsx` (already imports `<Team />`)

**Barrel Export** (add):
- `/components/sections/about/index.ts` → `export { default as Team } from "./Team";`

**Global Styles** (animation keyframes):
- `/app/globals.css` (add `@keyframes fadeInUp` if not present)

---

## Conclusion

This PRD provides complete specifications for implementing the Team component with:
- 6 realistic placeholder team members
- Initials-based avatars with color rotation
- Glassmorphism card design with hover effects
- Responsive 1/2/3 column grid layout
- CSS-based scroll animations with stagger
- Full i18n support (English + Hebrew RTL)
- Optional social links (LinkedIn, Twitter)
- Comprehensive accessibility features

The component follows Kohelet's design system, maintains consistency with existing About page sections, and requires no external dependencies beyond what's already installed.

**Ready for UI implementation by the `ui-designer` agent.**
