/*!
 * Harrix HTML Template (https://github.com/Harrix/Harrix-HTML-Template)
 * Copyright 2018 Sergienko Anton
 * Licensed under MIT (https://github.com/Harrix/Harrix-HTML-Template/blob/master/LICENSE)
 */

jQuery(function() {
    initSyntaxHighlighting();
    initLightGallery(200, 10);
    initShrinkLogo(50);
    initBackToTop(200);
    initTableOfContents('h2');
    initSmoothScrollingToAnchors();
});

function initSyntaxHighlighting() {
    jQuery('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });
}

function initLightGallery(rowHeight, margins) {
    $('.js-lightbox').lightGallery({
        hash: true,
        share: false
    });

    $('.js-gallery').justifiedGallery({
        rowHeight: rowHeight,
        margins: margins,
        border: 0
    });
}

function initShrinkLogo(scrollTop) {
    jQuery(window).scroll(function() {
        if (jQuery(this).scrollTop() >= scrollTop)
            jQuery('#js-logo').addClass('js-logo-shrink');
        else
            jQuery('#js-logo').removeClass('js-logo-shrink');
    });
}

function initBackToTop(scrollTop) {
    jQuery(window).scroll(function() {
        if (jQuery(this).scrollTop() >= scrollTop)
            jQuery('#js-back-to-top').fadeIn();
        else
            jQuery('#js-back-to-top').fadeOut();
    });

    jQuery('#js-back-to-top').click(function() {
        jQuery('html, body').animate({
            scrollTop: 0
        }, 800);
    });
}

function initTableOfContents(heading) {
    if ($("#js-table-of-contents").length) {
        var ToC = '<h2>' + gettext('Table of contents') + '</h2><ul>';
        var newLine, el, title, link;
        var counter = 1;
        $("article " + heading).each(function() {
            el = $(this);
            title = el.text();
            var attr = el.attr("id");
            if (!(typeof attr !== typeof undefined && attr !== false)) {
                el.attr("id", "heading" + counter);
                counter++;
            }
            link = "#" + el.attr("id");
            newLine = "<li><a href='" + link + "'>" + title + "</a></li>";
            ToC += newLine;
        });
        ToC += "</ul>";
        $("#js-table-of-contents").prepend(ToC);
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

var LOCALE = {
    "Table of contents": "Содержание",
  };
  
  function gettext(string) {
    var theLanguage = $('html').attr('lang');
    console.log(theLanguage);
    return theLanguage =='en' ? string : LOCALE[string];
  }