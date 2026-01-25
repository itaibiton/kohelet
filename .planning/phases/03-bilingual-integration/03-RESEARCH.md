# Phase 3: Bilingual Integration - Research

**Researched:** 2026-01-25
**Domain:** RTL/LTR bidirectional content rendering in Next.js with MDX
**Confidence:** HIGH

## Summary

This phase focuses on proper rendering of Hebrew (RTL) and English (LTR) content with correct text directionality, handling of mixed-direction text, direction-aware MDX components, and author profile implementation. The project already has foundational infrastructure in place: Velite for MDX processing, next-intl for locale management, and dir attribute set on the html root.

The standard approach uses **CSS logical properties** instead of physical directional properties (left/right), **unicode-bidi: isolate** for mixed-direction content, and **explicit dir attributes on specific elements** (code blocks, blockquotes) that need to maintain LTR direction within RTL context. For Hebrew typography, **bold is preferred over italic** for emphasis, and **letter-spacing** serves as a primary emphasis technique.

**Primary recommendation:** Use CSS logical properties throughout (ms-/me- for margins, ps-/pe- for padding, start/end for alignment), apply `dir="ltr"` explicitly to code blocks and technical content within RTL context, and extend Velite schema to include author metadata with references to separate author profile files.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-intl | 4.5.8+ | Locale detection and i18n | Official Next.js recommendation for App Router, provides `getLocale()` for server components |
| Tailwind CSS | 4.0+ | Styling with logical properties | v3.3+ introduced built-in logical properties (ms-/me-), v4.0 uses them by default for RTL |
| Velite | 0.3.1+ | MDX processing with Zod schemas | Type-safe content layer with frontmatter validation, MDX compilation at build time |
| Heebo (Google Fonts) | Variable | Hebrew + Latin typeface | Designed for Hebrew-Latin bilingual content, 7 weights (Thin to Black), free under OFL |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| rehype-slug | 6.0.0+ | Heading anchor IDs | Already in use, works with bidirectional text |
| rehype-autolink-headings | 7.1.0+ | Heading links | Already in use, behavior: 'wrap' works in RTL |
| rehype-highlight | 7.0.2+ | Code syntax highlighting | Already in use, must combine with dir="ltr" on code blocks |
| remark-gfm | 4.0.1+ | GitHub Flavored Markdown | Already in use, handles tables/lists in RTL |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS logical properties | RTL-specific CSS classes with direction modifiers | Logical properties are cleaner, automatically adapt, less code duplication |
| unicode-bidi: isolate | unicode-bidi: embed | `isolate` is safer - prevents parent context bleed, `embed` requires careful direction property management |
| Separate locale files | Single file with locale markers | Project already chose separate files - easier to maintain, clearer |

**Installation:**
```bash
# All dependencies already installed
# No additional packages needed
```

## Architecture Patterns

### Recommended File Structure
```
content/blog/
├── {slug}/
│   ├── en.mdx           # English content with LTR-specific frontmatter
│   └── he.mdx           # Hebrew content with RTL-specific frontmatter
├── authors/
│   ├── kohelet-digital.json   # Author profile referenced by posts
│   └── jane-doe.json          # Future author profiles
app/[locale]/blog/
├── [slug]/
│   ├── page.tsx         # Receives locale from params
│   └── mdx-content.tsx  # Already sets dir based on locale
components/blog/
├── author-profile.tsx   # Display author name, avatar, bio
└── direction-aware/     # Reusable MDX component overrides
    ├── code-block.tsx   # Force LTR for code
    ├── blockquote.tsx   # Maintain proper border/padding direction
    └── list.tsx         # Handle list markers in RTL
```

### Pattern 1: Setting Document Direction
**What:** Configure dir attribute at html root level based on locale
**When to use:** Already implemented in layout.tsx, this is the foundation

**Example:**
```typescript
// app/[locale]/layout.tsx (already implemented)
const dir = isRtl(locale as Locale) ? "rtl" : "ltr";
return <html lang={locale} dir={dir}>
```

### Pattern 2: CSS Logical Properties
**What:** Use inline-start/end instead of left/right for all spacing
**When to use:** All component styling, especially for margins, padding, borders, alignment

