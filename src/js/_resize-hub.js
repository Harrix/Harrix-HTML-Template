/**
 * Single window resize listener; coalesces callbacks with requestAnimationFrame.
 */

const subscribers = new Set();
let rafId = 0;

function flush() {
  rafId = 0;
  subscribers.forEach((fn) => {
    fn();
  });
}

function onResize() {
  if (!rafId) rafId = requestAnimationFrame(flush);
}

export function subscribeWindowResize(fn) {
  if (typeof fn !== "function") return () => {};
  subscribers.add(fn);
  if (subscribers.size === 1) {
    window.addEventListener("resize", onResize);
  }
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) {
      window.removeEventListener("resize", onResize);
    }
  };
}
