import { getUiModes, getSplitLayoutState, setSplitFitUpdater } from "./_app-bridge.js";
import {
  CONTAINER_MAX_WIDTH,
  MENU_FIT_HYSTERESIS,
  MENU_FIT_HYSTERESIS_SPLIT,
  MOBILE_NAV_BREAKPOINT,
  SIDEBAR_WIDTH,
  TOC_MIN_SPACE,
} from "./_constants.js";
import { measureMenuOverflow, suppressNavbarDropdownsTemporarily } from "./_menu-measure.js";
import { translate } from "./_locale.js";
import { initSearchClearButton } from "./_search-clear.js";
import { getSplitLayoutCenterInsetPx } from "./_split-layout-geometry.js";
import { subscribeWindowResize } from "./_resize-hub.js";

export function initNavbarSidebarTocFit() {
  const sidebar = document.getElementById("h-docs-sidebar");
  const tocList = document.getElementById("h-page-toc-list");
  const navbarSidebarBtn = document.getElementById("h-navbar-sidebar-btn");
  const navbarTocRow = document.getElementById("h-navbar-toc-row");
  const navbarSearchBtn = document.getElementById("h-navbar-search-btn");
  const navbarMenuBtn = document.getElementById("h-navbar-menu-btn") || document.getElementById("h-burger");
  const searchOverlay = document.getElementById("h-navbar-search-overlay");
  const searchOverlayInput = document.getElementById("h-navbar-search-overlay-input");
  const searchOverlayClear = document.getElementById("h-navbar-search-overlay-clear");
  const searchOverlaySubmit = document.getElementById("h-navbar-search-overlay-submit");
  const mainSearchInput = document.getElementById("h-search-input");

  let menuWasNoFit = false;
  let prevMenuNoFit = null;
  const rootStyle = document.documentElement.style;
  const NO_FIT_PANEL_LEFT_VAR = "--h-no-fit-panel-left";
  const NO_FIT_PANEL_WIDTH_VAR = "--h-no-fit-panel-width";

  if (searchOverlaySubmit) {
    searchOverlaySubmit.addEventListener("click", () => {
      const formEl = document.getElementById("h-search-form")?.querySelector("form");
      if (formEl) formEl.requestSubmit();
    });
  }
  if (searchOverlayInput) {
    initSearchClearButton(searchOverlayInput, searchOverlayClear);
    searchOverlayInput.placeholder = translate("Search…");
    searchOverlayInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const formEl = document.getElementById("h-search-form")?.querySelector("form");
        if (formEl) formEl.requestSubmit();
      }
    });
    if (mainSearchInput) {
      searchOverlayInput.addEventListener("input", () => {
        mainSearchInput.value = searchOverlayInput.value;
      });
      mainSearchInput.addEventListener("input", () => {
        searchOverlayInput.value = mainSearchInput.value;
      });
    }
  }

  function closeNavbarSearchOverlay() {
    if (searchOverlay?.classList.contains("is-open")) {
      getUiModes()?.close("navbarSearch");
    }
  }

  function clearNoFitPanelVars() {
    rootStyle.removeProperty(NO_FIT_PANEL_LEFT_VAR);
    rootStyle.removeProperty(NO_FIT_PANEL_WIDTH_VAR);
  }

  function updateNoFitPanelVars() {
    const rowEl = document.querySelector(".h-navbar__row1") || document.querySelector("#h-navbar .container");
    if (!rowEl) {
      clearNoFitPanelVars();
      return;
    }
    const rect = rowEl.getBoundingClientRect();
    rootStyle.setProperty(NO_FIT_PANEL_LEFT_VAR, `${Math.max(0, Math.round(rect.left))}px`);
    rootStyle.setProperty(NO_FIT_PANEL_WIDTH_VAR, `${Math.max(0, Math.round(rect.width))}px`);
  }

  function updateFit() {
    const splitState = getSplitLayoutState();
    const vw = window.innerWidth;
    const isSplitActive = splitState && splitState.isActive();

    if (vw <= MOBILE_NAV_BREAKPOINT) {
      closeNavbarSearchOverlay();
      prevMenuNoFit = null;
      document.body.classList.remove("h-navbar-sidebar-overlaps", "h-navbar-toc-no-fit", "h-navbar-menu-no-fit");
      clearNoFitPanelVars();
      if (navbarSidebarBtn) {
        navbarSidebarBtn.setAttribute("aria-hidden", "true");
        navbarSidebarBtn.setAttribute("hidden", "");
        navbarSidebarBtn.tabIndex = -1;
      }
      if (navbarTocRow) {
        navbarTocRow.setAttribute("aria-hidden", "true");
        navbarTocRow.hidden = true;
      }
      if (navbarSearchBtn) {
        navbarSearchBtn.setAttribute("aria-hidden", "true");
        navbarSearchBtn.setAttribute("hidden", "");
      }
      if (navbarMenuBtn) {
        navbarMenuBtn.setAttribute("aria-hidden", "true");
        navbarMenuBtn.setAttribute("hidden", "");
      }
      return;
    }

    if (isSplitActive) {
      const splitOffset = splitState.getOffset();
      const centerInset = getSplitLayoutCenterInsetPx(vw, splitOffset);
      const availableWidth = vw - splitOffset - 2 * centerInset;

      document.body.classList.remove("h-navbar-sidebar-overlaps");

      const rightSpace = availableWidth - CONTAINER_MAX_WIDTH;
      const tocNoFit = tocList && tocList.children.length > 0 && rightSpace < TOC_MIN_SPACE;

      const row1 = document.querySelector(".h-navbar__row1");
      const navbarMenu = document.getElementById("h-navbar-menu");
      let menuNoFit = false;
      if (row1 && navbarMenu) {
        const overflowPx = measureMenuOverflow(row1, navbarMenu);
        menuNoFit = menuWasNoFit ? overflowPx > -MENU_FIT_HYSTERESIS_SPLIT : overflowPx > 1;
      }
      if (prevMenuNoFit === true && menuNoFit === false) {
        suppressNavbarDropdownsTemporarily();
      }
      prevMenuNoFit = menuNoFit;
      menuWasNoFit = menuNoFit;

      document.body.classList.toggle("h-navbar-toc-no-fit", !!tocNoFit);
      document.body.classList.toggle("h-navbar-menu-no-fit", !!menuNoFit);

      if (tocNoFit || menuNoFit) updateNoFitPanelVars();
      else clearNoFitPanelVars();

      if (!menuNoFit) closeNavbarSearchOverlay();

      if (navbarSidebarBtn) {
        navbarSidebarBtn.setAttribute("aria-hidden", "true");
        navbarSidebarBtn.setAttribute("hidden", "");
        navbarSidebarBtn.tabIndex = -1;
      }

      if (navbarTocRow) {
        if (tocNoFit) {
          navbarTocRow.removeAttribute("aria-hidden");
          navbarTocRow.hidden = false;
        } else {
          navbarTocRow.setAttribute("aria-hidden", "true");
          navbarTocRow.hidden = true;
        }
      }

      if (navbarSearchBtn) {
        if (menuNoFit) {
          navbarSearchBtn.removeAttribute("aria-hidden");
          navbarSearchBtn.removeAttribute("hidden");
        } else {
          navbarSearchBtn.setAttribute("aria-hidden", "true");
          navbarSearchBtn.setAttribute("hidden", "");
        }
      }

      if (navbarMenuBtn) {
        if (menuNoFit) {
          navbarMenuBtn.removeAttribute("aria-hidden");
          navbarMenuBtn.removeAttribute("hidden");
        } else {
          navbarMenuBtn.setAttribute("aria-hidden", "true");
          navbarMenuBtn.setAttribute("hidden", "");
        }
      }

      return;
    }

    const contentLeft = (vw - CONTAINER_MAX_WIDTH) / 2;
    const sidebarOverlaps = sidebar && contentLeft < SIDEBAR_WIDTH;
    const tocNoFit = tocList && tocList.children.length > 0 && contentLeft < TOC_MIN_SPACE;

    const row1 = document.querySelector(".h-navbar__row1");
    const navbarMenu = document.getElementById("h-navbar-menu");
    let menuNoFit = false;
    if (row1 && navbarMenu) {
      const overflowPx = measureMenuOverflow(row1, navbarMenu);
      menuNoFit = menuWasNoFit ? overflowPx > -MENU_FIT_HYSTERESIS : overflowPx > 1;
    }
    if (prevMenuNoFit === true && menuNoFit === false) {
      suppressNavbarDropdownsTemporarily();
    }
    prevMenuNoFit = menuNoFit;
    menuWasNoFit = menuNoFit;

    document.body.classList.toggle("h-navbar-sidebar-overlaps", !!sidebarOverlaps);
    document.body.classList.toggle("h-navbar-toc-no-fit", !!tocNoFit);
    document.body.classList.toggle("h-navbar-menu-no-fit", !!menuNoFit);

    if (tocNoFit || menuNoFit) updateNoFitPanelVars();
    else clearNoFitPanelVars();

    if (!menuNoFit) {
      closeNavbarSearchOverlay();
    }

    if (navbarSidebarBtn) {
      if (sidebarOverlaps) {
        navbarSidebarBtn.removeAttribute("aria-hidden");
        navbarSidebarBtn.removeAttribute("hidden");
        navbarSidebarBtn.removeAttribute("tabindex");
      } else {
        navbarSidebarBtn.setAttribute("aria-hidden", "true");
        navbarSidebarBtn.setAttribute("hidden", "");
        navbarSidebarBtn.tabIndex = -1;
      }
    }
    if (navbarTocRow) {
      if (tocNoFit) {
        navbarTocRow.removeAttribute("aria-hidden");
        navbarTocRow.hidden = false;
      } else {
        navbarTocRow.setAttribute("aria-hidden", "true");
        navbarTocRow.hidden = true;
      }
    }
    if (navbarSearchBtn) {
      if (menuNoFit) {
        navbarSearchBtn.removeAttribute("aria-hidden");
        navbarSearchBtn.removeAttribute("hidden");
      } else {
        navbarSearchBtn.setAttribute("aria-hidden", "true");
        navbarSearchBtn.setAttribute("hidden", "");
      }
    }
    if (navbarMenuBtn) {
      if (menuNoFit) {
        navbarMenuBtn.removeAttribute("aria-hidden");
        navbarMenuBtn.removeAttribute("hidden");
      } else {
        navbarMenuBtn.setAttribute("aria-hidden", "true");
        navbarMenuBtn.setAttribute("hidden", "");
      }
    }
  }

  const tocTriggerLabel = document.getElementById("h-navbar-toc-trigger-label");
  if (tocTriggerLabel) tocTriggerLabel.textContent = translate("Table of contents");

  updateFit();
  document.documentElement.classList.remove("h-fit-pending");

  setSplitFitUpdater(updateFit);

  let resizeRafId = 0;
  let resizeTimer = 0;
  subscribeWindowResize(() => {
    document.documentElement.classList.add("h-resizing");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.documentElement.classList.remove("h-resizing");
    }, 150);

    if (!resizeRafId) {
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = 0;
        updateFit();
      });
    }
  });
}
