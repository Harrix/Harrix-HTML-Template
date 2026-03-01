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

const NAVBAR_HIDE_SCROLL_THRESHOLD = 100;
const GALLERY_ROW_HEIGHT = 200;
const SEARCH_ANIMATION_MS = 500;
const CODE_COPY_FEEDBACK_MS = 2000;
const CODE_BLOCK_BOTTOM_THRESHOLD = 80;

document.addEventListener("DOMContentLoaded", () => {
  initNavbar(NAVBAR_HIDE_SCROLL_THRESHOLD);
  initSearchPanel();
  initThemeToggle();
  initLightGallery();
  initSyntaxHighlighting();
  initCodeCopyButtons();
  initFontawesomeCollection();
  initGalleryGrid(GALLERY_ROW_HEIGHT);
});

function initNavbar(scrollThreshold) {
  const navbar = document.getElementById("h-navbar");

  if (navbar) {
    const root = document.documentElement;
    const navbarBurger = document.getElementById("h-burger");
    const navbarBottom = document.getElementById("h-navbar-bottom");
    const logo = document.getElementById("h-logo");

    let lastY = 0;
    let currentY = 0;
    let isNavbarHidden = logo.classList.contains("h-is-hidden");

    navbarBottom.onmouseover = function () {
      navbar.classList.remove("h-is-hidden");
      isNavbarHidden = false;
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

function initSearchPanel() {
  const searchForm = document.getElementById("h-search-form");
  if (searchForm) {
    const navbarMenu = document.getElementById("h-navbar-menu");
    const searchButtonOpen = document.getElementById("h-search-button-open");
    const searchButtonClose = document.getElementById("h-search-button-close");
    const searchInput = document.getElementById("h-search-input");

    searchInput.placeholder = translate("Search…");

    searchButtonOpen.addEventListener("click", () => {
      searchForm.classList.remove("h-is-hidden");
      navbarMenu.classList.add("has-visible-search-form");
      focusAfterAnimation(searchInput, SEARCH_ANIMATION_MS);
      showOrHideSearchButtonClose();
    });

    searchButtonClose.addEventListener("click", () => {
      if (searchInput.value.length >= 1) {
        searchInput.value = "";
        showOrHideSearchButtonClose();
      } else {
        searchForm.classList.add("h-is-hidden");
        navbarMenu.classList.remove("has-visible-search-form");
        searchInput.blur();
      }
    });

    searchInput.addEventListener("input", () => {
      showOrHideSearchButtonClose();
    });
  }
}

function getDownloadFilename(src) {
  if (!src) return "image";
  const parts = src.split("/");
  return parts[parts.length - 1] || "image";
}

function initLightGallery() {
  const items = [];
  const triggers = [];

  // Single images: .h-lightbox > a[href]
  document.querySelectorAll(".h-lightbox").forEach(function (figure) {
    const a = figure.querySelector("a[href]");
    if (!a) return;
    const img = a.querySelector("img");
    const href = a.getAttribute("href");
    items.push({
      src: href,
      thumb: (img && img.getAttribute("src")) || href,
      subHtml: (img && img.getAttribute("alt")) || "",
      download: getDownloadFilename(href),
    });
    triggers.push(a);
  });

  // Gallery items: .h-gallery .h-is-item
  document.querySelectorAll(".h-gallery .h-is-item").forEach(function (el) {
    const src = el.getAttribute("data-src");
    if (!src) return;
    const img = el.querySelector("img");
    items.push({
      src: src,
      thumb: (img && img.getAttribute("src")) || src,
      subHtml: (img && img.getAttribute("alt")) || "",
      download: getDownloadFilename(src),
    });
    triggers.push(el);
  });

  if (items.length === 0) return;

  const container = document.body;
  const GALLERY_ID = "1";
  const instance = lightGallery(container, {
    dynamic: true,
    dynamicEl: items,
    plugins: [lgHash, lgZoom, lgThumbnail],
    galleryId: GALLERY_ID,
    hash: true,
  });

  let isGalleryOpen = false;

  function getHashForIndex(index) {
    return "#lg=" + GALLERY_ID + "&slide=" + index;
  }

  function pushSlideToHistory(index) {
    const hash = getHashForIndex(index);
    if (typeof history !== "undefined" && history.pushState) {
      history.pushState({ lg: GALLERY_ID, slide: index }, "", window.location.pathname + window.location.search + hash);
    }
  }

  instance.LGel.on("lgAfterOpen.lg-history", function (e) {
    isGalleryOpen = true;
    const index = e.detail?.index ?? instance.index ?? 0;
    pushSlideToHistory(index);
  });
  instance.LGel.on("lgAfterSlide.lg-history", function (e) {
    const index = e.detail?.index ?? 0;
    pushSlideToHistory(index);
  });
  instance.LGel.on("lgAfterClose.lg-history", function () {
    isGalleryOpen = false;
  });

  window.addEventListener("popstate", function () {
    const hash = window.location.hash || "";
    const match = hash.match(/lg=([^&]+)&slide=(\d+)/);
    if (match && match[1] === GALLERY_ID) {
      const index = parseInt(match[2], 10);
      if (!isNaN(index) && index >= 0 && index < items.length) {
        if (isGalleryOpen) {
          instance.slide(index);
        } else {
          instance.openGallery(index);
        }
      }
    } else if (isGalleryOpen) {
      instance.closeGallery();
    }
  });

  function removeDownloadTarget() {
    const downloadEl = instance.getElementById("lg-download");
    if (downloadEl && downloadEl.length) {
      downloadEl.removeAttr("target");
    }
  }

  instance.LGel.on("lgAfterOpen.lg-download-fix", removeDownloadTarget);
  instance.LGel.on("lgAfterSlide.lg-download-fix", removeDownloadTarget);

  triggers.forEach(function (el, index) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      instance.openGallery(index);
    });
  });
}

