import { THEME_STORAGE_KEY } from "./_constants.js";
import { safeStorageGetItem } from "./_storage.js";

export const THEME_TOGGLE_SELECTOR = "[data-theme-toggle], .h-theme-toggle, #h-theme-toggle";

export function getTheme() {
  const fromDom = document.documentElement.getAttribute("data-theme");
  if (fromDom === "dark" || fromDom === "light") return fromDom;
  const stored = safeStorageGetItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function isDarkTheme() {
  return getTheme() === "dark";
}

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
