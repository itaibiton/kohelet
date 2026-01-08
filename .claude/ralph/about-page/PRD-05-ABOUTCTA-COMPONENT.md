# PRD-05: AboutCTA Component Requirements

## Document Information
- **Component**: AboutCTA
- **Location**: `/components/sections/about/AboutCTA.tsx`
- **Date**: 2026-01-08
- **Status**: Requirements Definition Complete
- **Dependencies**: None (final section of About page)

---

## 1. Component Overview

### Purpose
The AboutCTA component is the closing call-to-action section of the Kohelet About page, designed to convert visitors into consultation bookings or contact form submissions after learning about the company.

### Placement
- Positioned as the final component before the Footer on the About page
- Follows the Team component in the page hierarchy
- Full-width section with centered content

### User Goal
Enable users to take immediate action by:
1. Scheduling a consultation (primary action)
2. Getting in touch via contact form (secondary action)

---

## 2. Layout Specifications

### Container Structure
```
Section (full-width)
└─ Container (max-w-5xl mx-auto px-6 py-20 md:py-32)
   └─ Content Card/Wrapper (centered)
      ├─ Headline
      ├─ Subtext
      └─ Button Group
```

### Responsive Behavior
- **Mobile (< 768px)**:
  - Single column layout
  - Buttons stack vertically with full width
  - Reduced padding: `py-20 px-6`
  - Headline: `text-3xl`

- **Tablet (768px - 1024px)**:
  - Centered layout maintained
  - Buttons remain stacked or side-by-side based on content length
  - Moderate padding: `py-24 px-6`
  - Headline: `text-4xl`

- **Desktop (>1024px)**:
  - Maximum container width: `max-w-5xl`
  - Buttons side-by-side horizontally
  - Full padding: `py-32 px-6`
  - Headline: `text-5xl`

### Content Alignment
- All content centered: `text-center`
- Headline: `text-center`
- Subtext: `text-center max-w-2xl mx-auto`
- Buttons: `flex justify-center gap-4`

---

## 3. Content Structure

### Headline
- **Purpose**: Compelling, action-oriented call-to-action
- **Tone**: Confident, results-driven, transformational
- **Character Limit**: 40-60 characters
- **Suggested Content**: "Ready to Transform Your Business with AI?"
- **Alternative**: "Let's Build Something Extraordinary Together"

### Subtext
- **Purpose**: Reinforce value proposition and reduce friction
- **Length**: 1-2 sentences (120-180 characters)
- **Content Focus**:
  - Quick outcome statement
  - No-pressure invitation
  - Time-to-value indicator
- **Suggested Content**: "Schedule a 30-minute consultation to discuss how automation and custom software can scale your business. No sales pitch—just strategic insights tailored to your challenges."

### Primary Button
- **Label**: "Schedule a Consultation"
- **Action**: Links to external Calendly URL or internal `/contact` page
- **Purpose**: High-intent conversion action
- **Hierarchy**: Most prominent visual element

### Secondary Button
- **Label**: "Get in Touch"
- **Action**: Links to `/contact` page (anchor: `#contact`)
- **Purpose**: Lower-friction alternative for users not ready to commit
- **Hierarchy**: Visually subordinate to primary button

---

## 4. Visual Design (Glassmorphism)

### Selected Approach: Option A - Glassmorphism Card

**Rationale**: Consistent with AboutHero, CompanyStory, Values, and Team components. Maintains visual cohesion across the About page.

### Card Styling
```css
background: bg-[#111113]/80
backdrop-filter: backdrop-blur-md
border: border border-white/10
border-radius: rounded-2xl
padding: p-12 md:p-16
```

### Section Background
```css
background: bg-transparent
position: relative
z-index: 10
```
- ThreeBackground canvas renders behind
- No gradient overlay (keeps Three.js visible)

### Visual Hierarchy
1. **Card Container**:
   - `bg-[#111113]/80` with `backdrop-blur-md`
   - `border border-white/10`
   - `rounded-2xl`
   - `p-8 md:p-12 lg:p-16`
   - `max-w-3xl mx-auto` (narrower than section container)

