"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useSlideIn() {
  const ref = useRef<HTMLDivElement>(null);

  // Hide items before browser paints
  useIsomorphicLayoutEffect(() => {
    const container = ref.current;
    if (!container) return;
    const items = container.querySelectorAll<HTMLElement>("[data-slide], [data-pop]");
    items.forEach((item) => {
      item.style.opacity = "0";
    });
  }, []);

  // Animate in on scroll
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = container.querySelectorAll<HTMLElement>("[data-slide], [data-pop]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((item, i) => {
              item.style.animationDelay = `${i * 120}ms`;
              if (item.hasAttribute("data-pop")) {
                item.classList.add("animate-pop-in");
              } else {
                item.classList.add("animate-slide-in");
              }
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return ref;
}
