/**
 * Single window scroll listener; coalesces callbacks with requestAnimationFrame (passive).
 */

const subscribers = new Set();
let rafId = 0;

function flush() {
  rafId = 0;
  const y = window.scrollY;
  subscribers.forEach((fn) => {
    fn(y);
  });
}

function onScroll() {
  if (!rafId) rafId = requestAnimationFrame(flush);
}

export function subscribeWindowScroll(fn) {
  if (typeof fn !== "function") return () => {};
  subscribers.add(fn);
  if (subscribers.size === 1) {
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) {
      window.removeEventListener("scroll", onScroll);
    }
  };
}
