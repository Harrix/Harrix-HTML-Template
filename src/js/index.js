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
    const navbarEl = document.getElementById('navbar');
    navbarEl.classList.remove('translateY-hide');
};

document.addEventListener('DOMContentLoaded', () => {
    const navbarEl = document.getElementById('navbar');
    const navbarBurger = document.getElementById('navbarBurger');
    const specialShadow = document.getElementById('specialShadow');
    const rootEl = document.documentElement;
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
            navbarEl.classList.add('translateY-hide');
            console.log('add ' + lastY + " " + currentY);           
        } else {
            navbarEl.classList.remove('translateY-hide');
            console.log('remove ' + lastY + " " + currentY);
        }
    });

});