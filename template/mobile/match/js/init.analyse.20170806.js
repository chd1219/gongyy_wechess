/*Websocket变量*/
var myws = null;
/*测试Websocket变量*/
var mywstest = null;
/*超时计数*/
var timeout = 0;
/*计时器*/
var interval = 0;
/*判断服务器是否有数据返回*/
var waitServer = !1;
/*记录发送的消息*/
var msg = "";
/*引擎信息缓存*/
var depthinfolist = [];
/*云库信息缓存*/
var cloudinfolist = [];
/*定义Websocket类*/
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
}
/*判断是否超时*/
function CheckTimeout() {
	if(waitServer){
		timeout++;		
		if(timeout%10 == 9){
			console.log(timeout);
			console.log("服务器无返回,将重发");	
			myws.mysend(msg);
		}		
	}	
}
/*发送消息函数*/
function sendMessage(e){
	myws.Send(e);
//	mywstest.Send(e);
}
/*定义引擎信息的数据结构*/
var depthinfo = function(d){
	var e = d.split(" ");
	this.depth = (e[2] / 32).toFixed(2),
	this.seldepth = e[4],
	this.multipv = e[6],		
	this.nodes = e[10],
	this.nps = e[12],
	this.tbhits = e[14],
	this.time = e[16] / 1000;
	this.score = parseInt(e[8]);
	this.pv = [];
	for (var pvseek = 17; pvseek < e.length; pvseek++) {
		if (e[pvseek] == "pv") {
			for (var i=pvseek+1;i<e.length; i++) {
				this.pv[i-pvseek-1] = e[i];
			}
			break;
		}
	}
}
/*定义云库信息的数据结构*/
var cloudinfo = function(d){
	var e = d.split(",");
	this.move = e[0],
	this.score = parseInt(e[1]),	
	this.rank = e[2],
	this.note = e[3];
}
/*解析返回的云库信息*/
function DealQueryall(obj) {
	var e = (obj.result).split("|");				
	if (e[0].match("stalemate") || e[0].match("checkmate")) {
		showFloatTip("绝杀！");
		//回调返回函数
		myws.Return();
		return;
	}				
	if (e[0].match("unknown") || e[0].match("invalid board")){
		return;			
	}
	var tmpStr = new String();		
	for (i=0;i<e.length && i<10;i++) {	
		var info = new cloudinfo(e[i]);
		cloudinfolist.push(info);
		var tempmap = comm.arr2Clone(play.map);		
		a = info.move.split("");			
		n = play.transformat(a);	
		var move = comm.createMove(tempmap,n[0],n[1],n[2],n[3]);
		tmpStr += "<tr><td>"+ move +"</td><td>"+ info.rank +"</td><td>"+ info.score +"</td><td>"+ info.note +"</td></tr>";
	}	
	if(document.getElementById("chessdbDetailTbody")){ 
		document.getElementById("chessdbDetailTbody").innerHTML = tmpStr;
	}
}
/*解析返回的引擎信息*/
function DealPosition(obj) {
	d = obj.result;
	if(d.match("bestmove ")){
		var e = d.split("bestmove "); 
		var move = e[1];
		/*回调返回函数*/
		myws.Return();
		if(move.match("null") || move.match("none")){
			play.my == 1 ? play.onGameEnd(-1) : play.onGameEnd(1);
			bill.my = -bill.my;
			play.my = -play.my;		
			return;
		}
		
		if(!isanalyse){
			/*对比引擎和云库结果，取分数最大的走法*/
			var max = 0;
			for (var i=0;i<cloudinfolist.length && i<1;i++) {
				var info = cloudinfolist[i];
				if (1 == movesIndex%2) {
					info.score = -info.score;
				}	
				if(max < info.score){
					max = info.score;
					move = info.move;
				}			
			}
			for (var i=0;i<depthinfolist.length && i<1;i++) {
				var info = depthinfolist[depthinfolist.length-1-i];
				if(max < info.score){
					max = info.score;
					move = info.pv[0];
				}				
			}
			var o = move.split(""); 
			var aiPace = [];
			aiPace = play.transformat(o);
			play.aiPace = aiPace;
			setTimeout((function(){play.serverAIPlay();}),200);
		}		
	}		
	else if (d.length > 16){
		var info = new depthinfo(d);
		depthinfolist.push(info);
		if (isOffensive == movesIndex%2) {
			info.score = -info.score;
		}				
		var tempmap = comm.arr2Clone(play.map);
		var a = [];
		var tmpStr = "";
		bill.cleanLine();
		for (j = 0; j < info.pv.length && j<4; j++) {
			if (info.pv[j]) {
				a = info.pv[j].split("");					
				var o = play.transformat(a);					
				computelist.push(o);
				var move = comm.createMove(tempmap, o[0], o[1], o[2], o[3]);
				tmpStr = tmpStr + move + " ";
				/*走法提示*/
				if (isVerticalReverse) {
					o[0] = 8-o[0];
					o[1] = 9-o[1];
					o[2] = 8-o[2];
					o[3] = 9-o[3];
				}
				if (isanalyse && j<2) {
					bill.drawLine2(o,j+1);
				}
			}				
		}				
		if(document.getElementById("computerDetailTbody")){ 
			tmpStr = "<tr><td>" + info.depth + "</td><td>" + info.score + "</td><td>" + tmpStr + "</td></tr>";
			document.getElementById("computerDetailTbody").innerHTML = tmpStr + document.getElementById("computerDetailTbody").innerHTML;
		} 		
	}		
}
/*解析返回信息*/
function ParseMsg(obj) {
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
/*加载配置信息*/
function loadConfig() {
    comm.initChess(comm.initMap);
	bill.create();	
	/*初始化Websocket*/
    myws = new MyWebsocket('ws://120.55.37.210:9001/',!0);
    myws.initWebsocket();
	/*启动定时器，检查超时*/
    interval = setInterval(this.CheckTimeout, 1000);	
}
/*初始化结构布局*/
function initLayer(e) {
    initCanvas(e);
    onload(),
    loadConfig()    
}
/*触发分析模式*/
function onAnalyse() {
    isanalyse ?  closeAnalyse() : startAnalyse();
}
/*关闭分析模式*/
function closeAnalyse (){
	showFloatTip("关闭分析模式"),;
	isanalyse = 0 ;
	bill.cleanLine()
}
/*开启分析模式*/
function startAnalyse (){
    showFloatTip("开启分析模式");
    isanalyse = 1;
    if(b_autoset){
        bill.bPlay();
        if($("#blackautoplayTog").hasClass('mui-active')){
            $("#blackautoplayTog").removeClass('mui-active');
            $("#blackautoplayTog").html('<div class="mui-switch-handle"></div>');
        }
    }
    if(r_autoset){
        bill.rPlay();
        if($("#redautoplayTog").hasClass('mui-active')){
            $("#redautoplayTog").removeClass('mui-active');
            $("#redautoplayTog").html('<div class="mui-switch-handle"></div>');
        }
    }
    bill.replayBtnUpdate();
}
/*预加载*/
onload = function() {
    comm.dot = {
        dots: []
    },
    comm.mans = {},
	
    $("#isOffensiveBtn").on('tap',bill.offensive),
    $("#analyseBtn").on('tap',onAnalyse),
    $("#blackautoplayBtn").on('tap',bill.bPlay),
    $("#redautoplayBtn").on('tap',bill.rPlay),
    $("#soundBtn").on('tap',bill.sound),
    $("#verticalreverseBtn").on('tap',bill.reverse),    
    $("#noteBtn").on('tap',bill.note),  
    $("#editboardBtn").on('tap',bill.editboard),  
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
