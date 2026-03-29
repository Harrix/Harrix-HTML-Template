import mermaid from "mermaid";
import { THEME_STORAGE_KEY } from "./_constants.js";
import { safeStorageGetItem } from "./_storage.js";
import { onThemeToggle } from "./_theme-utils.js";

function getMermaidTheme() {
  const stored = safeStorageGetItem(THEME_STORAGE_KEY);
  const fromDom = document.documentElement.getAttribute("data-theme");
  const theme = fromDom || stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  return theme === "dark" ? "dark" : "default";
}

function renderMermaid() {
  const diagrams = document.querySelectorAll(".mermaid");
  if (diagrams.length === 0) return;

  diagrams.forEach((el) => {
    el.removeAttribute("data-processed");
  });

  mermaid.initialize({
    startOnLoad: false,
    theme: getMermaidTheme(),
  });

  mermaid.run({ querySelector: ".mermaid" });
}

document.addEventListener("DOMContentLoaded", () => {
  renderMermaid();

  onThemeToggle(() => {
    setTimeout(renderMermaid, 50);
  });
});