**Example:**
```typescript
// WRONG - physical properties
className="ml-4 pr-6 border-l-4 text-left"

// RIGHT - logical properties (Tailwind v4)
className="ms-4 pe-6 border-s-4 text-start"

// For prose styles in MDX wrapper
className="prose
  prose-blockquote:border-s-4
  prose-blockquote:ps-6
  prose-ul:ps-6
  prose-ol:ps-6"
```

### Pattern 3: Isolating LTR Content in RTL Context
**What:** Apply dir="ltr" and unicode-bidi: isolate to code blocks, emails, URLs
**When to use:** Code snippets, technical terms, proper nouns in Hebrew content

**Example:**
```typescript
// MDX code block component override
export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <pre
      dir="ltr"
      className={cn(
        "unicode-bidi-isolate", // or inline style
        className
      )}
    >
      <code>{children}</code>
    </pre>
  );
}

// CSS for isolation
.unicode-bidi-isolate {
  unicode-bidi: isolate;
}
```

### Pattern 4: Mixed-Direction Inline Content
**What:** Use bdi element for dynamic content with unknown direction
**When to use:** Author names from database, user-generated content, any dynamic text

**Example:**
```typescript
// Author name - might be Hebrew or English
<span>
  מאת: <bdi>{post.author}</bdi>
</span>

// Without bdi, if author name is English "John Doe",
// it might render incorrectly with RTL punctuation
```

### Pattern 5: Velite Author Schema Extension
**What:** Add author field to post schema, reference separate author profiles
**When to use:** Implement AUTH-01, AUTH-02, AUTH-03 requirements

**Example:**
```typescript
// velite.config.ts
const authors = defineCollection({
  name: 'Author',
  pattern: 'authors/*.json',
  schema: s.object({
    id: s.slug(),
    name: s.string(),
    bio: s.string().max(500),
    avatar: s.string().url(), // URL to avatar image
    email: s.string().email().optional(),
    twitter: s.string().optional(),
    website: s.string().url().optional(),
  }),
});

const posts = defineCollection({
  name: 'Post',
  pattern: 'blog/**/*.mdx',
  schema: s.object({
    title: s.string().max(200),
    excerpt: s.string().max(1000),
    date: s.isodate(),
    author: s.string(), // References author.id
    // ... existing fields
  }).transform((data, { meta, config }) => {
    // Lookup author from authors collection
    const author = config.collections.authors.find(
      a => a.id === data.author
    );
    return {
      ...data,
      authorData: author, // Embedded author object
    };
  }),
});

export default defineConfig({
  collections: { posts, authors },
});
```

### Anti-Patterns to Avoid

- **Using physical properties (left/right):** These don't flip automatically in RTL; use logical properties (start/end)
- **Assuming all Hebrew text is RTL only:** Hebrew content contains English technical terms, numbers, code - these need isolation
- **Applying dir="rtl" to individual elements:** Set dir on html root, override only when necessary (code blocks, specific LTR content)
- **Using italic for Hebrew emphasis:** Hebrew readers confuse italic with oblique; use bold or letter-spacing instead
- **Hardcoding author data in frontmatter:** Use author ID references to separate profiles for reusability

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Bidirectional text algorithm | Custom text reversal or direction detection | Browser's native dir attribute + unicode-bidi CSS | Unicode Bidirectional Algorithm is complex (P2, P3 rules), browsers implement it correctly |
| RTL-aware spacing | Conditional class switching (rtl:mr-4 ltr:ml-4) | CSS logical properties (ms-4, me-4) | Automatic adaptation, less code, better maintainability |
| Code block direction forcing | JavaScript-based direction detection | dir="ltr" attribute on <pre> elements | Simple, declarative, no runtime cost |
| Author data duplication | Copying author info to each post frontmatter | Velite collection references with transform | Single source of truth, type-safe, reusable across posts |
| Locale detection in components | Props drilling locale through component tree | next-intl's getLocale() or useLocale() | Built-in caching, optimized for App Router |

**Key insight:** The browser's bidirectional text rendering is extremely sophisticated. Your job is to provide the correct semantic hints (dir attribute, unicode-bidi CSS), not to reimplement the algorithm. Most RTL bugs come from fighting the browser instead of working with it.

## Common Pitfalls

