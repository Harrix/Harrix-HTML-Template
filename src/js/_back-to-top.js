import { BACK_TO_TOP_IDLE_MS, BACK_TO_TOP_THRESHOLD } from "./_constants.js";
import { subscribeWindowScroll } from "./_scroll-hub.js";

export function initBackToTop(threshold = BACK_TO_TOP_THRESHOLD) {
  const btn = document.getElementById("h-back-to-top");
  if (!btn) return;

  let idleTimer = null;

  function clearIdleTimer() {
    if (idleTimer !== null) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  }

  function scheduleIdle() {
    clearIdleTimer();
    idleTimer = window.setTimeout(() => {
      idleTimer = null;
      if (window.scrollY >= threshold) {
        btn.classList.add("is-idle");
      }
    }, BACK_TO_TOP_IDLE_MS);
  }

  function onScroll(scrollY) {
    btn.classList.remove("is-idle");
    if (scrollY >= threshold) {
      btn.classList.add("is-visible");
      scheduleIdle();
    } else {
      btn.classList.remove("is-visible");
      clearIdleTimer();
    }
  }

  subscribeWindowScroll(onScroll);
  onScroll(window.scrollY);

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
