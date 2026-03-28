import lightGallery from "lightgallery";
import lgHash from "lightgallery/plugins/hash";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import hljs from "highlight.js";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";

import initFontawesomeCollection from "./_fontawesome-collection.js";
import locale from "./_locale-ru.js";
import { THEME_TOGGLE_SELECTOR } from "./_theme-utils.js";

const NAVBAR_HIDE_SCROLL_THRESHOLD = 100;
const GALLERY_ROW_HEIGHT = 200;
const SEARCH_ANIMATION_MS = 500;
const CODE_COPY_FEEDBACK_MS = 800;
const CODE_COPY_ICON_HTML =
  '<span class="icon is-small"><i class="fas fa-copy" aria-hidden="true"></i></span>';
const CODE_COPY_DONE_ICON_HTML =
  '<span class="icon is-small"><i class="fas fa-check" aria-hidden="true"></i></span>';
const CODE_BLOCK_BOTTOM_THRESHOLD = 80;
const GALLERY_ID = "1";
const BACK_TO_TOP_THRESHOLD = 200;
const BACK_TO_TOP_DURATION_MS = 800;
const BACK_TO_TOP_IDLE_MS = 3000;
const PAGE_TOC_TOGGLE_THRESHOLD = 200;

const CONTAINER_MAX_WIDTH = 1179;
const SIDEBAR_WIDTH = 280;
const TOC_MIN_SPACE = 256;
const MOBILE_NAV_BREAKPOINT = 1024;
const SIDEBAR_TOC_DESKTOP_MIN_WIDTH = 1680;
const MENU_FIT_HYSTERESIS = 40;

// Split layout constants
const SPLIT_SIDEBAR_STORAGE_KEY = "h-split-sidebar-width";
const SPLIT_DEFAULT_WIDTH = 280;
const SPLIT_MIN_WIDTH = 200;
const SPLIT_MAX_VIEWPORT_RATIO = 0.5;
const SPLIT_SPLITTER_WIDTH = 1;
/** Horizontal centering runs only when viewport is wider than this (px). */
const SPLIT_LAYOUT_CENTER_TRIGGER_VW = 2500;
/** Matches split SCSS gap before TOC (`+ 1rem`); px fallback for band width. */
const SPLIT_LAYOUT_CENTER_TOC_GAP_PX = 16;

function getSplitLayoutNaturalBandWidthPx(splitOffsetPx) {
  return splitOffsetPx + CONTAINER_MAX_WIDTH + SPLIT_LAYOUT_CENTER_TOC_GAP_PX + TOC_MIN_SPACE;
}

/** Centers sidebar + content + TOC as one band: inset = max(0, (vw - band) / 2). */
function getSplitLayoutCenterInsetPx(vw, splitOffsetPx) {
  if (vw <= SPLIT_LAYOUT_CENTER_TRIGGER_VW) return 0;
  const band = getSplitLayoutNaturalBandWidthPx(splitOffsetPx);
  return Math.max(0, (vw - band) / 2);
}

// =========================================================================
// FIX 2: TOC scroll — block navbar auto-hide during programmatic scroll
// =========================================================================
const TOC_SCROLL_BLOCK_MS = 1200;
let _tocScrollBlockUntil = 0;

function blockNavAutoHide() {
  _tocScrollBlockUntil = Date.now() + TOC_SCROLL_BLOCK_MS;
}

function isNavAutoHideBlocked() {
  return Date.now() < _tocScrollBlockUntil;
}

function getFixedHeaderHeight() {
  const mobileTopNav = document.getElementById("h-mobile-top-nav");
  if (mobileTopNav && window.getComputedStyle(mobileTopNav).display !== "none") {
    return mobileTopNav.offsetHeight;
  }
  const navbar = document.getElementById("h-navbar");
  if (navbar && window.getComputedStyle(navbar).display !== "none") {
    return navbar.offsetHeight;
  }
  return 0;
}

function scrollToAnchor(href) {
  const id = href && href.startsWith("#") ? href.slice(1) : href;
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  blockNavAutoHide();
  const headerHeight = getFixedHeaderHeight();
  const elRect = el.getBoundingClientRect();
  const targetY = elRect.top + window.scrollY - headerHeight - 16;
  window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
}

const lang = document.documentElement.lang;

// Global reference to split layout state
let splitState = null;

function createUiHistoryLayer(getIsAnyOpen, closeAll) {
  let pushed = false;

  function ensure() {
    if (pushed) return;
    window.history.pushState({ hUiLayer: true }, "", window.location.href);
    pushed = true;
  }

  function clearIfPresent() {
    if (!pushed) return;
    pushed = false;
    if (window.history.state && window.history.state.hUiLayer) {
      window.history.back();
    }
  }

  window.addEventListener("popstate", () => {
    if (getIsAnyOpen()) {
      closeAll();
    }
    pushed = false;
  });

  return { ensure, clearIfPresent };
}

