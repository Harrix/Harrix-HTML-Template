import lightGallery from "lightgallery";
import lgHash from "lightgallery/plugins/hash";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import hljs from "highlight.js";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";

import initFontawesomeCollection from "./_fontawesome-collection.js";
import locale from "./_locale-ru.js";

document.addEventListener("DOMContentLoaded", () => {
  initNavbar(100);
  initSearchPanel();
  initLightGallery(200, 10);
  initSyntaxHighlighting();
  initCodeCopyButtons();
  initFontawesomeCollection();
  initGalleryGrid(200);
});

function initNavbar(scrollTopNavbarHide) {
  const navbar = document.getElementById("h-navbar");

  if (!!navbar) {
    const root = document.documentElement;
    const navbarBurger = document.getElementById("h-burger");
    const navbarBottom = document.getElementById("h-navbar-bottom");
    const logo = document.getElementById("h-logo");

    let lastY = 0;
    let currentY = 0;
    let hasClassHide = logo.classList.contains("h-is-hidden");

    navbarBottom.onmouseover = function (event) {
      navbar.classList.remove("h-is-hidden");
      hasClassHide = false;
    };

    navbarBurger.addEventListener("click", () => {
      root.classList.toggle("h-is-clipped-touch");
      const target = document.getElementById(navbarBurger.dataset.target);
      navbarBurger.classList.toggle("is-active");
      target.classList.toggle("is-active");
    });

    window.addEventListener("scroll", function () {
      lastY = currentY;
      currentY = window.scrollY;

      if (currentY > scrollTopNavbarHide && currentY > lastY && !hasClassHide) {
        navbar.classList.add("h-is-hidden");
        hasClassHide = true;
      }

      if (currentY < lastY && hasClassHide) {
        navbar.classList.remove("h-is-hidden");
        hasClassHide = false;
      }
    });
  }
}

function initSearchPanel() {
  const searchForm = document.getElementById("h-search-form");
  if (!!searchForm) {
    const navbarMenu = document.getElementById("h-navbar-menu");
    const searchButtonOpen = document.getElementById("h-search-button-open");
    const searchButtonClose = document.getElementById("h-search-button-close");
    const searchInput = document.getElementById("h-search-input");

    let timeOfAnimation = 500;

    searchInput.placeholder = translate("Search…");

    searchButtonOpen.addEventListener("click", () => {
      searchForm.classList.remove("h-is-hidden");
      navbarMenu.classList.add("has-visible-search-from");
      focusAfterAnimation(searchInput, timeOfAnimation);
      showOrHideSearchButtonClose();
    });

    searchButtonClose.addEventListener("click", () => {
      if (searchInput.value.length >= 1) {
        searchInput.value = "";
        showOrHideSearchButtonClose();
      } else {
        searchForm.classList.add("h-is-hidden");
        navbarMenu.classList.remove("has-visible-search-from");
        searchInput.blur();
      }
    });

    searchInput.addEventListener("input", () => {
      showOrHideSearchButtonClose();
    });
  }
}

function initLightGallery(rowHeight, margins) {
  var items = [];
  var triggers = [];

  // Single images: .h-lightbox > a[href]
  document.querySelectorAll(".h-lightbox").forEach(function (figure) {
    var a = figure.querySelector("a[href]");
    if (!a) return;
    var img = a.querySelector("img");
    items.push({
      src: a.getAttribute("href"),
      thumb: (img && img.getAttribute("src")) || a.getAttribute("href"),
      subHtml: (img && img.getAttribute("alt")) || "",
    });
    triggers.push(a);
  });

  // Gallery items: .h-gallery .h-is-item
  document.querySelectorAll(".h-gallery .h-is-item").forEach(function (el) {
    var src = el.getAttribute("data-src");
    if (!src) return;
    var img = el.querySelector("img");
    items.push({
      src: src,
      thumb: (img && img.getAttribute("src")) || src,
      subHtml: (img && img.getAttribute("alt")) || "",
    });
    triggers.push(el);
  });

  if (items.length === 0) return;

  var container = document.body;
  var instance = lightGallery(container, {
    dynamic: true,
    dynamicEl: items,
    plugins: [lgHash, lgZoom, lgThumbnail],
  });

  triggers.forEach(function (el, index) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      instance.openGallery(index);
    });
  });
}

