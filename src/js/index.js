/*!
 * Harrix HTML Template (https://github.com/Harrix/Harrix-HTML-Template)
 * Copyright 2018 Sergienko Anton
 * Licensed under MIT (https://github.com/Harrix/Harrix-HTML-Template/blob/master/LICENSE)
 */

import fontawesome from '@fortawesome/fontawesome'
import fontawesomeFreeSolid from '@fortawesome/fontawesome-free-solid'
import fontawesomeFreeRegular from '@fortawesome/fontawesome-free-regular'
import fontawesomeFreeBrands from '@fortawesome/fontawesome-free-brands'

import faCustomIcons from './fah.js'

document.addEventListener('DOMContentLoaded', () => {
    initNavbar(50, 300);
});

function initNavbar(scrollTopLogoShrink, scrollTopNavbarHide) {
    const root = document.documentElement;
    const navbar = document.getElementById('h-navbar');
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
        root.classList.toggle('h-is-hidden-overflow');
        const target = document.getElementById(navbarBurger.dataset.target);
        navbarBurger.classList.toggle('is-active');
        target.classList.toggle('is-active');
    });

    window.addEventListener('scroll', function() {
        lastY = currentY;
        currentY = window.scrollY;

        if (currentY >= scrollTopLogoShrink)
            logo.classList.add('h-is-shrink');
        else
            logo.classList.remove('h-is-shrink');

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