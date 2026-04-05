import mermaid from "mermaid";
import { THEME_STORAGE_KEY } from "./_constants.js";
import { safeStorageGetItem } from "./_storage.js";
import { onThemeToggle } from "./_theme-utils.js";

/** Last theme passed to `mermaid.initialize` (Mermaid docs: initialize is site-wide; avoid redundant calls). */
let appliedMermaidTheme = null;

function getMermaidTheme() {
  const stored = safeStorageGetItem(THEME_STORAGE_KEY);
  const fromDom = document.documentElement.getAttribute("data-theme");
  const theme = fromDom || stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  return theme === "dark" ? "dark" : "default";
}

function ensureMermaidConfigForCurrentTheme() {
  const theme = getMermaidTheme();
  if (appliedMermaidTheme === theme) {
    return;
  }
  mermaid.initialize({
    startOnLoad: false,
    theme,
  });
  appliedMermaidTheme = theme;
}

function renderMermaid() {
  const diagrams = document.querySelectorAll(".mermaid");
  if (diagrams.length === 0) return;

  diagrams.forEach((el) => {
    el.removeAttribute("data-processed");
  });

  ensureMermaidConfigForCurrentTheme();
  void mermaid.run({ querySelector: ".mermaid" });
}

/** Re-render after `data-theme` and styles settle (next frame + paint). */
function scheduleRenderMermaidAfterThemePaint() {
  requestAnimationFrame(() => {
    requestAnimationFrame(renderMermaid);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderMermaid();

  onThemeToggle(scheduleRenderMermaidAfterThemePaint);
});