2. **Spacing Between Elements**:
   - Headline to Subtext: `mt-6`
   - Subtext to Buttons: `mt-8 md:mt-10`
   - Between Buttons: `gap-4`

3. **Decorative Elements** (Optional):
   - Subtle gradient orb behind card (similar to AboutHero)
   - `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none -z-10`

---

## 5. Button Styling

### Primary Button ("Schedule a Consultation")

**Base Styles**:
```css
background: bg-accent-blue
text: text-white
font: text-sm md:text-base font-semibold
padding: px-8 py-3.5 md:px-10 md:py-4
border-radius: rounded-full
border: border border-accent-blue
shadow: shadow-[0_0_30px_rgba(59,130,246,0.3)]
transition: transition-all duration-300
```

**Hover State**:
```css
background: hover:bg-accent-blue-hover
shadow: hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]
transform: hover:scale-[1.02]
```

**Focus State**:
```css
outline: focus:outline-none
ring: focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-[#111113]
```

**Icon** (Optional):
- `ChevronRight` from `lucide-react`
- Positioned at end with `gap-2`
- Animates on hover: `group-hover:translate-x-0.5`
- RTL support: `rtl:rotate-180`

### Secondary Button ("Get in Touch")

**Base Styles**:
```css
background: bg-transparent
text: text-white
font: text-sm md:text-base font-medium
padding: px-8 py-3.5 md:px-10 md:py-4
border-radius: rounded-full
border: border border-white/10
transition: transition-all duration-300
```

**Hover State**:
```css
background: hover:bg-white/5
border: hover:border-white/20
transform: hover:scale-[1.02]
```

**Focus State**:
```css
outline: focus:outline-none
ring: focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-[#111113]
```

**Icon** (Optional):
- `Mail` from `lucide-react`
- Positioned at start with `gap-2`
- Size: `w-4 h-4`

### Button Container
```css
display: flex
flex-direction: flex-col sm:flex-row (stack on mobile, horizontal on tablet+)
justify-content: justify-center
align-items: items-center
gap: gap-4
margin-top: mt-8 md:mt-10
```

---

## 6. Typography

### Headline
```css
font-size: text-3xl md:text-4xl lg:text-5xl
font-family: font-display
font-weight: font-semibold
color: text-white
text-align: text-center
line-height: leading-[1.1]
tracking: tracking-tight
```

**Content Guidelines**:
- Should be action-oriented and transformational
- Use power words: "Transform", "Build", "Scale", "Accelerate"
- Keep under 60 characters for optimal readability
- Avoid generic CTAs like "Contact Us" (too passive)

### Subtext
```css
font-size: text-base md:text-lg lg:text-xl
color: text-neutral-400
text-align: text-center
line-height: leading-relaxed
max-width: max-w-2xl
margin: mx-auto mt-6
font-weight: font-light
```

**Content Guidelines**:
- Expand on the headline's promise
- Address objections (e.g., "no sales pitch", "30 minutes")
- Create urgency subtly (e.g., "limited slots", "schedule today")
- Keep under 180 characters

### Button Text
```css
font-size: text-sm md:text-base
font-weight: font-semibold (primary), font-medium (secondary)
letter-spacing: tracking-wide (optional)
text-transform: normal (not uppercase)
```

---

## 7. Animation Specifications

### Animation Strategy
Use CSS-based `animate-fade-in-up` animation (consistent with AboutHero pattern), NOT GSAP.

### Staggered Animation Timing
1. **Headline**: `animationDelay: "0.1s"`
2. **Subtext**: `animationDelay: "0.2s"`
3. **Primary Button**: `animationDelay: "0.3s"`
4. **Secondary Button**: `animationDelay: "0.4s"`

### CSS Animation (Already Defined in globals.css)
```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out both;
}
```

### Button Hover Animations
**Primary Button**:
- Scale: `hover:scale-[1.02]`
- Shadow: `hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]`
- Background: `hover:bg-accent-blue-hover`
- Duration: `transition-all duration-300`

