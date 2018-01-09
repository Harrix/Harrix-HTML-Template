/*!
 * Harrix HTML Template (https://github.com/Harrix/Harrix-HTML-Template)
 * Copyright 2017 Sergienko Anton
 * Licensed under MIT (https://github.com/Harrix/Harrix-HTML-Template/blob/master/LICENSE)
 */

$(function() {
    //Run syntax highlighting
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    //Change the size of the logo when scroll
    $(window).scroll(function() {
        var bo = $(this).scrollTop();
        if (bo >= 50) {
            $("#logo").addClass("shrink");
        } else {
            $("#logo").removeClass("shrink");
        }
    });

    //Hide or show the button "Back to up"
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
            $('#back-to-top').fadeIn();
        } else {
            $('#back-to-top').fadeOut();
        }
    });

    //When you press the "Back to up" animated transition
    $('#back-to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    //Turn on the auto-size iframe which is on the page
    iFrameResize({});

    //TODO: Working with the left pane
    //if ($('*').is('#sidebar')) forNavigationDrawer();//

    //Gallery
    changeSizeFiguraInPhotoswipeGallery();
    $(window).resize(function() {
        //При изменении размеров окна тоже нужно поменять размеры изображений в галереях 
        changeSizeFiguraInPhotoswipeGallery();

        //TODO:
        //Принудительно показываем боковую панель при увеличении размера окна
        //forcedDisplaySidebar();
    });
    $('.photoswipe_gallery').masonry({
        // options
        itemSelector: '.msnry_item',
        fitWidth: true,
    });

    //Smooth scrolling to anchors
    $('a[href*="#"]:not([href="#"])').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 800);
                return false;
            }
        }
    });
});

//TODO:
/*function forNavigationDrawer() {
  //Клик на гамбургер
  $('.hamburger').click(function() {
    $('#sidebar').toggleClass("sidebar-open");
    $('#dark').toggleClass("dark-open");
    $('#for-swipe').toggleClass("for-swipe-open");
    $('#for-swipe-in').toggleClass("for-swipe-in-open");
  });
  //При нажатии на затемнение убираем левую панель
  $('#dark').click(function(){
     $('.hamburger').click();
  });
  $('#for-swipe').click(function(){
     $('.hamburger').click();
  });
  $('#for-swipe-in').click(function(){
     $('.hamburger').click();
  });
  
  //Swipes
  var forSwipe = document.getElementById('for-swipe');
  var hammertimeForSwipe = new Hammer(forSwipe);
  hammertimeForSwipe.on('swipeleft', function(ev) {
      if ( $('#for-swipe').hasClass('for-swipe-open') == true )
      $('.hamburger').click();
  });
  hammertimeForSwipe.on('swiperight', function(ev) {
      if ( $('#for-swipe').hasClass('for-swipe-open') == false )
      $('.hamburger').click();
  });
  
  var forSwipeIn = document.getElementById('for-swipe-in');
  var hammertimeForSwipeIn = new Hammer(forSwipeIn);
  hammertimeForSwipeIn.on('swipeleft', function(ev) {
      if ( $('#for-swipe-in').hasClass('for-swipe-in-open') == true )
      $('.hamburger').click();
  });
  hammertimeForSwipeIn.on('swiperight', function(ev) {
      if ( $('#for-swipe-in').hasClass('for-swipe-in-open') == false )
      $('.hamburger').click();
  });
  
  var dark = document.getElementById('dark');
  var hammertimeDark = new Hammer(dark);
  hammertimeDark.on('swipe', function(ev) {
      $('.hamburger').click();
  });  
}*/

//TODO:
/*function forcedDisplaySidebar() {
  //Function forced showing in the sidebar when you increase the window size
  var width_content = $("body").width();
  
  if (width_content > 992) {
    $('#sidebar').removeClass("sidebar-open").show();
    $('#dark').removeClass("dark-open").hide();
    $('#for-swipe').removeClass("for-swipe-open").hide();
    $('#for-swipe-in').removeClass("for-swipe-in-open").hide();
  }
}*/

function changeSizeFiguraInPhotoswipeGallery() {
    //The counting function of the width of the pictures in the galleries
    var width_content = $(".content-with-gallery").width();
    var w_figura = (width_content - 40) / 3;
    $(".msnry_item").width(w_figura);
}