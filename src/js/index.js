/*!
 * Harrix HTML Template (https://github.com/Harrix/Harrix-HTML-Template)
 * Copyright 2018 Sergienko Anton
 * Licensed under MIT (https://github.com/Harrix/Harrix-HTML-Template/blob/master/LICENSE)
 */

import fontawesome from '@fortawesome/fontawesome'
import fontawesomeFreeSolid from '@fortawesome/fontawesome-free-solid'
import fontawesomeFreeRegular from '@fortawesome/fontawesome-free-regular'
import fontawesomeFreeBrands from '@fortawesome/fontawesome-free-brands'

import faCustomIcons from './_fah.js'

document.addEventListener('DOMContentLoaded', () => {
    initNavbar(50, 300);
    initSearchPanel();
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

function initSearchPanel() {
    const navbarMenu = document.getElementById('h-navbar-menu');
    const navbarMenuEnd = document.getElementById('h-navbar-menu-end');
    const buttonSearchOpen = document.getElementById('h-button-search-panel-open');
    const buttonSearchClose = document.getElementById('h-button-search-panel-close');
    const hdivsearch = document.getElementById('h-div-search');
    const hinputsearch = document.getElementById('h-input-search');
    buttonSearchOpen.addEventListener('click', () => {
        //navbarMenu.classList.add('h-has-visible-search-panel');
        //navbarMenu.classList.add('h-has-visible-search-panel');
        //hinputsearch.classList.toggle('h-www');
        var ww = navbarMenuEnd.clientWidth;
        //hinputsearch.style.width = 500;
        console.log(" w = " + navbarMenuEnd.clientWidth);
        hinputsearch.style.width = navbarMenuEnd.clientWidth + "px";
        navbarMenuEnd.classList.toggle('hideItems');
    });
    buttonSearchClose.addEventListener('click', () => {
        navbarMenu.classList.remove('h-has-visible-search-panel');
    });
}