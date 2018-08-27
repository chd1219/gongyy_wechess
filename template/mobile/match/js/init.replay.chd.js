var ws = null;
function initWebsocket(){
	var wsImpl = window.WebSocket || window.MozWebSocket;
	// create a new websocket and connect
	window.ws = new ReconnectingWebSocket('ws://114.55.174.231:9003/');
	if (ws.readyState == 3) {
		alert("连接服务器失败");
	}
	// when data is comming from the server, this metod is called
	ws.onmessage = function (evt) {
		heartCheck.reset();
		play.ParseMsg(evt.data);	
	};
	// when the connection is established, this method is called
	ws.onopen = function () {
		//heartCheck.start();
	};
	// when the connection is closed, this method is called
	ws.onclose = function () {
         console.log("服务断开，请重试！");
	}	
	// when the connection is error, this method is called
	ws.onerror = function () {
         console.log("服务断开，请重试！");
	}	
}
function sendMessage(e){
	if(!ws) return;
	ws.send(e);
}
function loadConfig() {
	file = getUrlParam("file"),
    level_id = getUrlParam("level_id");
    __getChessData(chessdata);	
}

var __getChessData = function(e) {
	serverData = e;
	if(serverData.BillType){
		var a;
		serverData.map ? ( comm.isPVP = !1, a = comm.parseMap(serverData.map)) : ( comm.isPVP = !0, comm.pvpTitle = serverData.meta.FUPAN_GAMESCENE_NAME, a = comm.initMap.concat(), 1 == serverData.meta.FUPAN_CHESS_COLOR && a.reverse()),
		serverData.meta && serverData.meta.FUPAN_TITLE ? chapterTitle = serverData.meta.FUPAN_TITLE: (chapterTitle = "棋谱中心", console.log(chapterTitle)),
		document.title = chapterTitle;
		var m = comm.parseMovesEx(serverData.moves);
		comm.movesNum = m.length,
		comm.parseNote(serverData.notes);
		comm.initChessEx(a, m);	
		createbroad = !1;
		bill.map = a;
		bill.cMap = comm.arr2Clone(bill.map),
		bill.cleanChess(),
		bill.init(3,bill.map,!0);
		bill.cleanChess2();
		play.map = bill.map;
		play.mans = comm.mans;		
		play.isFoul = !1,
		movesIndex = 0,
		play.pace = [],
		firststepman = bill.map[m[0][0][0][1]][m[0][0][0][0]];
		play.mans[firststepman].my == 1 ? bill.isOffensive = !0 : (bill.isOffensive = !1,showFloatTip("黑方先手"));
		bill.replayBtnUpdate();
		mode = MODE_BILLREPLAY;
		showBtns();
		$("#sendBtn").hide();
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < bill.map[i].length; j++) {
				if (bill.map[i][j] == 'j0') {							
	                $("#verticalreverseTog").addClass('mui-active');
	                $("#verticalreverseTog").html('<div class="mui-switch-handle" style="transition-duration: 0.2s; transform: translate(43px, 0px);"></div>');
          			return;
				}
			}
			
		}
	}
	else{
		var a;
		serverData.map ? ( comm.isPVP = !1, a = comm.parseMap(serverData.map)) : ( comm.isPVP = !0, comm.pvpTitle = serverData.meta.FUPAN_GAMESCENE_NAME, a = comm.initMap.concat(), 1 == serverData.meta.FUPAN_CHESS_COLOR && a.reverse()),
		serverData.meta && serverData.meta.FUPAN_TITLE ? chapterTitle = serverData.meta.FUPAN_TITLE: (chapterTitle = "空章节标题", console.log(chapterTitle)),
		document.title = chapterTitle;
		var m = comm.parseMoves(serverData.moves);
		comm.movesNum = m.length,
		comm.initChess(a, m);
		var o = new res.ReplayTip;
		o.x = 116,
		o.y = 296,
		comm.chessTopLayer.parent.addChild(o),
		comm.replayTip = o,
		comm.replayBtnUpdate(),
		mode = MODE_REPLAY;
		showBtns();
	}        
}

function initLayer(e) {
    initCanvas(e);
    onload(),
    loadConfig()
}
function analyse() {
	
	window.location.href="http://westudy.chinaxueyun.com/app/index.php?i=5&c=entry&op=analyse&do=publish&m=gongyy_wechess&fen="+comm.getBoard()+"&reverse="+comm.getReverse();
//	initWebsocket();
//	mode = 5;
//	isanalyse = 1;
//	playmode = 4;
//	tmpmovesIndex = movesIndex;
//	tmpId = currentId;
//	tmppaceEx = comm.arr2Clone(bill.paceEx);
// 	$("#board").css({"top":"50px"});
//	$("#analyse").hide();
//	$("#exit_analyse").show();
//	$("#liveroom-info").hide();
//	$("#mui-toast-container").hide();	 
//	$(".wgo-commentbox").hide();	 
//	$(".mode4").show();
//	bill.replayBtnUpdate();
}
function exitanalyse() {
	if (ws) {
		ws.close();
		ws = null;
	}
	bill.cleanLine();
	mode = 2;
	isanalyse = 0;
	playmode = 1;
	movesIndex = tmpmovesIndex;
	currentId = tmpId;
	bill.paceEx = comm.arr2Clone(tmppaceEx);
	moves = bill.getMoves4Server(-1);
	bill.cleanChess();
	isVerticalReverse ? bill.init(3, comm.arrReverse(bill.cMap), !0) : bill.init(3, bill.cMap, !0);
	for (var e = 0; e < movesIndex ; e++) {
		bill.stepPlay(moves[e].src, moves[e].dst, !0);
	}
	bill.replayBtnUpdate();
	
	$("#board").css({"top":"0px"});
	$("#exit_analyse").hide();
	$("#analyse").show();
	$("#liveroom-info").show();
	$("#mui-toast-container").show();	 
	$(".wgo-commentbox").show();	
	$(".mode4").hide(); 
}
onload = function() {
    comm.dot = {
        dots: []
    },
    comm.mans = {},
    $("#blackautoplayBtn").on('tap',bill.bPlay),
    $("#redautoplayBtn").on('tap',bill.rPlay),
    $("#soundBtn").on('tap',bill.sound),
	$("#verticalreverseBtn").on('tap',bill.reverse),	
	$("#noteBtn").on('tap',bill.note),	
	$("#firstBtn").on('tap',bill.replayFirst),
	$("#autoreplayBtn").on('tap',bill.autoreplay),
	$("#prevBtn").on('tap',bill.replayPrev),
    $("#nextBtn").on('tap',bill.replayNext),
    $("#endBtn").on('tap',bill.replayEnd),
	$("#sendBtn").on('tap',bill.send),
	$("#fullBtn").on('tap',bill.fullBroad),
	$("#clearBtn").on('tap',bill.cleanBroad),				
	$("#saveBtn").on('tap',bill.save);			
	$("#analyse").on('tap',analyse);		
	$("#exit_analyse").on('tap',exitanalyse);		
};