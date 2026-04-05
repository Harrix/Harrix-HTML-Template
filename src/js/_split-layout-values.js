import {
  SPLIT_DEFAULT_WIDTH,
  SPLIT_MAX_VIEWPORT_RATIO,
  SPLIT_MIN_WIDTH,
  SPLIT_SPLITTER_WIDTH,
} from "./_constants.js";
import { getSplitLayoutCenterInsetPx } from "./_split-layout-geometry.js";

export function getMaxSplitSidebarWidthPx(viewportWidthPx) {
  return Math.max(SPLIT_MIN_WIDTH, Math.floor(viewportWidthPx * SPLIT_MAX_VIEWPORT_RATIO));
}

export function clampSplitSidebarWidthPx(widthPx, viewportWidthPx) {
  const maxSidebar = getMaxSplitSidebarWidthPx(viewportWidthPx);
  return Math.max(SPLIT_MIN_WIDTH, Math.min(maxSidebar, widthPx));
}

/** Same rules as `initSplitLayout` initial read and early paint. */
export function resolveSplitSidebarWidthPx(storedValue, viewportWidthPx) {
  let sidebarW = SPLIT_DEFAULT_WIDTH;
  if (storedValue) {
    const parsed = parseInt(storedValue, 10);
    if (!Number.isNaN(parsed)) {
      sidebarW = clampSplitSidebarWidthPx(parsed, viewportWidthPx);
    }
  }
  return sidebarW;
}

/** `--h-split-*` values for `documentElement` (no DOM writes). */
export function getSplitLayoutCssPropMap(viewportWidthPx, sidebarWidthPx) {
  const offsetPx = sidebarWidthPx + SPLIT_SPLITTER_WIDTH;
  const centerInsetPx = getSplitLayoutCenterInsetPx(viewportWidthPx, offsetPx);
  return {
    "--h-split-viewport-px": `${viewportWidthPx}px`,
    "--h-split-sidebar-w": `${sidebarWidthPx}px`,
    "--h-split-offset": `${offsetPx}px`,
    "--h-split-center-inset": `${centerInsetPx}px`,
  };
}
