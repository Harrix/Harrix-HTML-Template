function isHttpLikeProtocol() {
  return window.location.protocol === "http:" || window.location.protocol === "https:";
}

function injectManifestLink() {
  if (!isHttpLikeProtocol()) return;
  var link = document.createElement("link");
  link.rel = "manifest";
  link.href = "favicon/manifest.json";
  document.head.appendChild(link);
}

function applyInitialTheme() {
  var stored = localStorage.getItem("h-theme");
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  var theme = stored === "dark" || stored === "light" ? stored : (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);
}

function markFitPending() {
  document.documentElement.classList.add("h-fit-pending");
}

function hasDocsSidebar() {
  return !!document.querySelector('meta[name="h-has-docs-sidebar"][content="1"]');
}

function applyInitialSplitLayout() {
  if (!hasDocsSidebar()) return;

  // Keep in sync with split constants in src/js/index.js (early paint before bundle).
  var MOBILE_NAV_BREAKPOINT = 1024;
  var SPLIT_SIDEBAR_STORAGE_KEY = "h-split-sidebar-width";
  var SPLIT_DEFAULT_WIDTH = 280;
  var SPLIT_MIN_WIDTH = 200;
  var SPLIT_MAX_VIEWPORT_RATIO = 0.5;
  var SPLIT_SPLITTER_WIDTH = 1;
  var CONTAINER_MAX_WIDTH = 1179;
  var SPLIT_LAYOUT_CENTER_TRIGGER_VW = 2500;
  var SPLIT_LAYOUT_CENTER_TOC_GAP_PX = 16;
  var TOC_MIN_SPACE = 256;

  var vw = window.innerWidth;
  if (vw <= MOBILE_NAV_BREAKPOINT) return;

  var maxSidebar = Math.max(SPLIT_MIN_WIDTH, Math.floor(vw * SPLIT_MAX_VIEWPORT_RATIO));
  var sidebarW = SPLIT_DEFAULT_WIDTH;
  var stored = localStorage.getItem(SPLIT_SIDEBAR_STORAGE_KEY);
  if (stored) {
    var parsed = parseInt(stored, 10);
    if (!isNaN(parsed)) {
      sidebarW = Math.max(SPLIT_MIN_WIDTH, Math.min(maxSidebar, parsed));
    }
  }

  var offset = sidebarW + SPLIT_SPLITTER_WIDTH;
  var band = offset + CONTAINER_MAX_WIDTH + SPLIT_LAYOUT_CENTER_TOC_GAP_PX + TOC_MIN_SPACE;
  var centerInset = vw <= SPLIT_LAYOUT_CENTER_TRIGGER_VW ? 0 : Math.max(0, (vw - band) / 2);

  var d = document.documentElement;
  d.style.setProperty("--h-split-viewport-px", vw + "px");
  d.style.setProperty("--h-split-sidebar-w", sidebarW + "px");
  d.style.setProperty("--h-split-offset", offset + "px");
  d.style.setProperty("--h-split-center-inset", centerInset + "px");
  d.classList.add("h-split-active");
}

injectManifestLink();
applyInitialTheme();
markFitPending();
applyInitialSplitLayout();