function initSearchClearButton(inputEl, clearButtonEl) {
  if (!inputEl || !clearButtonEl) return () => { };

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

function createUiModesController() {
  const root = document.documentElement;

  const docsSidebar = document.getElementById("h-docs-sidebar");
  const docsSidebarBackdrop = document.getElementById("h-docs-sidebar-backdrop");
  const docsSidebarClose = document.getElementById("h-docs-sidebar-close");
  const docsSidebarToggle = document.getElementById("h-docs-sidebar-toggle");
  const navbarSidebarBtn = document.getElementById("h-navbar-sidebar-btn");

  const pageToc = document.getElementById("h-page-toc");
  const pageTocBackdrop = document.getElementById("h-page-toc-backdrop");
  const pageTocClose = document.getElementById("h-page-toc-close");
  const pageTocToggle = document.getElementById("h-page-toc-toggle");
  const navbarTocTrigger = document.getElementById("h-navbar-toc-trigger");
  const mobileTocTrigger = document.getElementById("h-mobile-top-nav-toc-trigger");

  const navbarBurger = document.getElementById("h-navbar-menu-btn") || document.getElementById("h-burger");
  const navbarMenu = document.getElementById("h-navbar-menu");
  const navbarMenuPanelHeader = document.getElementById("h-navbar-menu-panel-header");
  const navbarMenuBackdrop = document.getElementById("h-navbar-menu-backdrop");
  const navbarMenuPanelClose = document.getElementById("h-navbar-menu-panel-close");

  const navbarSearchButtonOpen = document.getElementById("h-search-button-open");
  const navbarSearchInput = document.getElementById("h-search-input");

  const navbarSearchBtn = document.getElementById("h-navbar-search-btn");
  const navbarSearchOverlay = document.getElementById("h-navbar-search-overlay");
  const navbarSearchOverlayClose = document.getElementById("h-navbar-search-overlay-close");
  const navbarSearchOverlayInput = document.getElementById("h-navbar-search-overlay-input");

  const mobileSearchBtn = document.getElementById("h-mobile-top-nav-search");
  const mobileSearchPanel = document.getElementById("h-mobile-top-nav-search-panel");
  const mobileSearchClose = document.getElementById("h-mobile-top-nav-search-close");
  const mobileSearchInput = document.getElementById("h-mobile-top-nav-search-input");
  const mobileSearchSubmit = document.getElementById("h-mobile-top-nav-search-submit");

  const mobileMenuBtn = document.getElementById("h-mobile-top-nav-menu");
  const mobileMenuPanel = document.getElementById("h-mobile-top-nav-menu-panel");
  const mobileMenuBackdrop = document.getElementById("h-mobile-top-nav-menu-backdrop");

  const mobileDropdown = document.getElementById("h-mobile-top-nav-dropdown");
  const mobileDropdownBackdrop = document.getElementById("h-mobile-top-nav-dropdown-backdrop");

  let active = null;

  function isModeOpen(mode) {
    switch (mode) {
      case "docsSidebar":
        return !!(docsSidebar && docsSidebar.classList.contains("is-open"));
      case "pageToc":
        return !!(pageToc && pageToc.classList.contains("is-open"));
      case "navbarMenu":
        return !!(navbarMenu && navbarMenu.classList.contains("is-active"));
      case "navbarSearch":
        return !!(navbarSearchOverlay && navbarSearchOverlay.classList.contains("is-open"));
      case "mobileSearch":
        return !!(mobileSearchPanel && mobileSearchPanel.classList.contains("is-open"));
      case "mobileMenu":
        return !!(mobileMenuPanel && mobileMenuPanel.classList.contains("is-open"));
      case "mobileDropdown":
        return !!(mobileDropdown && mobileDropdown.classList.contains("is-open"));
      default:
        return false;
    }
  }

  function setTocExpanded(open) {
    if (navbarTocTrigger) navbarTocTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    if (mobileTocTrigger) mobileTocTrigger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function openMode(mode) {
    switch (mode) {
      case "docsSidebar": {
        if (!docsSidebar) return;
        docsSidebar.classList.add("is-open");
        if (docsSidebarBackdrop) docsSidebarBackdrop.classList.add("is-active");
        break;
      }
      case "pageToc": {
        if (!pageToc) return;
        pageToc.classList.add("is-open");
        if (pageTocBackdrop) pageTocBackdrop.classList.add("is-active");
        setTocExpanded(true);
        break;
      }
      case "navbarMenu": {
        if (!navbarMenu || !navbarBurger) return;
        root.classList.add("h-is-clipped-touch");
        navbarBurger.classList.add("is-active");
        navbarBurger.setAttribute("aria-expanded", "true");
        navbarMenu.classList.add("is-active");
        if (document.body.classList.contains("h-navbar-menu-no-fit")) {
          if (navbarMenuPanelHeader) {
            navbarMenuPanelHeader.removeAttribute("hidden");
            navbarMenuPanelHeader.setAttribute("aria-hidden", "false");
          }
          if (navbarMenuBackdrop) {
            navbarMenuBackdrop.classList.add("is-active");
            navbarMenuBackdrop.removeAttribute("hidden");
            navbarMenuBackdrop.setAttribute("aria-hidden", "false");
          }
          navbarBurger.style.display = "none";
        }
        resetExpandedMenuSubmenus();
        break;
      }
      case "navbarSearch": {
        if (!navbarSearchOverlay) return;
        navbarSearchOverlay.classList.add("is-open");
        navbarSearchOverlay.setAttribute("aria-hidden", "false");
        if (navbarSearchOverlayInput) setTimeout(() => navbarSearchOverlayInput.focus(), 50);
        break;
      }
      case "mobileSearch": {
        if (!mobileSearchPanel) return;
        mobileSearchPanel.classList.add("is-open");
        mobileSearchPanel.setAttribute("aria-hidden", "false");
        if (mobileSearchInput) setTimeout(() => mobileSearchInput.focus(), 50);
        break;
      }
      case "mobileMenu": {
        if (!mobileMenuPanel) return;
        root.classList.add("h-is-clipped-touch");
        if (document.body.classList.contains("h-navbar-menu-no-fit") && navbarBurger) {
          navbarBurger.classList.add("is-active");
          navbarBurger.setAttribute("aria-expanded", "true");
        }
        mobileMenuPanel.classList.add("is-open");
        mobileMenuPanel.setAttribute("aria-hidden", "false");
        if (mobileMenuBackdrop) {
          mobileMenuBackdrop.classList.add("is-active");
          mobileMenuBackdrop.setAttribute("aria-hidden", "false");
        }
        resetExpandedMenuSubmenus();
        break;
      }
      case "mobileDropdown": {
        if (!mobileDropdown) return;
        mobileDropdown.classList.add("is-open");
        setTocExpanded(true);
        if (mobileDropdownBackdrop) {
          mobileDropdownBackdrop.classList.add("is-active");
          mobileDropdownBackdrop.setAttribute("aria-hidden", "false");
        }
        break;
      }
    }
  }

  function closeMode(mode) {
    switch (mode) {
      case "docsSidebar": {
        if (docsSidebar) docsSidebar.classList.remove("is-open");
        if (docsSidebarBackdrop) docsSidebarBackdrop.classList.remove("is-active");
        break;
      }
      case "pageToc": {
        if (pageToc) pageToc.classList.remove("is-open");
        if (pageTocBackdrop) pageTocBackdrop.classList.remove("is-active");
        setTocExpanded(false);
        break;
      }
      case "navbarMenu": {
        if (!navbarMenu || !navbarBurger) return;
        root.classList.remove("h-is-clipped-touch");
        navbarBurger.classList.remove("is-active");
        navbarBurger.setAttribute("aria-expanded", "false");
        navbarMenu.classList.remove("is-active");
        if (navbarMenuPanelHeader) {
          navbarMenuPanelHeader.setAttribute("hidden", "");
          navbarMenuPanelHeader.setAttribute("aria-hidden", "true");
        }
        if (navbarMenuBackdrop) {
          navbarMenuBackdrop.classList.remove("is-active");
          navbarMenuBackdrop.setAttribute("hidden", "");
          navbarMenuBackdrop.setAttribute("aria-hidden", "true");
        }
        if (document.body.classList.contains("h-navbar-menu-no-fit")) {
          navbarBurger.style.display = "";
        }
        break;
      }
      case "navbarSearch": {
        if (!navbarSearchOverlay) return;
        navbarSearchOverlay.classList.remove("is-open");
        navbarSearchOverlay.setAttribute("aria-hidden", "true");
        if (navbarSearchOverlayInput) navbarSearchOverlayInput.blur();
        break;
      }
      case "mobileSearch": {
        if (mobileSearchInput) mobileSearchInput.blur();
        if (mobileSearchPanel) {
          mobileSearchPanel.classList.remove("is-open");
          mobileSearchPanel.setAttribute("aria-hidden", "true");
        }
        break;
      }
      case "mobileMenu": {
        root.classList.remove("h-is-clipped-touch");
        if (navbarBurger) {
          navbarBurger.classList.remove("is-active");
          navbarBurger.setAttribute("aria-expanded", "false");
        }
        if (mobileMenuPanel) {
          mobileMenuPanel.classList.remove("is-open");
          mobileMenuPanel.setAttribute("aria-hidden", "true");
        }
        if (mobileMenuBackdrop) {
          mobileMenuBackdrop.classList.remove("is-active");
          mobileMenuBackdrop.setAttribute("aria-hidden", "true");
        }
        break;
      }
      case "mobileDropdown": {
        if (mobileDropdown) mobileDropdown.classList.remove("is-open");
        setTocExpanded(false);
        if (mobileDropdownBackdrop) {
          mobileDropdownBackdrop.classList.remove("is-active");
          mobileDropdownBackdrop.setAttribute("aria-hidden", "true");
        }
        break;
      }
    }
  }

  function closeAll() {
    if (navbarMenu) navbarMenu.classList.remove("h-has-visible-search-form");
    if (navbarSearchInput) navbarSearchInput.blur();

    closeMode("navbarMenu");
    closeMode("docsSidebar");
    closeMode("pageToc");
    closeMode("navbarSearch");
    closeMode("mobileSearch");
    closeMode("mobileMenu");
    closeMode("mobileDropdown");
    active = null;
  }

  function isAnyOpen() {
    return (
      isModeOpen("navbarMenu") ||
      isModeOpen("docsSidebar") ||
      isModeOpen("pageToc") ||
      isModeOpen("navbarSearch") ||
      isModeOpen("mobileSearch") ||
      isModeOpen("mobileMenu") ||
      isModeOpen("mobileDropdown")
    );
  }

  const uiHistory = createUiHistoryLayer(isAnyOpen, closeAll);

  function open(mode) {
    if (isModeOpen(mode)) return;
    closeAll();
    openMode(mode);
    active = mode;
    uiHistory.ensure();
  }

  function close(mode) {
    if (!isModeOpen(mode)) return;
    closeMode(mode);
    if (active === mode) active = null;
    uiHistory.clearIfPresent();
  }

  function toggle(mode) {
    if (isModeOpen(mode)) close(mode);
    else open(mode);
  }

  if (docsSidebarToggle) docsSidebarToggle.addEventListener("click", () => toggle("docsSidebar"));
  if (navbarSidebarBtn) navbarSidebarBtn.addEventListener("click", () => toggle("docsSidebar"));
  if (docsSidebarClose) docsSidebarClose.addEventListener("click", () => close("docsSidebar"));
  if (docsSidebarBackdrop) docsSidebarBackdrop.addEventListener("click", () => close("docsSidebar"));

  if (pageTocToggle) pageTocToggle.addEventListener("click", () => toggle("pageToc"));
  if (pageTocClose) pageTocClose.addEventListener("click", () => close("pageToc"));
  if (pageTocBackdrop) pageTocBackdrop.addEventListener("click", () => close("pageToc"));
  if (navbarTocTrigger) navbarTocTrigger.addEventListener("click", () => toggle("pageToc"));

  if (navbarBurger) {
    navbarBurger.addEventListener("click", () => {
      if (document.body.classList.contains("h-navbar-menu-no-fit")) {
        toggle("mobileMenu");
      } else {
        toggle("navbarMenu");
      }
    });
  }
  if (navbarMenuBackdrop) navbarMenuBackdrop.addEventListener("click", () => close("navbarMenu"));
  if (navbarMenuPanelClose) navbarMenuPanelClose.addEventListener("click", () => close("navbarMenu"));

  if (navbarSearchBtn) navbarSearchBtn.addEventListener("click", () => toggle("navbarSearch"));
  if (navbarSearchOverlayClose) navbarSearchOverlayClose.addEventListener("click", () => close("navbarSearch"));

  if (navbarSearchButtonOpen) {
    navbarSearchButtonOpen.addEventListener("click", () => {
      closeAll();
    });
  }

  if (mobileSearchBtn) mobileSearchBtn.addEventListener("click", () => toggle("mobileSearch"));
  if (mobileSearchClose) mobileSearchClose.addEventListener("click", () => close("mobileSearch"));
  if (mobileSearchSubmit) {
    mobileSearchSubmit.addEventListener("click", () => {
      const formEl = document.getElementById("h-search-form")?.querySelector("form");
      if (formEl) formEl.requestSubmit();
    });
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", () => toggle("mobileMenu"));
  if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener("click", () => close("mobileMenu"));

  if (mobileTocTrigger) mobileTocTrigger.addEventListener("click", () => toggle("mobileDropdown"));
  if (mobileDropdownBackdrop) mobileDropdownBackdrop.addEventListener("click", () => close("mobileDropdown"));

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!isAnyOpen()) return;
    closeAll();
    uiHistory.clearIfPresent();
  });

  return { open, close, toggle, closeAll, isAnyOpen, getActive: () => active };
}

