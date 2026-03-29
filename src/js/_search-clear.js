export function initSearchClearButton(inputEl, clearButtonEl) {
  if (!inputEl || !clearButtonEl) return () => {};

  function syncVisibility() {
    const hasValue = inputEl.value.length > 0;
    clearButtonEl.classList.toggle("is-hidden", !hasValue);
  }

  clearButtonEl.addEventListener("click", () => {
    inputEl.value = "";
    syncVisibility();
    inputEl.dispatchEvent(new Event("input", { bubbles: true }));
    inputEl.focus();
  });

  inputEl.addEventListener("input", syncVisibility);
  syncVisibility();
  return syncVisibility;
}
