$(document).ready(function(){
    $(".cui-list-item").click(function () {
      $(this).siblings().find('ol').hide()
      $(this).toggleClass("cui-collapse-active").siblings().removeClass("cui-collapse-active cui-list-collapse-active")
	})
    $(".cui-list-item").click(function () {
      $(this).children("ol").slideToggle(200);
    })
	$("ol>li").click(function (e) {
	   e.stopPropagation()
	})
	$(".cui-list-collapse-active").click(function () {
	  $(this).toggleClass("cui-list-collapse-active")
      $(this).toggleClass("cui-collapse-active").siblings().removeClass("cui-collapse-active")
	})
})

$(document).ready(function(){
	$(".cui-panel-collapse-head").click(function () {
		$(this).siblings(".cui-panel-collapse-body").toggle(200)
	})
})