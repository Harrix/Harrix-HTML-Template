import mermaid from "mermaid";

function getMermaidTheme() {
  const stored = localStorage.getItem("h-theme");
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

  const toggle = document.getElementById("h-theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      setTimeout(renderMermaid, 50);
    });
  }
});
