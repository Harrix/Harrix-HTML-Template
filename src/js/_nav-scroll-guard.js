/**
 * While a programmatic TOC anchor scroll runs, suppress auto-hide on navbars that react to scroll.
 */

const TOC_SCROLL_BLOCK_MS = 1200;
let blockUntil = 0;

export function blockNavAutoHide() {
  blockUntil = Date.now() + TOC_SCROLL_BLOCK_MS;
}

export function isNavAutoHideBlocked() {
  return Date.now() < blockUntil;
}
