import lightgallery from 'lightgallery.js';
import lgThumbnail from 'lg-thumbnail.js';
import lgAutoplay from 'lg-autoplay.js';
import lgVideo from 'lg-video.js';
import lgFullscreen from 'lg-fullscreen.js';
import lgPager from 'lg-pager.js';
import lgZoom from 'lg-zoom.js';
import lgHash from 'lg-hash.js';
import hljs from 'highlight.js';

import initFontawesomeCollection from './_fontawesome-collection.js'
import locale from './_locale-ru.js'

document.addEventListener('DOMContentLoaded', () => {
  initNavbar(100);
  initSearchPanel();
  initLightGallery(200, 10);
  initSyntaxHighlighting();
  initFontawesomeCollection();
});

window.addEventListener("load", function(event) {
  initGalleryGrid(200);
});

function initNavbar(scrollTopNavbarHide) {
  const navbar = document.getElementById('h-navbar');

  if (!!navbar) {
    const root = document.documentElement;
    const navbarBurger = document.getElementById('h-burger');
    const navbarBottom = document.getElementById('h-navbar-bottom');
    const logo = document.getElementById('h-logo');

    let lastY = 0;
    let currentY = 0;
    let hasClassHide = logo.classList.contains('h-is-hidden');

    navbarBottom.onmouseover = function(event) {
      navbar.classList.remove('h-is-hidden');
      hasClassHide = false;
    };

    navbarBurger.addEventListener('click', () => {
      root.classList.toggle('h-is-clipped-touch');
      const target = document.getElementById(navbarBurger.dataset.target);
      navbarBurger.classList.toggle('is-active');
      target.classList.toggle('is-active');
    });

    window.addEventListener('scroll', function() {
      lastY = currentY;
      currentY = window.scrollY;

      if ((currentY > scrollTopNavbarHide) && (currentY > lastY) && (!hasClassHide)) {
        navbar.classList.add('h-is-hidden');
        hasClassHide = true;
      }

      if ((currentY < lastY) && (hasClassHide)) {
        navbar.classList.remove('h-is-hidden');
        hasClassHide = false;
      }
    });
  }
}

function initSearchPanel() {
  const searchForm = document.getElementById('h-search-form');
  if (!!searchForm) {
    const navbarMenu = document.getElementById('h-navbar-menu');
    const searchButtonOpen = document.getElementById('h-search-button-open');
    const searchButtonClose = document.getElementById('h-search-button-close');
    const searchInput = document.getElementById('h-search-input');

    let timeOfAnimation = 500;

    searchInput.placeholder = translate('Search…');

    searchButtonOpen.addEventListener('click', () => {
      searchForm.classList.remove("h-is-hidden");
      navbarMenu.classList.add('has-visible-search-from');
      focusAfterAnimation(searchInput, timeOfAnimation);
      showOrHideSearchButtonClose();
    });

    searchButtonClose.addEventListener('click', () => {
      if (searchInput.value.length >= 1) {
        searchInput.value = "";
        showOrHideSearchButtonClose();
      } else {
        searchForm.classList.add("h-is-hidden");
        navbarMenu.classList.remove('has-visible-search-from');
        searchInput.blur();
      }
    });

    searchInput.addEventListener('input', () => {
      showOrHideSearchButtonClose();
    });
  }
}

function initLightGallery(rowHeight, margins) {
  var lightboxes = document.getElementsByClassName('h-lightbox');

  Array.from(lightboxes).forEach(el => {
    lightGallery(el, {
      hash: true,
      share: false
    });
  });

  var galleries = document.getElementsByClassName('h-gallery');

  Array.from(galleries).forEach(el => {
    lightGallery(el, {
      hash: true,
      share: false,
      selector: '.item'
    });
  });
}

function initGalleryGrid(imgHeight) {
  var galleries = document.getElementsByClassName('h-gallery');

  Array.from(galleries).forEach(gallery => {
    gallery.style.display = 'flex';
    var images = gallery.querySelectorAll("img");

    Array.from(images).forEach(img => {
      var width = img.naturalWidth;
      var height = img.naturalHeight;

      var base = width / height;
      var grow = Math.round(base * 1000) / 100;
      var h = Math.round(imgHeight * base);

      img.parentElement.style.flex = grow + " " + h + "px";
      img.parentElement.style.minHeight = Math.round(h / base) + "px";
    });
  });
}

function initSyntaxHighlighting() {
  hljs.initHighlightingOnLoad();
}

function focusAfterAnimation(elem, timeOfAnimation) {
  window.setTimeout(function() {
    elem.focus();
  }, timeOfAnimation);
}

function showOrHideSearchButtonClose() {
  const searchInput = document.getElementById('h-search-input');
  const searchButtonClose = document.getElementById('h-search-button-close');
  if (searchInput.value.length >= 1)
    searchButtonClose.classList.remove('is-hidden-touch');
  else
    searchButtonClose.classList.add('is-hidden-touch');
}

function translate(string) {
  let lang = document.documentElement.lang;
  return lang == 'en' ? string : locale[string];
}