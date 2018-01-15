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

    $(".lightbox").lightGallery();
    $(".lightboxGallery").lightGallery({
        selector: '.card'
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

    //Turn on the auto-size iframe which is on the page
    iFrameResize({});

    //Gallery
    /*changeSizeFiguraInPhotoswipeGallery();
    jQuery(window).resize(function() {
        //When you resize the window too, need to change the size of images in gallery 
        changeSizeFiguraInPhotoswipeGallery();

        //TODO:
        //Forcibly show the sidebar when you increase the window size
        //forcedDisplaySidebar();
    });
    jQuery('.photoswipe_gallery').masonry({
        // options
        itemSelector: '.msnry_item',
        fitWidth: true,
    });*/

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

    //TODO: Working with the left pane
    //if (jQuery('*').is('#sidebar')) forNavigationDrawer();//
});

//TODO:
/*function forNavigationDrawer() {
  //Click on the hamburger
  jQuery('.hamburger').click(function() {
    jQuery('#sidebar').toggleClass("sidebar-open");
    jQuery('#dark').toggleClass("dark-open");
    jQuery('#for-swipe').toggleClass("for-swipe-open");
    jQuery('#for-swipe-in').toggleClass("for-swipe-in-open");
  });
  //When you click on a blackout remove the left panel
  jQuery('#dark').click(function(){
     jQuery('.hamburger').click();
  });
  jQuery('#for-swipe').click(function(){
     jQuery('.hamburger').click();
  });
  jQuery('#for-swipe-in').click(function(){
     jQuery('.hamburger').click();
  });
  
  //Swipes
  var forSwipe = document.getElementById('for-swipe');
  var hammertimeForSwipe = new Hammer(forSwipe);
  hammertimeForSwipe.on('swipeleft', function(ev) {
      if ( jQuery('#for-swipe').hasClass('for-swipe-open') == true )
      jQuery('.hamburger').click();
  });
  hammertimeForSwipe.on('swiperight', function(ev) {
      if ( jQuery('#for-swipe').hasClass('for-swipe-open') == false )
      jQuery('.hamburger').click();
  });
  
  var forSwipeIn = document.getElementById('for-swipe-in');
  var hammertimeForSwipeIn = new Hammer(forSwipeIn);
  hammertimeForSwipeIn.on('swipeleft', function(ev) {
      if ( jQuery('#for-swipe-in').hasClass('for-swipe-in-open') == true )
      jQuery('.hamburger').click();
  });
  hammertimeForSwipeIn.on('swiperight', function(ev) {
      if ( jQuery('#for-swipe-in').hasClass('for-swipe-in-open') == false )
      jQuery('.hamburger').click();
  });
  
  var dark = document.getElementById('dark');
  var hammertimeDark = new Hammer(dark);
  hammertimeDark.on('swipe', function(ev) {
      jQuery('.hamburger').click();
  });  
}*/

//TODO:
/*function forcedDisplaySidebar() {
  //Function forced showing in the sidebar when you increase the window size
  var width_content = jQuery("body").width();
  
  if (width_content > 992) {
    jQuery('#sidebar').removeClass("sidebar-open").show();
    jQuery('#dark').removeClass("dark-open").hide();
    jQuery('#for-swipe').removeClass("for-swipe-open").hide();
    jQuery('#for-swipe-in').removeClass("for-swipe-in-open").hide();
  }
}*/

function changeSizeFiguraInPhotoswipeGallery() {
    //The counting function of the width of the pictures in the galleries
    var width_content = jQuery(".content-with-gallery").width();
    var w_figura = (width_content - 40) / 3;
    jQuery(".msnry_item").width(w_figura);
}