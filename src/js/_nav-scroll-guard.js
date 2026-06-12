/**
 * While a programmatic TOC anchor scroll runs, suppress auto-hide on navbars that react to scroll.
 */

import { NAV_SCROLL_GUARD_BLOCK_MS } from "./_constants.js";
let blockUntil = 0;

export function blockNavAutoHide() {
  blockUntil = Date.now() + NAV_SCROLL_GUARD_BLOCK_MS;
}

export function isNavAutoHideBlocked() {
  return Date.now() < blockUntil;
}
