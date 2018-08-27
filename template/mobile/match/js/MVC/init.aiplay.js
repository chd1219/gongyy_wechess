/*
 * init.aiplay.js
 * 自定义初始化
 * 2017-08-20
 * chd
 */
var myws = null;
var mywstest = null;
var timeout = 0;
var interval = 0;
var msg = "";
var isPlaying = !1;
var MyWebsocket = function (url, bRec) {  
	this.url = url;
	var brec = bRec;
	var ws = null;
	this.initWebsocket = function(){
		var wsImpl = window.WebSocket || window.MozWebSocket;
		ws = new ReconnectingWebSocket(this.url);
		ws.onmessage = function (evt) {
			if(brec) {
				onMessage(evt.data);
			}	
		}
		ws.onopen = function () {
			var a = {};
				a.type = 0;
				a.uuid = uuid;	
				a.index = movesIndex;
				a.command = "";
				a.ua = navigator.userAgent;
				a.time = new Date().getTime();
				var o = JSON.stringify(a);
				ws.send(o);
		}
		ws.onclose = function () {
		}			
		ws.onerror = function () {
		}	
	}
    this.Send = function (e) {  
    	msg = e;
    	this.mysend(e);
    }  
	this.mysend = function (e) {  
		if(ws){
    		setTimeout(function () {
				if(e.match("position")){
					var command = new commandhistory;
					command.index = movesIndex;
					command.board = e;
					command.result = [];
					comm.historylist[movesIndex] = command;
					var a = {};
					a.type = 0;
					a.uuid = uuid;
					a.computer = computer;
					a.power = power;
					a.index = movesIndex;
					a.isVerticalReverse = isVerticalReverse;
					a.command = e;
					a.bcache = true;
					a.zobristKey = getKey(e.substring(13));
					console.log(a.zobristKey);
					a.time = new Date().getTime();
					var o = JSON.stringify(a);		
					ws.send(o);
					var _json = {"id": uuid, "msg": o};	
					$.ajax({
						type: "POST",
						url: "http://westudy.chinaxueyun.com/addons/gongyy_wechess/template/mobile/match/php/position.php",
						dataType: "json",
						data: _json,
						success: function (data) {
							
						},
						error: function (response, status, xhr) {
							
						}
					})								
				}	
				else{
					ws.send(e);
				}
			}, 1000);	
    	}        
	}
	this.Return = function () {  
		timeout = 0;
	}
}; 
var MyTestWebsocket = function (url, bRec) {  
	this.url = url;
	var brec = bRec;
	var ws = null;
	this.initWebsocket = function(){
		var wsImpl = window.WebSocket || window.MozWebSocket;
		ws = new ReconnectingWebSocket(this.url);
		ws.onmessage = function (evt) {
			if(brec) {
				onMessage(evt.data);
			}	
		}
		ws.onopen = function () {
			if(uuid.length > 0 ){
				ws.send(uuid);
			}			
		}
		ws.onclose = function () {
			console.log("onclose");
		}			
		ws.onerror = function () {
		}	
	}
    this.Send = function (e) {  
    	msg = e;
    	this.mysend(e);
    }  
	this.mysend = function (e) {  
		if(ws){
    		setTimeout(function () {
				if(e.match("position")){
					var command = new commandhistory;
					command.index = movesIndex;
					command.board = e;
					command.result = [];
					comm.historylist[movesIndex] = command;
					var a = {};
					a.type = 0;
					a.uuid = uuid;
					a.computer = computer;
					a.power = power;
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
			}, 1000);	
    	}        
	}
	this.Return = function () {  
		timeout = 0;
	}
}; 
function CheckReturn() {
	if(waitServerPlay){
		timeout++;
		if(timeout%10 == 9){
			console.log(timeout);
			console.log("服务器无返回,将重发");	
			myws.mysend(msg);
			if(timeout == 29) {
				showFloatTip("请求人数太多，10s后重试");
			}
			if(timeout == 59){
				showFloatTip("服务器响应超时！，请联系管理员");
			}
		}		
	}	
}
function sendMessage(e){
	myws.Send(e);
//	mywstest.Send(e);
	console.log(e);
}
function loadConfig() {
	setEnable("prevBtn", !1);
	setEnable("nextBtn", !1);
	setEnable("firstBtn", !1);
	setEnable("endBtn", !1);

	comm.pace = [];
	resizeCanvasAI();
	comm.isPlay = !0;
	movesIndex = 0
    //方便用户设置
    mui('#delete').popover('toggle');   
    
    mode = playmode.AIPLAY;    
}

function initLayer(e) {
	onload();
	initialization(e);    
    loadConfig(); 
    replayBtnUpdate();	
}

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
    $("#autoreplayBtn").on('tap', OnshowAIInfo),
    $("#prevBtn").on('tap', onReplayPrev),
    $("#nextBtn").on('tap', onReplayNext),
    $("#endBtn").on('tap', onReplayEnd),
    $("#regretBtn").on('tap', onRegret),
    $("#errordataBtn").on('tap', onErrordata),
    $("#sendBtn").on('tap', onSend),
    $("#fullBtn").on('tap', onFullBroad),
    $("#clearBtn").on('tap', onCleanBroad),               
    $("#saveBtn").on('tap', onSave);      	
};

function Setting() {
	if (isPlaying) return;
	var PlayLevel = {'level-0':"六级棋士",'level-1':"五级棋士",'level-2':"四级棋士",'level-3':"三级棋士",'level-4':"二级棋士",'level-5':"一级棋士",'level-6':"棋协大师"};
	showFloatTip(PlayLevel[power]);	
	setTimeout((function () {
        showFloatTip("隐藏提示");
    }), 1000);
    /*初始化Websocket*/  
	var ishttps = 'https:' == document.location.protocol ? true: false;

	if(ishttps){	
		if(power == 'level-6'){
		    myws = new MyWebsocket('wss://chessai.chinaxueyun.com:9003/',!0); 
		}
		else{
		    myws = new MyWebsocket('wss://chessai.chinaxueyun.com:9004/',!0);
		}
	}else{	
		if(power == 'level-6'){
		    myws = new MyWebsocket('ws://47.96.26.54:9001/',!0);	    
		}
		else{
		    myws = new MyWebsocket('ws://47.96.26.54:9002/',!0);
		}	
	}
    myws.initWebsocket();
	/*启动定时器，检查超时*/
    interval = setInterval(CheckReturn, 1000);	    
    
	showLevel(power);
    
	if (computer == 'red') {
		computerHold = RED;
		onReverse();
		Player.AIPlay();
		$("#black").hide();		
    }
    else {
    	computerHold = BLACK;
       	$("#red").hide();		
    }

	$("#restartli").show();		
	
	timingBegins = !0;
	isPlaying = !0;
	/*棋手计时*/
    OnTimer();
}

function showLevel(e){
	for (i=0;i<7;i++) {
		level = "level-"+i;
		if(!level.match(e)){
			$("#"+level).hide();	
		} 
	}
}