import { translate } from "./_locale.js";

export function resetExpandedMenuSubmenus() {
  document
    .querySelectorAll(
      "#h-mobile-top-nav-menu-panel .navbar-item.has-dropdown, #h-navbar-menu .navbar-item.has-dropdown",
    )
    .forEach((el) => {
      el.classList.remove("is-collapsed");
      const link = el.querySelector(":scope > .navbar-link");
      if (link) link.setAttribute("aria-expanded", "true");
    });
}

function syncExpandedMenuDropdownAria() {
  document
    .querySelectorAll(
      "#h-mobile-top-nav-menu-panel .navbar-item.has-dropdown, #h-navbar-menu .navbar-item.has-dropdown",
    )
    .forEach((el) => {
      const link = el.querySelector(":scope > .navbar-link");
      if (!link) return;
      const collapsed = el.classList.contains("is-collapsed");
      link.setAttribute("aria-expanded", collapsed ? "false" : "true");
    });
}

export function initExpandedMenuDropdowns() {
  document.addEventListener(
    "click",
    (e) => {
      const link = e.target.closest(".navbar-item.has-dropdown > .navbar-link");
      if (!link) return;
      const panel = link.closest("#h-mobile-top-nav-menu-panel, #h-navbar-menu");
      if (!panel) return;
      if (panel.id === "h-mobile-top-nav-menu-panel" && !panel.classList.contains("is-open")) return;
      if (panel.id === "h-navbar-menu" && !panel.classList.contains("is-active")) return;

      const dropdown = link.closest(".navbar-item.has-dropdown");
      if (!dropdown) return;

      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle("is-collapsed");
      const collapsed = dropdown.classList.contains("is-collapsed");
      link.setAttribute("aria-expanded", collapsed ? "false" : "true");
    },
    true,
  );

  syncExpandedMenuDropdownAria();
}

const PANEL_CLOSE_ICON_HTML =
  '<span class="icon is-small" aria-hidden="true"><i class="fas fa-times"></i></span>';

export function initExpandedMenuPanel() {
  const menuPanel = document.getElementById("h-mobile-top-nav-menu-panel");
  if (!menuPanel || menuPanel.dataset.initialized === "true") return;

  const navbarMenu = document.getElementById("h-navbar-menu");
  if (!navbarMenu) return;

  const menuHeader = document.createElement("div");
  menuHeader.className = "h-mobile-top-nav__panel-header";

  const menuLabel = document.createElement("p");
  menuLabel.className = "menu-label";
  menuLabel.textContent = translate("Menu");
  menuHeader.appendChild(menuLabel);

  const menuCloseBtn = document.createElement("button");
  menuCloseBtn.type = "button";
  menuCloseBtn.className = "h-mobile-top-nav__panel-close";
  menuCloseBtn.setAttribute("aria-label", translate("Close"));
  menuCloseBtn.innerHTML = PANEL_CLOSE_ICON_HTML;
  menuHeader.appendChild(menuCloseBtn);

  menuPanel.appendChild(menuHeader);

  const clone = navbarMenu.cloneNode(true);
  clone.id = "";
  const cloneSearchItem = clone.querySelector("#h-search-form");
  if (cloneSearchItem && cloneSearchItem.parentElement) {
    cloneSearchItem.parentElement.removeChild(cloneSearchItem);
  }
  const cloneSearchButtonOpen = clone.querySelector("#h-search-button-open");
  if (cloneSearchButtonOpen && cloneSearchButtonOpen.parentElement) {
    cloneSearchButtonOpen.parentElement.removeChild(cloneSearchButtonOpen);
  }
  clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  clone.classList.add("navbar-menu");
  clone.querySelectorAll(".navbar-item.has-dropdown.is-hoverable").forEach((el) => {
    el.classList.remove("is-hoverable");
  });
  menuPanel.appendChild(clone);

  menuCloseBtn.addEventListener("click", () => {
    const backdrop = document.getElementById("h-mobile-top-nav-menu-backdrop");
    if (backdrop) backdrop.click();
    else menuPanel.classList.remove("is-open");
  });
  menuPanel.querySelectorAll("a[href]").forEach((a) => {
    if (a.matches(".navbar-item.has-dropdown > .navbar-link")) return;
    a.addEventListener("click", () => {
      const backdrop = document.getElementById("h-mobile-top-nav-menu-backdrop");
      if (backdrop) backdrop.click();
    });
  });

  menuPanel.dataset.initialized = "true";
}
