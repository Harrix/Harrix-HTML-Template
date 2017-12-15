/*!
 * Harrix HTML Template (https://github.com/Harrix/Harrix-HTML-Template)
 * Copyright 2017 Sergienko Anton
 * Licensed under MIT (https://github.com/Harrix/Harrix-HTML-Template/blob/master/LICENSE)
 */

$(function() {
    var tex = document.getElementsByClassName("tex");
    Array.prototype.forEach.call(tex, function(el) {
        katex.render(el.getAttribute("data-expr"), el, {
            displayMode: true
        });
    });
});