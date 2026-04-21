import { createUiHistoryLayer } from "./_ui-history.js";
import { resetExpandedMenuSubmenus } from "./_expanded-menu.js";
import { IDS } from "./_constants.js";

export function createUiModesController() {
  const root = document.documentElement;

  const byId = (id) => document.getElementById(id);

  const docsSidebar = byId(IDS.docsSidebar);
  const docsSidebarBackdrop = byId(IDS.docsSidebarBackdrop);
  const docsSidebarClose = byId(IDS.docsSidebarClose);
  const docsSidebarToggle = byId(IDS.docsSidebarToggle);
  const navbarSidebarBtn = byId(IDS.navbarSidebarBtn);

  const pageToc = byId(IDS.pageToc);
  const pageTocBackdrop = byId(IDS.pageTocBackdrop);
  const pageTocClose = byId(IDS.pageTocClose);
  const pageTocToggle = byId(IDS.pageTocToggle);
  const navbarTocTrigger = byId(IDS.navbarTocTrigger);
  const mobileTocTrigger = byId(IDS.mobileTopNavTocTrigger);

  const navbarBurger = byId(IDS.navbarMenuBtn) || byId(IDS.burger);
  const navbarMenu = byId(IDS.navbarMenu);
  const navbarMenuPanelHeader = byId(IDS.navbarMenuPanelHeader);
  const navbarMenuBackdrop = byId(IDS.navbarMenuBackdrop);
  const navbarMenuPanelClose = byId(IDS.navbarMenuPanelClose);

  const navbarSearchButtonOpen = byId(IDS.searchButtonOpen);
  const navbarSearchInput = byId(IDS.searchInput);

  const navbarSearchBtn = byId(IDS.navbarSearchBtn);
  const navbarSearchOverlay = byId(IDS.navbarSearchOverlay);
  const navbarSearchOverlayClose = byId(IDS.navbarSearchOverlayClose);
  const navbarSearchOverlayInput = byId(IDS.navbarSearchOverlayInput);

  const mobileSearchBtn = byId(IDS.mobileTopNavSearch);
  const mobileSearchPanel = byId(IDS.mobileTopNavSearchPanel);
  const mobileSearchClose = byId(IDS.mobileTopNavSearchClose);
  const mobileSearchInput = byId(IDS.mobileTopNavSearchInput);
  const mobileSearchSubmit = byId(IDS.mobileTopNavSearchSubmit);

  const mobileMenuBtn = byId(IDS.mobileTopNavMenu);
  const mobileMenuPanel = byId(IDS.mobileTopNavMenuPanel);
  const mobileMenuBackdrop = byId(IDS.mobileTopNavMenuBackdrop);

  const mobileDropdown = byId(IDS.mobileTopNavDropdown);
  const mobileDropdownBackdrop = byId(IDS.mobileTopNavDropdownBackdrop);

  let active = null;

  function setTocExpanded(open) {
    if (navbarTocTrigger) navbarTocTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    if (mobileTocTrigger) mobileTocTrigger.setAttribute("aria-expanded", open ? "true" : "false");
  }

  /**
   * @typedef {Object} UiMode
   * @property {HTMLElement | null} [panel]
   * @property {string} panelOpenClass
   * @property {HTMLElement | null} [backdrop]
   * @property {string} [backdropActiveClass]
   * @property {() => boolean} [canOpen]
   * @property {(mode: UiModeName) => void} [onOpen]
   * @property {(mode: UiModeName) => void} [onClose]
   */

  /** @typedef {"docsSidebar"|"pageToc"|"navbarMenu"|"navbarSearch"|"mobileSearch"|"mobileMenu"|"mobileDropdown"} UiModeName */

  /** @type {Record<UiModeName, UiMode>} */
  const MODES = {
    docsSidebar: {
      panel: docsSidebar,
      panelOpenClass: "is-open",
      backdrop: docsSidebarBackdrop,
      backdropActiveClass: "is-active",
    },
    pageToc: {
      panel: pageToc,
      panelOpenClass: "is-open",
      backdrop: pageTocBackdrop,
      backdropActiveClass: "is-active",
      onOpen: () => setTocExpanded(true),
      onClose: () => setTocExpanded(false),
    },
    navbarMenu: {
      panel: navbarMenu,
      panelOpenClass: "is-active",
      canOpen: () => !!navbarBurger,
      onOpen: () => {
        if (!navbarMenu || !navbarBurger) return;

        root.classList.add("h-is-clipped-touch");
        navbarBurger.classList.add("is-active");
        navbarBurger.setAttribute("aria-expanded", "true");

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
      },
      onClose: () => {
        if (!navbarMenu || !navbarBurger) return;

        root.classList.remove("h-is-clipped-touch");
        navbarBurger.classList.remove("is-active");
        navbarBurger.setAttribute("aria-expanded", "false");

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
      },
    },
    navbarSearch: {
      panel: navbarSearchOverlay,
      panelOpenClass: "is-open",
      onOpen: () => {
        if (!navbarSearchOverlay) return;
        navbarSearchOverlay.setAttribute("aria-hidden", "false");
        if (navbarSearchOverlayInput) setTimeout(() => navbarSearchOverlayInput.focus(), 50);
      },
      onClose: () => {
        if (!navbarSearchOverlay) return;
        navbarSearchOverlay.setAttribute("aria-hidden", "true");
        if (navbarSearchOverlayInput) navbarSearchOverlayInput.blur();
      },
    },
    mobileSearch: {
      panel: mobileSearchPanel,
      panelOpenClass: "is-open",
      onOpen: () => {
        if (!mobileSearchPanel) return;
        mobileSearchPanel.setAttribute("aria-hidden", "false");
        if (mobileSearchInput) setTimeout(() => mobileSearchInput.focus(), 50);
      },
      onClose: () => {
        if (mobileSearchInput) mobileSearchInput.blur();
        if (mobileSearchPanel) mobileSearchPanel.setAttribute("aria-hidden", "true");
      },
    },
    mobileMenu: {
      panel: mobileMenuPanel,
      panelOpenClass: "is-open",
      backdrop: mobileMenuBackdrop,
      backdropActiveClass: "is-active",
      onOpen: () => {
        if (!mobileMenuPanel) return;
        root.classList.add("h-is-clipped-touch");
        if (document.body.classList.contains("h-navbar-menu-no-fit") && navbarBurger) {
          navbarBurger.classList.add("is-active");
          navbarBurger.setAttribute("aria-expanded", "true");
        }
        mobileMenuPanel.setAttribute("aria-hidden", "false");
        if (mobileMenuBackdrop) mobileMenuBackdrop.setAttribute("aria-hidden", "false");
        resetExpandedMenuSubmenus();
      },
      onClose: () => {
        root.classList.remove("h-is-clipped-touch");
        if (navbarBurger) {
          navbarBurger.classList.remove("is-active");
          navbarBurger.setAttribute("aria-expanded", "false");
        }
        if (mobileMenuPanel) mobileMenuPanel.setAttribute("aria-hidden", "true");
        if (mobileMenuBackdrop) mobileMenuBackdrop.setAttribute("aria-hidden", "true");
      },
    },
    mobileDropdown: {
      panel: mobileDropdown,
      panelOpenClass: "is-open",
      backdrop: mobileDropdownBackdrop,
      backdropActiveClass: "is-active",
      onOpen: () => {
        setTocExpanded(true);
        if (mobileDropdownBackdrop) mobileDropdownBackdrop.setAttribute("aria-hidden", "false");
      },
      onClose: () => {
        setTocExpanded(false);
        if (mobileDropdownBackdrop) mobileDropdownBackdrop.setAttribute("aria-hidden", "true");
      },
    },
  };

  /** @param {UiModeName} mode */
  function isModeOpen(mode) {
    const def = MODES[mode];
    return !!(def?.panel && def.panel.classList.contains(def.panelOpenClass));
  }

  /** @param {UiModeName} mode */
  function openMode(mode) {
    const def = MODES[mode];
    if (!def?.panel) return;
    if (def.canOpen && !def.canOpen()) return;

    def.panel.classList.add(def.panelOpenClass);
    if (def.backdrop && def.backdropActiveClass) def.backdrop.classList.add(def.backdropActiveClass);
    def.onOpen?.(mode);
  }

  /** @param {UiModeName} mode */
  function closeMode(mode) {
    const def = MODES[mode];
    if (!def) return;

    if (def.panel) def.panel.classList.remove(def.panelOpenClass);
    if (def.backdrop && def.backdropActiveClass) def.backdrop.classList.remove(def.backdropActiveClass);
    def.onClose?.(mode);
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

  const modeBindings =
    /** @type {Array<{ el: HTMLElement | null, type: "toggle"|"close"|"open", mode: UiModeName }>} */ ([
      { el: docsSidebarToggle, type: "toggle", mode: "docsSidebar" },
      { el: navbarSidebarBtn, type: "toggle", mode: "docsSidebar" },
      { el: docsSidebarClose, type: "close", mode: "docsSidebar" },
      { el: docsSidebarBackdrop, type: "close", mode: "docsSidebar" },

      { el: pageTocToggle, type: "toggle", mode: "pageToc" },
      { el: pageTocClose, type: "close", mode: "pageToc" },
      { el: pageTocBackdrop, type: "close", mode: "pageToc" },
      { el: navbarTocTrigger, type: "toggle", mode: "pageToc" },

      { el: navbarSearchBtn, type: "toggle", mode: "navbarSearch" },
      { el: navbarSearchOverlayClose, type: "close", mode: "navbarSearch" },

      { el: mobileSearchBtn, type: "toggle", mode: "mobileSearch" },
      { el: mobileSearchClose, type: "close", mode: "mobileSearch" },

      { el: mobileMenuBtn, type: "toggle", mode: "mobileMenu" },
      { el: mobileMenuBackdrop, type: "close", mode: "mobileMenu" },

      { el: mobileTocTrigger, type: "toggle", mode: "mobileDropdown" },
      { el: mobileDropdownBackdrop, type: "close", mode: "mobileDropdown" },
    ]);

  for (const { el, type, mode } of modeBindings) {
    if (!el) continue;
    el.addEventListener("click", () => {
      if (type === "toggle") toggle(mode);
      else if (type === "open") open(mode);
      else close(mode);
    });
  }

  if (navbarBurger) {
    navbarBurger.addEventListener("click", () => {
      toggle(document.body.classList.contains("h-navbar-menu-no-fit") ? "mobileMenu" : "navbarMenu");
    });
  }
  if (navbarMenuBackdrop) navbarMenuBackdrop.addEventListener("click", () => close("navbarMenu"));
  if (navbarMenuPanelClose) navbarMenuPanelClose.addEventListener("click", () => close("navbarMenu"));

  if (navbarSearchButtonOpen) navbarSearchButtonOpen.addEventListener("click", closeAll);

  if (mobileSearchSubmit) {
    mobileSearchSubmit.addEventListener("click", () => {
      const formEl = byId(IDS.searchForm)?.querySelector("form");
      if (formEl) formEl.requestSubmit();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!isAnyOpen()) return;
    closeAll();
    uiHistory.clearIfPresent();
  });

  return { open, close, toggle, closeAll, isAnyOpen, getActive: () => active };
}
