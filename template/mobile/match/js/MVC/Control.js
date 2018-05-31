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
    var a = a || InitMap;
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
Node = function(obj) {
	this.id = obj.id || 0;
	this.index = obj.index || 0;
	this.pater = obj.pater || 0;
	this.child = [];
	this.step = obj.step || "";
	this.stepcn = obj.stepcn || "";
	this.getMoves = function () {
		return comm.Step2XY(this.step);
	}
	this.getChildCount = function () {
		return this.child.length;
	}
	this.getChildID = function (e) {
		e = e || 0;
		return this.child[e];
	}
	this.getParterNode = function() {
		return comm.nodes(this.pater);
	}
	this.getChildNode = function (e) {
		e = e || 0;
		return comm.nodes(this.child[e]);
	}
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
comm.getMoves4Server2 = function() {	
	var e = "";
    for (var a = 1; a < comm.nodes.length; a++) {
        var node = comm.nodes[a];
        e += " "+node.step+" "+ node.id +" "+ node.pater +" "+ (node.index-1); 
    }
    return e
}
comm.getMoves4Server1 = function() {
	if (!comm.nodes.length) {
		return [];
	}
	if (mode == playmode.AIPLAY) {
		for (var e = [], a = 1; a < comm.nodes.length; a++) {
			e[a-1] = comm.nodes[a];
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
	while(comm.nodes[tempID].pater >= -1) {
		e.push(comm.nodes[tempID]);
		tempID = comm.nodes[tempID].pater;
		if(tempID == -1) {
			break;
		}
	}
	return e.reverse();
}
comm.getMoves4Server = function() {
	if (!comm.nodes.length) {
		return [];
	}
	if (mode == playmode.AIPLAY) {
		for (var e = [], a = 1; a < comm.nodes.length; a++) {
			e[a-1] = comm.nodes[a];
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
	while(comm.nodes[tempID].pater > -1) {
		e.push(comm.nodes[tempID]);
		tempID = comm.nodes[tempID].pater;
	}
	return e.reverse();
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
comm.createRedMove = function(man,step,flag) {
	var move = comm.Step2XY(step);
	var h="";
	var mumTo=["一","二","三","四","五","六","七","八","九","十"];    
    newX = comm.reverseX(move.dst.x);
    h+= mumTo[comm.reverseX(move.src.x)];
    if (move.dst.y > move.src.y) {
        flag ? h+= "退" : h+= "进" ;
        if (man.pater == "m" || man.pater == "s" || man.pater == "x"){
            h+= mumTo[newX];
        }else {
            h+= mumTo[move.dst.y - move.src.y -1];
        }
    }else if (move.dst.y < move.src.y) {
        flag ? h+= "进" : h+= "退";
        if (man.pater == "m" || man.pater == "s" || man.pater == "x"){
            h+= mumTo[newX];
        }else {
            h+= mumTo[move.src.y - move.dst.y -1];
        }
    }else {
        h+= "平";
        h+= mumTo[newX];
    }
    return h;
}
/*生成黑子着法*/
comm.createBlackMove = function(man,step,flag) {
	var move = comm.Step2XY(step);
	var h="";
	var mumTo=["１","２","３","４","５","６","７","８","９","10"];
    h+= mumTo[move.src.x];
    if (move.dst.y > move.src.y) {
        flag ? h+= "进" : h+= "退";
        if (man.pater == "M" || man.pater == "S" || man.pater == "X"){
            h+= mumTo[move.dst.x];
        }else {
            h+= mumTo[move.dst.y - move.src.y -1];
        }
    }else if (move.dst.y < move.src.y) {
    	flag ? h+= "退" : h+= "进" ;
        if (man.pater == "M" || man.pater == "S" || man.pater == "X"){
            h+= mumTo[move.dst.x];
        }else {
            h+= mumTo[move.src.y - move.dst.y -1];
        }
    }else {
        h+= "平";
        h+= mumTo[move.dst.x];
    }
    return h;
}
/*生成走法*/
comm.createMove = function (map,step){
	move = comm.Step2XY(step);
	try {
		var h="";   
	    var man;    
	    if (!isVerticalReverse) {
	        man = comm.mans[map[move.src.y][move.src.x]];
	        if(man != undefined){
	        	h+= man.text;
		        map[move.dst.y][move.dst.x] = map[move.src.y][move.src.x];
		        delete map[move.src.y][move.src.x];
		        if (man.my===RED){
		            h += comm.createRedMove(man,step,!0);
		        }else{
		            h += comm.createBlackMove(man,step,!0);
		        }     
	        }	          
	    }
	    else {
	        man = comm.mans[map[comm.reverseY(move.src.y)][comm.reverseX(move.src.x)]];
	        if(man != undefined){
		        h+= man.text;
		        map[comm.reverseY(move.dst.y)][comm.reverseX(move.dst.x)] = map[comm.reverseY(move.src.y)][comm.reverseX(move.src.x)];
		        delete map[comm.reverseY(move.src.y)][comm.reverseX(move.src.x)];
		        if (man.my===BLACK){
		            h += comm.createBlackMove(man,step,!0);
		        }else{
		        	h += comm.createRedMove(man,step,!0);
		        }       
	        }
	    }    
	}
    catch(e){
    	console.log(e);
    }
    return h;
}
/*生成走法*/
comm.createMove1 = function (map,move){
	try {
		var h="";   
	    var man;    
	    if (!isVerticalReverse) {
	        man = comm.mans[map[move.src.y][move.src.x]];
	        if(man != undefined){
	        	h+= man.text;
		        map[move.dst.y][move.dst.x] = map[move.src.y][move.src.x];
		        delete map[move.src.y][move.src.x];
		        if (man.my===RED){
		            h += comm.createRedMove(man,step,!0);
		        }else{
		            h += comm.createBlackMove(man,step,!0);
		        }     
	        }	          
	    }
	    else {
	        man = comm.mans[map[comm.reverseY(move.src.y)][comm.reverseX(move.src.x)]];
	        if(man != undefined){
		        h+= man.text;
		        map[comm.reverseY(move.dst.y)][comm.reverseX(move.dst.x)] = map[comm.reverseY(move.src.y)][comm.reverseX(move.src.x)];
		        delete map[comm.reverseY(move.src.y)][comm.reverseX(move.src.x)];
		        if (man.my===BLACK){
		            h += comm.createBlackMove(man,step,!0);
		        }else{
		        	h += comm.createRedMove(man,step,!0);
		        }       
	        }
	    }    
	}
    catch(e){
    	console.log(e);
    }
    return h;
}
/*检查将军*/
comm.checkJiang = function () {
	for (var e = 0; e < 3; e++)
		for (var a = 3; a < 6; a++) {
			var m = comm.map[e][a];
			if (m == "J0" || m == "j0") {
				var flag = 0;
				for (var o = e + 1; o < comm.map.length; o++) {
					m = comm.map[o][a];
					if (m == "J0" || m == "j0") {
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
/*判断是否数字*/
comm.isNumber = function (value) {
    var patrn = /^(-)?\d+(\.\d+)?$/;
    if (patrn.exec(value) == null || value == "") {
        return false
    } else {
        return true
    }
}
/*将fen格式转换为MAP*/
comm.board2map = function (board) {
	key={
		"k":["J0"],"b":["X0","X1"],"a":["S0","S1"],"p":["Z0","Z1","Z2","Z3","Z4"],"r":["C0","C1"],"n":["M0","M1"],"c":["P0","P1"],
		"K":["j0"],"B":["x0","x1"],"A":["s0","s1"],"P":["z0","z1","z2","z3","z4"],"R":["c0","c1"],"N":["m0","m1"],"C":["p0","p1"]
	};
    
	board = board.replace(/\//g,'');
	var arr = board.split("");
		tmap = [[, , , , , , , , ""], 
		[, , , , , , , , ""], 
		[, , , , , , , , ""], 
		[, , , , , , , , ""], 
		[, , , , , , , , ""], 
		[, , , , , , , , ""], 
		[, , , , , , , , ""], 
		[, , , , , , , , ""], 
		[, , , , , , , , ""], 
		[, , , , , , , , ""]];
	sr = [];
	index = 0;
	for (var i=0;i<90;i++) {		
		if(comm.isNumber(arr[i])){
			index += parseInt(arr[i]);		
		}
		else if(arr[i] == ' ') {
			break;
		}
		else {
			if(isVerticalReverse){
				tmap[9-parseInt(index/9)][index%9] = (key[arr[i]]).shift();
			}
			else{
				tmap[parseInt(index/9)][index%9] = (key[arr[i]]).shift();
			}
			index ++;
		}
	}
	return tmap;
}
/*验证FEN的合法性*/
comm.VerifyFEN = function (s) {
	if(s){		
		s = s.replace(/[\r\n]/, '');
		s = s.replace(/%20/, ' ');
		s = s.replace(/\+/, ' ');
		s = s.replace(/ b.*/g, ' b');
		s = s.replace(/ w.*/g, ' w');
		s = s.replace(/ r.*/g, ' w');
		if (s.search(/\+/) != -1) {
			s = s.substr(0, s.search(/\+/));
		}
	
		var a = new Array();
		var sum = 0;
		var w = new String(s.substr(s.length - 2, 2));
		w = w.toLowerCase();
		if (w != ' w' && w != ' b') {
			return (0);
		}
		s = s.substr(0, s.length - 2);
		a = String(s).split(/\//);
		if (a.length != 10) {
			return (0);
		}
		for (var x = 0; x < 10; x++) {
			sum = 0;
			if (String(a[x]).search(/[^1-9kabnrcpKABNRCP]/) != -1) {
				return (0);
			}
			a[x] = String(a[x]).replace(/[kabnrcpKABNRCP]/g, '1');
			while (String(a[x]).length != 0) {
				sum = sum + Number(String(a[x]).charAt(0));
				a[x] = String(a[x]).substr(1);
			}
			if (sum != 9) {
				return (0);
			}
		}
		return (1);
	}
	else {
		return (0);
	}
}
/*获取棋盘数据*/
comm.getsMap = function () {
    if(isVerticalReverse) {
    	MapEx = {
    		"c": ["c0", "c1"],"m": ["m0", "m1"],"p": ["p0", "p1"],"x": ["x0", "x1"],"s": ["s0", "s1"],"z": ["z0", "z1", "z2", "z3", "z4"],
        	"C": ["C0", "C1"],"M": ["M0", "M1"],"P": ["P0", "P1"],"X": ["X0", "X1"],"S": ["S0", "S1"],"Z": ["Z0", "Z1", "Z2", "Z3", "Z4"]
        }
    } 
    else {
    	MapEx = {
    		"C": ["C0", "C1"],"M": ["M0", "M1"],"P": ["P0", "P1"],"X": ["X0", "X1"],"S": ["S0", "S1"],"Z": ["Z0", "Z1", "Z2", "Z3", "Z4"],
        	"c": ["c0", "c1"],"m": ["m0", "m1"],"p": ["p0", "p1"],"x": ["x0", "x1"],"s": ["s0", "s1"],"z": ["z0", "z1", "z2", "z3", "z4"]
        } 
	}
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
comm.branch = function (move) {
	step = comm.XY2Step(move);
	/*如果链表为空，插入根节点*/
	if (!comm.nodes.length) {
		var obj = {id:0,pater:0,step:0,index:0,stepcn:0};		
		var node = new Node(obj);
		node.pater = -1;
		comm.nodes.push(node);
	}
	/*检查是否已存在*/
	if (!comm.checkbranch(step)) {
		id++;
		var obj = {id:id,pater:currentId,step:step,index:movesIndex,stepcn:stepcn};		
		var node = new Node(obj);
		comm.nodes.push(node);
		comm.nodes[node.pater].child.push(node.id);		
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
//	if (mode == playmode.ANALYSE && comm.nowManKey == !1 && document.getElementById("chessdbDetailTbody")) {
//		setTimeout(function () {
//			sendMessage(comm.queryall());
//		}, 1000);
////		setTimeout(function () {
////			sendMessage(comm.openbook());
////		}, 1000);
//	}
	if (isanalyse) {
		cleanLine();
		setTimeout(function () {
			sendMessage(comm.getFen());
		}, 1000);
	}
}
comm.reCompute = function() {
	cleanLine();
	setTimeout(function () {
		sendMessage(comm.getFen());
	}, 1000);
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
/*定义开局库信息的数据结构*/
comm.openbookinfo = function(d){
	var e = d.split(",");
	this.move = e[0],
	this.score = parseInt(e[1]),	
	this.rank = e[2],
	this.note = e[3];
}
/*解析返回的开局库信息*/
comm.DealOpenbook = function (list) {
	if(document.getElementById("openbookDetailTbody")){ 
		document.getElementById("openbookDetailTbody").innerHTML = "";
	}

	tmpStr = "";
	for (i=list.length-1;i>=0;i--) {	
		var info = list[i].split(",");
		
		var tempmap = comm.arr2Clone(comm.map);		
		step = comm.YX2XY(info[0]);	
		var move = comm.createMove(tempmap,step);
		tmpStr += "</td><td>"+ move +"</td><td>"+ info[1] +"</td><td>"+ info[2] +"</td><td>"+ info[3] +"</td><td>"+ info[4] +"</td></tr>";
	}	
	if(document.getElementById("openbookDetailTbody")){ 
		document.getElementById("openbookDetailTbody").innerHTML = tmpStr;
	}
}
/*解析返回的开局库信息*/
comm.DealOpenbook1 = function (d) {
	list = d.split("|");
	if(document.getElementById("openbookDetailTbody")){ 
		document.getElementById("openbookDetailTbody").innerHTML = "";
	}

	tmpStr = "";
	for (i=list.length-1;i>=0;i--) {	
		if (list[i].length > 0) {
			var info = list[i].split(",");
		
			var tempmap = comm.arr2Clone(comm.map);		
			step = comm.YX2XY(info[0]);	
			var move = comm.createMove(tempmap,step);
			if(move.length > 0) {
				tmpStr += "</td><td>"+ move +"</td><td>"+ info[1] +"</td><td>"+ info[2] +"</td><td>"+ info[3] +"</td><td>"+ info[4] +"</td></tr>";				
			}
		}		
	}	
	if(document.getElementById("openbookDetailTbody")){ 
		document.getElementById("openbookDetailTbody").innerHTML = tmpStr;
	}
}
/*解析返回的云库信息*/
comm.DealQueryall = function (msg) {
	var e = msg.split("|");				
	if (e[0].match("stalemate") || e[0].match("checkmate")) {
		showFloatTip("绝杀！");
		/*回调返回函数*/
		myws.Return();
		return;
	}				
	if (e[0].match("invalid board")){
		showFloatTip("局面无效！");
		/*回调返回函数*/
		myws.Return();
		return;			
	}
	var tmpStr = new String();		
	for (i=0;i<e.length && i<10;i++) {	
		var info = new comm.cloudinfo(e[i]);
		cloudinfolist.push(info);
		var tempmap = comm.arr2Clone(comm.map);		
		step = comm.transformat(info.move);	
		var move = comm.createMove(tempmap,step);
		tmpStr += "<tr><td>"+ move +"</td><td>"+ info.rank +"</td><td>"+ info.score +"</td><td>"+ info.note +"</td></tr>";
	}	
	if(document.getElementById("chessdbDetailTbody")){ 
		document.getElementById("chessdbDetailTbody").innerHTML = tmpStr;
	}
}
comm.getBestMove = function(move) {
	/*对比引擎和云库结果，取分数最大的走法*/
//	var max = 0;
//	for (var i=0;i<cloudinfolist.length && i<1;i++) {
//		var info = cloudinfolist[i];
//		if (comm.getHold() == BLACK) {
//			info.score = -info.score;
//		}	
//		if(max < info.score){
//			max = info.score;
//			move = info.move;
//		}			
//	}
//	for (var i=0;i<depthinfolist.length && i<1;i++) {
//		var info = depthinfolist[depthinfolist.length-1-i];
//		if(max < info.score){
//			max = info.score;
//			move = info.pv[0];
//		}				
//	}
	return comm.transformat(move);
}
/*解析返回的引擎信息*/
comm.DealPosition = function (obj) {
	if(obj.result != null && obj.result != undefined){
		d = obj.result;
		//hostname = obj.hostname ;
		if(d.match("方") || d.match("局面"))	{
			showFloatTip(d);
			/*回调返回函数*/
			myws.Return();
			comm.onGameEnd();		
			return;
		}
		
		if(d.match("checkmate"))	{
			comm.getHold()==RED ? showFloatTip("黑方被将死！！"):showFloatTip("红方被困毙！！");		
			/*回调返回函数*/
			myws.Return();
			comm.onGameEnd();		
			return;
		}
		
		if(d.match("stalemate"))	{
			comm.getHold()==RED ? showFloatTip("红方被困毙！！"):showFloatTip("黑方被困毙！！");				
			/*回调返回函数*/
			myws.Return();
			comm.onGameEnd();		
			return;
		}
		
		if(d.match("invalid"))	{
			showFloatTip("局面无效");			
			/*回调返回函数*/
			myws.Return();
			comm.onGameEnd();		
			return;
		}		
		
		if(d.match(",")){
			comm.DealPosition1(d);
		}
		
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
				Player.aiPace = comm.getBestMove(move);
				setTimeout((function(){Player.serverAIPlay();}),200);
			}		
		}		
		else {
			if (!d.match("depth")) {
				return;
			}
			var info = new comm.depthinfo(d);
			depthinfolist.push(info);
			if (comm.getHold() == BLACK) {
				info.score = -info.score;
			}				
			var tempmap = comm.arr2Clone(comm.map);
			var tmpStr = "";
			cleanLine();
			for (j = 0; j < info.pv.length && j<4; j++) {
				if (info.pv[j]) {
					var step = comm.transformat(info.pv[j]);					
					var move = comm.createMove(tempmap, step);
					tmpStr = tmpStr + move + " ";
					/*走法提示*/
					if (isVerticalReverse) {
						step = comm.reverseStep(step);
					}
					if (isanalyse && j<2) {
						showTipsStep(step,j+1);
					}
				}				
			}				
			if(document.getElementById("computerDetailTbody") && tmpStr.length > 4){ 
				tmpStr = "<tr><td>" + info.depth + "</td><td>" + info.score + "</td><td>" + tmpStr + "</td></tr>";
				document.getElementById("computerDetailTbody").innerHTML = tmpStr + document.getElementById("computerDetailTbody").innerHTML;
			} 		
		}	
	}
	else if(obj.bestmove != undefined )	{
		var move = obj.bestmove;		
		if(move.match("null") || move.match("none")){
			/*回调返回函数*/
			myws.Return();
			comm.onGameEnd();
			return;
		}		
	}
}

/*解析返回的引擎信息*/
comm.DealPosition1 = function (result) {
	var infos = result.split("|");	
	for (i = 0; i < infos.length; i++) {
		info = infos[i].split(",");
		depth = (info[0]/32).toFixed(2);
		score = info[1];
		pv = info[2].split(" ");

		if (comm.getHold() == BLACK) {
			score = -score;
		}				
		var tempmap = comm.arr2Clone(comm.map);
		var tmpStr = "";
		cleanLine();
		for (j = 0; j < pv.length && j<4; j++) {
			if (pv[j]) {
				var step = comm.transformat(pv[j]);					
				var move = comm.createMove(tempmap, step);
				tmpStr = tmpStr + move + " ";
				/*走法提示*/
				if (isVerticalReverse) {
					step = comm.reverseStep(step);
				}
				if (isanalyse && j<2) {
					showTipsStep(step,j+1);
				}
			}				
		}				
		if(document.getElementById("computerDetailTbody") && tmpStr.length > 4){ 
			tmpStr = "<tr><td>" + depth + "</td><td>" + score + "</td><td>" + tmpStr + "</td></tr>";
			document.getElementById("computerDetailTbody").innerHTML = tmpStr + document.getElementById("computerDetailTbody").innerHTML;
		} 	
	}	
	
	var move = pv[0];
	/*回调返回函数*/
	myws.Return();

	if(!isanalyse){			
		Player.aiPace = comm.getBestMove(move);
		setTimeout((function(){Player.serverAIPlay();}),200);
	}		
	
}
/*解析返回的信息*/
comm.DealMessage = function (d) {
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
			Player.aiPace = comm.getBestMove(move);
			setTimeout((function(){Player.serverAIPlay();}),200);
		}		
	}		
	else {
		if (!d.match("depth")) {
			return;
		}
		var info = new comm.depthinfo(d);
		depthinfolist.push(info);
		if (comm.getHold() == BLACK) {
			info.score = -info.score;
		}				
		var tempmap = comm.arr2Clone(comm.map);
		var tmpStr = "";
		cleanLine();
		for (j = 0; j < info.pv.length && j<4; j++) {
			if (info.pv[j]) {
				var step = comm.transformat(info.pv[j]);					
				var move = comm.createMove(tempmap, step);
				tmpStr = tmpStr + move + " ";
				/*走法提示*/
				if (isVerticalReverse) {
					step = comm.reverseStep(step);
				}
				if (isanalyse && j<2) {
					showTipsStep(step,j+1);
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
				comm.DealQueryall(obj.result);
				break;
			case "openbook":
				comm.DealOpenbook(obj);
				break;
			case "position":
				comm.DealPosition(obj);
				comm.historylist[movesIndex].result.push(e);
				break;
			default:
				break;
		}	
		if(obj.openbook != undefined && obj.openbook != ''){
			comm.DealOpenbook1(obj.openbook);
		}
		if(obj.queryall != undefined && obj.queryall != '' && obj.queryall.match(",")){
			comm.DealQueryall(obj.queryall);
		}
	}		
}
/*坐标变换(a-i)->(0-8),(0-9)->(9-0)*/
comm.transformat = function(e){
	var o = e.split("");
	var a = [];
	for(var i=0;i<4;i++){
		a[i] = {"a":"0","b":"1","c":"2","d":"3","e":"4","f":"5","g":"6","h":"7","i":"8","0":"9","1":"8","2":"7","3":"6","4":"5","5":"4","6":"3","7":"2","8":"1","9":"0"}[o[i]] || "";			                      
	}
	return a.join("");
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
/*获取Fen字符串*/
comm.getFen = function(){
	var result = "position fen ";
	var board = comm.getBoard();
	result += board + " - - 0 1";
	if (result.indexOf("k") != -1 && result.indexOf("K") != -1) return result;    
	return "";
}
/*获取query字符串*/
comm.queryall = function(){
	var result = "queryall:";
	var board = comm.getBoard();
	result += board;
	return result;    
}
comm.openbook = function(){
	var result = "openbook:";
	var board = comm.getBoard();
	result += board + " - - 0 1";
	if (result.indexOf("k") != -1 && result.indexOf("K") != -1) return result;    
	return "";
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
            showTipsStep(str);
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
/*XY坐标互换*/
comm.YX2XY = function (e) {
	var m = e.split("");
	var o = [];
	o[0] = m[1];
	o[1] = m[0];
	o[2] = m[3];
	o[3] = m[2];
	return 	o.join("");
}
/*步法转坐标*/
comm.XY2Step = function (move) {	
	return 	move.src.x + "" + move.src.y + move.dst.x + move.dst.y;
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
/*显示走法*/
comm.showStep = function (step){
	var tempmap = comm.arr2Clone(comm.map);
	stepcn = comm.createMove(tempmap, step);
	console.log((movesIndex+1)+":"+stepcn);

//	if(document.getElementById("chessDetailTbody")){ 
//		if(movesIndex%5 == 0) {
//			tempinnerHTML = document.getElementById("chessDetailTbody").innerHTML;
//			chessDetail = "<tr><td>" + (movesIndex+1) + ":" + stepcn + "</td>";
//		}
//		else if(movesIndex%5 == 4){
//			chessDetail += "<td>" + (movesIndex+1) + ":" + stepcn + "</td></tr>";
//		}
//		else {
//			chessDetail += "<td>" + (movesIndex+1) + ":" + stepcn + "</td>";
//		}
//		document.getElementById("chessDetailTbody").innerHTML = tempinnerHTML + chessDetail;
//	}
	if(document.getElementById("chessDetailTbody")){ 
		if(movesIndex%2 == 0) {			
			chessDetail = "<tr><td>" + (parseInt(movesIndex/2)+1) + "</td><td>" + stepcn + "</td><td></td></tr>";
		}		
		else {
			chessDetail = "<tr><td>" + "</td><td>" + stepcn + "</td><td></td></tr>";
		}
		document.getElementById("chessDetailTbody").innerHTML += chessDetail;
	}
}
/*游戏结束*/
comm.onGameEnd = function () {
	if (b_autoset != 0) {
        clearInterval(b_autoset); 
        b_autoset = 0;
    }
    if (r_autoset != 0) {
        clearInterval(r_autoset);   
        r_autoset = 0;
    }    
    if (showThinkset != 0) {
        clearInterval(showThinkset);
        showThinkset = 0;
    }   	
    if($("#blackautoplayTog").hasClass('mui-active')){
        $("#blackautoplayTog").removeClass('mui-active');
        $("#blackautoplayTog").html('<div class="mui-switch-handle"></div>');           
    }
    if($("#redautoplayTog").hasClass('mui-active')){
        $("#redautoplayTog").removeClass('mui-active');
        $("#redautoplayTog").html('<div class="mui-switch-handle"></div>');            
    }
    comm.isend = 1;
    /*锁定，等待1s后解锁*/
    setTimeout((function () {
        waitServerPlay = !1;
        comm.getHold() == BLACK ? o = "红" : o = "黑";
        $("#AIThink").text("游戏结束!");        
    	$("#AIThink").show();
    }), 1000);
}
/*获取分支数量*/
comm.getBrachLength = function () {
	return comm.nodes[currentId].child.length;
}
/*获取当前节点*/
comm.getCurrentNode = function () {
	return comm.nodes[currentId];
}
/*判断是否为第一步*/
comm.isFirst = function () {
	return (movesIndex == 0);
}
/*判断是否为最后一步*/
comm.isEnd = function () {
	return (movesIndex == comm.getMovesLength());
}
/*获取步法的长度*/
comm.getMovesLength = function () {
	moves = comm.getMoves4Server();
	return moves.length;
}
/*转到第几步*/
comm.gotoStep = function (moves, index) {
	cleanLine();
	comm.isend = !1;
	comm.isPlay = !0;
	waitServerPlay = !1;
	cleanChess();
	comm.init(3, comm.cMap, !0);
	currentId = 0;
	if(moves[0].id == 0){
		for (var e = 0; e < index; e++) {		
			Player.stepPlay(moves[e+1].step, !0);
			currentId = moves[e+1].id;
		}
	}
	else {
		for (var e = 0; e < index; e++) {		
			Player.stepPlay(moves[e].step, !0);
			currentId = moves[e].id;
		}
	}
}
/*判断是否在棋盘内*/
comm.CheckInBoard = function (point) {
	return point.x > -1 & point.x < 9 & point.y > -1 & point.y < 10;
}
/* 质朴长存法  */  
comm.pad = function (num, n) {  
    var len = num.toString().length;  
    while(len < n) {  
        num = "0" + num;  
        len++;  
    }  
    return num;  
}
comm.unescapeHTML = function(a){
    a = "" + a;
    return a.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
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
/*判断数组中是否包含某字符串*/  
Array.prototype.contains = function(needle) {  
    for (i in this) {  
        if (this[i].indexOf(needle) > 0)  
            return i;  
    }  
    return -1;  
}  
function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	  	var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
};