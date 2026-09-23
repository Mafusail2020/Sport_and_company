import { useCallback, useEffect, useRef } from "react";

/**
 * Adds the "is-visible" class the first time the element scrolls into view.
 * Accepts an optional onReveal callback (fired once, same moment) for
 * components that need to kick off extra JS on reveal, e.g. Stats'
 * count-up.
 *
 * Returns a callback ref, not a useRef object — deliberately. Several
 * callers (e.g. Pricing) only mount their revealed element once async data
 * arrives (a package list fetched after first render), so the DOM node
 * doesn't exist yet on the component's first commit. A plain useRef +
 * `useEffect(fn, [])` sets up the IntersectionObserver exactly once, at
 * that first commit, and finds ref.current still null — it never runs
 * again, so the observer never gets attached once the node does show up,
 * and the element stays permanently at its pre-reveal opacity. A callback
 * ref fires whenever the node actually attaches, however many renders
 * late that is, so this can't happen.
 */
export default function useScrollReveal(onReveal) {
  const onRevealRef = useRef(onReveal);
  const observerRef = useRef(null);

  useEffect(() => {
    onRevealRef.current = onReveal;
  });

  const ref = useCallback((el) => {
    observerRef.current?.disconnect();
    observerRef.current = null;

    if (!el) return;

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
    observerRef.current = observer;
  }, []);

  return ref;
}
