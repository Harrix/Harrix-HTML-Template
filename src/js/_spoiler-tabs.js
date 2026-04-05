export function initSpoilerAnimation() {
  document.querySelectorAll(".h-spoiler").forEach((details) => {
    const summary = details.querySelector(".h-spoiler__summary");
    const content = details.querySelector(".h-spoiler__content");
    const inner = details.querySelector(".h-spoiler__inner");
    if (!summary || !content || !inner) return;

    summary.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpening = !details.hasAttribute("open");

      if (isOpening) {
        details.setAttribute("open", "");
        content.style.height = "0px";
        const endHeight = inner.scrollHeight;
        requestAnimationFrame(() => {
          content.style.height = endHeight + "px";
        });
        const onEnd = () => {
          content.removeEventListener("transitionend", onEnd);
          content.style.height = "auto";
        };
        content.addEventListener("transitionend", onEnd);
      } else {
        const startHeight = content.offsetHeight;
        content.style.height = startHeight + "px";
        requestAnimationFrame(() => {
          content.style.height = "0px";
        });
        const onEnd = () => {
          content.removeEventListener("transitionend", onEnd);
          details.removeAttribute("open");
          content.style.height = "";
        };
        content.addEventListener("transitionend", onEnd);
      }
    });
  });
}

export function initTabs() {
  document.querySelectorAll(".h-tab-widget").forEach((widget) => {
    const tabLinks = widget.querySelectorAll('[role="tab"]');
    const panels = widget.querySelectorAll('[role="tabpanel"]');

    tabLinks.forEach((link, i) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        tabLinks.forEach((l, j) => {
          l.setAttribute("aria-selected", j === i ? "true" : "false");
          l.closest("li")?.classList.toggle("is-active", j === i);
        });
        panels.forEach((p, j) => {
          p.hidden = j !== i;
        });
      });
    });
  });
}
