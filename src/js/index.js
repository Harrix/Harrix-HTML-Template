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
const CODE_COPY_TOOLTIP_MS = 700;
const CODE_BLOCK_BOTTOM_THRESHOLD = 80;
const GALLERY_ID = "1";
const BACK_TO_TOP_THRESHOLD = 200;
const BACK_TO_TOP_DURATION_MS = 800;
const PAGE_TOC_TOGGLE_THRESHOLD = 200;

const lang = document.documentElement.lang;

document.addEventListener("DOMContentLoaded", () => {
  initNavbar(NAVBAR_HIDE_SCROLL_THRESHOLD);
  initSearchPanel();
  initThemeToggle();
  initBackToTop(BACK_TO_TOP_THRESHOLD, BACK_TO_TOP_DURATION_MS);
  initLightGallery();
  initSyntaxHighlighting();
  initCodeCopyButtons();
  initFontawesomeCollection();
  initGalleryGrid(GALLERY_ROW_HEIGHT);
  initSpoilerAnimation();
  initTabs();
  initPageToc();
  initDocsSidebar();
  initNavbarSidebarTocFit();
  initMobileTopNav();
});

function initNavbar(scrollThreshold) {
  const navbar = document.getElementById("h-navbar");

  if (navbar) {
    const root = document.documentElement;
    const navbarBurger = document.getElementById("h-burger");
    const navbarBottom = document.getElementById("h-navbar-bottom");
    const navbarMenu = document.getElementById("h-navbar-menu");
    const menuPanelHeader = document.getElementById("h-navbar-menu-panel-header");
    const menuPanelClose = document.getElementById("h-navbar-menu-panel-close");
    const menuBackdrop = document.getElementById("h-navbar-menu-backdrop");
    const menuPanelLabel = document.getElementById("h-navbar-menu-panel-label");

    if (!navbarBurger || !navbarBottom) return;

    if (menuPanelLabel) menuPanelLabel.textContent = translate("Menu");

    function closeNavbarMenu() {
      if (!navbarMenu) return;
      root.classList.remove("h-is-clipped-touch");
      navbarBurger.classList.remove("is-active");
      navbarBurger.setAttribute("aria-expanded", "false");
      navbarMenu.classList.remove("is-active");
      if (menuPanelHeader) {
        menuPanelHeader.setAttribute("hidden", "");
        menuPanelHeader.setAttribute("aria-hidden", "true");
      }
      if (menuBackdrop) {
        menuBackdrop.setAttribute("hidden", "");
        menuBackdrop.setAttribute("aria-hidden", "true");
      }
      if (document.body.classList.contains("h-navbar-menu-no-fit")) {
        navbarBurger.style.display = "";
      }
    }

    if (menuPanelClose) {
      menuPanelClose.addEventListener("click", closeNavbarMenu);
    }
    if (menuBackdrop) {
      menuBackdrop.addEventListener("click", closeNavbarMenu);
    }

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        document.body.classList.contains("h-navbar-menu-no-fit") &&
        navbarMenu &&
        navbarMenu.classList.contains("is-active")
      ) {
        closeNavbarMenu();
      }
    });

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
      const expanded = navbarBurger.classList.contains("is-active");
      navbarBurger.setAttribute("aria-expanded", String(expanded));
      if (document.body.classList.contains("h-navbar-menu-no-fit")) {
        if (expanded) {
          navbarBurger.style.display = "none";
        }
        if (menuPanelHeader) {
          if (expanded) {
            menuPanelHeader.removeAttribute("hidden");
            menuPanelHeader.setAttribute("aria-hidden", "false");
          } else {
            menuPanelHeader.setAttribute("hidden", "");
            menuPanelHeader.setAttribute("aria-hidden", "true");
          }
        }
        if (menuBackdrop) {
          if (expanded) {
            menuBackdrop.removeAttribute("hidden");
            menuBackdrop.setAttribute("aria-hidden", "false");
          } else {
            menuBackdrop.setAttribute("hidden", "");
            menuBackdrop.setAttribute("aria-hidden", "true");
          }
        }
      }
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

