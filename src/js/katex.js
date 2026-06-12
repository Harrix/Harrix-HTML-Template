import "katex/dist/katex.css";
import katex from "katex";

document.addEventListener("DOMContentLoaded", () => {
  const texElements = document.querySelectorAll(".tex");
  texElements.forEach((el) => {
    const expr = el.getAttribute("data-expr");
    if (!expr) return;
    try {
      katex.render(expr, el, {
        displayMode: true,
        throwOnError: false,
      });
    } catch (err) {
      console.error("KaTeX render error:", err);
    }
  });
});
