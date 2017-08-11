(function(_, doc, win) {
	 
	_.consts = {
		serverUrl: "http://api.golinksworld.com/369/v1/",
		shareApiUri:"http://api.golinksworld.com/369/v1/",
		shareUrl:"http://share.golinksworld.com/",
		requestServerUrl:"https://api.yikeweiqi.com/"
	}
	_.RequesetWS = function(uri, sucFn, errFn, data1) {
		$.ajax({
			type: "get",
			url: uri,
			data: data1 || {},
			dataType: "jsonp",
			jsonpCallback: "callfn"+Math.round(new Date().getTime()/1000),
			timeout: 10000,
			success: sucFn,
			error: errFn
		});
	}
	_.RequesetWSCallBack = function(uri, sucFn, errFn,callback) {
		$.ajax({
			type: "get",
			url: uri,
			data: {},
			dataType: "jsonp",
			jsonpCallback:callback|| "callfn"+Math.round(new Date().getTime()/1000),
			timeout: 10000,
			success: sucFn,
			error: errFn
		});
	},
	_.escape2Html=function (str) {
		var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'};
		return str.replace(/&(lt|gt|nbsp|amp|quot);/ig,function(all,t){return arrEntities[t];});
	},
	_.parseUrl = function(name) {
		var search = document.location.search;
		search=_.escape2Html(search);
		var pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
		var matcher = pattern.exec(search);
		var items = null;
		if (null != matcher) {
			try {
				items = decodeURIComponent(decodeURIComponent(matcher[1]));
			} catch (e) {
				try {
					items = decodeURIComponent(matcher[1]);
				} catch (e) {
					items = matcher[1];
				}
			}
		}
		return items;
	}
	_.createMask = function(callback) {
		var mask = $("div.mask");
		if (mask.length >= 1) {
			mask.show();
		} else {
			mask = $("<div class='mask'>数据加载异常，点击重新加载</div>");
			$('body').append(mask);
		}
		mask.on("click", function() {
			mask.hide();
			callback && callback();
		});

	}
	_.checkPlatform=function () {
		if (/android/i.test(navigator.userAgent)) {
			return 1;
		}
		if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
			return 2
		}
		if (/Linux/i.test(navigator.userAgent)) {
			return 3;
		}
		if (/Linux/i.test(navigator.platform)) {
			return 3;
		}
		if (/MicroMessenger/i.test(navigator.userAgent)) {
			return 4;//这是微信平台下浏览器
		}
	}
	//转换富文本
	_.changeHtml=function(text) {
		var temp = document.createElement("div");
		temp.innerHTML = text;
		var output = temp.innerText || temp.textContent;
		temp = null;
		return output;
	}
	$(document).ready(function(){
		var plat=_.checkPlatform();
		switch(plat){
			case 1:
				$("#btn_download").click(function(){
					win.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.indeed.golinks&g_f=991653";
				});
                $(".downloadApp").click(function(){
                    win.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.indeed.golinks&g_f=991653";
                })
				break;
			case 2:
				$("#btn_download").click(function(){
					win.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.indeed.golinks&g_f=991653";
				});
                $(".downloadApp").click(function(){
                    win.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.indeed.golinks&g_f=991653";
                })
				break;
			case 4:
				$("#btn_download").click(function(){
					win.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.indeed.golinks&g_f=991653";
				});
                $(".downloadApp").click(function(){
                    win.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.indeed.golinks&g_f=991653";
                })
				break;
			default:
				$("#btn_download").click(function(){
					win.location.href="http://openbox.mobilem.360.cn/index/d/sid/3001525";
				});
                $(".downloadApp").click(function(){
                    win.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.indeed.golinks&g_f=991653";
                })
				break;
		}
		
	});

})(mui, document, window);