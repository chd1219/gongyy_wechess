var ws = null;
var wstest = null;
function initWebsocket(){
    var wsImpl = window.WebSocket || window.MozWebSocket;
    // create a new websocket and connect
    window.ws = new wsImpl('ws://118.190.46.210:9011/');
    // when data is comming from the server, this metod is called
    ws.onmessage = function (evt) {
        //play.ParseMsg(evt.data);    
    }
    // when the connection is established, this method is called
    ws.onopen = function () {
        heartCheck.start();
    }
    // when the connection is closed, this method is called
    ws.onclose = function () {
        //showFloatTip("服务断开，请重试！");
        ws = null;
    }       
    // when the connection is error, this method is called
    ws.onerror = function () {
        //showFloatTip("服务断开，请重试！");
    }   
}
function initTestWebsocket(url){
	var wsImpl = window.WebSocket || window.MozWebSocket;
	window.wstest = new wsImpl(url);
	wstest.onmessage = function (evt) {
		e = evt.data;
		result = e;
		if (isJSON(e)){
			var obj = JSON.parse(e); //由JSON字符串转换为JSON对象
			ParseMsg(obj); 
		}		   
	}
	wstest.onopen = function () {

	}
	wstest.onclose = function () {
 		console.log("wstest服务断开，请重试！");
 		wstest = null;
	}		

	wstest.onerror = function () {
		//console.log("wstest服务断开，请重试！");
	}	
}
function ParseMsg(obj) {
	if(Number(obj.index) != movesIndex) return;
	switch(obj.commandtype){
		case "queryall":
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
			break;
		case "position":
			d = obj.result;
			if(d.match("bestmove ")){
				var e = d.split("bestmove "); 
				
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
				if (depth == 2) {
					computelist = [];
					cleanComputerDetail();
				}
		
				if (depth > 1) {
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
				//console.log(d);
				play.aiPace = null;	
			}		 
			break;
		default:
			break;
	}
	
}
function wetestSend(e){
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
		wstest.send(o);
	}	
	else{
		wstest.send(e);
	}	
}
function sendMessage(e){
	if(wstest) {
		wetestSend(e);
	}	
	else{
		initTestWebsocket('ws://120.55.37.210:9001/');
		setTimeout(function () {
			wetestSend(e);
		},1000);
	}
	
	if(ws) {
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
function loadConfig() {
    comm.initChess(comm.initMap);
	bill.create();	
    //initWebsocket();
    //initTestWebsocket('ws://118.190.46.210:9001/');
    initTestWebsocket('ws://120.55.37.210:9001/');
}
function initLayer(e) {
    initCanvas(e);
    onload(),
    loadConfig()    
}
function analyse() {
    isanalyse ?  (showFloatTip("关闭分析模式"), isanalyse = 0 , bill.cleanLine()) : (checkautoplay());
}
function checkautoplay (){
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
onload = function() {
    comm.dot = {
        dots: []
    },
    comm.mans = {},
	
    $("#isOffensiveBtn").on('tap',bill.offensive),
    $("#analyseBtn").on('tap',analyse),
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