function initGalleryGrid(rowHeight) {
  const galleries = document.getElementsByClassName("h-gallery");

  Array.from(galleries).forEach((gallery) => {
    const images = gallery.querySelectorAll("img");

    Array.from(images).forEach((img) => {
      if (img.complete) imgLoaded();
      else img.addEventListener("load", imgLoaded);

      function imgLoaded() {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        const base = width / height;
        const grow = Math.round(base * 1000) / 100;
        const h = Math.round(rowHeight * base);

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
            }, CODE_COPY_FEEDBACK_MS);
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

    wrapper.addEventListener("mousemove", (e) => {
      const rect = wrapper.getBoundingClientRect();
      const fromBottom = rect.bottom - e.clientY;
      if (fromBottom <= CODE_BLOCK_BOTTOM_THRESHOLD) {
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
  const tempTextarea = document.createElement("textarea");
  tempTextarea.value = text;
  tempTextarea.setAttribute("readonly", "");
  tempTextarea.style.position = "fixed";
  tempTextarea.style.left = "-9999px";
  document.body.appendChild(tempTextarea);
  tempTextarea.select();
  try {
    document.execCommand("copy");
    btn.setAttribute("aria-label", labelCopied);
    btn.classList.add("h-code-copy-done");
    setTimeout(() => {
      btn.setAttribute("aria-label", labelCopy);
      btn.classList.remove("h-code-copy-done");
    }, CODE_COPY_FEEDBACK_MS);
  } catch {
    // execCommand("copy") can throw in some environments
  }
  document.body.removeChild(tempTextarea);
}

function focusAfterAnimation(elem, delayMs) {
  window.setTimeout(function () {
    elem.focus();
  }, delayMs);
}

function showOrHideSearchButtonClose() {
  const searchInput = document.getElementById("h-search-input");
  const searchButtonClose = document.getElementById("h-search-button-close");
  if (!searchInput || !searchButtonClose) return;
  if (searchInput.value.length >= 1) searchButtonClose.classList.remove("is-hidden-touch");
  else searchButtonClose.classList.add("is-hidden-touch");
}

function initThemeToggle() {
  const toggle = document.getElementById("h-theme-toggle");
  if (!toggle) return;

  function getTheme() {
    const fromDom = document.documentElement.getAttribute("data-theme");
    if (fromDom === "dark" || fromDom === "light") return fromDom;
    const stored = localStorage.getItem("h-theme");
    if (stored === "dark" || stored === "light") return stored;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("h-theme", theme);
  }

  toggle.addEventListener("click", () => {
    const current = getTheme();
    setTheme(current === "dark" ? "light" : "dark");
  });
}

function translate(string) {
  const lang = document.documentElement.lang;
  if (lang === "en") return string;
  return locale[string] ?? string;
}
