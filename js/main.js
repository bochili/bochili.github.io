$(document).ready(function() {
	clickTreeDirectory();
	serachTree();
	switchTreeOrIndex();
	pageScroll();
	hljs.initHighlightingOnLoad();
	pjaxLoad();
	scrollToTop();
});
// 页面滚动
function pageScroll() {
	var start_hight = 0;
	$(window).on('scroll', function() {
		var end_hight = $(window).scrollTop();
		var distance = end_hight - start_hight;
		start_hight = end_hight;
		var $header = $('#header');
		if (distance > 0 && end_hight > 50) {
			$header.css('height','0px');
			$('#toc').css('top','0px');
		} else if (distance < 0) {
			$header.css('height','55px');
			$('#toc').css('top','60px');
		} else {
			return false;
		}
	})
}

function showArticleIndex() {
	$(".article-toc").empty();
	$(".article-toc").hide();
	$(".article-toc.active-toc").removeClass("active-toc");
	$("#tree .active").next().addClass('active-toc');

	var labelList = $("#article-content").children();
	var content = "<ul>";
	var max_level = 4;
	for (var i = 0; i < labelList.length; i++) {
		var level = 5;
		if ($(labelList[i]).is("h1")) {
			level = 1;
		} else if ($(labelList[i]).is("h2")) {
			level = 2;
		} else if ($(labelList[i]).is("h3")) {
			level = 3;
		} else if ($(labelList[i]).is("h4")) {
			level = 4;
		}
		if (level < max_level) {
			max_level = level;
		}
	}
	for (var i = 0; i < labelList.length; i++) {
		var level = 0;
		if ($(labelList[i]).is("h1")) {
			level = 1 - max_level + 1;
		} else if ($(labelList[i]).is("h2")) {
			level = 2 - max_level + 1;
		} else if ($(labelList[i]).is("h3")) {
			level = 3 - max_level + 1;
		} else if ($(labelList[i]).is("h4")) {
			level = 4 - max_level + 1;
		}
		if (level != 0) {
			$(labelList[i]).before('<span class="anchor" id="_label' + i + '"></span>');
			content += '<li class="level_' + level + '"><i class="fa fa-circle" aria-hidden="true"></i><a href="#_label' + i +
				'"> ' + $(labelList[i]).text() + '</a></li>';
		}
	}
	content += "</ul>"

	$(".article-toc.active-toc").append(content);

	if (null != $(".article-toc a") && 0 != $(".article-toc a").length) {

		// 点击目录索引链接，动画跳转过去，不是默认闪现过去
		$(".article-toc a").on("click", function(e) {
			e.preventDefault();
			// 获取当前点击的 a 标签，并前触发滚动动画往对应的位置
			var target = $(this.hash);
			$("body, html").animate({
					'scrollTop': target.offset().top
				},
				500
			);
		});


		// 监听浏览器滚动条，当浏览过的标签，给他上色。
		$(window).on("scroll", function(e) {
			var anchorList = $(".anchor");
			anchorList.each(function() {
				var tocLink = $('.article-toc a[href="#' + $(this).attr("id") + '"]');
				var anchorTop = $(this).offset().top;
				var windowTop = $(window).scrollTop();
				if (anchorTop <= windowTop + 100) {
					tocLink.addClass("read");
				} else {
					tocLink.removeClass("read");
				}
			});
		});
	}
	$(".article-toc.active-toc").show();
	$(".article-toc.active-toc").children().show();
}
// 搜索框输入事件
function serachTree() {
	// 解决搜索大小写问题
	jQuery.expr[':'].contains = function(a, i, m) {
		return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
	};

	$("#search-input").on("input", function(e) {
		e.preventDefault();

		// 获取 inpiut 输入框的内容
		var inputContent = e.currentTarget.value;

		// 没值就收起父目录，但是得把 active 的父目录都展开
		if (inputContent.length === 0) {
			$(".fa-minus-square-o").removeClass("fa-minus-square-o").addClass("fa-plus-square-o");
			$("#tree ul").css("display", "none");
			if ($("#tree .active").length) {
				showActiveTree($("#tree .active"), true);
			} else {
				$("#tree").children().css("display", "block");
			}
		}
		// 有值就搜索，并且展开父目录
		else {
			$(".fa-plus-square-o").removeClass("fa-plus-square-o").addClass("fa-minus-square-o");
			$("#tree ul").css("display", "none");
			var searchResult = $("#tree li").find("a:contains('" + inputContent + "')");
			if (searchResult.length) {
				showActiveTree(searchResult.parent(), false)
			}
		}
	});

	$("#search-input").on("keyup", function(e) {
		e.preventDefault();
		if (event.keyCode == 13) {
			var inputContent = e.currentTarget.value;

			if (inputContent.length === 0) {} else {
				window.open(searchEngine + inputContent + "%20site:" + homeHost, "_blank");
			}
		}
	});
}

