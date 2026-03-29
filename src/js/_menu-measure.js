/**
 * Hidden clone of `.navbar-end` for stable intrinsic width — avoids feedback loops when toggling no-fit classes.
 */

let menuMeasure = null;

function setImportantStyle(el, prop, value) {
  el.style.setProperty(prop, value, "important");
}

function stripIds(root) {
  if (!root) return;
  if (root.hasAttribute && root.hasAttribute("id")) root.removeAttribute("id");
  if (root.querySelectorAll) {
    root.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
  }
}

function buildMenuMeasure(navbarMenu) {
  const navbarEnd = navbarMenu?.querySelector(".navbar-end");
  if (!navbarEnd) return null;

  const root = document.createElement("div");
  root.className = "h-navbar-menu-measure";
  setImportantStyle(root, "position", "absolute");
  setImportantStyle(root, "left", "-9999px");
  setImportantStyle(root, "top", "0");
  setImportantStyle(root, "visibility", "hidden");
  setImportantStyle(root, "pointer-events", "none");
  setImportantStyle(root, "width", "auto");
  setImportantStyle(root, "height", "auto");
  setImportantStyle(root, "z-index", "-1");

  const nav = document.createElement("nav");
  nav.className = "navbar";
  setImportantStyle(nav, "width", "auto");
  setImportantStyle(nav, "height", "auto");
  setImportantStyle(nav, "padding", "0");
  setImportantStyle(nav, "margin", "0");

  const menu = document.createElement("div");
  menu.className = "navbar-menu";
  stripIds(menu);
  setImportantStyle(menu, "display", "flex");
  setImportantStyle(menu, "position", "static");
  setImportantStyle(menu, "visibility", "hidden");
  setImportantStyle(menu, "opacity", "1");
  setImportantStyle(menu, "transform", "none");
  setImportantStyle(menu, "box-shadow", "none");
  setImportantStyle(menu, "padding", "0");
  setImportantStyle(menu, "margin", "0");
  setImportantStyle(menu, "border", "none");
  setImportantStyle(menu, "background", "transparent");
  setImportantStyle(menu, "width", "auto");
  setImportantStyle(menu, "max-height", "none");

  const end = navbarEnd.cloneNode(true);
  const measureSearchForm = end.querySelector("#h-search-form");
  if (measureSearchForm?.parentElement) {
    measureSearchForm.parentElement.removeChild(measureSearchForm);
  }
  end.querySelectorAll(".navbar-dropdown").forEach((dd) => {
    dd.style.setProperty("display", "none", "important");
    dd.style.setProperty("position", "absolute", "important");
    dd.style.setProperty("visibility", "hidden", "important");
    dd.style.setProperty("pointer-events", "none", "important");
    dd.style.setProperty("width", "0", "important");
    dd.style.setProperty("height", "0", "important");
  });

  end.querySelectorAll(".navbar-item.has-dropdown").forEach((item) => {
    item.classList.remove("is-hoverable", "is-active");
  });

  stripIds(end);
  setImportantStyle(end, "display", "flex");
  setImportantStyle(end, "flex-direction", "row");
  setImportantStyle(end, "flex-wrap", "nowrap");
  setImportantStyle(end, "width", "max-content");
  setImportantStyle(end, "align-items", "center");

  menu.appendChild(end);
  nav.appendChild(menu);
  root.appendChild(nav);
  document.body.appendChild(root);

  return { root, end, source: navbarMenu };
}

function getMenuMeasure(navbarMenu) {
  if (menuMeasure && menuMeasure.source === navbarMenu && document.body.contains(menuMeasure.root)) {
    return menuMeasure;
  }
  if (menuMeasure?.root?.parentNode) {
    menuMeasure.root.parentNode.removeChild(menuMeasure.root);
  }
  menuMeasure = buildMenuMeasure(navbarMenu);
  return menuMeasure;
}

export function suppressNavbarDropdownsTemporarily(duration = 200) {
  const root = document.documentElement;
  root.classList.add("h-nav-suppress-dropdowns");

  const dropdowns = document.querySelectorAll("#h-navbar-menu .navbar-dropdown");
  dropdowns.forEach((dd) => {
    dd.dataset.hSuppress = "1";
    dd.style.display = "none";
  });

  window.setTimeout(() => {
    root.classList.remove("h-nav-suppress-dropdowns");
    dropdowns.forEach((dd) => {
      if (dd.dataset.hSuppress) {
        dd.style.display = "";
        delete dd.dataset.hSuppress;
      }
    });
  }, duration);
}

export function measureMenuOverflow(row1, navbarMenu) {
  if (!row1 || !navbarMenu) return 0;

  const measure = getMenuMeasure(navbarMenu);
  if (!measure?.end) return 0;

  const menuNeed = Math.ceil(measure.end.scrollWidth);

  const rowRect = row1.getBoundingClientRect();
  const brand = row1.querySelector(".navbar-brand");
  let leftUsed = 0;
  if (brand) {
    const br = brand.getBoundingClientRect();
    leftUsed = br.right - rowRect.left;
  }
  const sidebarBtnEl = row1.querySelector(".h-navbar-sidebar-btn");
  if (sidebarBtnEl && window.getComputedStyle(sidebarBtnEl).display !== "none") {
    leftUsed += sidebarBtnEl.getBoundingClientRect().width;
  }
  const availableForMenu = rowRect.width - leftUsed;
  return menuNeed - availableForMenu;
}
