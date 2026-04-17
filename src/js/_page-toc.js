import { getUiModes } from "./_app-bridge.js";
import { PAGE_TOC_TOGGLE_THRESHOLD } from "./_constants.js";
import { translate } from "./_locale.js";
import { scrollToAnchor } from "./_scroll-anchor.js";
import { subscribeWindowScroll } from "./_scroll-hub.js";

export function initPageToc() {
  const toc = document.getElementById("h-page-toc");
  const tocList = document.getElementById("h-page-toc-list");
  const tocLabel = document.getElementById("h-page-toc-label");
  const navbarTocTriggerLabel = document.getElementById("h-navbar-toc-trigger-label");
  const mobileTocTriggerLabel = document.getElementById("h-mobile-top-nav-toc-trigger-label");
  const toggleBtn = document.getElementById("h-page-toc-toggle");
  if (!toc || !tocList) return;

  const article = document.querySelector("article");
  if (!article) return;

  const headings = article.querySelectorAll("h2");
  if (headings.length === 0) return;

  if (tocLabel) tocLabel.textContent = translate("Table of contents");
  function setTocTriggerLabel(text) {
    const value = (text || "").trim() || translate("Table of contents");
    if (navbarTocTriggerLabel) navbarTocTriggerLabel.textContent = value;
    if (mobileTocTriggerLabel) mobileTocTriggerLabel.textContent = value;
  }
  setTocTriggerLabel("");

  const usedIds = new Set();
  headings.forEach((h, i) => {
    if (!h.id || usedIds.has(h.id)) {
      const base = h.textContent
        .trim()
        .toLowerCase()
        .replace(/[^a-zа-яё0-9]+/gi, "-")
        .replace(/^-|-$/g, "");
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
      setTocTriggerLabel(headings[index]?.textContent || "");
    } else {
      setTocTriggerLabel("");
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

  // Intercept clicks so fixed headers and UI layers behave consistently (smooth scroll + close drawer).
  tocList.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const href = a.getAttribute("href");
      getUiModes()?.close("pageToc");
      scrollToAnchor(href);
    });
  });

  subscribeWindowScroll((scrollY) => {
    if (scrollY >= PAGE_TOC_TOGGLE_THRESHOLD) {
      toggleBtn.classList.add("is-visible");
    } else {
      toggleBtn.classList.remove("is-visible");
    }
  });
}