function initBackToTop(threshold, _durationMs) {
  const btn = document.getElementById("h-back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY >= threshold) {
      btn.classList.add("is-visible");
    } else {
      btn.classList.remove("is-visible");
    }
  });

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


function initSearchPanel() {
  const searchForm = document.getElementById("h-search-form");
  if (searchForm) {
    const navbarMenu = document.getElementById("h-navbar-menu");
    const searchButtonOpen = document.getElementById("h-search-button-open");
    const searchButtonClose = document.getElementById("h-search-button-close");
    const searchButtonSubmit = document.getElementById("h-search-button-submit");
    const searchInput = document.getElementById("h-search-input");
    const formEl = searchForm.querySelector("form");

    searchInput.placeholder = translate("Search…");

    if (formEl) {
      formEl.addEventListener("submit", (e) => {
        e.preventDefault();
      });
    }

    if (searchButtonSubmit) {
      searchButtonSubmit.addEventListener("click", (e) => {
        e.preventDefault();
        if (formEl) formEl.requestSubmit();
      });
    }

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
    showCloseIcon: true,
    mobileSettings: {
      showCloseIcon: true,
      controls: true,
    },
  });

  let isGalleryOpen = false;

  instance.LGel.on("lgBeforeOpen.lg-history", () => {
    window.history.pushState({ lgOpen: true }, "", window.location.href);
  });
  instance.LGel.on("lgAfterOpen.lg-history", () => {
    isGalleryOpen = true;
  });
  instance.LGel.on("lgAfterClose.lg-history", () => {
    isGalleryOpen = false;
  });

  window.addEventListener("popstate", () => {
    if (isGalleryOpen) instance.closeGallery();
  });

  function removeDownloadTarget() {
    const downloadEl = document.getElementById("lg-download");
    if (downloadEl) downloadEl.removeAttribute("target");
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

function getCodeLanguage(codeEl) {
  if (!codeEl || !codeEl.classList) return null;
  for (const c of codeEl.classList) {
    if (c.startsWith("language-")) return c.slice(9);
    if (c !== "hljs") return c;
  }
  return null;
}

const CODE_LANGUAGE_NAMES = {
  cpp: "C++",
  c: "C",
  java: "Java",
  javascript: "JavaScript",
  js: "JavaScript",
  typescript: "TypeScript",
  ts: "TypeScript",
  python: "Python",
  py: "Python",
  css: "CSS",
  html: "HTML",
  xml: "XML",
  json: "JSON",
  bash: "Bash",
  shell: "Shell",
  sql: "SQL",
  plaintext: "Plain text",
};

function getLanguageDisplayName(alias) {
  const lower = (alias || "").toLowerCase();
  return CODE_LANGUAGE_NAMES[lower] || (alias ? alias.charAt(0).toUpperCase() + alias.slice(1) : "");
}

function showCopyTooltip(button, text) {
  const wrapper = button.parentElement;
  if (!wrapper) return;
  const tooltip = document.createElement("div");
  tooltip.className = "h-code-copy-tooltip";
  tooltip.textContent = text;
  wrapper.appendChild(tooltip);
  requestAnimationFrame(() => {
    tooltip.style.left = button.offsetLeft + button.offsetWidth / 2 + "px";
    tooltip.style.top = button.offsetTop - tooltip.offsetHeight - 8 + "px";
    tooltip.style.transform = "translateX(-50%)";
    tooltip.classList.add("h-code-copy-tooltip--visible");
  });
  setTimeout(() => {
    tooltip.classList.remove("h-code-copy-tooltip--visible");
    setTimeout(() => tooltip.remove(), 150);
  }, CODE_COPY_TOOLTIP_MS);
}

function initCodeCopyButtons() {
  const codeBlocks = document.querySelectorAll("pre > code");
  codeBlocks.forEach((codeEl) => {
    const pre = codeEl.parentElement;
    if (!pre || pre.classList.contains("h-code-block-inner")) return;
    if (codeEl.classList.contains("language-chart")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "h-code-block";

    const language = getCodeLanguage(codeEl);
    const lineCount = (codeEl.textContent || "").trim().split("\n").length;
    const showLanguageLabel = language && lineCount > 2;
    const isSingleLine = lineCount <= 1;
    if (isSingleLine) wrapper.classList.add("h-code-block--single-line");

    const labelCopy = translate("Copy");
    const labelCopied = translate("Copied!");

    function doCopy(btn) {
      const text = codeEl.textContent || "";
      navigator.clipboard.writeText(text).then(() => {
        showCopyTooltip(btn, labelCopied);
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

    if (showLanguageLabel) {
      const langSpan = document.createElement("span");
      langSpan.className = "h-code-lang";
      langSpan.textContent = getLanguageDisplayName(language);
      wrapper.appendChild(langSpan);
    }

    wrapper.appendChild(createButton("top"));
    const preClone = pre.cloneNode(true);
    preClone.classList.add("h-code-block-inner");
    wrapper.appendChild(preClone);
    if (!isSingleLine) wrapper.appendChild(createButton("bottom"));

    if (!isSingleLine) {
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
    }

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
  function getToggles() {
    return Array.from(document.querySelectorAll("[data-theme-toggle], .h-theme-toggle, #h-theme-toggle"));
  }

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

  function updateThemeLabel() {
    const theme = getTheme();
    const textLight = translate("Switch to light theme");
    const textDark = translate("Switch to dark theme");
    const label = theme === "dark" ? textLight : textDark;
    getToggles().forEach((toggle) => {
      toggle.setAttribute("aria-label", label);
      const labelEl = toggle.querySelector(".h-theme-toggle-label");
      if (labelEl) labelEl.textContent = label;
    });
  }

  updateThemeLabel();

  document.addEventListener(
    "click",
    (e) => {
      const target = e.target?.closest?.("[data-theme-toggle], .h-theme-toggle, #h-theme-toggle");
      if (!target) return;
      const current = getTheme();
      setTheme(current === "dark" ? "light" : "dark");
      updateThemeLabel();
    },
    true,
  );
}

function translate(string) {
  if (lang === "en") return string;
  return locale[string] ?? string;
}

function initSpoilerAnimation() {
  document.querySelectorAll(".h-spoiler").forEach((details) => {
    const summary = details.querySelector(".h-spoiler__summary");
    const content = details.querySelector(".h-spoiler__content");
    const inner = details.querySelector(".h-spoiler__inner");
    if (!summary || !content || !inner) return;

    summary.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpening = !details.hasAttribute("open");

      if (isOpening) {
        details.setAttribute("open", "");
        content.style.height = "0px";
        const endHeight = inner.scrollHeight;
        requestAnimationFrame(() => {
          content.style.height = endHeight + "px";
        });
        const onEnd = () => {
          content.removeEventListener("transitionend", onEnd);
          content.style.height = "auto";
        };
        content.addEventListener("transitionend", onEnd);
      } else {
        const startHeight = content.offsetHeight;
        content.style.height = startHeight + "px";
        requestAnimationFrame(() => {
          content.style.height = "0px";
        });
        const onEnd = () => {
          content.removeEventListener("transitionend", onEnd);
          details.removeAttribute("open");
          content.style.height = "";
        };
        content.addEventListener("transitionend", onEnd);
      }
    });
  });
}

function initTabs() {
  document.querySelectorAll(".h-tabs").forEach((tabs) => {
    const tabBtns = tabs.querySelectorAll(".h-tabs__tab");
    const panels = tabs.querySelectorAll(".h-tabs__panel");

    tabBtns.forEach((btn, i) => {
      btn.addEventListener("click", () => {
        tabBtns.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        panels.forEach((p) => {
          p.hidden = true;
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");
        panels[i].hidden = false;
      });
    });
  });
}

function initPageToc() {
  const toc = document.getElementById("h-page-toc");
  const tocList = document.getElementById("h-page-toc-list");
  const tocLabel = document.getElementById("h-page-toc-label");
  const toggleBtn = document.getElementById("h-page-toc-toggle");
  const closeBtn = document.getElementById("h-page-toc-close");
  const backdrop = document.getElementById("h-page-toc-backdrop");
  if (!toc || !tocList) return;

  const article = document.querySelector("article");
  if (!article) return;

  const headings = article.querySelectorAll("h2");
  if (headings.length === 0) return;

  if (tocLabel) tocLabel.textContent = translate("Table of contents");

  const usedIds = new Set();
  headings.forEach((h, i) => {
    if (!h.id || usedIds.has(h.id)) {
      const base = h.textContent.trim().toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "");
      let candidate = base || "section-" + i;
      let suffix = 1;
      while (usedIds.has(candidate) || document.getElementById(candidate)) {
        candidate = base + "-" + suffix++;
      }
      h.id = candidate;
    }
    usedIds.add(h.id);

    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    tocList.appendChild(li);
  });

  const links = tocList.querySelectorAll("a");
  let currentActiveIndex = -1;

  function setActive(index) {
    if (index === currentActiveIndex) return;
    if (currentActiveIndex >= 0 && currentActiveIndex < links.length) {
      links[currentActiveIndex].classList.remove("is-active");
    }
    if (index >= 0 && index < links.length) {
      links[index].classList.add("is-active");
      currentActiveIndex = index;
    }
    const mirror = document.getElementById("h-mobile-top-nav-dropdown")?.querySelector(".h-page-toc-mirror");
    const mirrorLinks = mirror?.querySelectorAll("a");
    if (mirrorLinks && mirrorLinks.length === links.length) {
      mirrorLinks.forEach((a, i) => a.classList.toggle("is-active", i === index));
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Array.from(headings).indexOf(entry.target);
          if (idx !== -1) setActive(idx);
        }
      });
    },
    { rootMargin: "-80px 0px -70% 0px" },
  );

  headings.forEach((h) => observer.observe(h));

  if (!toggleBtn) return;

  function openToc() {
    toc.classList.add("is-open");
    if (backdrop) backdrop.classList.add("is-active");
  }

  function closeToc() {
    toc.classList.remove("is-open");
    if (backdrop) backdrop.classList.remove("is-active");
  }

  toggleBtn.addEventListener("click", () => {
    if (toc.classList.contains("is-open")) closeToc();
    else openToc();
  });

  if (closeBtn) closeBtn.addEventListener("click", closeToc);
  if (backdrop) backdrop.addEventListener("click", closeToc);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toc.classList.contains("is-open")) closeToc();
  });

  tocList.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeToc);
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY >= PAGE_TOC_TOGGLE_THRESHOLD) {
      toggleBtn.classList.add("is-visible");
    } else {
      toggleBtn.classList.remove("is-visible");
    }
  });
}

