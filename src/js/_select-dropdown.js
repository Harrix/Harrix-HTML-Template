/**
 * Click-to-toggle select styled as a Bulma dropdown menu.
 */
export function initSelectDropdowns() {
  document.querySelectorAll("[data-h-select]").forEach((root) => {
    if (!(root instanceof HTMLElement)) return;

    const trigger = root.querySelector("[data-h-select-trigger]");
    const label = root.querySelector("[data-h-select-label]");
    const options = root.querySelectorAll("[data-h-select-option]");
    if (!(trigger instanceof HTMLButtonElement) || !(label instanceof HTMLElement)) return;

    const close = () => {
      root.classList.remove("is-active");
      trigger.setAttribute("aria-expanded", "false");
    };

    const open = () => {
      root.classList.add("is-active");
      trigger.setAttribute("aria-expanded", "true");
    };

    trigger.addEventListener("click", (event) => {
      event.stopPropagation();
      if (root.classList.contains("is-active")) close();
      else open();
    });

    options.forEach((option) => {
      if (!(option instanceof HTMLButtonElement)) return;
      option.addEventListener("click", (event) => {
        event.stopPropagation();
        const value = option.textContent?.trim() ?? "";
        label.textContent = value;
        options.forEach((item) => {
          const active = item === option;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-selected", active ? "true" : "false");
        });
        close();
      });
    });

    document.addEventListener("click", (event) => {
      if (!(event.target instanceof Node) || root.contains(event.target)) return;
      close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !root.classList.contains("is-active")) return;
      close();
      trigger.focus();
    });
  });
}
