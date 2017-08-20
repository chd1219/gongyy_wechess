/*
 * init.analyse.js
 * 自定义初始化
 * 2017-08-20
 * chd
 */

/*Websocket变量*/
var myws = null;
/*引擎信息缓存*/
var depthinfolist = [];
/*云库信息缓存*/
var cloudinfolist = [];
/*定义Websocket类*/
var MyWebsocket = function (url, bRec) {
	/*服务器地址*/
	this.url = url;
	/*是否解析返回数据*/
	var brec = bRec;
	/*Websocket实例*/
	var ws = null;	
	/*记录发送的消息*/
	var msg = "";
	/*超时计数*/
	var timeout = 0;
	/*判断服务器是否有数据返回*/
	var waitServer = !1;	
	  
	this.initWebsocket = function(){
		var wsImpl = window.WebSocket || window.MozWebSocket;
		ws = new ReconnectingWebSocket(this.url);
		ws.onmessage = function (evt) {
			if(brec){
				onMessage(evt.data);
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
    	this.mysend(e);
		if(e.match("position")){
			waitServer = !0;
			msg = e;
			computelist = [];
			depthinfolist = [];
			cleanComputerDetail();
		}else if (e.match("queryall")){
			chessdblist = [];
			cloudinfolist = [];
			cleanChessdbDetail();
		}
    }  
	this.mysend = function (e) {  
		if(ws){
    		if(e.match("position") || e.match("queryall")){
				var a = {};
				a.type = 1;
				a.isOffensive = isOffensive;
				a.isanalyse = isanalyse;
				b_autoset != 0 ? a.b_autoset = 1 : a.b_autoset = 0;
				r_autoset != 0 ? a.r_autoset = 1 : a.r_autoset = 0;
				a.index = movesIndex;
				a.isVerticalReverse = isVerticalReverse;
				a.command = e;
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
		waitServer = !1;
	}	
	this.onTime = function(){
		setInterval(CheckTimeout, 1000);	
	}  
	
}
CheckTimeout = function () {
		if(myws.waitServer){
			myws.timeout++;
			if(timeout%10 == 9){
				console.log(myws.timeout);
				console.log("服务器无返回,将重发");	
				myws.Send(msg);
			}		
		}	
	}
/*发送消息函数*/
sendMessage = function(e){
	myws.Send(e);
}
/*加载配置信息,根据模块自定义*/
loadConfig = function() {
	/*创建棋谱*/
	create();	
	/*初始化Websocket*/
    myws = new MyWebsocket('ws://120.55.37.210:9001/',!0);
    myws.initWebsocket();
    /*启动定时器，检查超时*/
    myws.onTime();
}
/*初始化结构布局*/
initLayer = function(e) {
	onload();
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
    $("#autoreplayBtn").on('tap', onAutoreplay),
    $("#prevBtn").on('tap', onReplayPrev),
    $("#nextBtn").on('tap', onReplayNext),
    $("#endBtn").on('tap', onReplayEnd),
    $("#regretBtn").on('tap', onRegret),
    $("#sendBtn").on('tap', onSend),
    $("#fullBtn").on('tap', onFullBroad),
    $("#clearBtn").on('tap', onCleanBroad),               
    $("#saveBtn").on('tap', onSave);      
}
