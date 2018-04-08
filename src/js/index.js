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

let hasClassHide;

specialShadow.onmouseover = function(event) {
    const navbarEl = document.getElementById('navbar');
    navbarEl.classList.remove('translateY-hide');
    hasClassHide = false;
};

document.addEventListener('DOMContentLoaded', () => {
    const navbarEl = document.getElementById('navbar');
    const navbarBurger = document.getElementById('navbarBurger');
    const specialShadow = document.getElementById('specialShadow');
    const rootEl = document.documentElement;
    const logo = document.getElementById('logo');
    let lastY = 0;
    let currentY = 0;

    hasClassHide = logo.classList.contains('translateY-hide');    

    navbarBurger.addEventListener('click', () => {
        rootEl.classList.toggle('bd-is-clipped-touch');

        const target = document.getElementById(navbarBurger.dataset.target);
        navbarBurger.classList.toggle('is-active');
        target.classList.toggle('is-active');
    });

    window.addEventListener('scroll', function() {
        lastY = currentY;
        currentY = window.scrollY;

        if (currentY >= 50) {
            logo.classList.add('logo-shrink');
            console.log('logo-shrink ' + currentY);
        } else {
            logo.classList.remove('logo-shrink');
            console.log('logo-shrink remove' + currentY);
        }

        if (currentY > 300) {
        if (currentY > lastY) {
           
            if (!hasClassHide) {
                navbarEl.classList.add('translateY-hide');
                hasClassHide = true;
                console.log('add ' + lastY + " " + currentY);
            }
            }
        } 
        
        if (currentY < lastY) {
            if (hasClassHide) {
            navbarEl.classList.remove('translateY-hide');
            hasClassHide = false;
            console.log('remove ' + lastY + " " + currentY);
            }
        }
    });

});