export const THEME_TOGGLE_SELECTOR = "[data-theme-toggle], .h-theme-toggle, #h-theme-toggle";

export function onThemeToggle(callback) {
  if (typeof callback !== "function") return;
  document.addEventListener(
    "click",
    (e) => {
      const target = e.target?.closest?.(THEME_TOGGLE_SELECTOR);
      if (!target) return;
      callback();
    },
    true,
  );
}