// 点击目录事件
function clickTreeDirectory() {
	var treeActive = $("#tree .active");
	if (treeActive.length) {
		showActiveTree(treeActive, true);
		$('.active').parent('ul').siblings('.directory').addClass('active');
		$('.active').parent('ul').parent('li').parent('ul').siblings('.directory').addClass('active');
	}
	$(document).on("click", "#tree a[class='directory']", function(e) {
		$(this).toggleClass('active');
		$(this).siblings('ul').toggle();
	});
	$(document).on("click", ".active", function(e) {
		$(this).toggleClass('active');
		$(this).siblings('ul').hide();
	});
}

function showActiveTree(jqNode, isSiblings) {
	if (jqNode.attr("id") === "tree") {
		return;
	}
	if (jqNode.is("ul")) {
		jqNode.show();
		if (isSiblings) {
			jqNode.siblings().show();
			jqNode.siblings("a").css("display", "inline");
		}
	}
	jqNode.each(function() {
		showActiveTree($(this).parent(), isSiblings);
	});
}

$(function() {
	if ($("ul").css('display') == "block") {
		$(this).siblings('a').addClass('active');
	}
	if ($("#content").hasClass('content-on')) {} else {
		$(this).addClass('mw80');
	}
})


var _LoadingHtml = '<div id="loadingDiv" class="loadingBar"><div class="lobt-son"></div></div>';
document.write(_LoadingHtml);
document.onreadystatechange = completeLoading;

function completeLoading() {
	if (document.readyState == "complete") {
		var loadingMask = document.getElementById('loadingDiv');
		loadingMask.parentNode.removeChild(loadingMask);
	}
}


$(document).ready(function() {
	$('#article-content').children('p').children('img').addClass('content-image');
	$('.content-image').parent().fancybox();
	$('.content-image').parent().addClass('fancybox-button');

	$('.toc-button').click(function() {
		$('.toc-collapse').toggle(200);
	});
	$('.toc-collapse').click(function() {
		$('.toc-collapse').toggle(200);
	});
});
// 回到顶部
function scrollToTop() {
	$("#totop-toggle").on("click", function(e) {
		$("html").animate({
			scrollTop: 0
		}, 200);
	});
}
// 侧面目录
function switchTreeOrIndex() {
	$('#sidebar-toggle').on('click', function() {
		if ($('#sidebar').hasClass('on')) {
			scrollOff();
		} else {
			scrollOn();
		}
	});
	$('body').click(function(e) {
		if (window.matchMedia("(max-width: 1100px)").matches) {
			var target = $(e.target);
			if (!target.is('#sidebar *')) {
				if ($('#sidebar').hasClass('on')) {
					scrollOn();
				}
			}
			if ($('#sidebar').hasClass('on')) {
				$("body").children(".sidebar-cover").addClass("sidebar-cover-on");
			}
		}
	});
	$('.sidebar-cover').click(function() {
		$("#sidebar").removeClass("on");
		if ($('#sidebar').hasClass('on')) {
			$("body").children(".sidebar-cover").toggleClass("sidebar-cover-on");
		} else {
			$("body").children(".sidebar-cover").removeClass("sidebar-cover-on");
		}
	});
	if (window.matchMedia("(min-width: 1100px)").matches) {
		scrollOn();
	} else {
		scrollOff();
	};
}



function pjaxLoad() {
	// $(document).pjax('#menu a', '#content', {
	// 	fragment: '#content',
	// 	timeout: 8000
	// });
	// $(document).pjax('#tree a', '#article-content', {
	// 	fragment: '#article-content',
	// 	timeout: 8000
	// });
	// $(document).pjax('#index a', '#content', {
	// 	fragment: '#content',
	// 	timeout: 8000
	// });
	$(document).on({
		"pjax:complete": function(e) {
			$("pre code").each(function(i, block) {
				hljs.highlightBlock(block);
			});
		}
	});

}