### Pitfall 1: Code Blocks Reversing in RTL Context
**What goes wrong:** Code snippets in Hebrew blog posts render right-to-left, making code unreadable
**Why it happens:** Code inherits RTL direction from parent, Arabic/Hebrew script detection doesn't recognize programming syntax as LTR
**How to avoid:**
- Always apply `dir="ltr"` to `<pre>` and `<code>` elements
- Use Tailwind utility: `prose-pre:[direction:ltr]` in prose wrapper
- Add `unicode-bidi: isolate` to prevent context bleeding

**Warning signs:**
- Curly braces appear on wrong side: `{code}` becomes `}code{`
- Function calls look backwards: `function()` becomes `()function`
- Indentation appears on right side

### Pitfall 2: Punctuation and Numbers in Wrong Position
**What goes wrong:** English terms within Hebrew text show reversed punctuation: "React.js," appears as ",React.js"
**Why it happens:** Unicode bidirectional algorithm treats neutral characters (punctuation, numbers) based on surrounding context
**How to avoid:**
- Wrap English technical terms in `<bdi>` tags or `<span dir="ltr">`
- For inline code, use `<code dir="ltr">` in MDX components
- Don't rely on automatic detection for mixed content

**Warning signs:**
- Punctuation moves to wrong side of words
- Numbers appear in reverse order (2024 becomes 4202)
- Parentheses flip: (hello) becomes (hello(

### Pitfall 3: Blockquote Borders on Wrong Side
**What goes wrong:** Blockquotes in RTL content show border on left instead of right
**Why it happens:** CSS uses physical properties (`border-left`) instead of logical properties
**How to avoid:**
- Replace `border-left` with `border-inline-start`
- Replace `padding-left` with `padding-inline-start`
- Use Tailwind logical utilities: `border-s-4 ps-6`

**Warning signs:**
- Visual indicators (borders, markers) appear on wrong edge
- Indentation spacing on wrong side
- Quote marks positioned incorrectly

### Pitfall 4: Hebrew Font Lacking Proper Bold Weights
**What goes wrong:** Bold text in Hebrew appears unchanged or renders with faux-bold (browser simulation)
**Why it happens:** Font loaded doesn't include bold weight for Hebrew subset
**How to avoid:**
- Use fonts designed for Hebrew with multiple weights (Heebo supports 400-700)
- Load multiple font weights explicitly: `weight: ["400", "500", "600", "700"]`
- Test bold rendering in Hebrew content during development

**Warning signs:**
- Bold text looks "thick" but unclear (faux-bold rendering)
- Inconsistent weight between Hebrew and English text
- Browser synthesizing bold instead of using font's true bold

### Pitfall 5: List Markers Position in RTL
**What goes wrong:** Bullet points and numbers appear on wrong side of list items
**Why it happens:** Using `margin-left` or `padding-left` for list indentation
**How to avoid:**
- Use logical properties for list styling: `margin-inline-start`, `padding-inline-start`
- Tailwind prose plugin in v4 handles this automatically with logical properties
- Override with `prose-ul:ps-6 prose-ol:ps-6` if needed

**Warning signs:**
- Bullets/numbers on left in RTL content (should be on right)
- List items not indented properly
- Nested lists appear to outdent instead of indent

### Pitfall 6: Letter-Spacing Breaking Hebrew Connected Letters
**What goes wrong:** Applying letter-spacing to Hebrew text disconnects letters unnaturally
**Why it happens:** Letter-spacing is fine for emphasis in English, but breaks Hebrew visual flow
**How to avoid:**
- For Hebrew emphasis, use bold weight instead of letter-spacing
- If using letter-spacing for design, test thoroughly with Hebrew content
- Consider using different emphasis technique for Hebrew (color, background)

**Warning signs:**
- Hebrew text looks "spaced out" and hard to read
- Visual rhythm broken compared to normal text
- Text feels artificially stretched

## Code Examples

Verified patterns from official sources:

### MDX Prose Wrapper with RTL Support
```typescript
// app/[locale]/blog/[slug]/mdx-content.tsx
// Current implementation - needs enhancement
export function MDXContent({ code, locale }: MDXContentProps) {
  const Component = useMDXComponent(code)

  return (
    <div
      className="prose prose-invert prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-white
        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
        prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
        prose-strong:text-white prose-strong:font-semibold
        prose-code:text-blue-400 prose-code:bg-blue-500/10
        prose-code:px-2 prose-code:py-1 prose-code:rounded
        prose-code:[direction:ltr] prose-code:[unicode-bidi:isolate]
        prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800
        prose-pre:rounded-xl prose-pre:shadow-xl
        prose-pre:[direction:ltr]
        prose-blockquote:border-s-4 prose-blockquote:border-blue-500
        prose-blockquote:ps-6 prose-blockquote:italic
        prose-blockquote:text-neutral-400
        prose-ul:text-neutral-300 prose-ul:my-6 prose-ul:ps-6
        prose-ol:text-neutral-300 prose-ol:my-6 prose-ol:ps-6
        prose-li:my-2"
      dir={locale === "he" ? "rtl" : "ltr"}
    >
      <Component />
    </div>
  )
}
```

### Author Profile Component
```typescript
// components/blog/author-profile.tsx
import Image from 'next/image';
import { Author } from '@/.velite';

interface AuthorProfileProps {
  author: Author;
  locale: string;
}

export function AuthorProfile({ author, locale }: AuthorProfileProps) {
  const isRtl = locale === 'he';

  return (
    <div className={cn(
      "flex items-center gap-4",
      isRtl && "flex-row-reverse" // Image on right in RTL
    )}>
      <Image
        src={author.avatar}
        alt={author.name}
        width={48}
        height={48}
        className="rounded-full"
      />
      <div className={cn(isRtl && "text-right")}>
        <p className="font-semibold text-white">
          <bdi>{author.name}</bdi>
        </p>
        <p className="text-sm text-neutral-400">
          {author.bio}
        </p>
      </div>
    </div>
  );
}
```

### Using Locale in Server Components
```typescript
// app/[locale]/blog/[slug]/page.tsx
import { getLocale } from 'next-intl/server';
import { posts } from '@/.velite';

export default async function BlogPost({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const currentLocale = await getLocale();

  const post = posts.find(
    p => p.slug === slug && p.locale === currentLocale
  );

  return (
    <article>
      <h1>{post.title}</h1>
      <AuthorProfile author={post.authorData} locale={locale} />
      <MDXContent code={post.content} locale={locale} />
    </article>
  );
}
```

### Handling Mixed Direction in Inline Code
```typescript
// For MDX component override if needed
const components = {
  code: ({ children, ...props }: ComponentProps<'code'>) => (
    <code
      dir="ltr"
      style={{ unicodeBidi: 'isolate' }}
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }: ComponentProps<'pre'>) => (
    <pre dir="ltr" {...props}>
      {children}
    </pre>
  ),
};

// Pass to MDX component
<Component components={components} />
```

### Velite Author Collection Schema
```typescript
// velite.config.ts - Extended schema
import { defineConfig, defineCollection, s } from 'velite'

const authors = defineCollection({
  name: 'Author',
  pattern: 'authors/*.json',
  schema: s.object({
    id: s.slug(),
    name: s.string().max(100),
    bio: s.string().max(500),
    avatar: s.string(), // Path to avatar image
    email: s.string().email().optional(),
    twitter: s.string().optional(),
    website: s.string().url().optional(),
  }),
});

const posts = defineCollection({
  name: 'Post',
  pattern: 'blog/**/*.mdx',
  schema: s
    .object({
      title: s.string().max(200),
      excerpt: s.string().max(1000),
      date: s.isodate(),
      author: s.string(), // Author ID reference
      category: s.string(),
      published: s.boolean().default(true),
      metadata: s.metadata(),
      content: s.mdx(),
    })
    .transform((data, { meta }) => {
      // Existing transform logic
      const pathParts = meta.path.split('/')
      const fileName = pathParts[pathParts.length - 1]
      const folderName = pathParts[pathParts.length - 2]
      const locale = fileName.replace('.mdx', '') as 'en' | 'he'

      return {
        ...data,
        slug: folderName,
        locale,
        url: `/${locale}/blog/${folderName}`,
      }
    }),
});

export default defineConfig({
  root: 'content',
  collections: { posts, authors },
  // ... rest of config
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Physical CSS properties (left/right) | Logical CSS properties (start/end) | Tailwind v3.3 (2023) | Automatic RTL support, cleaner code |
| RTL plugins (tailwindcss-rtl) | Built-in logical properties in Tailwind v4 | Tailwind v4.0 (2024) | No plugin needed, smaller CSS bundle |
| unicode-bidi: embed | unicode-bidi: isolate | HTML5/CSS3 spec | Better isolation, fewer rendering bugs |
| Manual locale prop drilling | next-intl getLocale() with request caching | next-intl v3+ | Better performance, cleaner code |
| @tailwindcss/typography separate plugin | Included in Tailwind v4 | Tailwind v4.0 (2024) | Less configuration, better integration |
| Italic for Hebrew emphasis | Bold weight or letter-spacing | Typography best practices | Better Hebrew readability |

**Deprecated/outdated:**
- **tailwindcss-rtl plugin**: Tailwind v4 has built-in logical properties, no plugin needed
- **@tailwindcss/typography as plugin**: Now use `@plugin "@tailwindcss/typography"` in CSS
- **unicode-bidi: bidi-override**: Too aggressive, breaks normal text rendering - use `isolate` instead
- **direction CSS property alone**: W3C recommends HTML dir attribute instead

## Open Questions

Things that couldn't be fully resolved:

1. **Hebrew diacritical marks (nikkud) support**
   - What we know: Current blog content doesn't use nikkud (vocalization marks)
   - What's unclear: If future content needs nikkud, will Heebo font render it properly?
   - Recommendation: Assume no nikkud for now, can add specialized font later if needed

2. **Author profile image optimization**
   - What we know: Velite supports image() schema with blur data for Next.js Image
   - What's unclear: Should author avatars be in content/authors/ or public/avatars/?
   - Recommendation: Use public/avatars/ for simplicity, reference by path in author JSON

3. **Cross-referencing authors in Velite transform**
   - What we know: Velite transforms can access meta and config
   - What's unclear: Best practice for embedding author data vs. runtime lookup
   - Recommendation: Use runtime lookup from separate authors array (cleaner separation)

## Sources

### Primary (HIGH confidence)
- [W3C Inline markup and bidirectional text in HTML](https://www.w3.org/International/articles/inline-bidi-markup/index.en.html)
- [W3C Hebrew Layout Requirements](https://www.w3.org/International/hlreq/)
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling/)
- [next-intl Server & Client Components](https://next-intl.dev/docs/environments/server-client-components)
- [Velite Schema Documentation](https://velite.js.org/guide/velite-schemas)
- [MDN unicode-bidi](https://developer.mozilla.org/en-US/docs/Web/CSS/unicode-bidi)
- [MDN :dir() pseudo-class](https://developer.mozilla.org/en-US/docs/Web/CSS/:dir)

### Secondary (MEDIUM confidence)
- [Next.js App Router Localization with next-intl - Phrase](https://phrase.com/blog/posts/next-js-app-router-localization-next-intl/)
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind CSS v3.3 Logical Properties](https://tailwindcss.com/blog/tailwindcss-v3-3)
- [Flowbite RTL Guide](https://flowbite.com/docs/customize/rtl/)
- [Google Fonts Heebo Specimen](https://fonts.google.com/specimen/Heebo)
- [Typotheque: Secondary Style in Hebrew Typography](https://www.typotheque.com/articles/secondary-style-in-hebrew-typography)

### Tertiary (LOW confidence)
- [Next.js i18n support and RTL layouts - Medium](https://medium.com/wtxhq/next-js-i18n-support-and-rtl-layouts-87144ad727c9) - Community tutorial, patterns look reasonable
- [Best practices to Implement RTL in React JS - DEV Community](https://dev.to/neers/best-practices-to-implement-rtl-in-react-js-1ckg) - Community post, aligns with official sources
- [Velite GitHub Repository](https://github.com/zce/velite) - Official repo, examples confirm schema patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries verified, currently in use or officially recommended
- Architecture: HIGH - Patterns sourced from W3C, next-intl docs, verified with project code
- Pitfalls: MEDIUM-HIGH - W3C sources for bidi issues (HIGH), some from community experience (MEDIUM)
- Hebrew typography: MEDIUM - W3C Hebrew Layout Requirements (HIGH), but limited 2026-specific font evolution data

**Research date:** 2026-01-25
**Valid until:** 2026-02-24 (30 days - stable domain, CSS/HTML specs and typography principles change slowly)
