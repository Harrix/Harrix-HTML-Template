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
const GALLERY_ID = "1";

const lang = document.documentElement.lang;

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

    if (!navbarBurger || !navbarBottom) return;

    let lastY = 0;
    let currentY = 0;
    let isNavbarHidden = navbar.classList.contains("h-is-hidden");

    navbarBottom.addEventListener("mouseover", () => {
      navbar.classList.remove("h-is-hidden");
      isNavbarHidden = false;
    });

    navbarBurger.addEventListener("click", () => {
      root.classList.toggle("h-is-clipped-touch");
      const target = document.getElementById(navbarBurger.dataset.target);
      navbarBurger.classList.toggle("is-active");
      target.classList.toggle("is-active");
    });

    window.addEventListener("scroll", () => {
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

    function showOrHideSearchButtonClose() {
      if (searchInput.value.length >= 1) searchButtonClose.classList.remove("is-hidden-touch");
      else searchButtonClose.classList.add("is-hidden-touch");
    }

    searchButtonOpen.addEventListener("click", () => {
      navbarMenu.classList.add("h-has-visible-search-form");
      focusAfterAnimation(searchInput, SEARCH_ANIMATION_MS);
      showOrHideSearchButtonClose();
    });

    searchButtonClose.addEventListener("click", () => {
      if (searchInput.value.length >= 1) {
        searchInput.value = "";
        showOrHideSearchButtonClose();
      } else {
        navbarMenu.classList.remove("h-has-visible-search-form");
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

  document.querySelectorAll(".h-lightbox").forEach((figure) => {
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

  document.querySelectorAll(".h-gallery .h-is-item").forEach((el) => {
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
    history.pushState({ lg: GALLERY_ID, slide: index }, "", window.location.pathname + window.location.search + hash);
  }

  instance.LGel.on("lgAfterOpen.lg-history", (e) => {
    isGalleryOpen = true;
    const index = e.detail?.index ?? instance.index ?? 0;
    pushSlideToHistory(index);
  });
  instance.LGel.on("lgAfterSlide.lg-history", (e) => {
    const index = e.detail?.index ?? 0;
    pushSlideToHistory(index);
  });
  instance.LGel.on("lgAfterClose.lg-history", () => {
    isGalleryOpen = false;
  });

  window.addEventListener("popstate", () => {
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

  triggers.forEach((el, index) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      instance.openGallery(index);
    });
  });
}

function initGalleryGrid(rowHeight) {
  document.querySelectorAll(".h-gallery").forEach((gallery) => {
    const images = gallery.querySelectorAll("img");

    images.forEach((img) => {
      if (img.complete) imgLoaded();
      else img.addEventListener("load", imgLoaded);

      function imgLoaded() {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        const flexGrow = Math.round(aspectRatio * 1000) / 100;
        const flexBasis = Math.round(rowHeight * aspectRatio);

        img.parentElement.style.flex = flexGrow + " " + flexBasis + "px";
        img.parentElement.style.minHeight = Math.round(flexBasis / aspectRatio) + "px";
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
      navigator.clipboard.writeText(text).then(() => {
        btn.setAttribute("aria-label", labelCopied);
        btn.classList.add("h-code-copy--done");
        setTimeout(() => {
          btn.setAttribute("aria-label", labelCopy);
          btn.classList.remove("h-code-copy--done");
        }, CODE_COPY_FEEDBACK_MS);
      });
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

function focusAfterAnimation(elem, delayMs) {
  setTimeout(() => {
    elem.focus();
  }, delayMs);
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
  if (lang === "en") return string;
  return locale[string] ?? string;
}