**Secondary Button**:
- Scale: `hover:scale-[1.02]`
- Border: `hover:border-white/20`
- Background: `hover:bg-white/5`
- Duration: `transition-all duration-300`

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up {
    animation: none;
    opacity: 1;
    transform: none;
  }

  button:hover {
    transform: none;
  }
}
```

---

## 8. Accessibility

### Semantic HTML Structure
```html
<section id="cta" aria-labelledby="cta-heading">
  <div class="container">
    <div class="card">
      <h2 id="cta-heading">{headline}</h2>
      <p>{subtext}</p>
      <div class="button-group">
        <a href={calendlyUrl}
           className="primary-button"
           aria-label="Schedule a consultation with Kohelet">
          {primaryButtonText}
        </a>
        <a href="/contact#contact"
           className="secondary-button"
           aria-label="Navigate to contact form">
          {secondaryButtonText}
        </a>
      </div>
    </div>
  </div>
</section>
```

### ARIA Labels
- Section: `aria-labelledby="cta-heading"`
- Primary Button: `aria-label="Schedule a consultation with Kohelet"`
- Secondary Button: `aria-label="Navigate to contact form"`

### Focus States
- Primary Button: `focus:ring-2 focus:ring-accent-blue focus:ring-offset-2`
- Secondary Button: `focus:ring-2 focus:ring-white/30 focus:ring-offset-2`
- Tab order: Natural DOM order (headline → subtext → primary → secondary)

### Keyboard Navigation
- Both buttons fully keyboard accessible
- Enter/Space to activate
- Focus visible indicator clearly distinguishable

### Color Contrast
- Headline (white on dark): 15:1+ (WCAG AAA)
- Subtext (neutral-400 on dark): 7:1+ (WCAG AA)
- Primary button (white on accent-blue): 4.5:1+ (WCAG AA)
- Secondary button (white on transparent/border): 12:1+ (WCAG AAA)

### Screen Reader Support
- Semantic HTML (`<section>`, `<h2>`, `<p>`, `<a>`)
- No empty links or buttons
- Descriptive aria-labels for context
- Proper heading hierarchy (if preceded by `<h1>` or `<h2>` sections)

---

## 9. RTL (Right-to-Left) Support

### Text Alignment
- `text-center` works universally for both LTR and RTL
- No directional alignment needed

### Button Layout
**LTR Layout**:
```
[Primary Button] [Secondary Button]
```

**RTL Layout** (if buttons are side-by-side):
```
[Secondary Button] [Primary Button]
```

**Implementation**:
```tsx
<div className="flex flex-col sm:flex-row justify-center items-center gap-4 rtl:flex-row-reverse">
  <a href={primaryUrl}>Primary</a>
  <a href={secondaryUrl}>Secondary</a>