function resetExpandedMenuSubmenus() {
  document
    .querySelectorAll(
      "#h-mobile-top-nav-menu-panel .navbar-item.has-dropdown, #h-navbar-menu .navbar-item.has-dropdown",
    )
    .forEach((el) => {
      el.classList.remove("is-collapsed");
      const link = el.querySelector(":scope > .navbar-link");
      if (link) link.setAttribute("aria-expanded", "true");
    });
}

function syncExpandedMenuDropdownAria() {
  document
    .querySelectorAll(
      "#h-mobile-top-nav-menu-panel .navbar-item.has-dropdown, #h-navbar-menu .navbar-item.has-dropdown",
    )
    .forEach((el) => {
      const link = el.querySelector(":scope > .navbar-link");
      if (!link) return;
      const collapsed = el.classList.contains("is-collapsed");
      link.setAttribute("aria-expanded", collapsed ? "false" : "true");
    });
}

function initExpandedMenuDropdowns() {
  document.addEventListener(
    "click",
    (e) => {
      const link = e.target.closest(".navbar-item.has-dropdown > .navbar-link");
      if (!link) return;
      const panel = link.closest("#h-mobile-top-nav-menu-panel, #h-navbar-menu");
      if (!panel) return;
      if (panel.id === "h-mobile-top-nav-menu-panel" && !panel.classList.contains("is-open")) return;
      if (panel.id === "h-navbar-menu" && !panel.classList.contains("is-active")) return;

      const dropdown = link.closest(".navbar-item.has-dropdown");
      if (!dropdown) return;

      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle("is-collapsed");
      const collapsed = dropdown.classList.contains("is-collapsed");
      link.setAttribute("aria-expanded", collapsed ? "false" : "true");
    },
    true,
  );

  syncExpandedMenuDropdownAria();
}

