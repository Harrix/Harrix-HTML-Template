/*!
 * Harrix HTML Template (https://github.com/Harrix/Harrix-HTML-Template)
 * Copyright 2018 Sergienko Anton
 * Licensed under MIT (https://github.com/Harrix/Harrix-HTML-Template/blob/master/LICENSE)
 */

import fontawesomeCollection from './_fontawesome-collection.js'

document.addEventListener('DOMContentLoaded', () => {
    initNavbar(100);
    initSearchPanel();
});

function initNavbar(scrollTopNavbarHide) {
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
    const buttonSearchOpen = document.getElementById('h-search-button-open');
    const buttonSearchClose = document.getElementById('h-search-button-close');
    const searchInput = document.getElementById('h-search-input');
    const hsearchpanel = document.getElementById('h-search');

    searchInput.placeholder = translate('Search…');

    buttonSearchOpen.addEventListener('click', () => {
        hsearchpanel.classList.toggle("h-is-hidden");
        searchInput.focus();

        navbarMenu.classList.toggle('has-hidden-items');
    });
    buttonSearchClose.addEventListener('click', () => {
        hsearchpanel.classList.toggle("h-is-hidden");
        searchInput.blur();

        navbarMenu.classList.toggle('has-hidden-items');
    });
}

var locale = {
    'Table of contents': 'Содержание',
    'Search…': 'Поиск…',
};
var lang = jQuery('html').attr('lang');

function translate(string) {
    return lang == 'en' ? string : locale[string];
}