import { THEME_STORAGE_KEY } from "./_constants.js";
import { THEME_TOGGLE_SELECTOR } from "./_theme-utils.js";
import { safeStorageGetItem, safeStorageSetItem } from "./_storage.js";
import { translate } from "./_locale.js";

export function initThemeToggle() {
  function getToggles() {
    return Array.from(document.querySelectorAll(THEME_TOGGLE_SELECTOR));
  }

  function getTheme() {
    const fromDom = document.documentElement.getAttribute("data-theme");
    if (fromDom === "dark" || fromDom === "light") return fromDom;
    const stored = safeStorageGetItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    safeStorageSetItem(THEME_STORAGE_KEY, theme);
  }

  function updateThemeLabel() {
    const theme = getTheme();
    const textLight = translate("Switch to light theme");
    const textDark = translate("Switch to dark theme");
    const label = theme === "dark" ? textLight : textDark;
    getToggles().forEach((toggle) => {
      toggle.setAttribute("aria-label", label);
      const labelEl = toggle.querySelector(".h-theme-toggle-label");
      if (labelEl) labelEl.textContent = label;
    });
  }

  updateThemeLabel();

  document.addEventListener(
    "click",
    (e) => {
      const target = e.target?.closest?.(THEME_TOGGLE_SELECTOR);
      if (!target) return;
      const current = getTheme();
      setTheme(current === "dark" ? "light" : "dark");
      updateThemeLabel();
    },
    true,
  );
}
