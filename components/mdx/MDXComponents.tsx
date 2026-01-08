import Image from "next/image";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * Type definition for MDX component overrides
 * Maps HTML element names to React component types
 */
type MDXComponents = {
  [key: string]: React.ComponentType<any>;
};

/**
 * Helper function to merge class names
 * Combines default classes with any additional classes passed via props
 */
function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Heading Components (h1-h6)
 *
 * Progressive sizing with consistent white text and proper document flow spacing.
 * Uses tracking-tight for display headings and proper margin for content rhythm.
 */
const H1 = ({ className, ...props }: ComponentPropsWithoutRef<"h1">) => (
  <h1
    className={cn(
      "text-3xl md:text-4xl font-bold text-white tracking-tight",
      "mb-6 mt-10 first:mt-0",
      className
    )}
    {...props}
  />
);

const H2 = ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
  <h2
    className={cn(
      "text-2xl md:text-3xl font-semibold text-white tracking-tight",
      "mt-12 mb-6 first:mt-0",
      className
    )}
    {...props}
  />
);

const H3 = ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
  <h3
    className={cn(
      "text-xl md:text-2xl font-semibold text-white",
      "mt-8 mb-4 first:mt-0",
      className
    )}
    {...props}
  />
);

const H4 = ({ className, ...props }: ComponentPropsWithoutRef<"h4">) => (
  <h4
    className={cn(
      "text-lg md:text-xl font-medium text-white",
      "mt-6 mb-3 first:mt-0",
      className
    )}
    {...props}
  />
);

const H5 = ({ className, ...props }: ComponentPropsWithoutRef<"h5">) => (
  <h5
    className={cn(
      "text-base md:text-lg font-medium text-white",
      "mt-4 mb-2 first:mt-0",
      className
    )}
    {...props}
  />
);

const H6 = ({ className, ...props }: ComponentPropsWithoutRef<"h6">) => (
  <h6
    className={cn(
      "text-sm md:text-base font-medium text-white/90",
      "mt-4 mb-2 first:mt-0",
      className
    )}
    {...props}
  />
);

/**
 * Paragraph Component
 *
 * Optimized for readability with white/70 text and relaxed line height.
 * Consistent bottom margin for proper content rhythm.
 */
const Paragraph = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      "text-white/70 leading-relaxed mb-6 text-base md:text-lg",
      className
    )}
    {...props}
  />
);

/**
 * Link Component
 *
 * Uses accent-blue color with underline styling.
 * Includes smooth hover transition for visual feedback.
 */
const Anchor = ({ className, ...props }: ComponentPropsWithoutRef<"a">) => (
  <a
    className={cn(
      "text-accent-blue hover:text-accent-blue/80",
      "underline underline-offset-4 decoration-accent-blue/40",
      "hover:decoration-accent-blue",
      "transition-colors duration-200",
      className
    )}
    {...props}
  />
);

/**
 * Inline Code Component
 *
 * Styled for inline code snippets (not inside pre blocks).
 * Features glassmorphism background with accent-blue text.
 */
const InlineCode = ({ className, ...props }: ComponentPropsWithoutRef<"code">) => (
  <code
    className={cn(
      "bg-white/5 text-accent-blue",
      "px-2 py-0.5 rounded",
      "border border-white/10",
      "text-sm font-mono",
      className
    )}
    {...props}
  />
);

/**
 * Code Block Container (pre)
 *
 * Glassmorphism container for syntax-highlighted code blocks.
 * Resets nested code element styling to preserve syntax highlighting.
 */
const Pre = ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => (
  <pre
    className={cn(
      "bg-[#0a0a0b] rounded-xl p-4 md:p-5",
      "overflow-x-auto mb-6",
      "border border-white/10",
      "text-sm md:text-base font-mono",
      // Reset nested code element styling
      "[&>code]:bg-transparent [&>code]:p-0 [&>code]:border-0 [&>code]:text-inherit [&>code]:rounded-none",
      className
    )}
    {...props}
  />
);

/**
 * Unordered List Component
 *
 * Disc markers with accent-blue color.
 * Proper indentation and spacing for readability.
 */
const UnorderedList = ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
  <ul
    className={cn(
      "list-disc marker:text-accent-blue",
      "pl-6 space-y-2 mb-6",
      "text-white/70",
      className
    )}
    {...props}
  />
);

/**
 * Ordered List Component
 *
 * Decimal markers with accent-blue color.
 * Proper indentation and spacing for readability.
 */
const OrderedList = ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
  <ol
    className={cn(
      "list-decimal marker:text-accent-blue",
      "pl-6 space-y-2 mb-6",
      "text-white/70",
      className
    )}
    {...props}
  />
);

/**
 * List Item Component
 *
 * Individual list items with proper spacing and line height.
 */
const ListItem = ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
  <li
    className={cn("leading-relaxed pl-1", className)}
    {...props}
  />
);

/**
 * Blockquote Component
 *
 * Features accent-blue left border with subtle background.
 * Italic text styling for visual distinction.
 */
