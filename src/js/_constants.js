export const THEME_STORAGE_KEY = "h-theme";

/** First year shown in footer copyright range (`#h-year-range`); keep in sync with `footer.html` if changed. */
export const YEAR_RANGE_START_YEAR = 2022;

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
