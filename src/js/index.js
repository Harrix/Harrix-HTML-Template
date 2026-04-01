import initFontawesomeCollection from "./_fontawesome-collection.js";
import { setSplitLayoutState, setUiModesController } from "./_app-bridge.js";
import { initSplitLayout } from "./_split-layout.js";
import {
  initExpandedMenuDropdowns,
  initExpandedMenuPanel,
} from "./_expanded-menu.js";
import { createUiModesController } from "./_ui-modes.js";
import { initNavbar } from "./_navbar.js";
import { initSearchPanel } from "./_search-panel.js";
import { initThemeToggle } from "./_theme.js";
import { initBackToTop } from "./_back-to-top.js";
import { initLightGallery } from "./_lightgallery-init.js";
import { initCodeCopyButtons, initSyntaxHighlighting } from "./_code-blocks.js";
import { GALLERY_ROW_HEIGHT, NAVBAR_HIDE_SCROLL_THRESHOLD } from "./_constants.js";
import { initGalleryGrid } from "./_gallery-grid.js";
import { initSpoilerAnimation, initTabs } from "./_spoiler-tabs.js";
import { initPageToc } from "./_page-toc.js";
import { initDocsSidebar } from "./_docs-sidebar.js";
import { initNavbarSidebarTocFit } from "./_navbar-fit.js";
import { initMobileTopNav } from "./_mobile-top-nav.js";
import { initYearRange } from "./_year-range.js";

document.addEventListener("DOMContentLoaded", () => {
  initExpandedMenuPanel();
  initExpandedMenuDropdowns();
  setUiModesController(createUiModesController());
  setSplitLayoutState(initSplitLayout());
  initNavbar(NAVBAR_HIDE_SCROLL_THRESHOLD);
  initSearchPanel();
  initThemeToggle();
  initBackToTop();
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
  initYearRange(2022);
});
