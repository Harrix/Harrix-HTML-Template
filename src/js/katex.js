import "katex/dist/katex.css";
import katex from "katex";

document.addEventListener("DOMContentLoaded", () => {
  const texElements = document.querySelectorAll(".tex");
  texElements.forEach((el) => {
    katex.render(el.getAttribute("data-expr"), el, {
      displayMode: true,
    });
  });
});