// ============================================================================
// FIX 1 & 3: Unified menu width measurement helper.
// Uses visibility:hidden to avoid visual flash and measures intrinsic width
// of .navbar-end regardless of current CSS class state.
// ============================================================================
function measureMenuOverflow(row1, navbarMenu) {
  if (!row1 || !navbarMenu) return 0;
  const navbarEnd = navbarMenu.querySelector(".navbar-end");
  if (!navbarEnd || row1.clientWidth <= 0) return 0;

  // Force menu visible but invisible to measure intrinsic width
  navbarMenu.style.setProperty("display", "flex", "important");
  navbarMenu.style.setProperty("visibility", "hidden", "important");
  navbarMenu.style.setProperty("pointer-events", "none", "important");
  void navbarMenu.offsetWidth; // force reflow
  const menuNeed = navbarEnd.scrollWidth;
  navbarMenu.style.removeProperty("display");
  navbarMenu.style.removeProperty("visibility");
  navbarMenu.style.removeProperty("pointer-events");

  // Measure available space (after removing forced styles, layout is back to normal)
  const rowRect = row1.getBoundingClientRect();
  const brand = row1.querySelector(".navbar-brand");
  let leftUsed = 0;
  if (brand) {
    const br = brand.getBoundingClientRect();
    leftUsed = br.right - rowRect.left;
  }
  const sidebarBtnEl = row1.querySelector(".h-navbar-sidebar-btn");
  if (sidebarBtnEl && window.getComputedStyle(sidebarBtnEl).display !== "none") {
    leftUsed += sidebarBtnEl.getBoundingClientRect().width;
  }
  const availableForMenu = rowRect.width - leftUsed;
  return menuNeed - availableForMenu;
}

