$(document).ready(function() {
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

    //Меняем размеры элементов у галерей
    changeSizeFiguraInPhotoswipeGallery();

    //События при изменении размера окна
    $(window).resize(function() {
        //При изменении размеров окна тоже нужно поменять размеры изображений в галереях 
        changeSizeFiguraInPhotoswipeGallery();

        //Принудительно показываем боковую панель при увеличении размера окна
        //forcedDisplaySidebar();
    });

    //Запускаем поиск галерей, чтобы привести сетку изображений к нужному виду
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