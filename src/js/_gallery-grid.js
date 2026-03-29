export function initGalleryGrid(rowHeight) {
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
