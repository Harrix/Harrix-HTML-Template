/*!
 * Harrix HTML Template (https://github.com/Harrix/Harrix-HTML-Template)
 * Copyright 2017 Sergienko Anton
 * Licensed under MIT (https://github.com/Harrix/Harrix-HTML-Template/blob/master/LICENSE)
 */

jQuery(function() {
    //Run syntax highlighting
    jQuery('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    $(".lightbox").lightGallery({
        hash: true
    });
    $(".lightboxGallery").lightGallery({
        selector: '.card',
        hash: true
    });

    $(".gallery").justifiedGallery({
        rowHeight: 300,
        margins: 10
    });

    jQuery(window).scroll(function() {
        //Change the size of the logo when scroll
        if (jQuery(this).scrollTop() >= 50)
            jQuery("#logo").addClass("shrink");
        else
            jQuery("#logo").removeClass("shrink");

        //Hide or show the button "Back to up"
        if (jQuery(this).scrollTop() >= 200)
            jQuery('#back-to-top').fadeIn();
        else
            jQuery('#back-to-top').fadeOut();
    });

    //When you press the "Back to up" animated transition
    jQuery('#back-to-top').click(function() {
        jQuery('html, body').animate({
            scrollTop: 0
        }, 800);
    });

    makeTOC();

    //Smooth scrolling to anchors
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
});

function makeTOC() {
    if ($("#table-of-contents").length) {
        var ToC =
            "<h2>Содержание:</h2>" +
            "<ul>";

        var newLine, el, title, link;
        var counter = 1;

        $("article h2").each(function() {

            el = $(this);
            title = el.text();

            var attr = el.attr("id");

            if (typeof attr !== typeof undefined && attr !== false) {
              // Element has this attribute
            } else {
                el.attr("id","heading"+counter);
                counter++;
            }
            
            link = "#" + el.attr("id");
            

            newLine =
                "<li>" +
                "<a href='" + link + "'>" +
                title +
                "</a>" +
                "</li>";

            ToC += newLine;

        });

        ToC +=
            "</ul>";

        $("#table-of-contents").prepend(ToC);
    }
}