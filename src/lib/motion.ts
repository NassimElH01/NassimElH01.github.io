// Reduced-motion helpers for scripts and islands. On the server they report
// "reduced", so anything decided at build time starts in the calm state.

const QUERY = "(prefers-reduced-motion: reduce)";

function query(): MediaQueryList | null {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return null;
  return window.matchMedia(QUERY);
}

export function prefersReducedMotion(): boolean {
  return query()?.matches ?? true;
}

/** Calls `callback` whenever the preference changes; returns an unsubscribe function. */
export function onReducedMotionChange(callback: (reduced: boolean) => void): () => void {
  const mql = query();
  if (!mql) return () => {};
  const handler = (event: MediaQueryListEvent) => callback(event.matches);
  mql.addEventListener("change", handler);
  return () => mql.removeEventListener("change", handler);
}

/** Returns `ms`, or 0 when the visitor prefers reduced motion. */
export function motionDuration(ms: number): number {
  return prefersReducedMotion() ? 0 : ms;
}
