var myws = null;
var mywstest = null;
var timeout = 0;
var interval = 0;
var waitServer = !1;
var msg = "";
var MyWebsocket = function (url, bRec) {  
	this.url = url;
	var brec = bRec;
	var ws = null;
	this.initWebsocket = function(){
		var wsImpl = window.WebSocket || window.MozWebSocket;
		ws = new ReconnectingWebSocket(this.url);
		ws.onmessage = function (evt) {
			if(brec){
				e = evt.data;
				result = e;
				if (isJSON(e)){
					var obj = JSON.parse(e); //由JSON字符串转换为JSON对象
					ParseMsg(obj); 
				}	
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
		console.log(timeout);
		if(timeout%10 == 9){
			console.log("服务器无返回,将重发");	
			myws.mysend(msg);
		}		
	}	
}
function sendMessage(e){
	myws.Send(e);
}
function DealQueryall(obj) {
	var e = (obj.result).split("|");
	cleanChessdbDetail();		
	if (e[0].match("stalemate") || e[0].match("checkmate")) {
		showFloatTip("绝杀！");
		return;
	}				
	if (e[0].match("unknown") || e[0].match("invalid board")){
		return;			
	}
	var tmpStr = new String();	
	chessdblist = [];
	for (i=0;i<e.length && i<10;i++) {	
		var tempmap = comm.arr2Clone(play.map);
		var o = e[i].split(",");
		a = o[0].split("");			
		n = play.transformat(a);	
		chessdblist.push(n);
		p = comm.createMove(tempmap,n[0],n[1],n[2],n[3]);
		tmpStr += "<tr style=\"height:40px;\"><td>"+ p +"</td><td>"+ o[2] +"</td><td>"+ o[1] +"</td><td><input type=\"Button\" onclick='play.onmdownchessdblist(\""+i+"\")' value=\"立即出招\"></td></tr>";
	}	
	if(document.getElementById("chessdbDetailTbody")){ 
		document.getElementById("chessdbDetailTbody").innerHTML = tmpStr;
	}
}
function DealPosition(obj) {
	d = obj.result;
	if(d.match("bestmove ")){
		var e = d.split("bestmove "); 
		//回调返回函数
		myws.Return();
		if(e[1].match("null") || e[1].match("none")){
			play.my == 1 ? play.onGameEnd(-1) : play.onGameEnd(1);
			bill.my = -bill.my;
			play.my = -play.my;			
			return;
		}
		var o = e[1].split(""); 
		var a = [];
		a = play.transformat(o);			
		play.aiPace = a;		
		if(!isanalyse){
			setTimeout((function(){play.serverAIPlay();}),200);
		}		
	}		
	else if (d.length > 16){
		var e = d.split(" ");
		var depth = e[2],
		seldepth = e[4],
		multipv = e[6],		
		nodes = e[10],
		nps = e[12],
		tbhits = e[14],
		time = e[16] / 1000;
		score = e[8];
		if (isOffensive == movesIndex%2) {
			score = -score;
		}		

		var tempmap = comm.arr2Clone(play.map);
		if (depth == 1) {
			computelist = [];
			cleanComputerDetail();
		}

		if (depth > 0) {
			var pv = [],
			a = [];

			var tmpStr = new String();
			var setting = new String();
			for (var pvseek = 17; pvseek < e.length; pvseek++) {
				if (e[pvseek] == "pv")
					break;
			}
			bill.cleanLine();
			for (j = 0; (j + pvseek) < e.length && j<4; j++) {
				i = j + pvseek + 1;
				if (e[i]) {
					a = e[i].split("");					
					o = play.transformat(a);					
					computelist.push(o);
					pv[j] = comm.createMove(tempmap, o[0], o[1], o[2], o[3]);
					tmpStr = tmpStr + pv[j] + " ";
					//走法提示
					if (isVerticalReverse) {
						o[0] = 8-o[0];
						o[1] = 9-o[1];
						o[2] = 8-o[2];
						o[3] = 9-o[3];
					}
					if (isanalyse) {
						if (j==0) {
							bill.drawLine2(o,1);
						}
						if (j==1) {
							bill.drawLine2(o,2);
						}
					}
				}				
			}
			setting = "<td> </td>";
			tmpStr = "<tr><td>" + (depth / 32).toFixed(2) + "</td><td>" + score + "</td><td>" + tmpStr + "</td>" + setting + "</tr>";
			if(document.getElementById("computerDetailTbody")){ 
				document.getElementById("computerDetailTbody").innerHTML = tmpStr + document.getElementById("computerDetailTbody").innerHTML;
			} 			
		}
	}
}
function ParseMsg(obj) {
	if(!waitServerPlay) return;
	
	if(Number(obj.index) != movesIndex) return;
	switch(obj.commandtype){
		case "queryall":
			DealQueryall(obj);
			break;
		case "position":
			DealPosition(obj);
			break;
		default:
			break;
	}	
}

function loadConfig() {
	comm.initChess(comm.emptyMap);
	setEnable("prevBtn", !1);
	setEnable("nextBtn", !1);
	setEnable("firstBtn", !1);
	setEnable("endBtn", !1);

	bill.pace = [];
	bill.resizeCanvas();
	createbroad = !1;
	comm.init();
	bill.init(3, bill.map, !0);
	play.map = bill.map;
	movesIndex = 0
    //方便用户设置
    mui('#delete').popover('toggle');
    
    //初始化
    myws = new MyWebsocket('ws://120.55.37.210:9002/',!0);
    myws.initWebsocket();
    //启动定时器，检查超时
    interval = setInterval(CheckReturn, 1000);	
}

function initLayer(e) {
    initCanvas(e);
    onload(),
    loadConfig();
    bill.replayBtnUpdate();
}

onload = function() {
    comm.dot = {
        dots: []
    },
    comm.mans = {},
	
    $("#isOffensiveBtn").on('tap',bill.offensive),
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
	$("#regretBtn").on('tap',bill.regret),
	$("#sendBtn").on('tap',bill.send),
	$("#fullBtn").on('tap',bill.fullBroad),
	$("#clearBtn").on('tap',bill.cleanBroad),				
	$("#saveBtn").on('tap',bill.save);		
};

function Setting() {
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
		bill.my = -1;
		bill.reverse();
		play.map = bill.map;
		play.rAIPlay();
		$("#black").hide();		
    }
    else {
    	bill.my = 1;
    	$("#red").hide();		
    }

	$("#restartli").show();		   
}

function showLevel(e){
	for (i=0;i<7;i++) {
		level = "level-"+i;
		if(!level.match(e)){
			$("#"+level).hide();	
		} 
	}
}