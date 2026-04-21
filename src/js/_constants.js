export const THEME_STORAGE_KEY = "h-theme";

/** First year shown in footer copyright range (`#h-year-range`); keep in sync with `footer.html` if changed. */
export const YEAR_RANGE_START_YEAR = 2022;

export const IDS = Object.freeze({
  backToTop: "h-back-to-top",
  burger: "h-burger",
  docsSidebar: "h-docs-sidebar",
  docsSidebarBackdrop: "h-docs-sidebar-backdrop",
  docsSidebarClose: "h-docs-sidebar-close",
  docsSidebarHeaderLabel: "h-docs-sidebar-header-label",
  docsSidebarToggle: "h-docs-sidebar-toggle",
  mobileTopNav: "h-mobile-top-nav",
  mobileTopNavDropdown: "h-mobile-top-nav-dropdown",
  mobileTopNavDropdownBackdrop: "h-mobile-top-nav-dropdown-backdrop",
  mobileTopNavMenu: "h-mobile-top-nav-menu",
  mobileTopNavMenuBackdrop: "h-mobile-top-nav-menu-backdrop",
  mobileTopNavMenuPanel: "h-mobile-top-nav-menu-panel",
  mobileTopNavSearch: "h-mobile-top-nav-search",
  mobileTopNavSearchClear: "h-mobile-top-nav-search-clear",
  mobileTopNavSearchClose: "h-mobile-top-nav-search-close",
  mobileTopNavSearchInput: "h-mobile-top-nav-search-input",
  mobileTopNavSearchPanel: "h-mobile-top-nav-search-panel",
  mobileTopNavSearchSubmit: "h-mobile-top-nav-search-submit",
  mobileTopNavSidebar: "h-mobile-top-nav-sidebar",
  mobileTopNavTocTrigger: "h-mobile-top-nav-toc-trigger",
  mobileTopNavTocTriggerLabel: "h-mobile-top-nav-toc-trigger-label",
  navbar: "h-navbar",
  navbarBottom: "h-navbar-bottom",
  navbarMenu: "h-navbar-menu",
  navbarMenuBackdrop: "h-navbar-menu-backdrop",
  navbarMenuBtn: "h-navbar-menu-btn",
  navbarMenuPanelClose: "h-navbar-menu-panel-close",
  navbarMenuPanelHeader: "h-navbar-menu-panel-header",
  navbarMenuPanelLabel: "h-navbar-menu-panel-label",
  navbarSearchBtn: "h-navbar-search-btn",
  navbarSearchOverlay: "h-navbar-search-overlay",
  navbarSearchOverlayClear: "h-navbar-search-overlay-clear",
  navbarSearchOverlayClose: "h-navbar-search-overlay-close",
  navbarSearchOverlayInput: "h-navbar-search-overlay-input",
  navbarSearchOverlaySubmit: "h-navbar-search-overlay-submit",
  navbarSidebarBtn: "h-navbar-sidebar-btn",
  navbarTocRow: "h-navbar-toc-row",
  navbarTocTrigger: "h-navbar-toc-trigger",
  navbarTocTriggerLabel: "h-navbar-toc-trigger-label",
  pageToc: "h-page-toc",
  pageTocBackdrop: "h-page-toc-backdrop",
  pageTocClose: "h-page-toc-close",
  pageTocLabel: "h-page-toc-label",
  pageTocList: "h-page-toc-list",
  pageTocToggle: "h-page-toc-toggle",
  searchButtonClear: "h-search-button-clear",
  searchButtonClose: "h-search-button-close",
  searchButtonOpen: "h-search-button-open",
  searchButtonSubmit: "h-search-button-submit",
  searchForm: "h-search-form",
  searchInput: "h-search-input",
  yearRange: "h-year-range",
});

export const NAVBAR_HIDE_SCROLL_THRESHOLD = 100;
export const GALLERY_ROW_HEIGHT = 200;
export const SEARCH_ANIMATION_MS = 500;
export const CODE_COPY_FEEDBACK_MS = 800;
export const CODE_COPY_ICON_HTML = '<span class="icon is-small"><i class="fas fa-copy" aria-hidden="true"></i></span>';
export const CODE_COPY_DONE_ICON_HTML =
  '<span class="icon is-small"><i class="fas fa-check" aria-hidden="true"></i></span>';
export const CODE_BLOCK_BOTTOM_THRESHOLD = 80;
export const GALLERY_ID = "1";
export const BACK_TO_TOP_THRESHOLD = 200;
export const BACK_TO_TOP_IDLE_MS = 3000;
export const PAGE_TOC_TOGGLE_THRESHOLD = 200;

export const CONTAINER_MAX_WIDTH = 1179;
export const SIDEBAR_WIDTH = 280;
export const TOC_MIN_SPACE = 256;
export const MOBILE_NAV_BREAKPOINT = 1024;
export const SIDEBAR_TOC_DESKTOP_MIN_WIDTH = 1680;
export const MENU_FIT_HYSTERESIS = 40;
/** Narrower exit band in split layout — row width matches real flex chrome; large −40px slack stuck no-fit. */
export const MENU_FIT_HYSTERESIS_SPLIT = 12;

export const SPLIT_SIDEBAR_STORAGE_KEY = "h-split-sidebar-width";
export const SPLIT_DEFAULT_WIDTH = 280;
export const SPLIT_MIN_WIDTH = 200;
export const SPLIT_MAX_VIEWPORT_RATIO = 0.5;
export const SPLIT_SPLITTER_WIDTH = 1;
/** Horizontal centering runs only when viewport is wider than this (px). */
export const SPLIT_LAYOUT_CENTER_TRIGGER_VW = 2500;
/** Matches split SCSS gap before TOC (`+ 1rem`); px fallback for band width. */
export const SPLIT_LAYOUT_CENTER_TOC_GAP_PX = 16;
