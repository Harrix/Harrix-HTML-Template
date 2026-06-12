import { getUiModes, getSplitLayoutState, setSplitFitUpdater } from "./_app-bridge.js";
import {
  CONTAINER_MAX_WIDTH,
  IDS,
  MENU_FIT_HYSTERESIS,
  MENU_FIT_HYSTERESIS_SPLIT,
  MOBILE_NAV_BREAKPOINT,
  NAVBAR_FIT_RESIZE_DEBOUNCE_MS,
  SIDEBAR_WIDTH,
  TOC_MIN_SPACE,
} from "./_constants.js";
import { measureMenuOverflow, suppressNavbarDropdownsTemporarily } from "./_menu-measure.js";
import { translate } from "./_locale.js";
import { initSearchClearButton } from "./_search-clear.js";
import { getSplitLayoutCenterInsetPx } from "./_split-layout-geometry.js";
import { subscribeWindowResize } from "./_resize-hub.js";

export function initNavbarSidebarTocFit() {
  const sidebar = document.getElementById(IDS.docsSidebar);
  const tocList = document.getElementById(IDS.pageTocList);
  const navbarSidebarBtn = document.getElementById(IDS.navbarSidebarBtn);
  const navbarTocRow = document.getElementById(IDS.navbarTocRow);
  const navbarSearchBtn = document.getElementById(IDS.navbarSearchBtn);
  const navbarMenuBtn = document.getElementById(IDS.navbarMenuBtn) || document.getElementById(IDS.burger);
  const searchOverlay = document.getElementById(IDS.navbarSearchOverlay);
  const searchOverlayInput = document.getElementById(IDS.navbarSearchOverlayInput);
  const searchOverlayClear = document.getElementById(IDS.navbarSearchOverlayClear);
  const searchOverlaySubmit = document.getElementById(IDS.navbarSearchOverlaySubmit);
  const mainSearchInput = document.getElementById(IDS.searchInput);

  let menuWasNoFit = false;
  let prevMenuNoFit = null;
  const rootStyle = document.documentElement.style;
  const NO_FIT_PANEL_LEFT_VAR = "--h-no-fit-panel-left";
  const NO_FIT_PANEL_WIDTH_VAR = "--h-no-fit-panel-width";

  if (searchOverlaySubmit) {
    searchOverlaySubmit.addEventListener("click", () => {
      const formEl = document.getElementById(IDS.searchForm)?.querySelector("form");
      if (formEl) formEl.requestSubmit();
    });
  }
  if (searchOverlayInput) {
    initSearchClearButton(searchOverlayInput, searchOverlayClear);
    searchOverlayInput.placeholder = translate("Search…");
    searchOverlayInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const formEl = document.getElementById(IDS.searchForm)?.querySelector("form");
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

  /** Show/hide an element for both AT (aria-hidden) and layout (hidden). */
  function setVisible(el, visible, { focusable = false } = {}) {
    if (!el) return;
    if (visible) {
      el.removeAttribute("aria-hidden");
      el.removeAttribute("hidden");
      if (focusable) el.removeAttribute("tabindex");
    } else {
      el.setAttribute("aria-hidden", "true");
      el.setAttribute("hidden", "");
      if (focusable) el.tabIndex = -1;
    }
  }

  function hasTocItems() {
    return !!tocList && tocList.children.length > 0;
  }

  /**
   * Measure menu overflow with hysteresis and track the no-fit transition
   * (dropdowns are suppressed briefly when leaving no-fit to avoid flicker).
   */
  function computeMenuNoFit(hysteresis) {
    const row1 = document.querySelector(".h-navbar__row1");
    const navbarMenu = document.getElementById(IDS.navbarMenu);
    let menuNoFit = false;
    if (row1 && navbarMenu) {
      const overflowPx = measureMenuOverflow(row1, navbarMenu);
      menuNoFit = menuWasNoFit ? overflowPx > -hysteresis : overflowPx > 1;
    }
    if (prevMenuNoFit === true && menuNoFit === false) {
      suppressNavbarDropdownsTemporarily();
    }
    prevMenuNoFit = menuNoFit;
    menuWasNoFit = menuNoFit;
    return menuNoFit;
  }

  function applyFitState({ sidebarOverlaps, tocNoFit, menuNoFit }) {
    document.body.classList.toggle("h-navbar-sidebar-overlaps", sidebarOverlaps);
    document.body.classList.toggle("h-navbar-toc-no-fit", tocNoFit);
    document.body.classList.toggle("h-navbar-menu-no-fit", menuNoFit);

    if (tocNoFit || menuNoFit) updateNoFitPanelVars();
    else clearNoFitPanelVars();

    if (!menuNoFit) closeNavbarSearchOverlay();

    setVisible(navbarSidebarBtn, sidebarOverlaps, { focusable: true });
    setVisible(navbarTocRow, tocNoFit);
    setVisible(navbarSearchBtn, menuNoFit);
    setVisible(navbarMenuBtn, menuNoFit);
  }

  function updateFit() {
    const splitState = getSplitLayoutState();
    const vw = window.innerWidth;
    const isSplitActive = splitState && splitState.isActive();

    if (vw <= MOBILE_NAV_BREAKPOINT) {
      prevMenuNoFit = null;
      applyFitState({ sidebarOverlaps: false, tocNoFit: false, menuNoFit: false });
      return;
    }

    if (isSplitActive) {
      // Drop the overlap state before measuring: the sidebar button affects row width.
      document.body.classList.remove("h-navbar-sidebar-overlaps");

      const splitOffset = splitState.getOffset();
      const centerInset = getSplitLayoutCenterInsetPx(vw, splitOffset);
      const availableWidth = vw - splitOffset - 2 * centerInset;
      const rightSpace = availableWidth - CONTAINER_MAX_WIDTH;
      const tocNoFit = hasTocItems() && rightSpace < TOC_MIN_SPACE;
      const menuNoFit = computeMenuNoFit(MENU_FIT_HYSTERESIS_SPLIT);

      applyFitState({ sidebarOverlaps: false, tocNoFit, menuNoFit });
      return;
    }

    const contentLeft = (vw - CONTAINER_MAX_WIDTH) / 2;
    const sidebarOverlaps = !!sidebar && contentLeft < SIDEBAR_WIDTH;
    const tocNoFit = hasTocItems() && contentLeft < TOC_MIN_SPACE;
    const menuNoFit = computeMenuNoFit(MENU_FIT_HYSTERESIS);

    applyFitState({ sidebarOverlaps, tocNoFit, menuNoFit });
  }

  const tocTriggerLabel = document.getElementById(IDS.navbarTocTriggerLabel);
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
    }, NAVBAR_FIT_RESIZE_DEBOUNCE_MS);

    if (!resizeRafId) {
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = 0;
        updateFit();
      });
    }
  });
}
