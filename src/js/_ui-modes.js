import { createUiHistoryLayer } from "./_ui-history.js";
import { resetExpandedMenuSubmenus } from "./_expanded-menu.js";

export function createUiModesController() {
  const root = document.documentElement;

  const docsSidebar = document.getElementById("h-docs-sidebar");
  const docsSidebarBackdrop = document.getElementById("h-docs-sidebar-backdrop");
  const docsSidebarClose = document.getElementById("h-docs-sidebar-close");
  const docsSidebarToggle = document.getElementById("h-docs-sidebar-toggle");
  const navbarSidebarBtn = document.getElementById("h-navbar-sidebar-btn");

  const pageToc = document.getElementById("h-page-toc");
  const pageTocBackdrop = document.getElementById("h-page-toc-backdrop");
  const pageTocClose = document.getElementById("h-page-toc-close");
  const pageTocToggle = document.getElementById("h-page-toc-toggle");
  const navbarTocTrigger = document.getElementById("h-navbar-toc-trigger");
  const mobileTocTrigger = document.getElementById("h-mobile-top-nav-toc-trigger");

  const navbarBurger = document.getElementById("h-navbar-menu-btn") || document.getElementById("h-burger");
  const navbarMenu = document.getElementById("h-navbar-menu");
  const navbarMenuPanelHeader = document.getElementById("h-navbar-menu-panel-header");
  const navbarMenuBackdrop = document.getElementById("h-navbar-menu-backdrop");
  const navbarMenuPanelClose = document.getElementById("h-navbar-menu-panel-close");

  const navbarSearchButtonOpen = document.getElementById("h-search-button-open");
  const navbarSearchInput = document.getElementById("h-search-input");

  const navbarSearchBtn = document.getElementById("h-navbar-search-btn");
  const navbarSearchOverlay = document.getElementById("h-navbar-search-overlay");
  const navbarSearchOverlayClose = document.getElementById("h-navbar-search-overlay-close");
  const navbarSearchOverlayInput = document.getElementById("h-navbar-search-overlay-input");

  const mobileSearchBtn = document.getElementById("h-mobile-top-nav-search");
  const mobileSearchPanel = document.getElementById("h-mobile-top-nav-search-panel");
  const mobileSearchClose = document.getElementById("h-mobile-top-nav-search-close");
  const mobileSearchInput = document.getElementById("h-mobile-top-nav-search-input");
  const mobileSearchSubmit = document.getElementById("h-mobile-top-nav-search-submit");

  const mobileMenuBtn = document.getElementById("h-mobile-top-nav-menu");
  const mobileMenuPanel = document.getElementById("h-mobile-top-nav-menu-panel");
  const mobileMenuBackdrop = document.getElementById("h-mobile-top-nav-menu-backdrop");

  const mobileDropdown = document.getElementById("h-mobile-top-nav-dropdown");
  const mobileDropdownBackdrop = document.getElementById("h-mobile-top-nav-dropdown-backdrop");

  let active = null;

  function isModeOpen(mode) {
    switch (mode) {
      case "docsSidebar":
        return !!(docsSidebar && docsSidebar.classList.contains("is-open"));
      case "pageToc":
        return !!(pageToc && pageToc.classList.contains("is-open"));
      case "navbarMenu":
        return !!(navbarMenu && navbarMenu.classList.contains("is-active"));
      case "navbarSearch":
        return !!(navbarSearchOverlay && navbarSearchOverlay.classList.contains("is-open"));
      case "mobileSearch":
        return !!(mobileSearchPanel && mobileSearchPanel.classList.contains("is-open"));
      case "mobileMenu":
        return !!(mobileMenuPanel && mobileMenuPanel.classList.contains("is-open"));
      case "mobileDropdown":
        return !!(mobileDropdown && mobileDropdown.classList.contains("is-open"));
      default:
        return false;
    }
  }

  function setTocExpanded(open) {
    if (navbarTocTrigger) navbarTocTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    if (mobileTocTrigger) mobileTocTrigger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function openMode(mode) {
    switch (mode) {
      case "docsSidebar": {
        if (!docsSidebar) return;
        docsSidebar.classList.add("is-open");
        if (docsSidebarBackdrop) docsSidebarBackdrop.classList.add("is-active");
        break;
      }
      case "pageToc": {
        if (!pageToc) return;
        pageToc.classList.add("is-open");
        if (pageTocBackdrop) pageTocBackdrop.classList.add("is-active");
        setTocExpanded(true);
        break;
      }
      case "navbarMenu": {
        if (!navbarMenu || !navbarBurger) return;
        root.classList.add("h-is-clipped-touch");
        navbarBurger.classList.add("is-active");
        navbarBurger.setAttribute("aria-expanded", "true");
        navbarMenu.classList.add("is-active");
        if (document.body.classList.contains("h-navbar-menu-no-fit")) {
          if (navbarMenuPanelHeader) {
            navbarMenuPanelHeader.removeAttribute("hidden");
            navbarMenuPanelHeader.setAttribute("aria-hidden", "false");
          }
          if (navbarMenuBackdrop) {
            navbarMenuBackdrop.classList.add("is-active");
            navbarMenuBackdrop.removeAttribute("hidden");
            navbarMenuBackdrop.setAttribute("aria-hidden", "false");
          }
          navbarBurger.style.display = "none";
        }
        resetExpandedMenuSubmenus();
        break;
      }
      case "navbarSearch": {
        if (!navbarSearchOverlay) return;
        navbarSearchOverlay.classList.add("is-open");
        navbarSearchOverlay.setAttribute("aria-hidden", "false");
        if (navbarSearchOverlayInput) setTimeout(() => navbarSearchOverlayInput.focus(), 50);
        break;
      }
      case "mobileSearch": {
        if (!mobileSearchPanel) return;
        mobileSearchPanel.classList.add("is-open");
        mobileSearchPanel.setAttribute("aria-hidden", "false");
        if (mobileSearchInput) setTimeout(() => mobileSearchInput.focus(), 50);
        break;
      }
      case "mobileMenu": {
        if (!mobileMenuPanel) return;
        root.classList.add("h-is-clipped-touch");
        if (document.body.classList.contains("h-navbar-menu-no-fit") && navbarBurger) {
          navbarBurger.classList.add("is-active");
          navbarBurger.setAttribute("aria-expanded", "true");
        }
        mobileMenuPanel.classList.add("is-open");
        mobileMenuPanel.setAttribute("aria-hidden", "false");
        if (mobileMenuBackdrop) {
          mobileMenuBackdrop.classList.add("is-active");
          mobileMenuBackdrop.setAttribute("aria-hidden", "false");
        }
        resetExpandedMenuSubmenus();
        break;
      }
      case "mobileDropdown": {
        if (!mobileDropdown) return;
        mobileDropdown.classList.add("is-open");
        setTocExpanded(true);
        if (mobileDropdownBackdrop) {
          mobileDropdownBackdrop.classList.add("is-active");
          mobileDropdownBackdrop.setAttribute("aria-hidden", "false");
        }
        break;
      }
    }
  }

  function closeMode(mode) {
    switch (mode) {
      case "docsSidebar": {
        if (docsSidebar) docsSidebar.classList.remove("is-open");
        if (docsSidebarBackdrop) docsSidebarBackdrop.classList.remove("is-active");
        break;
      }
      case "pageToc": {
        if (pageToc) pageToc.classList.remove("is-open");
        if (pageTocBackdrop) pageTocBackdrop.classList.remove("is-active");
        setTocExpanded(false);
        break;
      }
      case "navbarMenu": {
        if (!navbarMenu || !navbarBurger) return;
        root.classList.remove("h-is-clipped-touch");
        navbarBurger.classList.remove("is-active");
        navbarBurger.setAttribute("aria-expanded", "false");
        navbarMenu.classList.remove("is-active");
        if (navbarMenuPanelHeader) {
          navbarMenuPanelHeader.setAttribute("hidden", "");
          navbarMenuPanelHeader.setAttribute("aria-hidden", "true");
        }
        if (navbarMenuBackdrop) {
          navbarMenuBackdrop.classList.remove("is-active");
          navbarMenuBackdrop.setAttribute("hidden", "");
          navbarMenuBackdrop.setAttribute("aria-hidden", "true");
        }
        if (document.body.classList.contains("h-navbar-menu-no-fit")) {
          navbarBurger.style.display = "";
        }
        break;
      }
      case "navbarSearch": {
        if (!navbarSearchOverlay) return;
        navbarSearchOverlay.classList.remove("is-open");
        navbarSearchOverlay.setAttribute("aria-hidden", "true");
        if (navbarSearchOverlayInput) navbarSearchOverlayInput.blur();
        break;
      }
      case "mobileSearch": {
        if (mobileSearchInput) mobileSearchInput.blur();
        if (mobileSearchPanel) {
          mobileSearchPanel.classList.remove("is-open");
          mobileSearchPanel.setAttribute("aria-hidden", "true");
        }
        break;
      }
      case "mobileMenu": {
        root.classList.remove("h-is-clipped-touch");
        if (navbarBurger) {
          navbarBurger.classList.remove("is-active");
          navbarBurger.setAttribute("aria-expanded", "false");
        }
        if (mobileMenuPanel) {
          mobileMenuPanel.classList.remove("is-open");
          mobileMenuPanel.setAttribute("aria-hidden", "true");
        }
        if (mobileMenuBackdrop) {
          mobileMenuBackdrop.classList.remove("is-active");
          mobileMenuBackdrop.setAttribute("aria-hidden", "true");
        }
        break;
      }
      case "mobileDropdown": {
        if (mobileDropdown) mobileDropdown.classList.remove("is-open");
        setTocExpanded(false);
        if (mobileDropdownBackdrop) {
          mobileDropdownBackdrop.classList.remove("is-active");
          mobileDropdownBackdrop.setAttribute("aria-hidden", "true");
        }
        break;
      }
    }
  }

  function closeAll() {
    if (navbarMenu) navbarMenu.classList.remove("h-has-visible-search-form");
    if (navbarSearchInput) navbarSearchInput.blur();

    closeMode("navbarMenu");
    closeMode("docsSidebar");
    closeMode("pageToc");
    closeMode("navbarSearch");
    closeMode("mobileSearch");
    closeMode("mobileMenu");
    closeMode("mobileDropdown");
    active = null;
  }

  function isAnyOpen() {
    return (
      isModeOpen("navbarMenu") ||
      isModeOpen("docsSidebar") ||
      isModeOpen("pageToc") ||
      isModeOpen("navbarSearch") ||
      isModeOpen("mobileSearch") ||
      isModeOpen("mobileMenu") ||
      isModeOpen("mobileDropdown")
    );
  }

  const uiHistory = createUiHistoryLayer(isAnyOpen, closeAll);

  function open(mode) {
    if (isModeOpen(mode)) return;
    closeAll();
    openMode(mode);
    active = mode;
    uiHistory.ensure();
  }

  function close(mode) {
    if (!isModeOpen(mode)) return;
    closeMode(mode);
    if (active === mode) active = null;
    uiHistory.clearIfPresent();
  }

  function toggle(mode) {
    if (isModeOpen(mode)) close(mode);
    else open(mode);
  }

  if (docsSidebarToggle) docsSidebarToggle.addEventListener("click", () => toggle("docsSidebar"));
  if (navbarSidebarBtn) navbarSidebarBtn.addEventListener("click", () => toggle("docsSidebar"));
  if (docsSidebarClose) docsSidebarClose.addEventListener("click", () => close("docsSidebar"));
  if (docsSidebarBackdrop) docsSidebarBackdrop.addEventListener("click", () => close("docsSidebar"));

  if (pageTocToggle) pageTocToggle.addEventListener("click", () => toggle("pageToc"));
  if (pageTocClose) pageTocClose.addEventListener("click", () => close("pageToc"));
  if (pageTocBackdrop) pageTocBackdrop.addEventListener("click", () => close("pageToc"));
  if (navbarTocTrigger) navbarTocTrigger.addEventListener("click", () => toggle("pageToc"));

  if (navbarBurger) {
    navbarBurger.addEventListener("click", () => {
      if (document.body.classList.contains("h-navbar-menu-no-fit")) {
        toggle("mobileMenu");
      } else {
        toggle("navbarMenu");
      }
    });
  }
  if (navbarMenuBackdrop) navbarMenuBackdrop.addEventListener("click", () => close("navbarMenu"));
  if (navbarMenuPanelClose) navbarMenuPanelClose.addEventListener("click", () => close("navbarMenu"));

  if (navbarSearchBtn) navbarSearchBtn.addEventListener("click", () => toggle("navbarSearch"));
  if (navbarSearchOverlayClose) navbarSearchOverlayClose.addEventListener("click", () => close("navbarSearch"));

  if (navbarSearchButtonOpen) {
    navbarSearchButtonOpen.addEventListener("click", () => {
      closeAll();
    });
  }

  if (mobileSearchBtn) mobileSearchBtn.addEventListener("click", () => toggle("mobileSearch"));
  if (mobileSearchClose) mobileSearchClose.addEventListener("click", () => close("mobileSearch"));
  if (mobileSearchSubmit) {
    mobileSearchSubmit.addEventListener("click", () => {
      const formEl = document.getElementById("h-search-form")?.querySelector("form");
      if (formEl) formEl.requestSubmit();
    });
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", () => toggle("mobileMenu"));
  if (mobileMenuBackdrop) mobileMenuBackdrop.addEventListener("click", () => close("mobileMenu"));

  if (mobileTocTrigger) mobileTocTrigger.addEventListener("click", () => toggle("mobileDropdown"));
  if (mobileDropdownBackdrop) mobileDropdownBackdrop.addEventListener("click", () => close("mobileDropdown"));

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!isAnyOpen()) return;
    closeAll();
    uiHistory.clearIfPresent();
  });

  return { open, close, toggle, closeAll, isAnyOpen, getActive: () => active };
}
