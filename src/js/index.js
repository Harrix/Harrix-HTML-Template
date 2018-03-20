/*!
 * Harrix HTML Template (https://github.com/Harrix/Harrix-HTML-Template)
 * Copyright 2018 Sergienko Anton
 * Licensed under MIT (https://github.com/Harrix/Harrix-HTML-Template/blob/master/LICENSE)
 */
import jQuery from 'jquery';
import popper from 'popper.js';
import bootstrap from 'bootstrap';
import hljs from 'highlight.js';
import lightgallery from 'lightgallery';

console.log("HelloTot! from JavaScript!");
var name = "Bob", time = "today";
console.log(`Hello ${name}, how ar465466e you ${time}?`);

jQuery(function() {
    initSyntaxHighlighting();
    initLightGallery(200, 10);
    initShrinkLogo(50);
    initBackToTop(200, 0.8);
    initTableOfContents('article', 'h2');
    initSmoothScrollingToAnchors();
});

function initSyntaxHighlighting() {
    jQuery('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
}

function initLightGallery(rowHeight, margins) {
    jQuery('.js-lightbox').lightGallery({
        hash: true,
        share: false
    });

    jQuery('.js-gallery').lightGallery({
        hash: true,
        share: false,
        selector: '.item'
    });

    /*jQuery('.js-gallery').justifiedGallery({
        rowHeight: rowHeight,
        margins: margins,
        border: 0
    });*/
}

function initShrinkLogo(scrollTop) {
    jQuery(window).scroll(function() {
        if (jQuery(this).scrollTop() >= scrollTop)
            jQuery('#js-logo').addClass('js-logo-shrink');
        else
            jQuery('#js-logo').removeClass('js-logo-shrink');
    });
}

function initBackToTop(scrollTop, duration) {
    jQuery(window).scroll(function() {
        if (jQuery(this).scrollTop() >= scrollTop)
            jQuery('#js-back-to-top').fadeIn();
        else
            jQuery('#js-back-to-top').fadeOut();
    });

    jQuery('#js-back-to-top').click(function() {
        jQuery('html, body').animate({
            scrollTop: 0
        }, duration * 1000);
    });
}

function initTableOfContents(mainTag, heading) {
    if (jQuery('#js-table-of-contents').length) {
        var result = '<h2>' + translate('Table of contents') + '</h2>\n<ul>';
        var newLine, element, title;
        var numberHeadingWithoutId = 1;
        jQuery(mainTag + ' ' + heading).each(function() {
            element = jQuery(this);
            title = element.text();
            var attr = element.attr('id');
            if (!(typeof attr !== typeof undefined && attr !== false)) {
                element.attr('id', 'heading' + numberHeadingWithoutId);
                numberHeadingWithoutId++;
            }
            newLine = "<li><a href='#" + element.attr("id") + "'>" + title + "</a></li>\n";
            result += newLine;
        });
        result += '\n</ul>';
        jQuery('#js-table-of-contents').prepend(result);
    }
}

function initSmoothScrollingToAnchors() {
    jQuery('li a[href*="#"], h2 a[href*="#"]').not('[href="#"]').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = jQuery(this.hash);
            target = target.length ? target : jQuery('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                jQuery('html, body').animate({
                    scrollTop: target.offset().top
                }, 800);
                return false;
            }
        }
    });
}

var locale = {
    'Table of contents': 'Содержание',
};
var lang = jQuery('html').attr('lang');

function translate(string) {
    return lang == 'en' ? string : locale[string];
}