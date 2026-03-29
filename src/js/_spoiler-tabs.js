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
  document.querySelectorAll(".h-tabs").forEach((tabs) => {
    const tabBtns = tabs.querySelectorAll(".h-tabs__tab");
    const panels = tabs.querySelectorAll(".h-tabs__panel");

    tabBtns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        tabBtns.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        panels.forEach((p) => {
          p.hidden = true;
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");
        panels[i].hidden = false;
      });
    });
  });
}