</div>
```

### Icon Rotation (if icons used)
- ChevronRight: `rtl:rotate-180`
- Mail icon: No rotation needed

### Spacing
- Gap between buttons: `gap-4` (uniform spacing, no directional adjustments)

---

## 10. Translation Keys Structure

### Keys Required
```json
{
  "about": {
    "cta": {
      "headline": "Ready to Transform Your Business with AI?",
      "subtext": "Schedule a 30-minute consultation to discuss how automation and custom software can scale your business. No sales pitch—just strategic insights tailored to your challenges.",
      "primaryButton": "Schedule a Consultation",
      "secondaryButton": "Get in Touch"
    }
  }
}
```

### Translation Guidelines
- **headline**: Should be transformational and specific to Kohelet's value prop
- **subtext**: Should address common objections (time commitment, sales pressure)
- **primaryButton**: Action-oriented, specific outcome ("Schedule", not "Learn More")
- **secondaryButton**: Lower commitment, broader ("Get in Touch", "Contact Us")

### Hebrew Translation Considerations
- Hebrew headlines may be shorter due to language density
- Ensure button text fits within button width constraints
- Test RTL layout with actual Hebrew text to verify spacing

---

## 11. Component Props

### Approach: Minimal Props (Translation-Driven)

**Rationale**: Keep component simple and let translations handle content. Only add props if flexibility is truly needed.

### Recommended Props Interface
```typescript
interface AboutCTAProps {
  calendlyUrl?: string; // Optional: Override default Calendly link
}
```

### Default Behavior
- **Primary Button Link**:
  - If `calendlyUrl` prop provided: Use external Calendly URL
  - If not provided: Default to `/contact` page

- **Secondary Button Link**:
  - Always links to `/contact` (internal page)

### Alternative: Hardcoded Links
If Calendly URL is consistent and unlikely to change:
```typescript
const CALENDLY_URL = "https://calendly.com/kohelet/consultation";
```

**Implementation**:
```tsx
export function AboutCTA({ calendlyUrl = "/contact" }: AboutCTAProps) {
  const t = useTranslations("about.cta");

  return (
    <section>
      {/* ... */}
      <a href={calendlyUrl}>{t("primaryButton")}</a>
      <a href="/contact">{t("secondaryButton")}</a>
    </section>
  );
}
```

---

## 12. File Location

**Component Path**: `/components/sections/about/AboutCTA.tsx`

**Import Path** (from About page):
```typescript
import AboutCTA from "@/components/sections/about/AboutCTA";
```

**Directory Structure**:
```
components/
└── sections/
    └── about/
        ├── AboutHero.tsx
        ├── CompanyStory.tsx
        ├── Stats.tsx
        ├── Values.tsx
        ├── Team.tsx
        └── AboutCTA.tsx  ← New component
