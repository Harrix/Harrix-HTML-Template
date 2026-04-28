import { getUiModes } from "./_app-bridge.js";
import { SEARCH_ANIMATION_MS } from "./_constants.js";
import { translate } from "./_locale.js";
import { initSearchClearButton } from "./_search-clear.js";

let searchPanelInitialized = false;

function focusAfterAnimation(elem, delayMs) {
  setTimeout(() => {
    elem.focus();
  }, delayMs);
}

export function initSearchPanel() {
  const searchForm = document.getElementById("h-search-form");
  if (!searchForm) return;
  if (searchPanelInitialized) return;

  searchPanelInitialized = true;

    const navbarMenu = document.getElementById("h-navbar-menu");
    const searchButtonOpen = document.getElementById("h-search-button-open");
    const searchButtonClose = document.getElementById("h-search-button-close");
    const searchButtonSubmit = document.getElementById("h-search-button-submit");
    const searchInput = document.getElementById("h-search-input");
    const searchButtonClear = document.getElementById("h-search-button-clear");
    const formEl = searchForm.querySelector("form");
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

    function showOrHideSearchButtonClose() {
      if (searchInput.value.length >= 1) searchButtonClose.classList.remove("is-hidden-touch");
      else searchButtonClose.classList.add("is-hidden-touch");
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
      showOrHideSearchButtonClose();
      syncSearchClearButton();
      isSearchOpen = true;

      window.history.pushState({ hSearchOpen: true }, "", window.location.href);
    }

    searchButtonOpen.addEventListener("click", () => {
      if (isSearchOpen) return;
      openSearch();
    });

    searchButtonClose.addEventListener("click", () => {
      closeSearch();
    });

    searchInput.addEventListener("input", () => {
      showOrHideSearchButtonClose();
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