function scrollOn() {
	var $sidebar = $('#sidebar'),
		$content = $('#content'),
		$header = $('#header'),
		$footer = $('#footer'),
		$togglei = $('#sidebar-toggle i');

	$togglei.addClass('fa-close');
	$togglei.removeClass('fa-arrow-right');
	$sidebar.addClass('on');
	$sidebar.removeClass('off');

	if (window.matchMedia("(min-width: 1100px)").matches) {
		$content.addClass('content-on');
		$content.removeClass('content-off');
		$header.addClass('header-on');
		$header.removeClass('off');
		$footer.addClass('header-on');
		$footer.removeClass('off');
	}
}

function scrollOff() {
	var $sidebar = $('#sidebar'),
		$content = $('#content'),
		$header = $('#header'),
		$footer = $('#footer'),
		$togglei = $('#sidebar-toggle i');

	$togglei.addClass('fa-arrow-right');
	$togglei.removeClass('fa-close');
	$sidebar.addClass('off');
	$sidebar.removeClass('on');

	$content.addClass('off');
	$content.removeClass('content-on');
	$header.addClass('off');
	$header.removeClass('header-on');
	$footer.addClass('off');
	$footer.removeClass('header-on');
}

$(document).on("click", ".file", function(e) {
	$(".file").removeClass(
		"active_a"
	)
	$(this).addClass("active_a")
})
$(document).ready(function() {
	var dirOpen = $('.directory').hasClass('open');
	if (dirOpen) {
		$('.open').children('.sidebar-dir-open').addClass('active');
	}
	$('.open').click(function() {
		$(this).children('.sidebar-dir-open').siblings('#tree').toogle();
		$(this).children('.sidebar-dir-open').toggleClass('active');
		$(this).children('.sidebar-dir-open').children('.material-icons').toggleClass('icon-rotate');
	});
	$('.sidebar-dir-open').click(function() {
		$(this).siblings('#tree').toggle();
		$(this).toggleClass('active');
		$(this).children('.material-icons').toggleClass('icon-rotate');
	});
	$('.active').click(function() {
		$(this).children('.material-icons').toggleClass('icon-rotate');
	});
});
/*页面载入完成后，创建复制按钮*/
$(document).ready(function() {
	$('input').parent('li').css('list-style','none');
	$('table').wrap('<div class="overflow-scroll" />');
	var initCopyCode = function() {
		var copyHtml = '';
		copyHtml += '<button class="btn-copy btn-copy-toast">';
		copyHtml += '<span class="material-icons">content_copy</span>COPY';
		copyHtml += '</button>';
		$(".highlight div").before(copyHtml);
		new ClipboardJS('.btn-copy', {
			target: function(trigger) {
				return trigger.nextElementSibling;
			}
		});
	}
	initCopyCode();
	var t = $('input').attr("type");
	if( t == 'checkbox'){
		$(t).siblings('p').addClass('disinline');
	}
	var toct = $('.toc-title')
	if($(toct).siblings().length){
	}else{

			$(toct).parent('.widget-wrapper').hide();
	}
});
$(window).scroll(function() {
	// 滚动条距离顶部的距离 大于 200px时
	if ($(window).scrollTop() >= 850) {
		$("#totop-toggle").fadeIn(400); // 开始淡入
	} else {
		$("#totop-toggle").fadeOut(400); // 如果小于等于 200 淡出
	}
});

$(document).on("click", ".qrcode_button", function(e) {
	$(this).siblings('.qrcode-window').toggle(100);
	$(this).addClass('.qrcode-active');
})
$(document).on("click", ".qrcode_active", function(e) {
	$(this).siblings('.qrcode-window').toggle(100);
	$(this).removeClass('.qrcode-active');
})

$(document).on("click", ".notice_button", function(e) {
	$(this).siblings('.notice-window').toggle(100);
	$(this).addClass('.notice-active');
})
$(document).on("click", ".notice_active", function(e) {
	$(this).siblings('.notice-window').toggle(100);
	$(this).removeClass('.notice-active');
})
$(document).on("click", ".qrcode1_button", function(e) {
	$(this).siblings('.qrcode1-window').toggle(100);
	$(this).addClass('.qrcode1-active');
})
$(document).on("click", ".qrcode1_active", function(e) {
	$(this).siblings('.qrcode1-window').toggle(100);
	$(this).removeClass('.qrcode1-active');
})

$(document).on("click", ".notice1_button", function(e) {
	$(this).siblings('.notice1-window').toggle(100);
	$(this).addClass('.notice1-active');
})
$(document).on("click", ".notice1_active", function(e) {
	$(this).siblings('.notice1-window').toggle(100);
	$(this).removeClass('.notice1-active');
})
