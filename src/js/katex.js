import katex from 'katex';

jQuery(function() {
    var tex = document.getElementsByClassName("tex");
    Array.prototype.forEach.call(tex, function(el) {
        katex.render(el.getAttribute("data-expr"), el, {
            displayMode: true
        });
    });
});