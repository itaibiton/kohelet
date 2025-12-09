# Section Components

Modern, production-ready section components for the Kohelet landing page.

## Components

### Navigation

Scroll-aware navigation component with smooth transitions.

**File:** `/Users/itaibiton/Code/kohelet/components/sections/Navigation.tsx`

**Features:**
- Scroll-triggered background blur and opacity
- Smooth transitions between states
- Desktop navigation links with hover effects
- Logo with icon and brand name
- CTA button with clip-path styling

**States:**
- Not scrolled: Transparent background, larger padding
- Scrolled: Dark background with backdrop blur, reduced padding

**Usage:**
```tsx
import Navigation from "@/components/sections/Navigation";

export default function Page() {
  return <Navigation />;
}
```

### Hero

Main hero section with 3D holographic network visualization and floating stats cards.

**File:** `/Users/itaibiton/Code/kohelet/components/sections/Hero.tsx`

**Features:**
- Two-column layout (content + 3D visual)
- Animated status badge with pulsing indicator
- Large gradient headline with custom tracking
- Call-to-action buttons (primary + ghost variants)
- Live stats display
- Holographic 3D network animation
- Floating metric cards with animations

**Components Used:**
- `HolographicNetwork` - 3D particle network animation
- `Button` - Styled CTA buttons
- `StatItem` - Metric display component
- Icons: `TerminalIcon`, `ChevronRightIcon`, `ActivityIcon`

**Usage:**
```tsx
import Hero from "@/components/sections/Hero";

export default function Page() {
  return <Hero />;
}
```

## Dependencies

These components require the following:

### UI Components
- `/components/ui/Button.tsx` - Button component with variants
- `/components/ui/StatItem.tsx` - Stat display component

### Effects
- `/components/effects/HolographicNetwork.tsx` - 3D network visualization

### Icons
- `/components/icons/index.tsx` - Icon components (CodeIcon, ChevronRightIcon, TerminalIcon, ActivityIcon)

### Utilities
- `/lib/utils.ts` - cn() utility for class merging

### Styles
All custom animations and utilities are defined in `/app/globals.css`:
- `.clip-hud` - Custom clip-path for sci-fi button effect
- `.tracking-tighter-custom` - Extra tight letter spacing
- `.text-glow` - Text shadow glow effect
- `.animate-pulse-slow` - Slow pulsing animation
- `.animate-shimmer` - Shimmer gradient animation

## Styling

Components use Tailwind CSS with custom design tokens defined in `globals.css`:

**Color Palette:**
- Brand Dark: `#020204`
- Brand Gray: `#111113`
- Accent Blue: `#3b82f6`
- Accent Emerald: `#10b981`

**Responsive Breakpoints:**
- `md:` - Tablet and up
- `lg:` - Desktop and up
- `xl:` - Large desktop

## Integration Example

```tsx
// app/page.tsx
import Navigation from "@/components/sections/Navigation";
import Hero from "@/components/sections/Hero";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen">
      <Navigation />
      <Hero />
      {/* Other sections */}
      <CTA />
      <Footer />
    </main>
  );
}
```

## Performance Notes

- Navigation uses window scroll event with cleanup
- Hero section includes 3D canvas animation (optimized with requestAnimationFrame)
- All animations use CSS transforms for GPU acceleration
- Components are client-side rendered ("use client") for interactivity