// ============================================================================
// SPLIT LAYOUT — sidebar + splitter + content
// ============================================================================
function initSplitLayout() {
  const sidebar = document.getElementById("h-docs-sidebar");
  if (!sidebar) return null;
  if (!document.body.classList.contains("h-has-docs-sidebar")) return null;

  const root = document.documentElement;

  function getMaxSidebarWidth() {
    return Math.max(SPLIT_MIN_WIDTH, Math.floor(window.innerWidth * SPLIT_MAX_VIEWPORT_RATIO));
  }

  function clampSidebarWidth(width) {
    return Math.max(SPLIT_MIN_WIDTH, Math.min(getMaxSidebarWidth(), width));
  }

  // Restore width from localStorage
  let sidebarWidth = SPLIT_DEFAULT_WIDTH;
  const stored = localStorage.getItem(SPLIT_SIDEBAR_STORAGE_KEY);
  if (stored) {
    const parsed = parseInt(stored, 10);
    if (!isNaN(parsed)) {
      sidebarWidth = clampSidebarWidth(parsed);
    }
  }

  // Create splitter element
  const splitter = document.createElement("div");
  splitter.id = "h-docs-splitter";
  splitter.className = "h-docs-splitter";
  splitter.setAttribute("aria-hidden", "true");
  document.body.appendChild(splitter);

  function applyCssVars() {
    const vw = window.innerWidth;
    const offsetPx = sidebarWidth + SPLIT_SPLITTER_WIDTH;
    root.style.setProperty("--h-split-sidebar-w", sidebarWidth + "px");
    root.style.setProperty("--h-split-offset", offsetPx + "px");
    root.style.setProperty("--h-split-viewport-px", vw + "px");
    root.style.setProperty("--h-split-center-inset", getSplitLayoutCenterInsetPx(vw, offsetPx) + "px");
  }

  function activate() {
    root.classList.add("h-split-active");
    applyCssVars();
  }

  function deactivate() {
    root.classList.remove("h-split-active");
    root.style.removeProperty("--h-split-sidebar-w");
    root.style.removeProperty("--h-split-offset");
    root.style.removeProperty("--h-split-viewport-px");
    root.style.removeProperty("--h-split-center-inset");
  }

  function updateSplitState() {
    const vw = window.innerWidth;
    if (vw <= MOBILE_NAV_BREAKPOINT) {
      deactivate();
    } else {
      sidebarWidth = clampSidebarWidth(sidebarWidth);
      activate();
    }
  }

  updateSplitState();

  // --- Drag handling ---
  let isDragging = false;
  let startX = 0;
  let startWidth = 0;

  function onPointerDown(e) {
    isDragging = true;
    startX = e.clientX != null ? e.clientX : e.touches[0].clientX;
    startWidth = sidebarWidth;
    splitter.classList.add("is-dragging");
    root.classList.add("h-split-dragging");
    document.addEventListener("mousemove", onPointerMove, { passive: false });
    document.addEventListener("mouseup", onPointerUp);
    document.addEventListener("touchmove", onPointerMove, { passive: false });
    document.addEventListener("touchend", onPointerUp);
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const clientX = e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : startX);
    const dx = clientX - startX;
    let newWidth = startWidth + dx;
    newWidth = clampSidebarWidth(newWidth);
    sidebarWidth = newWidth;
    applyCssVars();
    if (window.hUpdateSplitFit) window.hUpdateSplitFit();
  }

  function onPointerUp() {
    if (!isDragging) return;
    isDragging = false;
    splitter.classList.remove("is-dragging");
    root.classList.remove("h-split-dragging");
    document.removeEventListener("mousemove", onPointerMove);
    document.removeEventListener("mouseup", onPointerUp);
    document.removeEventListener("touchmove", onPointerMove);
    document.removeEventListener("touchend", onPointerUp);
    localStorage.setItem(SPLIT_SIDEBAR_STORAGE_KEY, sidebarWidth.toString());
    if (window.hUpdateSplitFit) window.hUpdateSplitFit();
  }

  splitter.addEventListener("mousedown", onPointerDown);
  splitter.addEventListener("touchstart", onPointerDown, { passive: false });

  window.addEventListener("resize", updateSplitState);

  const state = {
    getSidebarWidth: () => sidebarWidth,
    getOffset: () => sidebarWidth + SPLIT_SPLITTER_WIDTH,
    isActive: () => root.classList.contains("h-split-active"),
    update: updateSplitState,
  };

  return state;
}

// ============================================================================
// DOMContentLoaded
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initExpandedMenuPanel();
  initExpandedMenuDropdowns();
  window.hUiModes = createUiModesController();
  splitState = initSplitLayout();
  initNavbar(NAVBAR_HIDE_SCROLL_THRESHOLD);
  initSearchPanel();
  initThemeToggle();
  initBackToTop(BACK_TO_TOP_THRESHOLD, BACK_TO_TOP_DURATION_MS);
  initLightGallery();
  initSyntaxHighlighting();
  initCodeCopyButtons();
  initFontawesomeCollection();
  initGalleryGrid(GALLERY_ROW_HEIGHT);
  initSpoilerAnimation();
  initTabs();
  initPageToc();
  initDocsSidebar();
  initNavbarSidebarTocFit();
  initMobileTopNav();
});

function initNavbar(scrollThreshold) {
  const navbar = document.getElementById("h-navbar");

  if (navbar) {
    const navbarBurger = document.getElementById("h-navbar-menu-btn") || document.getElementById("h-burger");
    const navbarBottom = document.getElementById("h-navbar-bottom");
    const menuPanelLabel = document.getElementById("h-navbar-menu-panel-label");

    if (!navbarBurger || !navbarBottom) return;

    if (menuPanelLabel) menuPanelLabel.textContent = translate("Menu");

    let lastY = 0;
    let currentY = 0;
    let isNavbarHidden = navbar.classList.contains("h-is-hidden");

    navbarBottom.addEventListener("mouseover", () => {
      navbar.classList.remove("h-is-hidden");
      isNavbarHidden = false;
    });

    window.addEventListener("scroll", () => {
      // FIX 2: don't hide navbar during programmatic TOC scroll
      if (isNavAutoHideBlocked()) {
        navbar.classList.remove("h-is-hidden");
        isNavbarHidden = false;
        lastY = window.scrollY;
        currentY = window.scrollY;
        return;
      }

      lastY = currentY;
      currentY = window.scrollY;

      if (currentY > scrollThreshold && currentY > lastY && !isNavbarHidden) {
        navbar.classList.add("h-is-hidden");
        isNavbarHidden = true;
      }

      if (currentY < lastY && isNavbarHidden) {
        navbar.classList.remove("h-is-hidden");
        isNavbarHidden = false;
      }
    });
  }
}

