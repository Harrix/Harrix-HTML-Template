import { blockNavAutoHide } from "./_nav-scroll-guard.js";
import { IDS } from "./_constants.js";

export function getFixedHeaderHeight() {
  const mobileTopNav = document.getElementById(IDS.mobileTopNav);
  if (mobileTopNav && window.getComputedStyle(mobileTopNav).display !== "none") {
    return mobileTopNav.offsetHeight;
  }
  const navbar = document.getElementById(IDS.navbar);
  if (navbar && window.getComputedStyle(navbar).display !== "none") {
    return navbar.offsetHeight;
  }
  return 0;
}

export function scrollToAnchor(href) {
  const id = href && href.startsWith("#") ? href.slice(1) : href;
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  blockNavAutoHide();
  const headerHeight = getFixedHeaderHeight();
  const elRect = el.getBoundingClientRect();
  const targetY = elRect.top + window.scrollY - headerHeight - 16;
  window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
}
