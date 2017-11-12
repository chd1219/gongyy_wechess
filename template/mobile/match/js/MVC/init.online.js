/*
 * init.online.js
 * 自定义初始化
 * 2017-11-01
 * chd
 */
var myws = null;
var timeout = 0;
var interval = 0;
var waitServer = !1;
var msg = "";
var isPlaying = !1;
var MyWebsocket = function (url, bRec) {  
	this.url = url;
	var brec = bRec;
	var ws = null;
	this.initWebsocket = function(){
		var wsImpl = window.WebSocket || window.MozWebSocket;
		ws = new ReconnectingWebSocket(this.url);
		//ws = new wsImpl(this.url);
		ws.onmessage = function (evt) {
			if(brec) {
				onMessage_online(evt.data);
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
    	ws.send(e);	
//  	msg = e;
//  	this.mysend(e);
//		waitServer = !0;		
    }  
	this.mysend = function (e) {  
		if(ws){
    		setTimeout(function () {
				var command = new commandhistory;
				command.index = movesIndex;
				command.board = e;
				command.result = [];
				comm.historylist[movesIndex] = command;
				var a = {};
				a.type = 2;
				a.myhold = myhold;
				a.index = movesIndex;
				a.isVerticalReverse = isVerticalReverse;
				a.command = e;
				var o = JSON.stringify(a);
				var _json = {"id": uuid, "msg": o};						
				//ws.send(o);	
				console.log(o);
			}, 1000);	
    	}        
	}
	this.Return = function () {  
		timeout = 0;
		waitServer = !1;
	}
}; 
function CheckReturn() {
	if(waitServer){
		timeout++;
		if(timeout%10 == 9){
			console.log(timeout);
			console.log("服务器无返回,将重发");	
			myws.mysend(msg);
		}		
	}	
}
function sendMessage(e){
	move = e.src.x+""+e.src.y+e.dst.x+e.dst.y;
	myws.Send("bestmove "+move);
	console.log(move);

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
   // mui('#delete').popover('toggle');  
 
    mode = playmode.ONLINE;    
	cleanChess();
	/*初始化*/
    myws = new MyWebsocket('ws://118.190.46.210:9011/',!0);
    myws.initWebsocket();
	setTimeout((function(){myws.Send("roomid="+room_id);}),1000);

}
onMessage_online = function(d) {
	console.log(d);
	if(d.match("close")){
		showFloatTip("玩家退出！", 2000);
	}
	
	if(d.match("player")){
		var e = d.split("player "); 
		if(e[1] == "1") {
			showFloatTip("执红", 2000);
			waitServerPlay = !1,
			onFullBroad();
		}
		else if(e[1] == "2") {
			showFloatTip("执黑", 2000);
			waitServerPlay = !0;
			isVerticalReverse = 1;
			comm.map = comm.arrReverse(comm.map);
			cleanChess();
			comm.init(3, comm.map, !0);
		}
	}
	
	if(d.match("isready")){
		var count = 0;
		waitingset = setInterval(function(){
			if(count++ < 10){
				showFloatTip(11-count,500);
			}
			else{
				clearInterval(waitingset);
			}
		},1000)
	}
	
	if(d.match("running")){

	}
	
	if(d.match("waiting")){		
		showFloatTip("分享给朋友邀请他来下棋", 2000);
	}
	
	if(d.match("move")){
		var e = d.split("move "); 
		var step = e[1]; 	

        if (!step) return void(waitServerPlay = !0);		

		step = comm.reverseStep(step);
		
		move = comm.Step2XY(step);
		Player.selected(move.src);
        var key = comm.map[move.src.y][move.src.x];
        comm.nowManKey = key;
        key = comm.map[move.dst.y][move.dst.x];
        type = 0;
		{
			key ? setTimeout(Player.AIclickMan, 1000, move.dst,type) : setTimeout(Player.AIclickPoint, 1000, move.dst,type);
		
		}

		setTimeout((function(){
			Player.cancleSelected();
		}),1000);
	}
	 
};

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
    $("#autoreplayBtn").on('tap', onAutoreplay),
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

	if (myhold == 'red') {
		computerHold = RED;
		
		$("#black").hide();		
    }
    else {
    	onReverse();
    	computerHold = BLACK;
       	$("#red").hide();		
    }

	$("#restartli").show();		
	
	timingBegins = !0;
	isPlaying = !0;
	/*棋手计时*/
    OnTimer();
}