function initGalleryGrid(imgHeight) {
  var galleries = document.getElementsByClassName("h-gallery");

  Array.from(galleries).forEach((gallery) => {
    var images = gallery.querySelectorAll("img");

    Array.from(images).forEach((img) => {
      if (img.complete) imgLoaded();
      else img.addEventListener("load", imgLoaded);

      function imgLoaded() {
        var width = img.naturalWidth;
        var height = img.naturalHeight;

        var base = width / height;
        var grow = Math.round(base * 1000) / 100;
        var h = Math.round(imgHeight * base);

        img.parentElement.style.flex = grow + " " + h + "px";
        img.parentElement.style.minHeight = Math.round(h / base) + "px";
        img.parentElement.style.width = "100%";

        img.style.width = "100%";
        img.style.height = "auto";
      }
    });
  });
}

function initSyntaxHighlighting() {
  if (typeof hljs.highlightAll === "function") {
    hljs.highlightAll();
  }
}

function initCodeCopyButtons() {
  const codeBlocks = document.querySelectorAll("pre > code");
  codeBlocks.forEach((codeEl) => {
    const pre = codeEl.parentElement;
    if (!pre || pre.classList.contains("h-code-block-inner")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "h-code-block";

    const labelCopy = translate("Copy");
    const labelCopied = translate("Copied!");

    function doCopy(btn) {
      const text = codeEl.textContent || "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          () => {
            btn.setAttribute("aria-label", labelCopied);
            btn.classList.add("h-code-copy-done");
            setTimeout(() => {
              btn.setAttribute("aria-label", labelCopy);
              btn.classList.remove("h-code-copy-done");
            }, 2000);
          },
          () => fallbackCopy(text, btn, labelCopy, labelCopied)
        );
      } else {
        fallbackCopy(text, btn, labelCopy, labelCopied);
      }
    }

    function createButton(position) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "h-code-copy h-code-copy--" + position;
      btn.setAttribute("aria-label", labelCopy);
      btn.innerHTML = '<span class="icon is-small"><i class="fas fa-copy" aria-hidden="true"></i></span>';
      btn.addEventListener("click", () => doCopy(btn));
      return btn;
    }

    const preClone = pre.cloneNode(true);
    preClone.classList.add("h-code-block-inner");
    wrapper.appendChild(preClone);
    wrapper.appendChild(createButton("top"));
    wrapper.appendChild(createButton("bottom"));

    const bottomThreshold = 80;
    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      const fromBottom = rect.bottom - e.clientY;
      if (fromBottom <= bottomThreshold) {
        wrapper.classList.add("h-code-block--show-copy");
      } else {
        wrapper.classList.remove("h-code-block--show-copy");
      }
    });
    wrapper.addEventListener("mouseleave", () => {
      wrapper.classList.remove("h-code-block--show-copy");
    });

    pre.parentNode.insertBefore(wrapper, pre);
    pre.remove();
  });
}

function fallbackCopy(text, btn, labelCopy, labelCopied) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    btn.setAttribute("aria-label", labelCopied);
    btn.classList.add("h-code-copy-done");
    setTimeout(() => {
      btn.setAttribute("aria-label", labelCopy);
      btn.classList.remove("h-code-copy-done");
    }, 2000);
  } catch (err) {}
  document.body.removeChild(ta);
}

function focusAfterAnimation(elem, timeOfAnimation) {
  window.setTimeout(function () {
    elem.focus();
  }, timeOfAnimation);
}

function showOrHideSearchButtonClose() {
  const searchInput = document.getElementById("h-search-input");
  const searchButtonClose = document.getElementById("h-search-button-close");
  if (searchInput.value.length >= 1) searchButtonClose.classList.remove("is-hidden-touch");
  else searchButtonClose.classList.add("is-hidden-touch");
}

function translate(string) {
  let lang = document.documentElement.lang;
  return lang == "en" ? string : locale[string];
}