function initBackToTop(threshold, _durationMs) {
  const btn = document.getElementById("h-back-to-top");
  if (!btn) return;

  let idleTimer = null;

  function clearIdleTimer() {
    if (idleTimer !== null) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  }

  function scheduleIdle() {
    clearIdleTimer();
    idleTimer = window.setTimeout(() => {
      idleTimer = null;
      if (window.scrollY >= threshold) {
        btn.classList.add("is-idle");
      }
    }, BACK_TO_TOP_IDLE_MS);
  }

  function onScroll() {
    btn.classList.remove("is-idle");
    if (window.scrollY >= threshold) {
      btn.classList.add("is-visible");
      scheduleIdle();
    } else {
      btn.classList.remove("is-visible");
      clearIdleTimer();
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


function initSearchPanel() {
  const searchForm = document.getElementById("h-search-form");
  if (searchForm) {
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
      window.hUiModes?.closeAll?.();
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
}

function getDownloadFilename(src) {
  if (!src) return "image";
  const parts = src.split("/");
  return parts[parts.length - 1] || "image";
}

function initLightGallery() {
  const items = [];
  const triggers = [];

  document.querySelectorAll(".h-lightbox").forEach((figure) => {
    const a = figure.querySelector("a[href]");
    if (!a) return;
    const img = a.querySelector("img");
    const href = a.getAttribute("href");
    items.push({
      src: href,
      thumb: (img && img.getAttribute("src")) || href,
      subHtml: (img && img.getAttribute("alt")) || "",
      download: getDownloadFilename(href),
    });
    triggers.push(a);
  });

  document.querySelectorAll(".h-gallery .h-is-item").forEach((el) => {
    const src = el.getAttribute("data-src");
    if (!src) return;
    const img = el.querySelector("img");
    items.push({
      src: src,
      thumb: (img && img.getAttribute("src")) || src,
      subHtml: (img && img.getAttribute("alt")) || "",
      download: getDownloadFilename(src),
    });
    triggers.push(el);
  });

  if (items.length === 0) return;

  const container = document.body;
  const instance = lightGallery(container, {
    dynamic: true,
    dynamicEl: items,
    plugins: [lgHash, lgZoom, lgThumbnail],
    galleryId: GALLERY_ID,
    hash: true,
    showCloseIcon: true,
    mobileSettings: {
      showCloseIcon: true,
      controls: true,
    },
  });

  let isGalleryOpen = false;

  instance.LGel.on("lgBeforeOpen.lg-history", () => {
    window.history.pushState({ lgOpen: true }, "", window.location.href);
  });
  instance.LGel.on("lgAfterOpen.lg-history", () => {
    isGalleryOpen = true;
  });
  instance.LGel.on("lgAfterClose.lg-history", () => {
    isGalleryOpen = false;
  });

  window.addEventListener("popstate", () => {
    if (isGalleryOpen) instance.closeGallery();
  });

  function removeDownloadTarget() {
    const downloadEl = document.getElementById("lg-download");
    if (downloadEl) downloadEl.removeAttribute("target");
  }

  instance.LGel.on("lgAfterOpen.lg-download-fix", removeDownloadTarget);
  instance.LGel.on("lgAfterSlide.lg-download-fix", removeDownloadTarget);

  triggers.forEach((el, index) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      instance.openGallery(index);
    });
  });
}

function initGalleryGrid(rowHeight) {
  document.querySelectorAll(".h-gallery").forEach((gallery) => {
    const images = gallery.querySelectorAll("img");

    images.forEach((img) => {
      if (img.complete) imgLoaded();
      else img.addEventListener("load", imgLoaded);

      function imgLoaded() {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const flexGrow = Math.round(aspectRatio * 1000) / 100;
        const flexBasis = Math.round(rowHeight * aspectRatio);

        img.parentElement.style.flex = flexGrow + " " + flexBasis + "px";
        img.parentElement.style.minHeight = Math.round(flexBasis / aspectRatio) + "px";
        img.parentElement.style.width = "100%";

        img.style.width = "100%";
        img.style.height = "auto";
      }
    });
  });
}

function initSyntaxHighlighting() {
  if (typeof hljs.highlightAll === "function") {
    hljs.highlightAll();
  }
}

function getCodeLanguage(codeEl) {
  if (!codeEl || !codeEl.classList) return null;
  for (const c of codeEl.classList) {
    if (c.startsWith("language-")) return c.slice(9);
    if (c !== "hljs") return c;
  }
  return null;
}

const CODE_LANGUAGE_NAMES = {
  cpp: "C++",
  c: "C",
  java: "Java",
  javascript: "JavaScript",
  js: "JavaScript",
  typescript: "TypeScript",
  ts: "TypeScript",
  python: "Python",
  py: "Python",
  css: "CSS",
  html: "HTML",
  xml: "XML",
  json: "JSON",
  bash: "Bash",
  shell: "Shell",
  sql: "SQL",
  plaintext: "Plain text",
};

function getLanguageDisplayName(alias) {
  const lower = (alias || "").toLowerCase();
  return CODE_LANGUAGE_NAMES[lower] || (alias ? alias.charAt(0).toUpperCase() + alias.slice(1) : "");
}

function initCodeCopyButtons() {
  const codeBlocks = document.querySelectorAll("pre > code");
  codeBlocks.forEach((codeEl) => {
    const pre = codeEl.parentElement;
    if (!pre || pre.classList.contains("h-code-block-inner")) return;
    if (codeEl.classList.contains("language-chart")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "h-code-block";

    const language = getCodeLanguage(codeEl);
    const lineCount = (codeEl.textContent || "").trim().split("\n").length;
    const showLanguageLabel = language && lineCount > 2;
    const isSingleLine = lineCount <= 1;
    if (isSingleLine) wrapper.classList.add("h-code-block--single-line");

    const labelCopy = translate("Copy");
    const labelCopied = translate("Copied!");

    function doCopy(btn) {
      const text = codeEl.textContent || "";
      navigator.clipboard.writeText(text).then(() => {
        btn.innerHTML = CODE_COPY_DONE_ICON_HTML;
        btn.setAttribute("aria-label", labelCopied);
        btn.classList.add("h-code-copy--done");
        setTimeout(() => {
          btn.innerHTML = CODE_COPY_ICON_HTML;
          btn.setAttribute("aria-label", labelCopy);
          btn.classList.remove("h-code-copy--done");
        }, CODE_COPY_FEEDBACK_MS);
      });
    }

    function createButton(position) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "h-code-copy h-code-copy--" + position;
      btn.setAttribute("aria-label", labelCopy);
      btn.innerHTML = CODE_COPY_ICON_HTML;
      btn.addEventListener("click", () => doCopy(btn));
      return btn;
    }

    if (showLanguageLabel) {
      const langSpan = document.createElement("span");
      langSpan.className = "h-code-lang";
      langSpan.textContent = getLanguageDisplayName(language);
      wrapper.appendChild(langSpan);
    }

    wrapper.appendChild(createButton("top"));
    const preClone = pre.cloneNode(true);
    preClone.classList.add("h-code-block-inner");
    wrapper.appendChild(preClone);
    if (!isSingleLine) wrapper.appendChild(createButton("bottom"));

    if (!isSingleLine) {
      wrapper.addEventListener("mousemove", (e) => {
        const rect = wrapper.getBoundingClientRect();
        const fromBottom = rect.bottom - e.clientY;
        if (fromBottom <= CODE_BLOCK_BOTTOM_THRESHOLD) {
          wrapper.classList.add("h-code-block--show-copy");
        } else {
          wrapper.classList.remove("h-code-block--show-copy");
        }
      });
      wrapper.addEventListener("mouseleave", () => {
        wrapper.classList.remove("h-code-block--show-copy");
      });
    }

    pre.parentNode.insertBefore(wrapper, pre);
    pre.remove();
  });
}

function focusAfterAnimation(elem, delayMs) {
  setTimeout(() => {
    elem.focus();
  }, delayMs);
}

function initThemeToggle() {
  function getToggles() {
    return Array.from(document.querySelectorAll(THEME_TOGGLE_SELECTOR));
  }

  function getTheme() {
    const fromDom = document.documentElement.getAttribute("data-theme");
    if (fromDom === "dark" || fromDom === "light") return fromDom;
    const stored = localStorage.getItem("h-theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("h-theme", theme);
  }

  function updateThemeLabel() {
    const theme = getTheme();
    const textLight = translate("Switch to light theme");
    const textDark = translate("Switch to dark theme");
    const label = theme === "dark" ? textLight : textDark;
    getToggles().forEach((toggle) => {
      toggle.setAttribute("aria-label", label);
      const labelEl = toggle.querySelector(".h-theme-toggle-label");
      if (labelEl) labelEl.textContent = label;
    });
  }

  updateThemeLabel();

  document.addEventListener(
    "click",
    (e) => {
      const target = e.target?.closest?.(THEME_TOGGLE_SELECTOR);
      if (!target) return;
      const current = getTheme();
      setTheme(current === "dark" ? "light" : "dark");
      updateThemeLabel();
    },
    true,
  );
}

function translate(string) {
  if (lang === "en") return string;
  return locale[string] ?? string;
}

function initSpoilerAnimation() {
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

function initTabs() {
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

function initPageToc() {
  const toc = document.getElementById("h-page-toc");
  const tocList = document.getElementById("h-page-toc-list");
  const tocLabel = document.getElementById("h-page-toc-label");
  const navbarTocTriggerLabel = document.getElementById("h-navbar-toc-trigger-label");
  const mobileTocTriggerLabel = document.getElementById("h-mobile-top-nav-toc-trigger-label");
  const toggleBtn = document.getElementById("h-page-toc-toggle");
  const closeBtn = document.getElementById("h-page-toc-close");
  if (!toc || !tocList) return;

  const article = document.querySelector("article");
  if (!article) return;

  const headings = article.querySelectorAll("h2");
  if (headings.length === 0) return;

  if (tocLabel) tocLabel.textContent = translate("Table of contents");
  function setTocTriggerLabel(text) {
    const value = (text || "").trim() || translate("Table of contents");
    if (navbarTocTriggerLabel) navbarTocTriggerLabel.textContent = value;
    if (mobileTocTriggerLabel) mobileTocTriggerLabel.textContent = value;
  }
  setTocTriggerLabel("");

  const usedIds = new Set();
  headings.forEach((h, i) => {
    if (!h.id || usedIds.has(h.id)) {
      const base = h.textContent.trim().toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "");
      let candidate = base || "section-" + i;
      let suffix = 1;
      while (usedIds.has(candidate) || document.getElementById(candidate)) {
        candidate = base + "-" + suffix++;
      }
      h.id = candidate;
    }
    usedIds.add(h.id);

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    tocList.appendChild(li);
  });

  const links = tocList.querySelectorAll("a");
  let currentActiveIndex = -1;

  function setActive(index) {
    if (index === currentActiveIndex) return;
    if (currentActiveIndex >= 0 && currentActiveIndex < links.length) {
      links[currentActiveIndex].classList.remove("is-active");
    }
    if (index >= 0 && index < links.length) {
      links[index].classList.add("is-active");
      currentActiveIndex = index;
      setTocTriggerLabel(headings[index]?.textContent || "");
    } else {
      setTocTriggerLabel("");
    }
    const mirror = document.getElementById("h-mobile-top-nav-dropdown")?.querySelector(".h-page-toc-mirror");
    const mirrorLinks = mirror?.querySelectorAll("a");
    if (mirrorLinks && mirrorLinks.length === links.length) {
      mirrorLinks.forEach((a, i) => a.classList.toggle("is-active", i === index));
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Array.from(headings).indexOf(entry.target);
          if (idx !== -1) setActive(idx);
        }
      });
    },
    { rootMargin: "-80px 0px -70% 0px" },
  );

  headings.forEach((h) => observer.observe(h));

  if (!toggleBtn) return;

  // FIX 2: Use preventDefault + scrollToAnchor instead of relying on anchor navigation
  tocList.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const href = a.getAttribute("href");
      window.hUiModes?.close("pageToc");
      scrollToAnchor(href);
    });
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY >= PAGE_TOC_TOGGLE_THRESHOLD) {
      toggleBtn.classList.add("is-visible");
    } else {
      toggleBtn.classList.remove("is-visible");
    }
  });
}

