$(document).ready(function() {
    //Запускаем подсветку синтаксиса
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    //Размеры логотипа при скроле
    $(window).scroll(function() {
        var bo = $(this).scrollTop();
        if (bo >= 50) {
            $("#logo").addClass("shrink");
        } else {
            $("#logo").removeClass("shrink");
        }
    });

    //Подготавливаем сплойеры
    $('.spoiler-text').hide();
    $('.spoiler').click(function() {
        $(this).toggleClass("folded").toggleClass("unfolded").next().slideToggle();
    });

    //Находим все вставки LaTeX в виде div класса tex и рендерим их
    var tex = document.getElementsByClassName("tex");
    Array.prototype.forEach.call(tex, function(el) {
        katex.render(el.getAttribute("data-expr"), el, {
            displayMode: true
        });
    });

    //Скрываем или показываем кнопку "Наверх"
    $(window).scroll(function() {
        if ($(this).scrollTop() > 200) {
            $('#top-link').fadeIn();
        } else {
            $('#top-link').fadeOut();
        }
    });

    //При нажатии на кнопку "Наверх" анимируем переход
    $('#top-link').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    //Включаем авторазмер iframe, которые есть на странице
    iFrameResize({});

    //TODO: Работаем с левой панелью
    //if ($('*').is('#sidebar')) forNavigationDrawer();//

    //Галереи
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
});

$(function() {
    //Плавная прокрутка по якорям
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
  
  //Свайпы
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
  //Функция принудительного показа боковой панели при увеличении размера окна
  var width_content = $("body").width();
  
  if (width_content > 992) {
    $('#sidebar').removeClass("sidebar-open").show();
    $('#dark').removeClass("dark-open").hide();
    $('#for-swipe').removeClass("for-swipe-open").hide();
    $('#for-swipe-in').removeClass("for-swipe-in-open").hide();
  }
}*/

function changeSizeFiguraInPhotoswipeGallery() {
    //Функция подсчета ширины рисунков в галереях
    var width_content = $(".content-with-gallery").width();
    var w_figura = (width_content - 40) / 3;
    $(".msnry_item").width(w_figura);
}