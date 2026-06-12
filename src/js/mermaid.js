import mermaid from "mermaid";
import { getTheme, onThemeToggle } from "./_theme-utils.js";

/** Last theme passed to `mermaid.initialize` (Mermaid docs: initialize is site-wide; avoid redundant calls). */
let appliedMermaidTheme = null;

function getMermaidTheme() {
  return getTheme() === "dark" ? "dark" : "default";
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
  void mermaid.run({ querySelector: ".mermaid" }).catch((err) => {
    console.error("Mermaid render error:", err);
  });
}

/** Re-render after `data-theme` and styles settle (next frame + paint). */
function scheduleRenderMermaidAfterThemePaint() {
  requestAnimationFrame(() => {
    requestAnimationFrame(renderMermaid);
  });
}

export function startMermaid() {
  renderMermaid();
  onThemeToggle(scheduleRenderMermaidAfterThemePaint);
}
