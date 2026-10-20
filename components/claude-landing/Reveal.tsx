"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";

type RevealProps = {
  as?: ElementType;
  className?: string;
  delay?: number;
  children: React.ReactNode;
  id?: string;
};

/**
 * Scroll reveal that fires once. Marketing surface only.
 * Motion lives in CSS (.cl-reveal); this just flips the attribute.
 */
export function Reveal({ as, className = "", delay = 0, children, id }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.dataset.visible = "true";
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      id={id}
      className={`cl-reveal ${className}`}
      data-visible={visible ? "true" : "false"}
      style={{ "--delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
