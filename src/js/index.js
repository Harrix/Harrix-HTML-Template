/*!
 * Harrix HTML Template (https://github.com/Harrix/Harrix-HTML-Template)
 * Copyright 2018 Sergienko Anton
 * Licensed under MIT (https://github.com/Harrix/Harrix-HTML-Template/blob/master/LICENSE)
 */

import fontawesome from '@fortawesome/fontawesome'
import fontawesomeFreeSolid from '@fortawesome/fontawesome-free-solid'
import fontawesomeFreeRegular from '@fortawesome/fontawesome-free-regular'
import fontawesomeFreeBrands from '@fortawesome/fontawesome-free-brands'

function getAll(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
}

specialShadow.onmouseover = function(event) {
    var target = event.target;
    target.style.background = 'pink';
    //text.value += "mouseover " + target.tagName + "\n";
    //text.scrollTop = text.scrollHeight;
    //translateHeader(currentY, true);
    const navbarEl = document.getElementById('navbar');
    navbarEl.classList.remove('translateY-hide');
    navbarEl.classList.add('translateY-show');
};

document.addEventListener('DOMContentLoaded', () => {

    const $burgers = getAll('.burger');

    const navbarEl = document.getElementById('navbar');
    const navbarBurger = document.getElementById('navbarBurger');
    const specialShadow = document.getElementById('specialShadow');
    const rootEl = document.documentElement;
    const NAVBAR_HEIGHT = 52;
    const THRESHOLD = 160;
    let navbarOpen = false;
    let horizon = NAVBAR_HEIGHT;
    let whereYouStoppedScrolling = 0;
    let scrollFactor = 0;
    let currentTranslate = 0;
    let lastY = 0;
    let currentY = 0;

    navbarBurger.addEventListener('click', () => {
        rootEl.classList.toggle('bd-is-clipped-touch');

        const target = document.getElementById(navbarBurger.dataset.target);
        navbarBurger.classList.toggle('is-active');
        target.classList.toggle('is-active');
    });

    window.addEventListener('scroll', function() {
        lastY = currentY;

        currentY = window.scrollY;

        if (currentY >= lastY) {
            navbarEl.classList.remove('translateY-show');
            navbarEl.classList.add('translateY-hide');
            //console.log('add ' + lastY + " " + currentY);           
        } else {
            navbarEl.classList.remove('translateY-hide');
            navbarEl.classList.add('translateY-show');
            //console.log('remove ' + lastY + " " + currentY);
        }
    });

});