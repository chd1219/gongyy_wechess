var myws = null;
var mywstest = null;
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
    	msg = e;
    	this.mysend(e);
		waitServer = !0;		
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
					a.computer = computer;
					a.power = power;
					a.index = movesIndex;
					a.isVerticalReverse = isVerticalReverse;
					a.command = e;
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
	myws.Send(e);
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
    
    //初始化
    myws = new MyWebsocket('ws://120.55.37.210:9002/',!0);
    myws.initWebsocket();
    //启动定时器，检查超时
    interval = setInterval(CheckReturn, 1000);	
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
    $("#autoreplayBtn").on('tap', onAutoreplay),
    $("#prevBtn").on('tap', onReplayPrev),
    $("#nextBtn").on('tap', onReplayNext),
    $("#endBtn").on('tap', onReplayEnd),
    $("#regretBtn").on('tap', onRegret),
    $("#sendBtn").on('tap', onSend),
    $("#fullBtn").on('tap', onFullBroad),
    $("#clearBtn").on('tap', onCleanBroad),               
    $("#saveBtn").on('tap', onSave);      	
};

function Setting() {
	if (isPlaying) return;
	switch (power){
		case 'level-0':
		{
			showFloatTip("六级棋士");
			break;
		}
		case 'level-1':
		{
			showFloatTip("五级棋士");
			break;
		}
		case 'level-2':
		{
			showFloatTip("四级棋士");
			break;
		}
		case 'level-3':
		{
			showFloatTip("三级棋士");
			break;
		}
		case 'level-4':
		{
			showFloatTip("二级棋士");
			break;
		}
		case 'level-5':
		{
			showFloatTip("一级棋士");
			break;
		}
		case 'level-6':
		{
			showFloatTip("棋协大师");				
			break;
		}
	}
	
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
	showThink();
}

function showLevel(e){
	for (i=0;i<7;i++) {
		level = "level-"+i;
		if(!level.match(e)){
			$("#"+level).hide();	
		} 
	}
}