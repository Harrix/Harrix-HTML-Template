import { MOBILE_NAV_BREAKPOINT, SPLIT_SIDEBAR_STORAGE_KEY } from "./_constants.js";
import { getSplitLayoutCssPropMap, resolveSplitSidebarWidthPx } from "./_split-layout-values.js";
import { safeStorageGetItem } from "./_storage.js";

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
  var stored = safeStorageGetItem("h-theme");
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

  var vw = window.innerWidth;
  if (vw <= MOBILE_NAV_BREAKPOINT) return;

  var stored = safeStorageGetItem(SPLIT_SIDEBAR_STORAGE_KEY);
  var sidebarW = resolveSplitSidebarWidthPx(stored, vw);
  var props = getSplitLayoutCssPropMap(vw, sidebarW);

  var d = document.documentElement;
  Object.keys(props).forEach(function (key) {
    d.style.setProperty(key, props[key]);
  });
  d.classList.add("h-split-active");
}

injectManifestLink();
applyInitialTheme();
markFitPending();
applyInitialSplitLayout();

