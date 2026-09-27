/**
 * Footnote popovers and the native scenario dialog.
 * Links keep a real href: without the Popover API they jump to the note list.
 */
export function initScenarios() {
  const popoverSupported = typeof HTMLElement !== "undefined" && "popover" in HTMLElement.prototype;

  if (popoverSupported) {
    document.querySelectorAll("a.h-footnote-ref[popovertarget]").forEach((link) => {
      link.addEventListener("click", (event) => {
        const id = link.getAttribute("popovertarget");
        const popover = id ? document.getElementById(id) : null;
        if (!popover || typeof popover.showPopover !== "function") return;
        event.preventDefault();
        if (!popover.matches(":popover-open")) popover.showPopover();
      });
    });
  }

  document.querySelectorAll("[data-h-dialog-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-h-dialog-open");
      const dialog = id ? document.getElementById(id) : null;
      if (!dialog || typeof dialog.showModal !== "function" || dialog.open) return;
      dialog.showModal();
    });
  });
}
