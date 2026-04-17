import { MOBILE_NAV_BREAKPOINT, SPLIT_SIDEBAR_STORAGE_KEY, SPLIT_SPLITTER_WIDTH } from "./_constants.js";
import { requestSplitFitUpdate } from "./_app-bridge.js";
import { safeStorageGetItem, safeStorageSetItem } from "./_storage.js";
import {
  clampSplitSidebarWidthPx,
  getSplitLayoutCssPropMap,
  resolveSplitSidebarWidthPx,
} from "./_split-layout-values.js";
import { subscribeWindowResize } from "./_resize-hub.js";

export function initSplitLayout() {
  const sidebar = document.getElementById("h-docs-sidebar");
  if (!sidebar) return null;
  if (!document.body.classList.contains("h-has-docs-sidebar")) return null;

  const root = document.documentElement;

  function clampSidebarWidth(width) {
    return clampSplitSidebarWidthPx(width, window.innerWidth);
  }

  let sidebarWidth = resolveSplitSidebarWidthPx(safeStorageGetItem(SPLIT_SIDEBAR_STORAGE_KEY), window.innerWidth);

  const splitter = document.createElement("div");
  splitter.id = "h-docs-splitter";
  splitter.className = "h-docs-splitter";
  splitter.setAttribute("aria-hidden", "true");
  document.body.appendChild(splitter);

  function applyCssVars() {
    const vw = window.innerWidth;
    const map = getSplitLayoutCssPropMap(vw, sidebarWidth);
    for (const key of Object.keys(map)) {
      root.style.setProperty(key, map[key]);
    }
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
    const clientX = e.clientX != null ? e.clientX : e.touches && e.touches[0] ? e.touches[0].clientX : startX;
    const dx = clientX - startX;
    let newWidth = startWidth + dx;
    newWidth = clampSidebarWidth(newWidth);
    sidebarWidth = newWidth;
    applyCssVars();
    requestSplitFitUpdate();
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
    safeStorageSetItem(SPLIT_SIDEBAR_STORAGE_KEY, sidebarWidth.toString());
    requestSplitFitUpdate();
  }

  splitter.addEventListener("mousedown", onPointerDown);
  splitter.addEventListener("touchstart", onPointerDown, { passive: false });

  subscribeWindowResize(updateSplitState);

  return {
    getSidebarWidth: () => sidebarWidth,
    getOffset: () => sidebarWidth + SPLIT_SPLITTER_WIDTH,
    isActive: () => root.classList.contains("h-split-active"),
    update: updateSplitState,
  };
}
