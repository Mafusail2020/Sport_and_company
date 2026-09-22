import { useEffect, useRef } from "react";

/**
 * Adds the "is-visible" class the first time the element scrolls into view.
 * Accepts an optional onReveal callback (fired once, same moment) for
 * components that need to kick off extra JS on reveal, e.g. Stats'
 * count-up. Read via a ref so it doesn't need to be memoized by the caller.
 */
export default function useScrollReveal(onReveal) {
  const ref = useRef(null);
  const onRevealRef = useRef(onReveal);

  useEffect(() => {
    onRevealRef.current = onReveal;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          onRevealRef.current?.();
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