const CONTAINER_MAX_WIDTH = 1179;
const SIDEBAR_WIDTH = 280;
const TOC_MIN_SPACE = 256;
const MOBILE_NAV_BREAKPOINT = 1024;
const SIDEBAR_TOC_DESKTOP_MIN_WIDTH = 1680;

function initNavbarSidebarTocFit() {
  const sidebar = document.getElementById("h-docs-sidebar");
  const sidebarBackdrop = document.getElementById("h-docs-sidebar-backdrop");
  const toc = document.getElementById("h-page-toc");
  const tocList = document.getElementById("h-page-toc-list");
  const tocBackdrop = document.getElementById("h-page-toc-backdrop");
  const navbarSidebarBtn = document.getElementById("h-navbar-sidebar-btn");
  const navbarTocRow = document.getElementById("h-navbar-toc-row");
  const navbarTocTrigger = document.getElementById("h-navbar-toc-trigger");
  const navbarSearchBtn = document.getElementById("h-navbar-search-btn");
  const searchOverlay = document.getElementById("h-navbar-search-overlay");
  const searchOverlayInput = document.getElementById("h-navbar-search-overlay-input");
  const searchOverlaySubmit = document.getElementById("h-navbar-search-overlay-submit");
  const searchOverlayClose = document.getElementById("h-navbar-search-overlay-close");
  const mainSearchInput = document.getElementById("h-search-input");

  function openSearchOverlay() {
    if (!searchOverlay) return;
    searchOverlay.classList.add("is-open");
    searchOverlay.setAttribute("aria-hidden", "false");
    if (searchOverlayInput) setTimeout(() => searchOverlayInput.focus(), 50);
  }

  function closeSearchOverlay() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove("is-open");
    searchOverlay.setAttribute("aria-hidden", "true");
    if (searchOverlayInput) searchOverlayInput.blur();
  }

  if (navbarSearchBtn) {
    navbarSearchBtn.addEventListener("click", openSearchOverlay);
  }
  if (searchOverlayClose) {
    searchOverlayClose.addEventListener("click", closeSearchOverlay);
  }
  if (searchOverlaySubmit) {
    searchOverlaySubmit.addEventListener("click", () => {
      const formEl = document.getElementById("h-search-form")?.querySelector("form");
      if (formEl) formEl.requestSubmit();
    });
  }
  if (searchOverlayInput) {
    searchOverlayInput.placeholder = translate("Search…");
    searchOverlayInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSearchOverlay();
      if (e.key === "Enter") {
        const formEl = document.getElementById("h-search-form")?.querySelector("form");
        if (formEl) formEl.requestSubmit();
      }
    });
    if (mainSearchInput) {
      searchOverlayInput.addEventListener("input", () => {
        mainSearchInput.value = searchOverlayInput.value;
      });
      mainSearchInput.addEventListener("input", () => {
        searchOverlayInput.value = mainSearchInput.value;
      });
    }
  }

  function updateFit() {
    const vw = window.innerWidth;
    if (vw <= MOBILE_NAV_BREAKPOINT) {
      document.body.classList.remove("h-navbar-sidebar-overlaps", "h-navbar-toc-no-fit", "h-navbar-menu-no-fit");
      if (navbarSidebarBtn) {
        navbarSidebarBtn.setAttribute("aria-hidden", "true");
        navbarSidebarBtn.setAttribute("hidden", "");
        navbarSidebarBtn.tabIndex = -1;
      }
      if (navbarTocRow) {
        navbarTocRow.setAttribute("aria-hidden", "true");
        navbarTocRow.hidden = true;
      }
      if (navbarSearchBtn) {
        navbarSearchBtn.setAttribute("aria-hidden", "true");
        navbarSearchBtn.setAttribute("hidden", "");
      }
      closeSearchOverlay();
      return;
    }

    const contentLeft = (vw - CONTAINER_MAX_WIDTH) / 2;
    const sidebarOverlaps = sidebar && contentLeft < SIDEBAR_WIDTH;
    const tocNoFit = tocList && tocList.children.length > 0 && contentLeft < TOC_MIN_SPACE;

    const row1 = document.querySelector(".h-navbar__row1");
    const navbarMenu = document.getElementById("h-navbar-menu");
    const menuNoFit =
      row1 &&
      navbarMenu &&
      row1.scrollWidth > row1.clientWidth + 1;

    document.body.classList.toggle("h-navbar-sidebar-overlaps", !!sidebarOverlaps);
    document.body.classList.toggle("h-navbar-toc-no-fit", !!tocNoFit);
    document.body.classList.toggle("h-navbar-menu-no-fit", !!menuNoFit);

    if (navbarSidebarBtn) {
      if (sidebarOverlaps) {
        navbarSidebarBtn.removeAttribute("aria-hidden");
        navbarSidebarBtn.removeAttribute("hidden");
        navbarSidebarBtn.removeAttribute("tabindex");
      } else {
        navbarSidebarBtn.setAttribute("aria-hidden", "true");
        navbarSidebarBtn.setAttribute("hidden", "");
        navbarSidebarBtn.tabIndex = -1;
      }
    }
    if (navbarTocRow) {
      if (tocNoFit) {
        navbarTocRow.removeAttribute("aria-hidden");
        navbarTocRow.hidden = false;
      } else {
        navbarTocRow.setAttribute("aria-hidden", "true");
        navbarTocRow.hidden = true;
      }
    }
    if (navbarSearchBtn) {
      if (menuNoFit) {
        navbarSearchBtn.removeAttribute("aria-hidden");
        navbarSearchBtn.removeAttribute("hidden");
      } else {
        navbarSearchBtn.setAttribute("aria-hidden", "true");
        navbarSearchBtn.setAttribute("hidden", "");
        closeSearchOverlay();
      }
    }
  }

  if (navbarSidebarBtn && sidebar && sidebarBackdrop) {
    navbarSidebarBtn.addEventListener("click", () => {
      if (sidebar.classList.contains("is-open")) {
        sidebar.classList.remove("is-open");
        sidebarBackdrop.classList.remove("is-active");
      } else {
        sidebar.classList.add("is-open");
        sidebarBackdrop.classList.add("is-active");
      }
    });
  }

  if (navbarTocTrigger && toc && tocBackdrop) {
    function setNavbarTocExpanded(open) {
      navbarTocTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    }
    navbarTocTrigger.addEventListener("click", () => {
      if (toc.classList.contains("is-open")) {
        toc.classList.remove("is-open");
        tocBackdrop.classList.remove("is-active");
        setNavbarTocExpanded(false);
      } else {
        toc.classList.add("is-open");
        tocBackdrop.classList.add("is-active");
        setNavbarTocExpanded(true);
      }
    });
    tocBackdrop.addEventListener("click", () => setNavbarTocExpanded(false));
    const tocCloseBtn = document.getElementById("h-page-toc-close");
    if (tocCloseBtn) tocCloseBtn.addEventListener("click", () => setNavbarTocExpanded(false));
  }

  const tocTriggerLabel = document.getElementById("h-navbar-toc-trigger-label");
  if (tocTriggerLabel) tocTriggerLabel.textContent = translate("Table of contents");

  updateFit();
  window.addEventListener("resize", updateFit);
}

