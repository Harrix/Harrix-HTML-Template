$(document).ready(function() {
    //Размеры логотипа при скроле
    $(window).scroll(function() {
        var bo = $(this).scrollTop();
        if (bo >= 50) {
            $("#logo").addClass("shrink");
        } else {
            $("#logo").removeClass("shrink");
        }
    });

    //Запускаем подсветку синтаксиса
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
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
  $(window).scroll(function(){
    if ($(this).scrollTop() > 200) {

      $('#top-link').fadeIn();
    } else {
      $('#top-link').fadeOut();
    }
  });
  
  //При нажатии на кнопку "Наверх" анимируем переход
  $('#top-link').click(function(){
    $('html, body').animate({scrollTop : 0},800);
    return false;
  });

  //Включаем авторазмер iframe, которые есть на странице
  iFrameResize({});

    //Галереи
    changeSizeFiguraInPhotoswipeGallery();
    $(window).resize(function() {
        //При изменении размеров окна тоже нужно поменять размеры изображений в галереях 
        changeSizeFiguraInPhotoswipeGallery();

        //Принудительно показываем боковую панель при увеличении размера окна
        //forcedDisplaySidebar();
    });
    $('.photoswipe_gallery').masonry({
        // options
        itemSelector: '.msnry_item',
        fitWidth: true,
    });
});

function changeSizeFiguraInPhotoswipeGallery() {
    //Функция подсчета ширины рисунков в галереях
    var width_content = $(".content-with-gallery").width();
    var w_figura = (width_content - 40) / 3;
    $(".msnry_item").width(w_figura);
}