const Blockquote = ({ className, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
  <blockquote
    className={cn(
      "border-l-4 border-accent-blue",
      "pl-4 py-2 my-6",
      "bg-white/5 rounded-r-lg",
      "text-white/80 italic",
      className
    )}
    {...props}
  />
);

/**
 * Image Component
 *
 * Uses Next.js Image for optimization.
 * Features rounded corners and subtle border.
 * Handles fallback dimensions for MDX images.
 */
interface MDXImageProps extends ComponentPropsWithoutRef<"img"> {
  src?: string;
  alt?: string;
  width?: number | string;
  height?: number | string;
}

const MDXImage = ({ src, alt, width, height, className, ...props }: MDXImageProps) => {
  // For MDX images, we need to handle cases where dimensions aren't provided
  // Use fill mode with aspect ratio container, or explicit dimensions if available
  const hasExplicitDimensions = width && height;

  if (!src) {
    return null;
  }

  if (hasExplicitDimensions) {
    return (
      <Image
        src={src}
        alt={alt || ""}
        width={typeof width === "string" ? parseInt(width, 10) : width}
        height={typeof height === "string" ? parseInt(height, 10) : height}
        className={cn(
          "rounded-xl border border-white/10 my-8",
          "w-full h-auto",
          className
        )}
        {...props}
      />
    );
  }

  // Use a responsive container with fill mode for images without dimensions
  return (
    <span className="block relative w-full my-8 aspect-video">
      <Image
        src={src}
        alt={alt || ""}
        fill
        className={cn(
          "rounded-xl border border-white/10",
          "object-cover",
          className
        )}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        {...props}
      />
    </span>
  );
};

/**
 * Table Components
 *
 * Full-featured table styling with glassmorphism design.
 * Includes responsive wrapper for horizontal scrolling.
 */
const TableWrapper = ({ className, children, ...props }: ComponentPropsWithoutRef<"table">) => (
  <div className="overflow-x-auto my-6 rounded-xl border border-white/10">
    <table
      className={cn("w-full border-collapse", className)}
      {...props}
    >
      {children}
    </table>
  </div>
);

const TableHead = ({ className, ...props }: ComponentPropsWithoutRef<"thead">) => (
  <thead
    className={cn("bg-white/5", className)}
    {...props}
  />
);

const TableBody = ({ className, ...props }: ComponentPropsWithoutRef<"tbody">) => (
  <tbody
    className={cn("divide-y divide-white/10", className)}
    {...props}
  />
);

const TableRow = ({ className, ...props }: ComponentPropsWithoutRef<"tr">) => (
  <tr
    className={cn(
      "border-b border-white/10 last:border-b-0",
      "transition-colors hover:bg-white/[0.02]",
      className
    )}
    {...props}
  />
);

const TableHeader = ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
  <th
    className={cn(
      "bg-white/5 text-white font-semibold text-left",
      "p-3 border-b border-white/10",
      className
    )}
    {...props}
  />
);

const TableCell = ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
  <td
    className={cn(
      "text-white/70 p-3 border-b border-white/10",
      className
    )}
    {...props}
  />
);

/**
 * Horizontal Rule Component
 *
 * Gradient divider for visual section breaks.
 * Uses transparent-to-white gradient for subtle appearance.
 */
const HorizontalRule = ({ className, ...props }: ComponentPropsWithoutRef<"hr">) => (
  <hr
    className={cn(
      "border-0 h-px my-8",
      "bg-gradient-to-r from-transparent via-white/20 to-transparent",
      className
    )}
    {...props}
  />
);

/**
 * Strong (Bold) Component
 *
 * Semibold weight with full white color for emphasis.
 */
const Strong = ({ className, ...props }: ComponentPropsWithoutRef<"strong">) => (
  <strong
    className={cn("font-semibold text-white", className)}
    {...props}
  />
);

/**
 * Emphasis (Italic) Component
 *
 * Italic styling with slightly muted text color.
 */
const Emphasis = ({ className, ...props }: ComponentPropsWithoutRef<"em">) => (
  <em
    className={cn("italic text-white/80", className)}
    {...props}
  />
);

/**
 * MDX Components Object
 *
 * Maps HTML element names to their styled React component equivalents.
 * Export this object and pass it to your MDX renderer.
 *
 * Usage with next-contentlayer2:
 * ```tsx
 * import { useMDXComponent } from "next-contentlayer2/hooks";
 * import { mdxComponents } from "@/components/mdx/MDXComponents";
 *
 * const MDXContent = useMDXComponent(code);
 * return <MDXContent components={mdxComponents} />;
 * ```
 */
export const mdxComponents: MDXComponents = {
  // Headings
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,

  // Text content
  p: Paragraph,
  a: Anchor,
  strong: Strong,
  em: Emphasis,

  // Code
  code: InlineCode,
  pre: Pre,

  // Lists
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,

  // Block elements
  blockquote: Blockquote,
  hr: HorizontalRule,

  // Media
  img: MDXImage,

  // Tables
  table: TableWrapper,
  thead: TableHead,
  tbody: TableBody,
  tr: TableRow,
  th: TableHeader,
  td: TableCell,
};

/**
 * Named exports for individual components
 * Useful when you need to use specific components outside of MDX context
 */
export {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Paragraph,
  Anchor,
  InlineCode,
  Pre,
  UnorderedList,
  OrderedList,
  ListItem,
  Blockquote,
  MDXImage,
  TableWrapper,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  HorizontalRule,
  Strong,
  Emphasis,
};

// Default export for convenience
export default mdxComponents;
