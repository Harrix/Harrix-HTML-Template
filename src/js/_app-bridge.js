/**
 * In-bundle wiring between feature modules (avoids window.* globals).
 */

let uiModesRef = null;
let splitFitUpdater = null;
let splitLayoutStateRef = null;
let inlineSearchCloser = null;

export function setUiModesController(controller) {
  uiModesRef = controller;
}

export function getUiModes() {
  return uiModesRef;
}

export function setSplitFitUpdater(fn) {
  splitFitUpdater = typeof fn === "function" ? fn : null;
}

export function requestSplitFitUpdate() {
  splitFitUpdater?.();
}

export function setSplitLayoutState(state) {
  splitLayoutStateRef = state;
}

export function getSplitLayoutState() {
  return splitLayoutStateRef;
}

export function setInlineSearchCloser(fn) {
  inlineSearchCloser = typeof fn === "function" ? fn : null;
}

export function closeInlineSearch() {
  inlineSearchCloser?.();
}