```

---

## 13. Technical Implementation Notes

### Dependencies
```typescript
import { useTranslations } from "next-intl";
import { ChevronRight, Mail } from "lucide-react"; // Optional icons
```

### State Requirements
- **None**: Static component with no interactive state
- All interactivity handled via `<a>` tag navigation

### Performance Considerations
- No client-side JavaScript required (can be fully static)
- No animations requiring GSAP (pure CSS)
- Minimal bundle size impact

### External Integrations
- **Calendly**: If primary button links to Calendly, ensure `target="_blank"` and `rel="noopener noreferrer"`
- **Contact Form**: If linking to internal contact page, use relative path `/contact`

---

## 14. Content Variations (Future Considerations)

### Variation A: Urgency-Driven
- **Headline**: "Limited Consultation Slots Available This Month"
- **Subtext**: "Book your strategy session now before our calendar fills up. We work with a limited number of partners to ensure exceptional results."

### Variation B: Outcome-Focused
- **Headline**: "Build Your Custom Automation in 90 Days"
- **Subtext**: "From first call to live deployment, we move fast. Schedule a consultation to get your personalized automation roadmap."

### Variation C: Problem-Agitation
- **Headline**: "Still Wasting 20+ Hours Per Week on Manual Tasks?"
- **Subtext**: "Let's change that. Book a free consultation to identify your biggest automation opportunities and get a custom implementation plan."

### Recommendation
Start with **transformational/partnership tone** (default content), then A/B test against urgency-driven or outcome-focused variations.

---

## 15. Edge Cases & Error Handling

### External Link Failures (Calendly)
- **Issue**: Calendly link breaks or changes
- **Mitigation**:
  - Use environment variable for Calendly URL
  - Fallback to `/contact` if prop undefined
  - Monitor broken link reports

### Translation Missing
- **Issue**: Translation key not found
- **Mitigation**:
  - next-intl displays key name as fallback
  - Ensure all keys exist in both `en.json` and `he.json`

### Long Button Text (Hebrew)
- **Issue**: Hebrew translations may be longer than English
- **Mitigation**:
  - Test with actual Hebrew text
  - Use flexible button widths (`px-8 md:px-10`)
  - Allow text wrapping if necessary (`whitespace-normal`)

### Mobile Button Layout
- **Issue**: Two buttons side-by-side may be cramped on mobile
- **Solution**: Use `flex-col sm:flex-row` to stack on mobile, horizontal on tablet+

---

## 16. Success Metrics

### Engagement Metrics
1. **CTA Click-Through Rate (CTR)**:
   - Primary button: Target 8-12% of About page visitors
   - Secondary button: Target 3-5% of About page visitors

2. **Scroll Depth**:
   - % of visitors reaching AboutCTA section: Target 60%+

3. **Conversion Rate**:
   - Visitors who click CTA → complete contact form: Target 30%+
   - Visitors who click CTA → book Calendly appointment: Target 40%+

### A/B Testing Opportunities
1. Headline variations (transformational vs. urgency vs. outcome)
2. Button text ("Schedule Consultation" vs. "Book Strategy Session")
3. Subtext length (1 sentence vs. 2 sentences)
4. Visual treatment (glassmorphism card vs. gradient background)

---

## 17. Design Specifications Summary

### Container
- **Width**: `max-w-5xl mx-auto`
- **Padding**: `px-6 py-20 md:py-32`
- **Background**: `bg-transparent`
- **Z-index**: `relative z-10`

### Card Wrapper
- **Max Width**: `max-w-3xl mx-auto`
- **Background**: `bg-[#111113]/80`
- **Backdrop**: `backdrop-blur-md`
- **Border**: `border border-white/10`
- **Corners**: `rounded-2xl`
- **Padding**: `p-8 md:p-12 lg:p-16`

### Headline
- **Size**: `text-3xl md:text-4xl lg:text-5xl`
- **Weight**: `font-display font-semibold`
- **Color**: `text-white`
- **Spacing**: `tracking-tight leading-[1.1]`
- **Alignment**: `text-center`

### Subtext
- **Size**: `text-base md:text-lg lg:text-xl`
- **Color**: `text-neutral-400`
- **Weight**: `font-light`
- **Spacing**: `leading-relaxed`
- **Max Width**: `max-w-2xl mx-auto`
- **Margin Top**: `mt-6`

### Button Group
- **Layout**: `flex flex-col sm:flex-row justify-center items-center gap-4`
- **Margin Top**: `mt-8 md:mt-10`
- **RTL Support**: `rtl:flex-row-reverse`

### Primary Button
- **Background**: `bg-accent-blue hover:bg-accent-blue-hover`
- **Text**: `text-white text-sm md:text-base font-semibold`
- **Padding**: `px-8 py-3.5 md:px-10 md:py-4`
- **Border**: `border border-accent-blue rounded-full`
- **Shadow**: `shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]`
- **Hover**: `hover:scale-[1.02]`
- **Focus**: `focus:ring-2 focus:ring-accent-blue focus:ring-offset-2`

### Secondary Button
- **Background**: `bg-transparent hover:bg-white/5`
- **Text**: `text-white text-sm md:text-base font-medium`
- **Padding**: `px-8 py-3.5 md:px-10 md:py-4`
- **Border**: `border border-white/10 hover:border-white/20 rounded-full`
- **Hover**: `hover:scale-[1.02]`
- **Focus**: `focus:ring-2 focus:ring-white/30 focus:ring-offset-2`

### Animations
- **Headline**: `animate-fade-in-up` with `animationDelay: "0.1s"`
- **Subtext**: `animate-fade-in-up` with `animationDelay: "0.2s"`
- **Primary Button**: `animate-fade-in-up` with `animationDelay: "0.3s"`
- **Secondary Button**: `animate-fade-in-up` with `animationDelay: "0.4s"`
- **Transitions**: `transition-all duration-300`

---

## 18. Implementation Checklist

### Pre-Implementation
- [ ] Confirm Calendly URL or default link strategy
- [ ] Add translation keys to `content/en.json` and `content/he.json`
- [ ] Verify AboutHero pattern for styling consistency

### Development
- [ ] Create `/components/sections/about/AboutCTA.tsx`
- [ ] Import `useTranslations` from `next-intl`
- [ ] Import icons from `lucide-react` (if used)
- [ ] Implement glassmorphism card wrapper
- [ ] Add headline with proper typography classes
- [ ] Add subtext with `max-w-2xl mx-auto`
- [ ] Create button group with responsive flex layout
- [ ] Implement primary button with glow effect
- [ ] Implement secondary button with ghost style
- [ ] Add staggered `animate-fade-in-up` animations
- [ ] Add RTL support (`rtl:flex-row-reverse` on button group)
- [ ] Add ARIA labels and semantic HTML
- [ ] Implement focus states for accessibility
- [ ] Add optional decorative gradient orb

### Testing
- [ ] Test on mobile (320px - 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (1024px+)
- [ ] Test RTL layout with Hebrew translations
- [ ] Test keyboard navigation (Tab, Enter)
- [ ] Test screen reader compatibility
- [ ] Verify animation timing matches specs
- [ ] Test reduced motion preference
- [ ] Verify color contrast ratios
- [ ] Test button hover states
- [ ] Test external link (Calendly) opens in new tab

### Integration
- [ ] Import component in `/app/[locale]/about/page.tsx`
- [ ] Position before `<Footer />` component
- [ ] Verify Z-index layering with ThreeBackground
- [ ] Test entire About page flow (Hero → CTA)
- [ ] Verify section spacing matches design system

### Post-Launch
- [ ] Monitor CTA click-through rates
- [ ] Track scroll depth to CTA section
- [ ] A/B test headline variations
- [ ] Collect user feedback on messaging
- [ ] Monitor conversion rates (CTA click → contact submission)

---

## 19. Questions for Stakeholders (If Applicable)

Before implementation, consider validating:

1. **Calendly Integration**:
   - Do we have a dedicated Calendly link for consultations?
   - Should primary button link to Calendly or `/contact` page?
   - If Calendly, should it open in new tab or same tab?

2. **Messaging Tone**:
   - Is "Ready to Transform Your Business with AI?" aligned with brand voice?
   - Should we emphasize urgency (limited slots) or partnership (collaboration)?
   - Any specific objections to address in subtext?

3. **Conversion Goals**:
   - Is consultation booking the primary goal, or contact form submission?
   - Should we add a third option (e.g., "Download Case Studies")?

4. **Hebrew Translations**:
   - Who will provide final Hebrew copy for headline and subtext?
   - Any cultural considerations for CTA messaging in Hebrew market?

---

## 20. Summary for progress.txt

**PRD-05: AboutCTA Component Requirements - COMPLETE**

**Deliverables**:
- Comprehensive 20-section PRD document saved to `.claude/ralph/about-page/PRD-05-ABOUTCTA-COMPONENT.md`
- Layout: Centered glassmorphism card (`max-w-3xl`, `bg-[#111113]/80`, `backdrop-blur-md`)
- Content: Headline + Subtext + Primary Button + Secondary Button
- Primary Button: Solid blue with glow (`bg-accent-blue`, `shadow-[0_0_30px_rgba(59,130,246,0.3)]`)
- Secondary Button: Ghost style (`border-white/10`, `hover:bg-white/5`)
- Typography: Headline `text-3xl/4xl/5xl font-display font-semibold`, Subtext `text-neutral-400 max-w-2xl`
- Animation: CSS `animate-fade-in-up` with staggered delays (0.1s to 0.4s)
- Accessibility: Semantic HTML, ARIA labels, focus states, keyboard navigation
- RTL Support: `rtl:flex-row-reverse` on button group, centered text alignment
- Translation Keys: `about.cta.headline`, `about.cta.subtext`, `about.cta.primaryButton`, `about.cta.secondaryButton`
- Props: Optional `calendlyUrl` prop (defaults to `/contact`)
- File Location: `/components/sections/about/AboutCTA.tsx`

**Component Props**:
```typescript
interface AboutCTAProps {
  calendlyUrl?: string; // Optional: defaults to "/contact"
}
```

**Suggested Content**:
- Headline: "Ready to Transform Your Business with AI?"
- Subtext: "Schedule a 30-minute consultation to discuss how automation and custom software can scale your business. No sales pitch—just strategic insights tailored to your challenges."
- Primary Button: "Schedule a Consultation"
- Secondary Button: "Get in Touch"

**Next Task**: UI-05 (Implement AboutCTA component) - depends on PRD-05 ✅
