(function(_,doc,win,$){
	var gonews=function(){};
	_.extend(gonews.prototype, {
		player:"",
		currentpo : null,
		info :null,
		isFirst:null,
		isShow:false,
		timerSgf:null,
		muiInit:function(){
			_.init();
			
		//	this.updatePepleTimes();
		},
		onReady:function(){
			var that=this;
			var type=_.parseUrl("type")||0;
			if(type==2){
				window.location.href="old-sgf-preview.php"+document.location.search;
			}
			var elem = document.getElementById("board");
			that.player = new WGo.BasicPlayer(elem, {
				sgf: "(;FF[4]GM[1]SZ[19]CA[UTF-8]SO[弈客围棋])",
				layout: { 
					bottom: ["Control","CommentBox"]
				},
				board:{
					background:WGo.DIR+"board.jpg",
					marketStyle:"LB",
					clearMarker:true,
					otherCB: function(type) {
						that.timerSgf && clearInterval(that.timerSgf);
					}
				},
				kifuLoaded:function(e){
					var innerHeight = window.innerHeight;
					var innerWidth = window.innerWidth>640?640:window.innerWidth;
					document.getElementById("board").style.height =innerHeight-46+"px";
					var loadheight =  document.getElementById("btn_download").offsetHeight;
					var boxheight = innerHeight-innerWidth;
					document.getElementById("wgo-box-bottom").style.height=boxheight+"px";
				},
				enableWheel:false,
				lockScroll:false,
				enableKeys:false
			});
			that.player.setCoordinates(!that.player.coordinates);
			this.loadData();
			this.bindEvent();
		},
		loadData:function(){
			var that=this;
			var type=_.parseUrl("type")||0;
		//	var uri = _.consts.shareApiUri + "Share/GetLiveRoomSgf?id=" + _.parseUrl("Id") + "&type=" +type ;
			var uri = _.consts.requestServerUrl + "golive/detail/" + _.parseUrl("Id") + "/" +1 ;
			_.RequesetWS(uri,that.sucFn,that.errFn);
			if (type == 1) {
				that.timerSgf=setInterval(function(){
					_.RequesetWS(uri, that.sucFn, that.errFn)
				}, "3000");
			}
		},
		bindEvent:function(){
			var plat=_.checkPlatform();
			switch(plat){
				case 1:
					$("#btn_download").click(function(){
						win.location.href=win.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.indeed.golinks&g_f=991653";
					});
					break;
				case 2:
					$("#btn_download").click(function(){
						win.location.href=win.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.indeed.golinks&g_f=991653";
					});
					break;
				case 4:
					$("#btn_download").click(function(){
						win.location.href=win.location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.indeed.golinks&g_f=991653";
					});
					break;
				default:
					$("#btn_download").click(function(){
						win.location.href="http://www.golinksworld.com";
					});
					break;
			}
		},
		showTips:function(text){
			if(!text&&!isShow){
				text="当后退的时候，自动刷新会关闭，请点击此“刷新”最新棋谱";
				isShow=true;
			}
			$("#tips").html(text);
			$("#tips").show();
			setTimeout(function(){
				$("#tips").hide();
			},3000);
		},
		sucFn:function(data){
			var result=data.Result.live;
			if(result.GameResult!=""){
				clearInterval(win.goNews.timerSgf);
			}
			if(!win.goNews.isFirst){
				win.goNews.isFirst=true;
				var title="弈客直播 | ";
				title=title+result.GameName.replace(/<[^>]+>/g,"");//+result.BlackPlayer+"(黑) VS "+result.WhitePlayer+"(白)";
				document.getElementById("live_name").innerHTML='<i class="iconfont icon-zhibo"></i>'+result.GameName+"["+result.GameDate+"]";
				var html = template('online-chess-info', result);
				document.getElementById("online-player").innerHTML = html;
				
				
				wx.ready(function () {
					  var shareData = {
					    title: title,
					    desc:result.BlackPlayer+"(黑) VS "+result.WhitePlayer+"(白)",
					    link:"http://share.golinksworld.com/sgf-preview.php"+doc.location.search,
					    imgUrl: "http://img.golinksworld.com/system/logo/icon-120.png"
					  };
					   var shareDataST = {
					    title:title+",\n"+result.BlackPlayer+"(黑) VS "+result.WhitePlayer+"(白)",
					    desc:result.BlackPlayer+"(黑) VS "+result.WhitePlayer+"(白)",
					    link:"http://share.golinksworld.com/sgf-preview.php"+doc.location.search,
					    imgUrl: "http://img.golinksworld.com/system/logo/icon-120.png"
					  };
					  wx.onMenuShareAppMessage(shareData);
					  wx.onMenuShareTimeline(shareDataST);
					  wx.onMenuShareQQ(shareData);
					  wx.onMenuShareWeibo(shareData);
				});
			}
			win.goNews.info = result;
			win.goNews.loadSgf(result.Content||'(;GM[1]FF[4]CA[UTF-8]SZ[19])');
		},
		errFn:function(err){
		},
		loadSgf:function(sgf) {
			var that=this;
				if (!that.player.kifuReader) { //初次加载？
					that.player.loadSgf(sgf);
					that.player.last();
				} else {
					if ($(".wgo-info-overlay").css("display")) {
						return;
					}
					if (that.player.kifuReader.path.m == that.player.kifu.nodeCount) {
						that.player.loadSgf(sgf);
						that.player.last();
					} else {
						var pos = that.player.kifuReader.path.m;
						that.player.loadSgf(sgf);
						that.player.goToOffSet(pos);
					}
					that.currentpos = that.player.kifu.nodeCount;
				}
		},
	
	});
	win.goNews=new gonews();
	win.goNews.muiInit();
	_.ready(function(){
		win.goNews.onReady();
	});
})(mui,document,window,Zepto);
