import { getUiModes } from "./_app-bridge.js";
import { IDS, SEARCH_ANIMATION_MS } from "./_constants.js";
import { translate } from "./_locale.js";
import { initSearchClearButton } from "./_search-clear.js";

let searchPanelInitialized = false;

function focusAfterAnimation(elem, delayMs) {
  window.setTimeout(() => {
    elem.focus();
  }, delayMs);
}

export function initSearchPanel() {
  const searchForm = document.getElementById(IDS.searchForm);
  if (!searchForm) return;
  if (searchPanelInitialized) return;

  searchPanelInitialized = true;

  const byId = (id) => document.getElementById(id);

  const navbarMenu = byId(IDS.navbarMenu);
  const searchButtonOpen = byId(IDS.searchButtonOpen);
  const searchButtonClose = byId(IDS.searchButtonClose);
  const searchButtonSubmit = byId(IDS.searchButtonSubmit);
  const searchInput = byId(IDS.searchInput);
  const searchButtonClear = byId(IDS.searchButtonClear);
  const formEl = searchForm.querySelector("form");

  if (
    !navbarMenu ||
    !searchButtonOpen ||
    !searchButtonClose ||
    !searchInput ||
    !(searchInput instanceof HTMLInputElement)
  ) {
    return;
  }

  let isSearchOpen = false;

  searchInput.placeholder = translate("Search…");

  if (formEl) {
    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  }

  if (searchButtonSubmit) {
    searchButtonSubmit.addEventListener("click", (e) => {
      e.preventDefault();
      if (formEl) formEl.requestSubmit();
    });
  }

  const syncSearchClearButton = initSearchClearButton(searchInput, searchButtonClear);

  function syncCloseButtonVisibility() {
    searchButtonClose.classList.toggle("is-hidden-touch", searchInput.value.length < 1);
  }

  function closeSearch({ fromPopstate } = { fromPopstate: false }) {
    navbarMenu.classList.remove("h-has-visible-search-form");
    searchInput.blur();
    isSearchOpen = false;

    if (!fromPopstate && window.history.state && window.history.state.hSearchOpen) {
      window.history.back();
    }
  }

  function openSearch() {
    getUiModes()?.closeAll?.();
    navbarMenu.classList.add("h-has-visible-search-form");
    focusAfterAnimation(searchInput, SEARCH_ANIMATION_MS);
    syncCloseButtonVisibility();
    syncSearchClearButton();
    isSearchOpen = true;

    const state = window.history.state;
    if (!state || !state.hSearchOpen) {
      window.history.pushState({ ...(state || {}), hSearchOpen: true }, "", window.location.href);
    }
  }

  searchButtonOpen.addEventListener("click", () => {
    if (isSearchOpen) return;
    openSearch();
  });

  searchButtonClose.addEventListener("click", () => {
    closeSearch();
  });

  searchInput.addEventListener("input", () => {
    syncCloseButtonVisibility();
  });

  window.addEventListener("keydown", (e) => {
    if (!isSearchOpen) return;
    if (e.key !== "Escape") return;
    e.preventDefault();
    if (window.history.state && window.history.state.hSearchOpen) {
      window.history.back();
    } else {
      closeSearch();
    }
  });

  window.addEventListener("popstate", () => {
    if (isSearchOpen) closeSearch({ fromPopstate: true });
  });
}
