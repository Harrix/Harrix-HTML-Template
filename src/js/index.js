/*!
 * Harrix HTML Template (https://github.com/Harrix/Harrix-HTML-Template)
 * Copyright 2018 Sergienko Anton
 * Licensed under MIT (https://github.com/Harrix/Harrix-HTML-Template/blob/master/LICENSE)
 */

import fontawesome from '@fortawesome/fontawesome'
import fontawesomeFreeSolid from '@fortawesome/fontawesome-free-solid'
import fontawesomeFreeRegular from '@fortawesome/fontawesome-free-regular'
import fontawesomeFreeBrands from '@fortawesome/fontawesome-free-brands'

document.addEventListener('DOMContentLoaded', () => {
 
    const $burgers = getAll('.burger');
  
    if ($burgers.length > 0) {
      $burgers.forEach($el => {
        $el.addEventListener('click', () => {
          const target = $el.dataset.target;
          const $target = document.getElementById(target);
          $el.classList.toggle('is-active');
          $target.classList.toggle('is-active');
        });
      });
    }
  
    function getAll(selector) {
      return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
    }
  
    const navbarEl = document.getElementById('navbar');
    const navbarBurger = document.getElementById('navbarBurger');
    const specialShadow = document.getElementById('specialShadow');
    const NAVBAR_HEIGHT = 52;
    const THRESHOLD = 160;
    let navbarOpen = false;
    let horizon = NAVBAR_HEIGHT;
    let whereYouStoppedScrolling = 0;
    let scrollFactor = 0;
    let currentTranslate = 0;
  
    navbarBurger.addEventListener('click', el => {
      navbarOpen = !navbarOpen;
  
      if (navbarOpen) {
        rootEl.classList.add('bd-is-clipped-touch');
      } else {
        rootEl.classList.remove('bd-is-clipped-touch');
      }
    });
  
    function upOrDown(lastY, currentY) {
      if (currentY >= lastY) {
        return goingDown(currentY);
      }
      return goingUp(currentY);
    }
  
    function goingDown(currentY) {
      const trigger = NAVBAR_HEIGHT;
      whereYouStoppedScrolling = currentY;
  
      if (currentY > horizon) {
        horizon = currentY;
      }
  
      translateHeader(currentY, false);
    }
  
    function goingUp(currentY) {
      const trigger = 0;
  
      if (currentY < (whereYouStoppedScrolling - NAVBAR_HEIGHT)) {
        horizon = currentY + NAVBAR_HEIGHT;
      }
  
      translateHeader(currentY, true);
    }
  
    function constrainDelta(delta) {
      return Math.max(0, Math.min(delta, NAVBAR_HEIGHT));
    }
  
    function translateHeader(currentY, upwards) {
      // let topTranslateValue;
      let translateValue;
  
      if (upwards && currentTranslate == 0) {
        translateValue = 0;
      } else if (currentY <= NAVBAR_HEIGHT) {
        translateValue = currentY * -1;
      } else {
        const delta = constrainDelta(Math.abs(currentY - horizon));
        translateValue = delta - NAVBAR_HEIGHT;
      }
  
      if (translateValue != currentTranslate) {
        const navbarStyle = `
          transform: translateY(${translateValue}px);
        `;
        currentTranslate = translateValue;
        navbarEl.setAttribute('style', navbarStyle);
      }
  
      if (currentY > THRESHOLD * 2) {
        scrollFactor = 1;
      } else if (currentY > THRESHOLD) {
        scrollFactor = (currentY - THRESHOLD) / THRESHOLD;
      } else {
        scrollFactor = 0;
      }
  
      const translateFactor = 1 + translateValue / NAVBAR_HEIGHT;
      specialShadow.style.opacity = scrollFactor;
      specialShadow.style.transform = 'scaleY(' + translateFactor + ')';
    }
  
    translateHeader(window.scrollY, false);
  
    let ticking = false;
    let lastY = 0;
  
    window.addEventListener('scroll', function() {
      const currentY = window.scrollY;
  
      if (!ticking) {
        window.requestAnimationFrame(function() {
          upOrDown(lastY, currentY);
          ticking = false;
          lastY = currentY;
        });
      }
  
      ticking = true;
    });
  
  });

  