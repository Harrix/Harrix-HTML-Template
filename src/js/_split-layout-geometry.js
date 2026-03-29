import {
  CONTAINER_MAX_WIDTH,
  SPLIT_LAYOUT_CENTER_TRIGGER_VW,
  SPLIT_LAYOUT_CENTER_TOC_GAP_PX,
  TOC_MIN_SPACE,
} from "./_constants.js";

export function getSplitLayoutNaturalBandWidthPx(splitOffsetPx) {
  return splitOffsetPx + CONTAINER_MAX_WIDTH + SPLIT_LAYOUT_CENTER_TOC_GAP_PX + TOC_MIN_SPACE;
}

/** Centers sidebar + content + TOC as one band: inset = max(0, (vw - band) / 2). */
export function getSplitLayoutCenterInsetPx(vw, splitOffsetPx) {
  if (vw <= SPLIT_LAYOUT_CENTER_TRIGGER_VW) return 0;
  const band = getSplitLayoutNaturalBandWidthPx(splitOffsetPx);
  return Math.max(0, (vw - band) / 2);
}
