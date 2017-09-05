/*
 * Control.js
 * 定义MVC的Control
 * 2017-08-20
 * chd
 */

/*定义控制类*/
var comm = comm || {};
/*初始化*/
comm.init = function (e, a, k) {
    var a = a || initMap;
    comm.cMap = comm.cMap || a;
    comm.nowMap = a,
    comm.map = comm.arr2Clone(a),
    comm.sMap = comm.sMap || [],
    comm.sMapList = comm.sMapList || {};
    comm.nowManKey = !1,
    comm.pace = comm.pace || [],
    comm.nodes = comm.nodes || [],
    comm.isPlay = !0,
    comm.isAnimating = !1,
    comm.isFoul = !1,
    comm.mans = {},
    comm.notes = comm.notes || [],
    comm.moves =  comm.moves || [],
    comm.isOffensive = comm.isOffensive || 0,
    comm.historylist = comm.historylist || {};
    createMans(a);
    for (var m = 0; m < comm.map.length; m++) {
    	for (var o = 0; o < comm.map[m].length; o++) {
	        var n = comm.map[m][o];
	        n && (comm.mans[n].x = o, comm.mans[n].y = m, comm.mans[n].isShow = !0)
	    }
    }    	
    comm.moves4Server = comm.getMap4Server(comm.map);
    k == !0 ? ( comm.isPlay = !0 ) : ($("#saveBtn").show(), comm.isPlay = !1);
}
commandhistory = function() {
	var index;
	var board;
	var result;
}
Node = function(id, parter, step) {
	this.id = id || 0;
	this.parter = parter || 0;
	this.child = [];
	this.step = step || "";
}
/*数组克隆*/
comm.arr2Clone = function(e) {
    for (var a = [], m = 0; m < e.length; m++) {
    	a[m] = e[m].slice();
    }
    return a
}
/*数组翻转*/
comm.arrReverse = function(e) {
    for (var a = [], m = 0; m < e.length; m++) {
    	a[m] = e[e.length-1-m].slice().reverse();
    }
    return a
}
/*播放声音*/
comm.soundplay = function(e) {
	voicemode ? createjs.Sound.play(e) : !1;
}
/*X坐标翻转*/
comm.reverseX = function(e) {
    return 8 - e
}
/*Y坐标翻转*/
comm.reverseY = function(e) {
    return 9 - e
}
comm.getMap4Server2 = function(e) {
	var map6server = "";
    for (var a = 10, m = 0; m < e.length; m++) {
        for (var o = e[m], n = 0; n < o.length; n++) {
            var t = o[n];
            if (t) {
                var s = comm.name2id[t.split("")[0]];
				map6server += " "+s+" "+(n + 1)+" "+a;              
            }
        }
        a--
    }
    return map6server
}
comm.getMoves4Server2 = function() {	
	var e = "",
		o = "";
    for (var a = 0; a < comm.pace.length; a++) {
        var m = comm.pace[a].split("");
        o = " "+(parseInt(m[0])+1)+" "+(10-parseInt(m[1]))+" "+(parseInt(m[2])+1)+" "+(10-parseInt(m[3]));            
        e += o;
    }
    return e
}
comm.getMap4Server = function(e) {
    var map4server = [];
    for (var a = 10, m = 0; m < e.length; m++) {
        for (var o = e[m], n = 0; n < o.length; n++) {
            var t = o[n];
            if (t) {
                var s = comm.name2id[t.split("")[0]];
                map4server.push({
                    cid: s.toString(),
                    x: (n+1).toString(),
                    y: a.toString()
                })
            }
        }
        a--
    }
    return map4server
}
comm.getMoves4Server = function() {
	if (!comm.nodes.length) {
		return [];
	}
	if (mode == playmode.AIPLAY) {
		for (var e = [], a = 1; a < comm.nodes.length; a++) {
			e[a-1] = comm.Step2XY(comm.nodes[a].step)
		}
		return e
	}
	var e = [];
	var tempID = currentId;
	/*向后延伸,获取终局ID,多条路径，默认选择第一条*/
	while(comm.nodes[tempID].child.length > 0) {
		tempID = comm.nodes[tempID].child[0];
	}
	/*回溯整条路径*/
	while(comm.nodes[tempID].parter > 0) {
		var step = comm.nodes[tempID].step;
		e.push(comm.Step2XY(step));
		tempID = comm.nodes[tempID].parter;
	}
	moves = e.reverse();
	return moves;
}
comm.getNotes4Server = function () {
	var e = "",
		o = "";
	for (var a = 0; a < comm.notes.length; a++) {
		o = (comm.notes[a]);
		if (o) {
			e += " " + a + " " + o;
		}
	}
	return e
}
/*id2name*/
comm.id2name = {
	16 : "J", 17 : "S", 18 : "X", 19 : "M", 20 : "C", 21 : "P", 22 : "Z", 8 : "j", 9 : "s", 10 : "x", 11 : "m", 12 : "c", 13 : "p", 14 : "z"
}
/*name2id*/
comm.name2id = {
	J: 16, S: 17, X: 18, M: 19, C: 20, P: 21, Z: 22, j: 8, s: 9, x: 10, m: 11, c: 12, p: 13, z: 14
}
/*检查将、士、象、兵、卒的位置是否合法*/
comm.checkMans = function (e, p) {	
	a = p.y;
	m = p.x;
	e = e.slice(0, 1);
	(isVerticalReverse == 0) ? (result = {
			"J": (a > -1 & 3 > a & m > 2 & 6 > m),
			"X": (((a == 0 || a == 4) & (m == 2 || m == 6)) || (a == 2 & (m == 0 || m == 4 || m == 8))),
			"S": (((a == 0 || a == 2) & (m == 3 || m == 5)) || (a == 1 & (m == 4))),
			"Z": (((a == 3 || a == 4) & (m == 0 || m == 2 || m == 4 || m == 6 || m == 8)) || (a > 4 & 10 > a)),
			"j": (a > 6 & 10 > a & m > 2 & 6 > m),
			"x": (((a == 5 || a == 9) & (m == 2 || m == 6)) || (a == 7 & (m == 0 || m == 4 || m == 8))),
			"s": (((a == 7 || a == 9) & (m == 3 || m == 5)) || (a == 8 & (m == 4))),
			"z": (((a == 5 || a == 6) & (m == 0 || m == 2 || m == 4 || m == 6 || m == 8)) || (a > -1 & 5 > a)),
			"C": !0,
			"M": !0,
			"P": !0,
			"c": !0,
			"m": !0,
			"p": !0
		}
		[e] || !1) : (result = {
			"j": (a > -1 & 3 > a & m > 2 & 6 > m),
			"x": (((a == 0 || a == 4) & (m == 2 || m == 6)) || (a == 2 & (m == 0 || m == 4 || m == 8))),
			"s": (((a == 0 || a == 2) & (m == 3 || m == 5)) || (a == 1 & (m == 4))),
			"z": (((a == 3 || a == 4) & (m == 0 || m == 2 || m == 4 || m == 6 || m == 8)) || (a > 4 & 10 > a)),
			"J": (a > 6 & 10 > a & m > 2 & 6 > m),
			"X": (((a == 5 || a == 9) & (m == 2 || m == 6)) || (a == 7 & (m == 0 || m == 4 || m == 8))),
			"S": (((a == 7 || a == 9) & (m == 3 || m == 5)) || (a == 8 & (m == 4))),
			"Z": (((a == 5 || a == 6) & (m == 0 || m == 2 || m == 4 || m == 6 || m == 8)) || (a > -1 & 5 > a)),
			"C": !0,
			"M": !0,
			"P": !0,
			"c": !0,
			"m": !0,
			"p": !0
		}
		[e] || !1)

	return result;
}
/*解析棋盘数组*/
comm.parseMap = function(e) {
	var a = e, 
		m = comm.emptyMap.concat(), 
		o = {};
    for (var n = 0; n < a.length; n++) {
        var t = a[n],
        s = comm.id2name[t.cid],
        r = "";
        void 0 == o[s] ? (o[s] = 0, r = s + o[s]) : (o[s]++, r = s + o[s]),
        m[comm.reverseY(t.y - 1)][t.x - 1] = r
    }
    return m
}
/*解析注释信息*/
comm.parseNote = function(e) {
    for (var a = e, n = 0; n < a.length; n++) {
        var t = a[n].id+1;
		comm.notes.length = t,
		comm.notes[t-1] = a[n].note;        
    }	
}
/*解析走法信息*/
comm.parseMoves = function(e) {
    for (var a = e, m = 0; m < a.length; m++) {
    	a[m].src.x = a[m].src.x - 1,
    	a[m].src.y = comm.reverseY((a[m].src.y - 1)),
	    a[m].dst.x = a[m].dst.x - 1,	    
	    a[m].dst.y = comm.reverseY((a[m].dst.y - 1))
    }
    return a
}
/*字符大小写互换*/
comm.ReverseCase = function (ch){
    if( ch >= 'A' && ch <= 'Z' ) {
    	return ch.toLowerCase();
    }
    if( ch >= 'a' && ch <= 'z' ) {
    	return ch.toUpperCase();
	}
}
/*生成红子着法*/
comm.createRedMove = function(man,x,y,newX,newY,flag) {
	var h="";
	var mumTo=["一","二","三","四","五","六","七","八","九","十"];    
    newX = comm.reverseX(newX);
    h+= mumTo[comm.reverseX(x)];
    if (newY > y) {
        flag ? h+= "退" : h+= "进" ;
        if (man.pater == "m" || man.pater == "s" || man.pater == "x"){
            h+= mumTo[newX];
        }else {
            h+= mumTo[newY - y -1];
        }
    }else if (newY < y) {
        flag ? h+= "进" : h+= "退";
        if (man.pater == "m" || man.pater == "s" || man.pater == "x"){
            h+= mumTo[newX];
        }else {
            h+= mumTo[y - newY -1];
        }
    }else {
        h+= "平";
        h+= mumTo[newX];
    }
    return h;
}
/*生成黑子着法*/
comm.createBlackMove = function(man,x,y,newX,newY,flag) {
	var h="";
	var mumTo=["１","２","３","４","５","６","７","８","９","10"];
    h+= mumTo[x];
    if (newY > y) {
        flag ? h+= "进" : h+= "退";
        if (man.pater == "M" || man.pater == "S" || man.pater == "X"){
            h+= mumTo[newX];
        }else {
            h+= mumTo[newY-y-1];
        }
    }else if (newY < y) {
    	flag ? h+= "退" : h+= "进" ;
        if (man.pater == "M" || man.pater == "S" || man.pater == "X"){
            h+= mumTo[newX];
        }else {
            h+= mumTo[y-newY-1];
        }
    }else {
        h+= "平";
        h+= mumTo[newX];
    }
    return h;
}
/*生成走法*/
comm.createMove = function (map,x,y,newX,newY){
	try {
		var h="";   
	    var man;    
	    if (!isVerticalReverse) {
	        man = comm.mans[map[y][x]];
	        h+= man.text;
	        map[newY][newX] = map[y][x];
	        delete map[y][x];
	        if (man.my===RED){
	            h += comm.createRedMove(man,x,y,newX,newY,!0);
	        }else{
	            h += comm.createBlackMove(man,x,y,newX,newY,!0);
	        }       
	    }
	    else {
	        man = comm.mans[map[comm.reverseY(y)][comm.reverseX(x)]];
	        h+= man.text;
	        map[comm.reverseY(newY)][comm.reverseX(newX)] = map[comm.reverseY(y)][comm.reverseX(x)];
	        delete map[comm.reverseY(y)][comm.reverseX(x)];
	        if (man.my===BLACK){
	            h += comm.createBlackMove(man,x,y,newX,newY,!0);
	        }else{
	        	h += comm.createRedMove(man,x,y,newX,newY,!0);
	        }       
	    }    
	}
    catch(e){
    	console.log(e);
    }
    return h;
}
/*生成走法1*/
comm.createMove1 = function (man,x,y,newX,newY){
	try{
		var h="";   
	    h+= man.text;
	    if (!isVerticalReverse) {
	        if (man.my===RED){
	            h += comm.createRedMove(man,x,y,newX,newY,!1);
	        }else{
	            h += comm.createBlackMove(man,x,y,newX,newY,!1);
	        }          
	    }
	    else {        
	        if (man.my===BLACK){
	            h += comm.createBlackMove(man,x,y,newX,newY,!1);
	        }else{
	        	h += comm.createRedMove(man,x,y,newX,newY,!1);
	        }      
	    }
	}catch(e){
		console.log(e);
	}     
    return h;
}
/*检查将军*/
comm.checkJiang = function () {
	for (var e = 0; e < 3; e++)
		for (var a = 3; a < 6; a++) {
			var m = comm.map[e][a];
			if (m == "J0") {
				var flag = 0;
				for (var o = e + 1; o < comm.map.length; o++) {
					m = comm.map[o][a];
					if (m == "j0") {
						if (flag == 0)
							return !1;
					} else if (m) {
						flag++;
					}
				}
				return !0;
			}
		}
	return !0;
}
/*获取棋盘数据*/
comm.getsMap = function () {
    var MapEx = {
        "C": ["C0", "C1"],
        "M": ["M0", "M1"],
        "P": ["P0", "P1"],
        "X": ["X0", "X1"],
        "S": ["S0", "S1"],
        "Z": ["Z0", "Z1", "Z2", "Z3", "Z4"],
        "c": ["c0", "c1"],
        "m": ["m0", "m1"],
        "p": ["p0", "p1"],
        "x": ["x0", "x1"],
        "s": ["s0", "s1"],
        "z": ["z0", "z1", "z2", "z3", "z4"]
    };
    for (var i = 0; i < comm.map.length; i++) {
        for (var j = 0; j < comm.map[i].length ; j++) {
            var temp = comm.map[i][j];
            if (temp && temp != "j0" && temp != "J0") {
                item = temp.slice(0,1);
                index = temp.slice(1,2);
                (MapEx[item]).remove(temp);            
            }
        }
    }
    return JSON.parse(JSON.stringify(MapEx));
}
/*查找是否存在分支,否则增加分支*/
comm.branch = function (step) {
	/*如果链表为空，插入根节点*/
	if (!comm.nodes.length) {
		var node = new Node();
		comm.nodes.push(node);
	}
	/*检查是否已存在*/
	if (!comm.checkbranch(step)) {
		id++;
		var node = new Node(id,currentId,step);
		comm.nodes.push(node);
		comm.nodes[node.parter].child.push(node.id);		
		currentId = id;
	}
}
/*检查分支*/
comm.checkbranch = function (step) {
	if (comm.nodes[currentId].child.length == 0) {
		return !1;
	}
	else {
		var childID = comm.nodes[currentId].child;
		for (var i=0;i<childID.length;i++) {
			var childstep = comm.nodes[childID[i]].step;
			if (childstep == step) {
				currentId = comm.nodes[childID[i]].id;
				return !0;
			}
		}
	}
	return !1;
}
/*取消分析模式*/
comm.cancleanalyse = function () {
	if (isanalyse) {
		isanalyse = 0;
		cleanLine();
		if ($("#analyseTog").hasClass('mui-active')) {
			$("#analyseTog").removeClass('mui-active');
			$("#analyseTog").html('<div class="mui-switch-handle"></div>');
		}
	}
}
/*关闭分析模式*/
comm.closeAnalyse = function (){
	showFloatTip("关闭分析模式");
	isanalyse = 0 ;
	cleanLine()
}
/*开启分析模式*/
comm.startAnalyse = function (){
    isanalyse = 1;    
    if(b_autoset){
        if($("#blackautoplayTog").hasClass('mui-active')){
            $("#blackautoplayTog").removeClass('mui-active');
            $("#blackautoplayTog").html('<div class="mui-switch-handle"></div>');           
        }
         onBluePlay();
    }
    if(r_autoset){
        if($("#redautoplayTog").hasClass('mui-active')){
            $("#redautoplayTog").removeClass('mui-active');
            $("#redautoplayTog").html('<div class="mui-switch-handle"></div>');            
        }
        onRedPlay();
    }
    showFloatTip("开启分析模式");
    comm.send();
    replayBtnUpdate();
}
/*检查分析模式*/
comm.checkanalyse = function () {
    isanalyse ?  (showFloatTip("关闭分析模式"), isanalyse = 0 , comm.cleanLine()) : (checkautoplay());
}
/*发送消息*/
comm.send = function () {
	if (mode == playmode.ANALYSE && comm.nowManKey == !1 && document.getElementById("chessdbDetailTbody")) {
		setTimeout(function () {
			sendMessage(comm.queryall());
		}, 1000);
	}
	if (isanalyse) {
		cleanLine();
		setTimeout(function () {
			sendMessage(comm.getFen());
		}, 1000);
	}
}
/*获取当前执方*/
comm.getHold = function () {	
	var ret;
	/* 红方先手 isOffensive = 0
	 * 黑方先手 isOffensive = 1
	 */	
	(comm.isOffensive == movesIndex%2)? ret = RED : ret = BLACK;
	return ret;
}
/*定义引擎信息的数据结构*/
comm.depthinfo = function(d){
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
comm.cloudinfo = function(d){
	var e = d.split(",");
	this.move = e[0],
	this.score = parseInt(e[1]),	
	this.rank = e[2],
	this.note = e[3];
}
/*解析返回的云库信息*/
comm.DealQueryall = function (obj) {
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
		var info = new comm.cloudinfo(e[i]);
		cloudinfolist.push(info);
		var tempmap = comm.arr2Clone(comm.map);		
		a = info.move.split("");			
		n = comm.transformat(a);	
		var move = comm.createMove(tempmap,n[0],n[1],n[2],n[3]);
		tmpStr += "<tr><td>"+ move +"</td><td>"+ info.rank +"</td><td>"+ info.score +"</td><td>"+ info.note +"</td></tr>";
	}	
	if(document.getElementById("chessdbDetailTbody")){ 
		document.getElementById("chessdbDetailTbody").innerHTML = tmpStr;
	}
}
/*解析返回的引擎信息*/
comm.DealPosition = function (obj) {
	d = obj.result;
	if(d.match("bestmove ")){
		var e = d.split("bestmove "); 
		var move = e[1];
		/*回调返回函数*/
		myws.Return();
		if(move.match("null") || move.match("none")){
			comm.onGameEnd();
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
			aiPace = comm.transformat(o);
			Player.aiPace = aiPace;
			setTimeout((function(){Player.serverAIPlay();}),200);
		}		
	}		
	else {
		if (!d.match("depth")) {
			return;
		}
		var info = new comm.depthinfo(d);
		depthinfolist.push(info);
		if (comm.isOffensive == movesIndex%2) {
			info.score = -info.score;
		}				
		var tempmap = comm.arr2Clone(comm.map);
		var a = [];
		var tmpStr = "";
		cleanLine();
		for (j = 0; j < info.pv.length && j<4; j++) {
			if (info.pv[j]) {
				a = info.pv[j].split("");					
				var o = comm.transformat(a);					
				computelist.push(o);
				var move = comm.createMove(tempmap, o[0], o[1], o[2], o[3]);
				tmpStr = tmpStr + move + " ";
				/*走法提示*/
				if (isVerticalReverse) {
					o[0] = comm.reverseX(o[0]);
					o[1] = comm.reverseY(o[1]);
					o[2] = comm.reverseX(o[2]);
					o[3] = comm.reverseY(o[3]);
				}
				if (isanalyse && j<2) {
					drawLine2(o,j+1);
				}
			}				
		}				
		if(document.getElementById("computerDetailTbody") && tmpStr.length > 4){ 
			tmpStr = "<tr><td>" + info.depth + "</td><td>" + info.score + "</td><td>" + tmpStr + "</td></tr>";
			document.getElementById("computerDetailTbody").innerHTML = tmpStr + document.getElementById("computerDetailTbody").innerHTML;
		} 		
	}		
}
/*解析返回信息*/
comm.ParseMsg = function (e) {
	if (comm.isJSON(e)){
		/*由JSON字符串转换为JSON对象*/
		var obj = JSON.parse(e); 
		if(Number(obj.index) != movesIndex) return;
		switch(obj.commandtype){
			case "queryall":
				comm.DealQueryall(obj);
				break;
			case "position":
				comm.DealPosition(obj);
				comm.historylist[movesIndex].result.push(e);
				break;
			default:
				break;
		}	
	}		
}
/*坐标变换(a-i)->(0-8),(0-9)->(9-0)*/
comm.transformat = function(o){
	var a = [];
	for(var i=0;i<4;i++){
		a[i] = {"a":"0","b":"1","c":"2","d":"3","e":"4","f":"5","g":"6","h":"7","i":"8","0":"9","1":"8","2":"7","3":"6","4":"5","5":"4","6":"3","7":"2","8":"1","9":"0"}[o[i]] || "";			                      
	}
	return a;
}
/*获取URL参数*/
comm.getUrlParam = function (e) {
    var a = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),
    m = window.location.search.substr(1).match(a);
    return null != m ? unescape(m[2]) : null
}
/*加载声音*/
comm.loadSound = function (e) {
    fileLoaded(e)
}
/*响应Canvas点击事件*/
comm.stageClick = function (e) {
	Player.clickCanvas(e);
//	switch(mode) {
//		case playmode.AIPLAY:
//			Player.clickCanvasAIplay(e);
//			break;
//		case playmode.EDITBOARD:
//			Player.clickCanvasEditboard(e);
//			break;
//		case playmode.ANALYSE:
//			Player.clickCanvasAnalyse(e);
//			break;
//		case playmode.REPLAY:
//			break;
//		case playmode.CREATE:
//			break;
//		case playmode.ONLINE:
//			break;
//		default:
//			Player.clickCanvas(e);
//			break;
//	}    
}
/*获取棋盘取反状态*/
comm.getReverse = function () {
	for (var i=0;i<3;i++) {
		for (var j=3;j<6;j++) {
			if (comm.map[i][j] == "J0") {
				return !1;
			}
		}
	}
	return !0;
}
/*getFenKey*/
comm.getFenKey = function (e) {
	var key={"J0":"k","X0":"b","X1":"b","S0":"a","S1":"a","Z0":"p","Z1":"p","Z2":"p","Z3":"p","Z4":"p","C0":"r","C1":"r","M0":"n","M1":"n","P0":"c","P1":"c","j0":"K","x0":"B","x1":"B","s0":"A","s1":"A","z0":"P","z1":"P","z2":"P","z3":"P","z4":"P","c0":"R","c1":"R","m0":"N","m1":"N","p0":"C","p1":"C"}[e] || "";
	return key;
}
/*将棋盘数组转化成FEN格式*/
comm.getBoard= function (){
	comm.getReverse() ? map = comm.arrReverse(comm.map) : map = comm.arr2Clone(comm.map);
	var key = "";
	var coutZero = 0;
	var board = "";
	for(var i=0;i<10;i++){
		coutZero = 0;
		for(var j=0;j<9;j++){
			key = map[i][j];
		
			if(!key){
				coutZero++;
				continue;
			}			
			if(coutZero > 0){
				board += ""+coutZero;
				coutZero = 0;
			}					
			board += comm.getFenKey(key);
		}
		if(coutZero > 0){
			board += ""+coutZero;
			coutZero = 0;
		}
		if(i < (map.length-1)){			
			board += "/";
		}		
	}
	comm.getHold() == 1 ? (board += " w") : (board += " b");
	return board;
}
comm.getFen = function(){
	var result = "position fen ";
	var board = comm.getBoard();
	result += board + " - - 0 1";
	if (result.indexOf("k") != -1 && result.indexOf("K") != -1) return result;    
	return "";
}
comm.queryall = function(){
	var result = "queryall:";
	var board = comm.getBoard();
	result += board;
	return result;    
}
/*判断字符串是否为JSON格式*/
comm.isJSON = function (str) {
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(str.indexOf('{')>-1){
                return true;
            }else{
                return false;
            }

        } catch(e) {
            console.log(e);
            return false;
        }
    }
    return false;
}
/*步法翻转*/
comm.reverseStep = function (e) {
	var a = e.split("");
	a[0] = comm.reverseX(a[0]);
	a[1] = comm.reverseY(a[1]);
	a[2] = comm.reverseX(a[2]);
	a[3] = comm.reverseY(a[3]);
	return 	a.join("");
}
/*步法转坐标*/
comm.Step2XY = function (e) {
	var m = e.split("");
	o = {src: {x: parseInt(m[0]), y: parseInt(m[1])}, dst: {x: parseInt(m[2]), y: parseInt(m[3])}};
	return 	o;
}
/*走法转换*/
comm.reverseMoves = function () {
	for (a = 0; a < comm.nodes.length; a++) {
		var node = comm.nodes[a];
		node.step = comm.reverseStep(node.step);

	}
	for (a = 0; a < comm.pace.length; a++) {
		comm.pace[a] = comm.reverseStep(comm.pace[a]);
	}
}
comm.onGameEnd = function () {
	if (b_autoset != 0) {
        clearInterval(b_autoset);
    }
    if (r_autoset != 0) {
        clearInterval(r_autoset);
    }
    if (showThinkset != 0) {
        clearInterval(showThinkset);        
    }   	
    comm.isend = 1;
    /*锁定，等待1s后解锁*/
    setTimeout((function () {
        waitServerPlay = !1;
        comm.getHold() == -1 ? o = "红" : o = "黑";
        $("#AIThink").text(o + "方胜! 游戏结束!"), 
    	$("#AIThink").show();
    }), 1000);
}
/*悔棋*/
comm.airegret = function () {
	if (comm.nodes.length == 0 || isVerticalReverse && comm.nodes.length == 1) {
		showFloatTip("您还没开始走子");
		return;
	}

	cleanLine();
	comm.isend = !1,
	comm.isPlay = !0,
	waitServerPlay = !1;
	delsetp = 0;
	moves = comm.getMoves4Server();
	cleanChess();
	comm.init(3, comm.cMap, !0);
	if (movesIndex > 0) {
		isVerticalReverse ? (movesIndex % 2 == 1 ? delsetp = 2 : delsetp = 1) : (movesIndex % 2 == 0 ? delsetp = 2 : delsetp = 1);
		movesIndex -= delsetp;
		movesIndex < 0 ? movesIndex = 0 : 1;
		for (var e = 0; movesIndex > e; e++)
			Player.stepPlay(moves[e].src, moves[e].dst, !0);
	}
	replayBtnUpdate();
}
/*悔棋*/
comm.regret = function () {
	if (b_autoset != 0 || r_autoset != 0) {
		showFloatTip("请取消电脑思考，再点击悔棋");
		return;
	}
	if (comm.nodes.length == 0) {
		showFloatTip("还没开始下棋呢");
		return;
	}
	if (comm.nodes[currentId].child.length != 0) {
		showFloatTip("不是最后一步");
		return;
	}

	cleanLine();
	comm.isend = !1,
	comm.isPlay = !0,
	moves = comm.getMoves4Server();
	cleanChess();
	isVerticalReverse ? comm.init(3, comm.arrReverse(comm.cMap), !0) : comm.init(3, comm.cMap, !0);
	if (movesIndex > 0) {
		movesIndex--;
		for (var e = 0; movesIndex > e; e++)
			Player.stepPlay(moves[e].src, moves[e].dst, !0);
	}
	moves.length--;
	replayBtnUpdate();
}
comm.getBrachLength = function () {
	return comm.nodes[currentId].child.length;
}
comm.isFirst = function () {
	if (!comm.nodes.length) {
		return !0;
	}

	return (comm.nodes[currentId].parter == 0);
}
comm.isEnd = function () {
	if (!comm.nodes.length) {
		return !0;
	}
	return (comm.nodes[currentId].child.length > 0);
}
comm.getMovesLength = function () {
	moves = comm.getMoves4Server();
	return moves.length;
}
/*下一步函数*/
comm.replayNextset = function () {
	relayNextLock = 0;
	if (b_autoset != 0 && r_autoset != 0) {
		showFloatTip("请取消电脑思考，再点击下一步");
		return;
	}
	
	var nextpace = [];
	/*统计分支数*/	
	countPath = comm.getBrachLength();
	if (countPath == 1) {
		/*一条分支直接走棋*/
		var childID = comm.nodes[currentId].child[0];
		var step = comm.nodes[childID].step;
		Player.serverAIPlay(step);
	}
	else if (countPath > 1) {
		/*多条分支弹出提示框*/		
		/*自动播放控制*/
		if (autoreplayset != 0) {
			clearInterval(autoreplayset);
		}
		cleanLine();
		for (var j = 0; j < countPath; j++) {
			var childID = comm.nodes[currentId].child[j];
			var step = comm.nodes[childID].step;
			drawLine(step, j + 1);
			BranchPath = "BranchPath_" + j;
			$("#nextstepdialog").prepend('<input type="button" id=' + BranchPath + ' class="chessbaseBtn chess' + j + 'Btn" value=""/>');
			var ss = ("#BranchPath_") + j;
			$(ss).one('click', function () {
				inx = this.getAttribute("id").split("_")[1];
				var childID = comm.nodes[currentId].child[inx-1];
				var step = comm.nodes[childID].step;
				Player.serverAIPlay(step);
				$("#nextstepdialog").trigger("myclick");
				/*自动播放控制*/
				if (autoreplayset != 0) {
					autoreplayset = setInterval(comm.replayNext, 2000);
				}
			});
		}
		popupDiv('nextstepdialog');
		$("#nextstepdialog").bind('myclick', function () {
			hideDiv('nextstepdialog');
			for (i = 0; i < countPath; i++) {
				$(".chessbaseBtn").remove();
			}
			cleanLine();
		});
	}
}
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};