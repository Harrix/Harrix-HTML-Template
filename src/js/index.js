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
    initNavbar(50, 300);
});

function initNavbar(scrollTopLogoShrink, scrollTopNavbarHide) {
    const rootEl = document.documentElement;
    const navbarEl = document.getElementById('navbar');
    const navbarBurger = document.getElementById('navbarBurger');
    const specialShadow = document.getElementById('specialShadow');    
    const logo = document.getElementById('logo');
    let lastY = 0;
    let currentY = 0;

    let hasClassHide = logo.classList.contains('translateY-hide');

    specialShadow.onmouseover = function(event) {
        const navbarEl = document.getElementById('navbar');
        navbarEl.classList.remove('translateY-hide');
        hasClassHide = false;
    };

    navbarBurger.addEventListener('click', () => {
        rootEl.classList.toggle('bd-is-clipped-touch');

        const target = document.getElementById(navbarBurger.dataset.target);
        navbarBurger.classList.toggle('is-active');
        target.classList.toggle('is-active');
    });

    window.addEventListener('scroll', function() {
        lastY = currentY;
        currentY = window.scrollY;

        if (currentY >= scrollTopLogoShrink)
            logo.classList.add('logo-shrink');
        else
            logo.classList.remove('logo-shrink');

        if (currentY > scrollTopNavbarHide) {
            if (currentY > lastY) {

                if (!hasClassHide) {
                    navbarEl.classList.add('translateY-hide');
                    hasClassHide = true;
                }
            }
        }

        if (currentY < lastY) {
            if (hasClassHide) {
                navbarEl.classList.remove('translateY-hide');
                hasClassHide = false;
            }
        }
    });
}