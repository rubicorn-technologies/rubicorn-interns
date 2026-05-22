import { useEffect, useRef } from "react";

/** Adds .in-view to children with .reveal as they enter the viewport. */
export function useReveal() {
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return rootRef;
}
