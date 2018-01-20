/*
 * init.analyse.js
 * 自定义初始化
 * 2017-08-20
 * chd
 */

/*Websocket变量*/
var myws = null;
/*超时计数*/
var timeout = 0;
/*记录发送的消息*/
var msg = "";
/*定义Websocket类*/
var MyWebsocket = function (url, bRec) {
	/*服务器地址*/
	this.url = url;
	/*是否解析返回数据*/
	var brec = bRec;
	/*Websocket实例*/
	var ws = null;		
	  
	this.initWebsocket = function(){
		var wsImpl = window.WebSocket || window.MozWebSocket;
		ws = new ReconnectingWebSocket(this.url);
		ws.onmessage = function (evt) {
			if(brec) {
				onMessage(evt.data);
				//console.log(evt.data);
			}			
		}
		ws.onopen = function () {
		}
		ws.onclose = function () {
		}			
		ws.onerror = function () {
		}	
	}
    this.Send = function (e) {      	
		if(e.match("position")){
			var command = new commandhistory;
			command.index = movesIndex;
			command.board = e;
			command.result = [];
			comm.historylist[movesIndex] = command;
			msg = e;
			computelist = [];
			depthinfolist = [];
			cleanComputerDetail();
		}else if (e.match("queryall")) {
			chessdblist = [];
			cloudinfolist = [];
			cleanChessdbDetail();
		}
		this.mysend(e);
    }  
	this.mysend = function (e) {  
		if(ws){
    		if(e.match("position") || e.match("queryall")){
				var a = {};
				a.type = 1;
				a.uuid = uuid;
				a.isOffensive = comm.isOffensive;
				a.isanalyse = isanalyse;
				b_autoset != 0 ? a.b_autoset = 1 : a.b_autoset = 0;
				r_autoset != 0 ? a.r_autoset = 1 : a.r_autoset = 0;
				a.index = movesIndex;
				a.isVerticalReverse = isVerticalReverse;
				a.command = e;
				a.time = new Date().getTime();
				var o = JSON.stringify(a);

				if(e.match("position")){
					var _json = {"id": uuid, "msg": o};
	
					$.ajax({
						type: "POST",
						url: "http://westudy.chinaxueyun.com/addons/gongyy_wechess/template/mobile/match/php/position.php",
						dataType: "json",
						data: _json,
						success: function (data) {
							if(data.length > 0) {
								console.log("position-redis");
								for(var i=0;i<data.length;i++) {
									comm.DealMessage(data[i]);
								}
								//waitServerPlay = !1;
							}
							else {
								console.log("engineer");
								ws.send(o);
							}
						},
						error: function (response, status, xhr) {
							ws.send(o);
						}
					})			
				}
				else {					
					var _json = {"id": uuid, "msg": o};
					/*查询云库*/
					$.ajax({
						type: "POST",
						url: "http://westudy.chinaxueyun.com/addons/gongyy_wechess/template/mobile/match/php/queryall.php",
						dataType: "json",
						data: _json,
						success: function (data) {
							if(data.length > 0) {
								console.log("queryall-redis");
								comm.DealQueryall(data);
							}
							else {
								console.log("chessdb");
								ws.send(o);
							}
						},
						error: function (response, status, xhr) {
							ws.send(o);
						}
					})			
				}
			}
			else{
				ws.send(e);
			}
    	}        
	}	
	this.rebackerror = function (e) {  
		if(ws){
    		if(e.match("position") || e.match("queryall")){
				var a = {};
				a.type = 1;
				a.isOffensive = comm.isOffensive;
				a.isanalyse = isanalyse;
				b_autoset != 0 ? a.b_autoset = 1 : a.b_autoset = 0;
				r_autoset != 0 ? a.r_autoset = 1 : a.r_autoset = 0;
				a.index = movesIndex;
				a.isVerticalReverse = isVerticalReverse;
				a.command = e;
				a.time = new Date().getTime();
				var o = JSON.stringify(a);
				ws.send(o);
			}
			else{
				ws.send(e);
			}
    	}        
	}	
	this.Return = function () {  
		timeout = 0;
	}		
}
/*检查超时*/
CheckTimeout = function () {
	if(waitServerPlay){
		timeout++;
		if(timeout%10 == 9){
			console.log(timeout);
			myws.Send(msg);
			if(timeout == 29) {
				showFloatTip("请求人数太多，10s后重试");
			}
			if(timeout == 59){
				showFloatTip("服务器响应超时！，请联系管理员");
			}
		}		
		
	}	
}
/*发送消息函数*/
sendMessage = function(e){
	myws.Send(e);
	console.log(e);
}
/*加载配置信息,根据模块自定义*/
loadConfig = function() {
	/*创建棋谱*/
	onCreate();	
	/*初始化Websocket*/
    myws = new MyWebsocket('ws://47.96.137.194:9001/',!0);
    myws.initWebsocket();
    /*启动定时器，检查超时*/
    interval = setInterval(CheckTimeout, 1000);	
}
/*初始化结构布局*/
initLayer = function(e) {
	onload();
	mode = playmode.EDITBOARD;
	initialization(e);    
    loadConfig(); 

}
/*预加载*/
onload = function() {
    $("#isOffensiveBtn").on('tap', onOffensive),
    $("#analyseBtn").on('tap', onAnalyse),
    $("#blackautoplayBtn").on('tap', onBluePlay),
    $("#redautoplayBtn").on('tap', onRedPlay),
    $("#soundBtn").on('tap', onSound),
    $("#verticalreverseBtn").on('tap', onReverse),    
    $("#noteBtn").on('tap', onNote),  
    $("#editboardBtn").on('tap', onEditboard),  
    $("#firstBtn").on('tap', onReplayFirst),
    $("#autoreplayBtn").on('tap', OnshowArrow),
    $("#prevBtn").on('tap', onReplayPrev),
    $("#nextBtn").on('tap', onReplayNext),
    $("#endBtn").on('tap', onReplayEnd),
    $("#regretBtn").on('tap', onRegret),
    $("#sendBtn").on('tap', onSend),
    $("#errordataBtn").on('tap', onErrordata),
    $("#reveseBtn").on('tap', onReverse),    
    $("#fullBtn").on('tap', onFullBroad),
    $("#clearBtn").on('tap', onCleanBroad),               
    $("#saveBtn").on('tap', onSave);      
}
function Setting() {
	timingBegins = !0;
	showThink();
}