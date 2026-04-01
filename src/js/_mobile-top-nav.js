import { getUiModes } from "./_app-bridge.js";
import { translate } from "./_locale.js";
import { isNavAutoHideBlocked } from "./_nav-scroll-guard.js";
import { scrollToAnchor } from "./_scroll-anchor.js";
import { initSearchClearButton } from "./_search-clear.js";
import { subscribeWindowScroll } from "./_scroll-hub.js";

function createPanelCloseIcon() {
  const span = document.createElement("span");
  span.className = "icon is-small";
  span.setAttribute("aria-hidden", "true");
  const i = document.createElement("i");
  i.className = "fas fa-times";
  span.appendChild(i);
  return span;
}

export function initMobileTopNav() {
  if (!document.body.classList.contains("h-mobile-nav-top")) return;

  const topNav = document.getElementById("h-mobile-top-nav");
  if (!topNav) return;
  let lastScrollY = window.scrollY;
  let currentScrollY = window.scrollY;
  const HIDE_THRESHOLD = 100;

  const btnSidebar = document.getElementById("h-mobile-top-nav-sidebar");
  const tocTrigger = document.getElementById("h-mobile-top-nav-toc-trigger");
  const tocTriggerLabel = document.getElementById("h-mobile-top-nav-toc-trigger-label");
  const dropdown = document.getElementById("h-mobile-top-nav-dropdown");
  const searchPanel = document.getElementById("h-mobile-top-nav-search-panel");
  const searchInput = document.getElementById("h-mobile-top-nav-search-input");
  const searchClear = document.getElementById("h-mobile-top-nav-search-clear");
  const menuPanel = document.getElementById("h-mobile-top-nav-menu-panel");

  const sidebarToggle = document.getElementById("h-docs-sidebar-toggle");
  const sidebarPanel = document.getElementById("h-docs-sidebar");
  const rootTree = document.getElementById("root_tree");
  const pageTocList = document.getElementById("h-page-toc-list");

  if (tocTriggerLabel) tocTriggerLabel.textContent = translate("Table of contents");

  function isAnyUiOpen() {
    const searchOpen = !!(searchPanel && searchPanel.classList.contains("is-open"));
    const dropdownOpen = !!(dropdown && dropdown.classList.contains("is-open"));
    const menuOpen = !!(menuPanel && menuPanel.classList.contains("is-open"));
    const sidebarOpen = !!(sidebarPanel && sidebarPanel.classList.contains("is-open"));
    return searchOpen || dropdownOpen || menuOpen || sidebarOpen;
  }

  if (btnSidebar && sidebarToggle) {
    btnSidebar.addEventListener("click", () => sidebarToggle.click());
  }

  if (searchPanel && searchInput) {
    initSearchClearButton(searchInput, searchClear);
    if (searchInput) searchInput.placeholder = translate("Search…");
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const formEl = document.getElementById("h-search-form")?.querySelector("form");
        if (formEl) formEl.requestSubmit();
      }
    });
    const mainSearchInput = document.getElementById("h-search-input");
    if (mainSearchInput) {
      searchInput.addEventListener("input", () => {
        mainSearchInput.value = searchInput.value;
      });
      mainSearchInput.addEventListener("input", () => {
        searchInput.value = mainSearchInput.value;
      });
    }
  }

  const hasTocContent = rootTree || pageTocList;
  const row2 = topNav.querySelector(".h-mobile-top-nav__row2");
  if (row2 && !hasTocContent) row2.classList.add("is-hidden");

  if (dropdown && tocTrigger && hasTocContent) {
    const header = document.createElement("div");
    header.className = "h-mobile-top-nav__panel-header";

    const label = document.createElement("p");
    label.className = "menu-label";
    label.textContent = translate("Table of contents");
    header.appendChild(label);

    const dropdownCloseBtn = document.createElement("button");
    dropdownCloseBtn.type = "button";
    dropdownCloseBtn.className = "h-mobile-top-nav__panel-close";
    dropdownCloseBtn.setAttribute("aria-label", translate("Close"));
    dropdownCloseBtn.appendChild(createPanelCloseIcon());
    header.appendChild(dropdownCloseBtn);

    dropdown.appendChild(header);

    if (pageTocList) {
      const listWrap = document.createElement("ul");
      listWrap.className = "menu-list";
      const tocClone = pageTocList.cloneNode(true);
      tocClone.classList.add("h-page-toc-mirror");
      tocClone.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", (e) => {
          e.preventDefault();
          const href = a.getAttribute("href");
          getUiModes()?.close("mobileDropdown");
          scrollToAnchor(href);
        }),
      );
      listWrap.appendChild(tocClone);
      dropdown.appendChild(listWrap);
    } else if (rootTree) {
      const treeClone = rootTree.cloneNode(true);
      treeClone.id = "";
      dropdown.appendChild(treeClone);
      dropdown.querySelectorAll("a[href]").forEach((a) =>
        a.addEventListener("click", () => {
          const backdrop = document.getElementById("h-mobile-top-nav-dropdown-backdrop");
          if (backdrop) backdrop.click();
        }),
      );
    }

    dropdownCloseBtn.addEventListener("click", () => {
      const backdrop = document.getElementById("h-mobile-top-nav-dropdown-backdrop");
      if (backdrop) backdrop.click();
      else dropdown.classList.remove("is-open");
    });
  }

  function shouldKeepVisible() {
    return isAnyUiOpen();
  }

  subscribeWindowScroll((scrollY) => {
    currentScrollY = scrollY;

    if (isNavAutoHideBlocked()) {
      topNav.classList.remove("h-mobile-top-nav--hidden");
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY <= HIDE_THRESHOLD) {
      topNav.classList.remove("h-mobile-top-nav--hidden");
      lastScrollY = currentScrollY;
      return;
    }

    if (shouldKeepVisible()) {
      topNav.classList.remove("h-mobile-top-nav--hidden");
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > lastScrollY) {
      topNav.classList.add("h-mobile-top-nav--hidden");
    } else if (currentScrollY < lastScrollY) {
      topNav.classList.remove("h-mobile-top-nav--hidden");
    }

    lastScrollY = currentScrollY;
  });
}