function initDocsSidebar() {
  const sidebar = document.getElementById("h-docs-sidebar");
  const toggle = document.getElementById("h-docs-sidebar-toggle");
  const backdrop = document.getElementById("h-docs-sidebar-backdrop");
  if (!sidebar || !toggle || !backdrop) return;

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    backdrop.classList.remove("is-active");
  }

  function openSidebar() {
    sidebar.classList.add("is-open");
    backdrop.classList.add("is-active");
  }

  toggle.addEventListener("click", () => {
    if (sidebar.classList.contains("is-open")) closeSidebar();
    else openSidebar();
  });

  backdrop.addEventListener("click", closeSidebar);

  const sidebarCloseBtn = document.getElementById("h-docs-sidebar-close");
  const sidebarHeaderLabel = document.getElementById("h-docs-sidebar-header-label");
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener("click", closeSidebar);
  if (sidebarHeaderLabel) sidebarHeaderLabel.textContent = translate("Documentation");

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("is-open")) closeSidebar();
  });

  sidebar.querySelectorAll("a[href]").forEach((a) => {
    a.addEventListener("click", closeSidebar);
  });
}

function initMobileTopNav() {
  if (!document.body.classList.contains("h-mobile-nav-top")) return;

  const topNav = document.getElementById("h-mobile-top-nav");
  if (!topNav) return;
  let lastScrollY = window.scrollY;
  let currentScrollY = window.scrollY;
  const HIDE_THRESHOLD = 100;

  const btnSidebar = document.getElementById("h-mobile-top-nav-sidebar");
  const btnSearch = document.getElementById("h-mobile-top-nav-search");
  const btnMenu = document.getElementById("h-mobile-top-nav-menu");
  const tocTrigger = document.getElementById("h-mobile-top-nav-toc-trigger");
  const tocTriggerLabel = document.getElementById("h-mobile-top-nav-toc-trigger-label");
  const dropdown = document.getElementById("h-mobile-top-nav-dropdown");
  const dropdownBackdrop = document.getElementById("h-mobile-top-nav-dropdown-backdrop");
  const searchPanel = document.getElementById("h-mobile-top-nav-search-panel");
  const searchInput = document.getElementById("h-mobile-top-nav-search-input");
  const searchSubmit = document.getElementById("h-mobile-top-nav-search-submit");
  const searchClose = document.getElementById("h-mobile-top-nav-search-close");
  const menuPanel = document.getElementById("h-mobile-top-nav-menu-panel");
  const menuBackdrop = document.getElementById("h-mobile-top-nav-menu-backdrop");

  const sidebarToggle = document.getElementById("h-docs-sidebar-toggle");
  const sidebarPanel = document.getElementById("h-docs-sidebar");
  const sidebarBackdrop = document.getElementById("h-docs-sidebar-backdrop");
  const navbarMenu = document.getElementById("h-navbar-menu");
  const rootTree = document.getElementById("root_tree");
  const pageTocList = document.getElementById("h-page-toc-list");

  if (tocTriggerLabel) tocTriggerLabel.textContent = translate("Table of contents");

  if (!sidebarPanel && btnSidebar) {
    btnSidebar.classList.add("is-hidden");
  }

  if (btnSidebar && sidebarToggle) {
    btnSidebar.addEventListener("click", () => sidebarToggle.click());
  }

  function closeSidebarPanel() {
    if (!sidebarPanel) return;
    sidebarPanel.classList.remove("is-open");
    if (sidebarBackdrop) sidebarBackdrop.classList.remove("is-active");
  }

  if (searchPanel && searchInput) {
    if (searchInput) searchInput.placeholder = translate("Search…");
    function openSearch() {
      // закрываем остальные режимы при открытии поиска
      if (dropdown) {
        dropdown.classList.remove("is-open");
        if (tocTrigger) tocTrigger.setAttribute("aria-expanded", "false");
      }
      if (menuPanel && menuBackdrop) {
        menuPanel.classList.remove("is-open");
        menuPanel.setAttribute("aria-hidden", "true");
        menuBackdrop.setAttribute("aria-hidden", "true");
      }
      closeSidebarPanel();

      searchPanel.classList.add("is-open");
      searchPanel.setAttribute("aria-hidden", "false");
      setTimeout(() => searchInput.focus(), 50);
    }
    function closeSearch() {
      searchInput.blur();
      searchPanel.classList.remove("is-open");
      searchPanel.setAttribute("aria-hidden", "true");
      if (btnSearch) btnSearch.focus();
    }
    if (btnSearch) btnSearch.addEventListener("click", openSearch);
    if (searchClose) searchClose.addEventListener("click", closeSearch);
    if (searchSubmit) {
      searchSubmit.addEventListener("click", () => {
        const formEl = document.getElementById("h-search-form")?.querySelector("form");
        if (formEl) formEl.requestSubmit();
      });
    }
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSearch();
      if (e.key === "Enter") {
        const formEl = document.getElementById("h-search-form")?.querySelector("form");
        if (formEl) formEl.requestSubmit();
      }
    });
    const mainSearchInput = document.getElementById("h-search-input");
    if (mainSearchInput) {
      searchInput.addEventListener("input", () => {
        mainSearchInput.value = searchInput.value;
      });
      mainSearchInput.addEventListener("input", () => {
        searchInput.value = mainSearchInput.value;
      });
    }
  }

  if (menuPanel && menuBackdrop) {
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
    menuCloseBtn.innerHTML = '<span class="icon is-small" aria-hidden="true"><i class="fas fa-times"></i></span>';
    menuHeader.appendChild(menuCloseBtn);

    menuPanel.appendChild(menuHeader);

    if (navbarMenu) {
      const clone = navbarMenu.cloneNode(true);
      clone.id = "";
      const cloneSearchItem = clone.querySelector("#h-search-form");
      if (cloneSearchItem && cloneSearchItem.parentElement) {
        cloneSearchItem.parentElement.removeChild(cloneSearchItem);
      }
      clone.querySelectorAll("[id]").forEach((el) => el.removeAttribute("id"));
      clone.classList.add("navbar-menu");
      menuPanel.appendChild(clone);
    }

    function openMenu() {
      // закрываем остальные режимы при открытии меню
      if (searchPanel && searchPanel.classList.contains("is-open")) {
        searchPanel.classList.remove("is-open");
        searchPanel.setAttribute("aria-hidden", "true");
      }
      if (dropdown) {
        dropdown.classList.remove("is-open");
        if (tocTrigger) tocTrigger.setAttribute("aria-expanded", "false");
      }
      closeSidebarPanel();

      menuPanel.classList.add("is-open");
      menuPanel.setAttribute("aria-hidden", "false");
      if (menuBackdrop) menuBackdrop.setAttribute("aria-hidden", "false");
    }
    function closeMenu() {
      menuPanel.classList.remove("is-open");
      menuPanel.setAttribute("aria-hidden", "true");
      if (menuBackdrop) menuBackdrop.setAttribute("aria-hidden", "true");
    }
    if (btnMenu) btnMenu.addEventListener("click", () => (menuPanel.classList.contains("is-open") ? closeMenu() : openMenu()));
    menuBackdrop.addEventListener("click", closeMenu);
    menuCloseBtn.addEventListener("click", closeMenu);
    menuPanel.querySelectorAll("a[href]").forEach((a) => {
      a.addEventListener("click", closeMenu);
    });
  }

  const hasTocContent = rootTree || pageTocList;
  const row2 = topNav.querySelector(".h-mobile-top-nav__row2");
  if (row2 && !hasTocContent) row2.classList.add("is-hidden");

  if (dropdown && tocTrigger && hasTocContent) {
    function closeDropdown() {
      dropdown.classList.remove("is-open");
      tocTrigger.setAttribute("aria-expanded", "false");
    }

    const header = document.createElement("div");
    header.className = "h-mobile-top-nav__panel-header";

    const label = document.createElement("p");
    label.className = "menu-label";
    label.textContent = translate("Table of contents");
    header.appendChild(label);

    const dropdownCloseBtn = document.createElement("button");
    dropdownCloseBtn.type = "button";
    dropdownCloseBtn.className = "h-mobile-top-nav__panel-close";
    dropdownCloseBtn.setAttribute("aria-label", translate("Close"));
    dropdownCloseBtn.innerHTML = '<span class="icon is-small" aria-hidden="true"><i class="fas fa-times"></i></span>';
    header.appendChild(dropdownCloseBtn);

    dropdown.appendChild(header);

    if (pageTocList) {
      const listWrap = document.createElement("ul");
      listWrap.className = "menu-list";
      const tocClone = pageTocList.cloneNode(true);
      tocClone.classList.add("h-page-toc-mirror");
      tocClone.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeDropdown));
      listWrap.appendChild(tocClone);
      dropdown.appendChild(listWrap);
    } else if (rootTree) {
      const treeClone = rootTree.cloneNode(true);
      treeClone.id = "";
      dropdown.appendChild(treeClone);
      dropdown.querySelectorAll("a[href]").forEach((a) => a.addEventListener("click", closeDropdown));
    }

    function openDropdown() {
      // закрываем остальные режимы при открытии «Содержания»
      if (searchPanel && searchPanel.classList.contains("is-open")) {
        searchPanel.classList.remove("is-open");
        searchPanel.setAttribute("aria-hidden", "true");
      }
      if (menuPanel && menuBackdrop) {
        menuPanel.classList.remove("is-open");
        menuPanel.setAttribute("aria-hidden", "true");
        menuBackdrop.setAttribute("aria-hidden", "true");
      }
      closeSidebarPanel();

      dropdown.classList.add("is-open");
      tocTrigger.setAttribute("aria-expanded", "true");
    }
    tocTrigger.addEventListener("click", () => (dropdown.classList.contains("is-open") ? closeDropdown() : openDropdown()));
    if (dropdownBackdrop) dropdownBackdrop.addEventListener("click", closeDropdown);
    dropdownCloseBtn.addEventListener("click", closeDropdown);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && dropdown.classList.contains("is-open")) closeDropdown();
    });
  }

  function shouldKeepVisible() {
    const searchOpen = searchPanel && searchPanel.classList.contains("is-open");
    const dropdownOpen = dropdown && dropdown.classList.contains("is-open");
    const menuOpen = menuPanel && menuPanel.classList.contains("is-open");
    return searchOpen || dropdownOpen || menuOpen;
  }

  window.addEventListener("scroll", () => {
    currentScrollY = window.scrollY;

    if (currentScrollY <= HIDE_THRESHOLD) {
      topNav.classList.remove("h-mobile-top-nav--hidden");
      lastScrollY = currentScrollY;
      return;
    }

    if (shouldKeepVisible()) {
      topNav.classList.remove("h-mobile-top-nav--hidden");
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY > lastScrollY) {
      topNav.classList.add("h-mobile-top-nav--hidden");
    } else if (currentScrollY < lastScrollY) {
      topNav.classList.remove("h-mobile-top-nav--hidden");
    }

    lastScrollY = currentScrollY;
  });
}
