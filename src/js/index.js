import initFontawesomeCollection from "./_fontawesome-collection.js";
import { setSplitLayoutState, setUiModesController } from "./_app-bridge.js";
import { initSplitLayout } from "./_split-layout.js";
import { initExpandedMenuDropdowns, initExpandedMenuPanel } from "./_expanded-menu.js";
import { createUiModesController } from "./_ui-modes.js";
import { initNavbar } from "./_navbar.js";
import { initSearchPanel } from "./_search-panel.js";
import { initThemeToggle } from "./_theme.js";
import { initBackToTop } from "./_back-to-top.js";
import { initLightGallery } from "./_lightgallery-init.js";
import { initCodeCopyButtons, initSyntaxHighlighting } from "./_code-blocks.js";
import { bootLazyHeavyLibs } from "./_lazy-heavy-libs.js";
import { GALLERY_ROW_HEIGHT, NAVBAR_HIDE_SCROLL_THRESHOLD } from "./_constants.js";
import { initGalleryGrid } from "./_gallery-grid.js";
import { initSpoilerAnimation, initTabs } from "./_spoiler-tabs.js";
import { initPageToc } from "./_page-toc.js";
import { initDocsSidebar } from "./_docs-sidebar.js";
import { initNavbarSidebarTocFit } from "./_navbar-fit.js";
import { initMobileTopNav } from "./_mobile-top-nav.js";
import { initYearRange } from "./_year-range.js";

/**
 * Run a callback when the main thread is idle.
 * Uses `requestIdleCallback` when available, otherwise falls back to a short timeout.
 *
 * @param {() => void} cb
 * @param {{ timeout?: number }} [options]
 */
function runWhenIdle(cb, { timeout = 1500 } = {}) {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    // @ts-ignore - requestIdleCallback is not in some JS typings
    window.requestIdleCallback(cb, { timeout });
    return;
  }

  window.setTimeout(cb, 50);
}

document.addEventListener("DOMContentLoaded", () => {
  initExpandedMenuPanel();
  initExpandedMenuDropdowns();
  setUiModesController(createUiModesController());
  setSplitLayoutState(initSplitLayout());
  initNavbar(NAVBAR_HIDE_SCROLL_THRESHOLD);
  initSearchPanel();
  initThemeToggle();
  initBackToTop();
  initPageToc();
  initDocsSidebar();
  initNavbarSidebarTocFit();
  initMobileTopNav();

  runWhenIdle(() => {
    initLightGallery();
    initGalleryGrid(GALLERY_ROW_HEIGHT);
    initSpoilerAnimation();
    initTabs();
    bootLazyHeavyLibs();
    initFontawesomeCollection();
    initYearRange();
  });
});

window.addEventListener("load", () => {
  void (async () => {
    await initSyntaxHighlighting();
    initCodeCopyButtons();
  })();
});
