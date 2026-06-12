import { IDS, NAVBAR_HIDE_SCROLL_THRESHOLD } from "./_constants.js";
import { isNavAutoHideBlocked } from "./_nav-scroll-guard.js";
import { translate } from "./_locale.js";
import { subscribeWindowScroll } from "./_scroll-hub.js";

export function initNavbar(scrollThreshold = NAVBAR_HIDE_SCROLL_THRESHOLD) {
  const navbar = document.getElementById(IDS.navbar);

  if (navbar) {
    const navbarBurger = document.getElementById(IDS.navbarMenuBtn) || document.getElementById(IDS.burger);
    const navbarBottom = document.getElementById(IDS.navbarBottom);
    const menuPanelLabel = document.getElementById(IDS.navbarMenuPanelLabel);

    if (!navbarBurger || !navbarBottom) return;

    if (menuPanelLabel) menuPanelLabel.textContent = translate("Menu");

    let lastY = 0;
    let currentY = 0;
    let isNavbarHidden = navbar.classList.contains("h-is-hidden");

    navbarBottom.addEventListener("mouseover", () => {
      navbar.classList.remove("h-is-hidden");
      isNavbarHidden = false;
    });

    subscribeWindowScroll((scrollY) => {
      if (isNavAutoHideBlocked()) {
        navbar.classList.remove("h-is-hidden");
        isNavbarHidden = false;
        lastY = scrollY;
        currentY = scrollY;
        return;
      }

      lastY = currentY;
      currentY = scrollY;

      if (currentY > scrollThreshold && currentY > lastY && !isNavbarHidden) {
        navbar.classList.add("h-is-hidden");
        isNavbarHidden = true;
      }

      if (currentY < lastY && isNavbarHidden) {
        navbar.classList.remove("h-is-hidden");
        isNavbarHidden = false;
      }
    });
  }
}
