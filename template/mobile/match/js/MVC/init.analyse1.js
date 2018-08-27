/*
 * init.analyse.js
 * 自定义初始化
 * 2017-08-20
 * chd
 */

/*Websocket变量*/
var myws = null;
var mywstest = null;
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
			var a = {};
				a.type = 1;
				a.uuid = uuid;
				a.index = movesIndex;
				a.command = "";
				a.ua = navigator.userAgent;
				a.time = new Date().getTime();
				var o = JSON.stringify(a);
				ws.send(o);
		}
		ws.onclose = function () {
			console.log("onclose");
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
				a.bcache = true;
				a.zobristKey = getKey(e.substring(13));
				console.log(a.zobristKey);
				a.time = new Date().getTime();
				var o = JSON.stringify(a);
				ws.send(o);
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
							}							
						},
						error: function (response, status, xhr) {
							
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
/*获取手机型号*/
getOsModel = function(e) {
	var device_type = navigator.userAgent;//获取userAgent信息  
    var md = new MobileDetect(device_type);//初始化mobile-detect  
    var os = md.os();//获取系统  
    var model = "";  
    if (os == "iOS") {//ios系统的处理  
        os = md.os() + md.version("iPhone");  
        model = md.mobile();          
    } else if (os == "AndroidOS") {//Android系统的处理  
        os = md.os() + md.version("Android");  
        var sss = device_type.split(";");  
        var i = sss.contains("Build/");  
        if (i > -1) {  
            model = sss[i].substring(0, sss[i].indexOf("Build/"));  
        }          
    }  
    var wigth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var heigth = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var a = {};
	a.uuid = uuid;
	a.type = 1;
	a.os = os;
	a.model = model;
	a.wigth = wigth;
	a.heigth = heigth;	
	o = JSON.stringify(a);
    myws.Send(o);//打印系统版本和手机型号
}

var MyTestWebsocket = function (url, bRec) {
	/*服务器地址*/
	this.url = url;
	/*是否解析返回数据*/
	var brec = bRec;
	/*Websocket实例*/
	var ws = null;		
	  
	this.initWebsocket = function(){
		var wsImpl = window.WebSocket || window.MozWebSocket;
		ws = new WebSocket(this.url);
		ws.onmessage = function (evt) {
			if(brec) {
				onMessage(evt.data);
				//console.log(evt.data);
			}			
		}
		ws.onopen = function () {
			
		}
		ws.onclose = function () {
			console.log("onclose");
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
				ws.send(o);					
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
//	mywstest.Send(e);
	console.log(movesIndex+":"+e);
}
/*加载配置信息,根据模块自定义*/
loadConfig = function() {

	/*初始化Websocket*/  

	myws = new MyTestWebsocket('wss://47.96.26.54:9003/',!0);
	myws.initWebsocket();
    
}
/*初始化结构布局*/
initLayer = function(e) {

   
}
 loadConfig(); 	
function Setting() {
	timingBegins = !0;
	showThink();
}