function initNavbarSidebarTocFit() {
  const sidebar = document.getElementById("h-docs-sidebar");
  const sidebarBackdrop = document.getElementById("h-docs-sidebar-backdrop");
  const toc = document.getElementById("h-page-toc");
  const tocList = document.getElementById("h-page-toc-list");
  const tocBackdrop = document.getElementById("h-page-toc-backdrop");
  const navbarSidebarBtn = document.getElementById("h-navbar-sidebar-btn");
  const navbarTocRow = document.getElementById("h-navbar-toc-row");
  const navbarTocTrigger = document.getElementById("h-navbar-toc-trigger");
  const navbarSearchBtn = document.getElementById("h-navbar-search-btn");
  const navbarMenuBtn = document.getElementById("h-navbar-menu-btn") || document.getElementById("h-burger");
  const searchOverlay = document.getElementById("h-navbar-search-overlay");
  const searchOverlayInput = document.getElementById("h-navbar-search-overlay-input");
  const searchOverlayClear = document.getElementById("h-navbar-search-overlay-clear");
  const searchOverlaySubmit = document.getElementById("h-navbar-search-overlay-submit");
  const searchOverlayClose = document.getElementById("h-navbar-search-overlay-close");
  const mainSearchInput = document.getElementById("h-search-input");

  let menuWasNoFit = false;
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
      window.hUiModes?.close("navbarSearch");
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
    const vw = window.innerWidth;
    const isSplitActive = splitState && splitState.isActive();

    if (vw <= MOBILE_NAV_BREAKPOINT) {
      closeNavbarSearchOverlay();
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

    // ========================================================================
    // SPLIT MODE
    // ========================================================================
    if (isSplitActive) {
      const splitOffset = splitState.getOffset();
      const centerInset = getSplitLayoutCenterInsetPx(vw, splitOffset);
      const availableWidth = vw - splitOffset - 2 * centerInset;

      document.body.classList.remove("h-navbar-sidebar-overlaps");

      const rightSpace = availableWidth - CONTAINER_MAX_WIDTH;
      const tocNoFit = tocList && tocList.children.length > 0 && rightSpace < TOC_MIN_SPACE;

      // FIX 1 & 3: Use unified measurement helper (visibility:hidden, no flash)
      const row1 = document.querySelector(".h-navbar__row1");
      const navbarMenu = document.getElementById("h-navbar-menu");
      let menuNoFit = false;
      if (row1 && navbarMenu) {
        const overflowPx = measureMenuOverflow(row1, navbarMenu);
        menuNoFit = menuWasNoFit ? overflowPx > -MENU_FIT_HYSTERESIS : overflowPx > 1;
      }
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

    // ========================================================================
    // NORMAL MODE (no split)
    // FIX 3: Use the same intrinsic-width measurement as split mode instead
    // of scrollWidth-clientWidth. This avoids sensitivity to layout shifts
    // when h-navbar-toc-no-fit changes the container to flex-direction:column.
    // ========================================================================
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

  window.hUpdateSplitFit = updateFit;

  let resizeRafId = 0;
  let resizeTimer = 0;
  window.addEventListener("resize", () => {
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

function initDocsSidebar() {
  const sidebar = document.getElementById("h-docs-sidebar");
  if (!sidebar) return;

  const sidebarHeaderLabel = document.getElementById("h-docs-sidebar-header-label");
  if (sidebarHeaderLabel) sidebarHeaderLabel.textContent = translate("Documentation");
}

function initMobileTopNav() {
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
    dropdownCloseBtn.innerHTML = '<span class="icon is-small" aria-hidden="true"><i class="fas fa-times"></i></span>';
    header.appendChild(dropdownCloseBtn);

    dropdown.appendChild(header);

    if (pageTocList) {
      const listWrap = document.createElement("ul");
      listWrap.className = "menu-list";
      const tocClone = pageTocList.cloneNode(true);
      tocClone.classList.add("h-page-toc-mirror");
      // FIX 2: Use preventDefault + scrollToAnchor for mobile TOC links
      tocClone.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", (e) => {
          e.preventDefault();
          const href = a.getAttribute("href");
          window.hUiModes?.close("mobileDropdown");
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

  window.addEventListener("scroll", () => {
    currentScrollY = window.scrollY;

    // FIX 2: don't hide mobile nav during programmatic TOC scroll
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

function initExpandedMenuPanel() {
  const menuPanel = document.getElementById("h-mobile-top-nav-menu-panel");
  if (!menuPanel || menuPanel.dataset.initialized === "true") return;

  const navbarMenu = document.getElementById("h-navbar-menu");
  if (!navbarMenu) return;

  const menuHeader = document.createElement("div");
  menuHeader.className = "h-mobile-top-nav__panel-header";

  const menuLabel = document.createElement("p");
  menuLabel.className = "menu-label";
  menuLabel.textContent = translate("Menu");
  menuHeader.appendChild(menuLabel);

  const menuCloseBtn = document.createElement("button");
  menuCloseBtn.type = "button";
  menuCloseBtn.className = "h-mobile-top-nav__panel-close";
  menuCloseBtn.setAttribute("aria-label", translate("Close"));
  menuCloseBtn.innerHTML = '<span class="icon is-small" aria-hidden="true"><i class="fas fa-times"></i></span>';
  menuHeader.appendChild(menuCloseBtn);

  menuPanel.appendChild(menuHeader);

  const clone = navbarMenu.cloneNode(true);
  clone.id = "";
  const cloneSearchItem = clone.querySelector("#h-search-form");
  if (cloneSearchItem && cloneSearchItem.parentElement) {
    cloneSearchItem.parentElement.removeChild(cloneSearchItem);
  }
  const cloneSearchButtonOpen = clone.querySelector("#h-search-button-open");
  if (cloneSearchButtonOpen && cloneSearchButtonOpen.parentElement) {
    cloneSearchButtonOpen.parentElement.removeChild(cloneSearchButtonOpen);
  }
  clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  clone.classList.add("navbar-menu");
  clone.querySelectorAll(".navbar-item.has-dropdown.is-hoverable").forEach((el) => {
    el.classList.remove("is-hoverable");
  });
  menuPanel.appendChild(clone);

  menuCloseBtn.addEventListener("click", () => {
    const backdrop = document.getElementById("h-mobile-top-nav-menu-backdrop");
    if (backdrop) backdrop.click();
    else menuPanel.classList.remove("is-open");
  });
  menuPanel.querySelectorAll("a[href]").forEach((a) => {
    if (a.matches(".navbar-item.has-dropdown > .navbar-link")) return;
    a.addEventListener("click", () => {
      const backdrop = document.getElementById("h-mobile-top-nav-menu-backdrop");
      if (backdrop) backdrop.click();
    });
  });

  menuPanel.dataset.initialized = "true";
}
