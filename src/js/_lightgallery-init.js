import lightGallery from "lightgallery";
import lgHash from "lightgallery/plugins/hash";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";

import { GALLERY_ID } from "./_constants.js";

function getDownloadFilename(src) {
  if (!src) return "image";
  const parts = src.split("/");
  return parts[parts.length - 1] || "image";
}

export function initLightGallery() {
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
