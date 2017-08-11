var ws = null;
var wstest = null;
var wsanalyse = null;
var curcomputer = '';
var curpower = '';
var ischange = 0;
function initWebsocket(url){
	var wsImpl = window.WebSocket || window.MozWebSocket;
	window.ws = new ReconnectingWebSocket(url);
	ws.onmessage = function (evt) {
		ParseMsg(evt.data);	
		/*if(evt.data.match("bestmove ")){
			var date = new Date();
			t2 = date.getTime();
			serverReceiveRecord[movesIndex] = [movesIndex,evt.data,t2-t1-1000];
			bill.record();
		}*/
	}
	ws.onopen = function () {
	}
	ws.onclose = function () {
	}		

	ws.onerror = function () {
	}	
}
function initTestWebsocket(url){
	var wsImpl = window.WebSocket || window.MozWebSocket;
	window.wstest = new wsImpl(url);
	wstest.onmessage = function (evt) {

	}
	wstest.onopen = function () {

	}
	wstest.onclose = function () {
 		console.log("wstest服务断开，请重试！");
	}		

	wstest.onerror = function () {
		console.log("wstest服务断开，请重试！");
	}	
}

function initAnalyseWebsocket(url){
	var wsImpl = window.WebSocket || window.MozWebSocket;
	window.wsanalyse = new wsImpl(url);
	wsanalyse.onmessage = function (evt) {
		e = evt.data;
		if (isJSON(e)){
			var obj = JSON.parse(e); //由JSON字符串转换为JSON对象
			result = obj.command;		
			//ParseMsg(result);    
		}
	}
	wsanalyse.onopen = function () {

	}
	wsanalyse.onclose = function () {
 		console.log("wstest服务断开，请重试！");
	}		

	wsanalyse.onerror = function () {
		console.log("wstest服务断开，请重试！");
	}	
}
function sendMessage(e){
	if(!ws) return;
	setTimeout(function () {
		ws.send(e)
	}, 1000);
	n=0;
	var date = new Date();
	t1 = date.getTime();
	serverSendRecord[movesIndex] = new Array();
	serverReceiveRecord[movesIndex] = new Array();
	serverSendRecord[movesIndex] = [movesIndex,e,n];
	bill.record();
	checkreturn(e);
	if(!wstest) return;
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
			wstest.send(o);
		}	
		else{
			wstest.send(e);
		}
	}, 1000);
	if(!wsanalyse) return;
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
			wsanalyse.send(o);
		}	
		else{
			wsanalyse.send(e);
		}
	}, 1000);
	
}

function checkreturn(e){
	if (n<3){
		setTimeout(function(){
			if(serverSendRecord[serverSendRecord.length-1].length>serverReceiveRecord[serverSendRecord.length-1].length){
				ws.send(e);
				n = n+1;
				if(typeof(serverSendRecord[movesIndex])!='undefined'){
					serverSendRecord[movesIndex] = [movesIndex,e,n*10000];
				}
				bill.record();
				checkreturn(e);
			}	
		},10000);
	}else{
		alert("服务器超时重连！");
		location.reload();
	}
}

function ParseMsg(d) {
	if(!waitServerPlay) return;
	
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
		setTimeout((function(){play.serverAIPlay();}),200);
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
}
function loadConfig() {
	if(!chessdata){
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
		movesIndex = 0;
		mui('#delete').popover('toggle');
		bill.replayBtnUpdate();
		if(window.Storage && window.localStorage && window.localStorage instanceof Storage){
                setInterval("setStorageData()",3000);
          }	
	}else{
		var btn = ['是', '否'];
		mui.confirm("定位到上次退出的位置?","系统提示：",btn,function(e) {
			if(e.index == 0){
				mode = 5;
				showFloatTip("已为您定位到上次退出的位置");
				__getChessData(chessdata);
  				Setting();
			}else{
				localStorage.removeItem("chessdata");
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
				movesIndex = 0;
				mui('#delete').popover('toggle');
			}
			if(window.Storage && window.localStorage && window.localStorage instanceof Storage){
                setInterval("setStorageData()",3000);
            }
			bill.replayBtnUpdate();
		})
		
	}
}
function initLayer(e) {
    initCanvas(e);
    onload(),
    loadConfig();
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
	if (curpower != power) {
		if (ws) {
			ws.close();
		}
		var url;
		switch (power){
			case 'level-0':
			{
				url = 'ws://121.43.37.233:9100/';
				!chessdata?showFloatTip("六级棋士"):1;
				break;
			}
			case 'level-1':
			{
				url = 'ws://121.43.37.233:9101/';
				!chessdata?showFloatTip("五级棋士"):1;
				break;
			}
			case 'level-2':
			{
				url = 'ws://121.43.37.233:9102/';
				!chessdata?showFloatTip("四级棋士"):1;
				break;
			}
			case 'level-3':
			{
				url = 'ws://121.43.37.233:9103/';
				!chessdata?showFloatTip("三级棋士"):1;
				break;
			}
			case 'level-4':
			{
				url = 'ws://121.43.37.233:9104/';
				!chessdata?showFloatTip("二级棋士"):1;
				break;
			}
			case 'level-5':
			{
				url = 'ws://121.43.37.233:9105/';
				!chessdata?showFloatTip("一级棋士"):1;
				break;
			}
			case 'level-6':
			{
				url = 'ws://121.43.37.233:9106/';
				!chessdata?showFloatTip("棋协大师"):1;
				initTestWebsocket('ws://118.190.46.210:9001/');
				break;
			}
		}
		initTestWebsocket('ws://118.190.46.210:9001/');	
		showLevel(power);
		initWebsocket(url);		
	    ischange = 1;
	    curpower = power;
	    
		if (computer == 'red') {
			bill.my = -1;
    		bill.reverse();
    		play.map = bill.map;
    		if (movesIndex % 2 == 0){play.rAIPlay();}
    		$("#black").hide();		
	    }
	    else {
	    	bill.my = 1;
	    	if (movesIndex % 2 == 1){play.bAIPlay();}
	    	$("#red").hide();		
	    }
	    curcomputer = computer;
	
	    $("#restartli").show();		
	}    
}

function showLevel(e){
	for (i=0;i<7;i++) {
		level = "level-"+i;
		if(!level.match(e)){
			$("#"+level).hide();	
		} 
	}
}

var __getChessData = function(e) {
	serverData = e;
	if(serverData.BillType){
		comm.initChess(comm.emptyMap);
		bill.resizeCanvas();
		createbroad = !1;
		comm.init();
		bill.init(3, comm.parseMap(serverData.map), !0);
		play.map = bill.map;
		var moves = comm.parseMovesEx(serverData.moves);
		id = moves.length,currentId = moves.length,movesIndex = moves.length;
		comm.parseNote(serverData.notes);
		setEnable("nextBtn", !1);
		setEnable("endBtn", !1);
		setEnable("firstBtn", !1);
		power = serverData.power;
		computer = serverData.computer;
		redtime = serverData.redtime;
		blacktime = serverData.blacktime;
		bill.cMap = comm.initMap; 
		play.my=parseInt(serverData.pmy);
		voicemode = parseInt(serverData.voicemode);
		computer=='black'?($('#black').addClass('mui-active'),$("input:radio[value='black']").attr('checked','true')):($('#red').addClass('mui-active'),$("input:radio[value='red']").attr('checked','true'),bill.reverseMoves());
		$("input:radio[value='"+power+"']").attr('checked','true');
		voicemode?$('#soundTog').addClass('mui-active'):$('#soundTog').removeClass('mui-active');
	}        
}
