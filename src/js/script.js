$(document).ready(function() {
    $(window).scroll(function(){
        var bo = $(this).scrollTop();
        if ( bo >= 50) {
          $("#logo").addClass("shrink");
        }
        else {
          $("#logo").removeClass("shrink");
        }
      });
});