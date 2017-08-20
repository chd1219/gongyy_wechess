var serverData = serverData || {};
var fullMap, 
fullMoves, 
moves = [],
movesIndex = 0,
movesTipsShow = !0,
isVerticalReverse = 0,
movesInterval,
voicemode = 1,
autoset,
r_autoset = 0,
b_autoset = 0;
canRestart = !1;
lastTime = 0,
/*棋盘位置偏移*/
boardseek = 80;
commTipsImg,
Dots = {};
/*弹出DIV*/
function popupDiv(div_id) {    
	var $div_obj = $("#" + div_id);       
	var windowWidth = $(window).width();          
	var windowHeight = $(window).height();
	var popupHeight = $div_obj.height();      
	var popupWidth = $div_obj.width();            
	if	(div_id == "nextstepdialog"){
		$("<div id='bg1'></div>").width(windowWidth * 0.99)          
							.height(windowHeight * 0.99).click(function() {           
								hideDiv(div_id); 
								bill.cleanLine();								
							}).appendTo("body").fadeIn(200);
		$div_obj.css({  "position" : "absloute"   	})
			.animate({    
			left : windowWidth / 2 - popupWidth / 2,        
			top : (windowHeight  - popupHeight ) * 0.90,        
			opacity : "show"      
			}, "slow");     
	}
	else{
		$("<div id='bg'></div>").width(windowWidth * 0.99)          
							.height(windowHeight * 0.99).click(function() {           
								hideDiv(div_id);          
							}).appendTo("body").fadeIn(200); 
		$div_obj.css({  "position" : "absloute"   	})
			.animate({    
			left : windowWidth / 2 - popupWidth / 2,        
			top : windowHeight / 2 - popupHeight / 2,        
			opacity : "show"      
			}, "slow");     
	}			     
}    
/*隐藏弹出DIV*/    
function hideDiv(div_id) {     
	if	(div_id == "nextstepdialog"){
		$("#bg1").remove();
		for (i=0;i<countPath;i++){
			$(".chessbaseBtn").remove();
		}
	}
	else{
		$("#bg").remove();
	}
	$("#" + div_id).animate({ 
	left : 0,        
	top : 0,        
	opacity : "hide"     
	}, 
	"slow");  	
}
/*字符大小写互换*/
function ReverseCase(ch){
    if( ch >= 'A' && ch <= 'Z' ) {
    	return ch.toLowerCase();
    }
    if( ch >= 'a' && ch <= 'z' ) {
    	return ch.toUpperCase();
    }
}
/*添加棋子*/
function addChess(e) {
	var scale = 1.15;
    e || (e = "c");	
    var a = new createjs.Container,
    m = LABEL[e],
    o = new m,
    n = new lib.ChessBody;
    return a.body = n,
    a.label = o,
    n.framerate = 24,
    o.framerate = 24,
    n.stop(),
    o.stop(),
	n.scaleX = scale,
	n.scaleY = scale,
	o.scaleX = scale,
	o.scaleY = scale,	
    a.addChild(n),
    a.addChild(o),
    chessLayer.addChild(a),
    a.key = e,
    a
}
/*棋盘初始化*/
function initBoard() {
	board = new lib.Board;
	verticalReverseboard = new lib.VerticalReverseBoard;
	if(mode == 5){
		board.y = boardseek;
		verticalReverseboard.y = boardseek;
	}	
	chessBottonLayer.addChild(board)	
}
/*棋盘重置*/
function resizeBoard() {
	board.y = 0;	
	verticalReverseboard.y = 0;
}
/*初始化提示点*/
function initDots() {
    for (var e = 0; 10 > e; e++) {
        for (var a = 0; 9 > a; a++) {
            var m = new res.Dot,
            o = comm.pointStartX + comm.spaceX * a + parseInt(a / 3),
            n = comm.pointStartY + comm.spaceY * e + parseInt(e / 3);
            m.x = o + 12;			
			/*修改提示点的位置*/			
			if(mode == 5){
				m.y = n + 11 - boardseek;
			}else{
				m.y = n + 11;
				}
            
            m.visible = !1;
            chessTopLayer.addChild(m);
            Dots[a.toString() + e.toString()] = m
        }
        comm.Dots = Dots
    }
}
/*初始化控制板*/
function initPane() {
    comm.box1 = new res.Box,
    comm.box1.visible = !1,
    chessLayer.addChild(comm.box1),
    comm.box2 = new res.Box,
    comm.box2.visible = !1,
    chessLayer.addChild(comm.box2)
}
/*初始化光圈*/
function initLight() {
    comm.light = new res.Light,
    comm.light.visible = !1,
    chessBottonLayer.addChild(comm.light)
}
/*设置是否可用*/
function setEnable(e, a) {
    1 == a ? ($("#" + e).removeAttr("disabled"), $("#" + e).addClass(e), $("#" + e).removeClass(e + "Disable")) : ($("#" + e).attr("disabled", "disabled"), $("#" + e).addClass(e + "Disable"), $("#" + e).removeClass(e))
}
/*清除引擎信息*/
function cleanComputerDetail() {
	if (mode == 5 && document.getElementById("computerDetailTbody")) {
		document.getElementById("computerDetailTbody").innerHTML = "";
	}        
}
/*清除云库信息*/
function cleanChessdbDetail() {
	if (mode == 5 && document.getElementById("chessdbDetailTbody")) {
		document.getElementById("chessdbDetailTbody").innerHTML = "";
	}        
}
/*清空棋盘的棋子*/
function cleanChess() {
    for (var e = 0; e < bill.map.length; e++) for (var a = 0; a < bill.map[e].length; a++) {
        var m = bill.map[e][a];
        removeChess(m);
    }
    comm.hidePane(),
    comm.hideDots(),
    comm.light.visible = !1
}
/*删除棋子*/
function removeChess(e) {
	if (e) {
		var o = comm.mans[e].chess;
		o.parent.removeChild(o)
	}
}
/*获取URL参数*/
function getUrlParam(e) {
    var a = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),
    m = window.location.search.substr(1).match(a);
    return null != m ? unescape(m[2]) : null
}
/*获取运行环境信息*/
function getEnv() {
    var e = navigator.userAgent.toLowerCase();
    return /micromessenger(\/[\d\.]+)*/.test(e) ? "weixin": /qq\/(\/[\d\.]+)*/.test(e) || /qzone\//.test(e) ? "qq": "web"
}
/*加载声音*/
function loadSound(e) {
    fileLoaded(e)
}
/*重绘Canvas*/
function resizeCanvas(){
	canvas = document.getElementById("chess");
	stageWidth = window.screen.width;
	stageHeight = 0;
	canvasWidth =  window.screen.width - 10;
	canvasHeight = canvasWidth / 640 * 866;

	if(mode == 5){
		stageHeight = (window.screen.width - 10)/ 640 * 706 ;
	}else{
		stageHeight = window.screen.width / 640 * 706 ;
		canvasHeight = canvasWidth / 640 * 706;
	}
	if(stageHeight + 100 > window.screen.height){
		/*如果屏幕太矮*/
		stageHeight = window.screen.height - 100;
		console.log(stageHeight);
		if(mode == 5){
			stageWidth = (stageHeight - 20) / 706 * 640 + 10;
			canvasWidth = stageWidth - 10;
			canvasHeight = canvasWidth / 640 * 866;

		}else{
			stageWidth = stageHeight / 706 * 640 + 10;

			canvasHeight = stageHeight - 10;
			canvasWidth = canvasHeight / 706 * 640;
			mui.scrollTo(45,1000);
		}
	}

	canvas.style.width = canvasWidth + 'px';
	canvas.style.height = canvasHeight + 'px';
	$('.wgo-board').css('width',stageWidth+'px');
	$('.wgo-board').css('height',stageHeight+'px');	
}
/*初始化Canvas*/
function initCanvas(e){
	resizeCanvas();
	
	canvas = document.getElementById("chess");
    images = images || {},
    ss = ss || {},
    createjs.Sound.alternateExtensions = ["mp3"],
    createjs.Sound.on("fileload", loadSound),
    createjs.Sound.registerSound(CDN_PATH + "assets/audio/select.mp3", "select"),
    createjs.Sound.registerSound(CDN_PATH + "assets/audio/drop.mp3", "drop"),
    createjs.Sound.registerSound(CDN_PATH + "assets/audio/gamelose.mp3", "gamelose"),
    createjs.Sound.registerSound(CDN_PATH + "assets/audio/gamewin.mp3", "gamewin");
    var a = e.target;
    ss.chess_slim_atlas_ = a.getResult("chess_slim_atlas_"),
    exportRoot = new lib.chess_slim,
    ss.f_atlas_ = a.getResult("f_atlas_"),
    new res.f,
    stage = new createjs.Stage(canvas),
    stage.addChild(exportRoot),
    stage.update(),
    createjs.Touch.enable(stage),
    stage.on("stagemousedown", stageClick),
    chessLayer = comm.chessLayer = new createjs.Container,
    chessLayer.mouseEnabled = !1,
    chessLayer.mouseChildren = !1,
    chessTopLayer = comm.chessTopLayer = new createjs.Container,
    chessTopLayer.mouseEnabled = !1,
    chessTopLayer.mouseChildren = !1,
    chessBottonLayer = comm.chessBottonLayer = new createjs.Container,
    chessBottonLayer.mouseEnabled = !1,
    chessBottonLayer.mouseChildren = !1,
    chessTopLayer.x = chessLayer.x = 0,
    chessTopLayer.y = chessLayer.y = 0,
    stage.addChild(chessBottonLayer),
    stage.addChild(chessLayer),
    stage.addChild(chessTopLayer),
    createjs.Ticker.setFPS(lib.properties.fps),
    createjs.Ticker.addEventListener("tick", stage),
	createjs.Ticker.addEventListener("tick", enterFrame),	
	setTimeout(hideLoading, 200),	
    commTipsImg = new Image,
    commTipsImg.src = CDN_PATH + "assets/images/commTips.png";	
	
	comm.init();
}
/*响应Canvas点击事件*/
function stageClick(e) {
    mode == MODE_REPLAY && comm.clickCanvas(e),
	mode == MODE_BILL && bill.clickCanvas(e),
    mode == MODE_BILLREPLAY && bill.clickCanvas(e)
}
/*弹出提示信息*/
function showFloatTip(e, a) {
    function m(e) {
        e.parent.removeChild(e)
    }
    a = a || 1200;
    var o = getTips(e);
    o.alpha = 0;
    var n = o.getBounds().width,
    t = (640 - n) / 2 - 50;
    o.x = t,
    o.y = 300,
    comm.chessTopLayer.addChild(o),
    createjs.Tween.get(o).to({
        alpha: 1
    },
    500).wait(a).to({
        alpha: 0
    },
    1e3).call(m, [o])
}
/*生成提示信息*/
getTips = function(e) {
    var e = new createjs.Text(e, "30px Arial", "#FFE5B4");
    e.x = 60,
    e.y = 34;
    var a = e.getBounds(),
    m = new createjs.ScaleBitmap(commTipsImg, new createjs.Rectangle(24, 24, 51, 43));
    m.setDrawSize(a.width + 100, 100);
    var o = new createjs.Container;
    return o.addChild(m),
    o.addChild(e),
    o
}
/*判断字符串是否为JSON格式*/
function isJSON(str) {
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
/*定义棋子类*/
Man = function(e, a, m) {
    this.pater = e.slice(0, 1);
    var o = comm.args[this.pater];
    this.x = a || 0,
    this.y = m || 0,
    this.key = e,
    this.my = o.my,
    this.text = o.text,
    this.value = o.value,
    this.isShow = !0,
    this.ps = [];
	var pointSeek = 15;
    this.move = function() {
        var e = comm.spaceX * this.x + comm.pointStartX - pointSeek,
        a = comm.spaceY * this.y + comm.pointStartY - pointSeek;
        this.chess.x = e - 80,
        this.chess.y = a - 70
    },
    this.animate = function() {
        function e() {}
        var a = comm.spaceX * this.x + comm.pointStartX - pointSeek,
        m = comm.spaceY * this.y + comm.pointStartY - pointSeek,
        o = a - 80,
        n = m - 70;
        bill.isAnimating = !0,
        this.chess.body.addEventListener("dropEnd", this.onDropEnd),
        this.chess.body.gotoAndPlay(0),
        this.chess.label.gotoAndPlay(0),
        comm.chessTopLayer.addChild(this.chess),
        createjs.Tween.get(this.chess).to({
            x: o,
            y: n
        },
        200).call(e)
    },
    this.onDropEnd = function(e) {
        var a = e.target.parent;
        e.target.currentFrame;
        a.label.gotoAndStop(0),
        a.body.gotoAndStop(0),
        a.body.removeEventListener("dropEnd", this.onDropEnd),
        comm.chessLayer.addChild(a),
        bill.onChessDrop()
    },
    this.bl = function(e) {
        var e = e || bill.map;
        return comm.bylaw[o.bl](parseInt(this.x), parseInt(this.y), e, this.my)
    }
}
comm = comm || {};
comm.notes = [];
comm.emptyMap = [
	[, , , , , , , , ""], 
	[, , , , , , , , ""],
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""]
 ]
comm.initMap = [
	["C0", "M0", "X0", "S0", "J0", "S1", "X1", "M1", "C1"], 
	[, , , , , , , , ""], 
	[, "P0", , , , , , "P1","",], 
	["Z0", , "Z1", , "Z2", , "Z3", , "Z4"], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	["z0", , "z1", , "z2", , "z3", , "z4"], 
	[, "p0", , , , , , "p1",""], 
	[, , , , , , , , ""], 
	["c0", "m0", "x0", "s0", "j0", "s1", "x1", "m1", "c1"]
]
/*显示提示点*/
comm.showDots = function() {
    for (var e = 0; e < comm.dot.dots.length; e++) {
        var a = comm.dot.dots[e].join(""),
        m = comm.Dots[a];
        m.visible = !0
    }
}
/*隐藏提示点*/
comm.hideDots = function() {
    for (var e in comm.Dots) comm.Dots[e].visible = !1
}
/*初始化参数*/
comm.init = function(e) {
    comm.width = canvas.width,
    comm.height = canvas.height,
    comm.spaceX = 69,
    comm.spaceY = 69;
	if(mode == 5 && createbroad == 1){
		comm.pointStartX = 22;
    	comm.pointStartY = 22+boardseek;
	}else{
		comm.pointStartX = 22;
   		comm.pointStartY = 22;
	}	
}
/*id2name*/
comm.id2name = {
	16 : "J", 17 : "S", 18 : "X", 19 : "M", 20 : "C", 21 : "P", 22 : "Z", 8 : "j", 9 : "s", 10 : "x", 11 : "m", 12 : "c", 13 : "p", 14 : "z"
}
/*name2id*/
comm.name2id = {
	J: 16, S: 17, X: 18, M: 19, C: 20, P: 21, Z: 22, j: 8, s: 9, x: 10, m: 11, c: 12, p: 13, z: 14
}
/*解析棋盘数组*/
comm.parseMap = function(e) {
    for (var a = e,
    m = comm.emptyMap.concat(), o = {},
    n = 0; n < a.length; n++) {
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
    for (var a = e,
    n = 0; n < a.length; n++) {
        var t = a[n].id+1;
		bill.notes.length = t,
		bill.notes[t-1] = a[n].note;        
    }	
}
/*解析走法信息*/
comm.parseMoves = function(e) {
    for (var a = e,
    m = 0; m < a.length; m++) a[m].src.x = a[m].src.x - 1,
    a[m].dst.x = a[m].dst.x - 1,
    a[m].src.y = 9 - (a[m].src.y - 1),
    a[m].dst.y = 9 - (a[m].dst.y - 1),
    delete a[m].redBlack,
    delete a[m].reserved,
    delete a[m].reserved2,
    delete a[m].reserved3,
    delete a[m].cid,
    delete a[m].order;
    return a
}
/*解析扩展走法信息*/
comm.parseMovesEx = function(e) {
    for (var a = [],m = 0; m < e.length; m++) {
		if(a[e[m].index]){
			a[e[m].index].push([e[m].step,e[m].id,e[m].perid]);
		}
		else{
			a[e[m].index] = new Array();
			a[e[m].index].push([e[m].step,e[m].id,e[m].perid]);
		}		
	}
	bill.paceEx = a;
    return a
}
/*棋盘参数初始化*/
comm.initChess = function(e, a) {
    bill.isPlay = !0;
    var e = e || comm.initMap;
    fullMoves = a || [],
    fullMap = e.concat(),
    moves = fullMoves.concat(),
    bill.init(3, e),
    initBoard(),
    initDots(),
    initPane(),
    initLight(),
    showBtns();
}
/*扩展棋盘参数初始化*/
comm.initChessEx = function(e, a) {
    bill.isPlay = !0;
    var e = e || comm.initMap;
    fullMoves = a || [],
    fullMap = e.concat(),
    moves = fullMoves.concat(),
	bill.init(3, e, !0);
    initBoard(),
    initDots(),
    initPane(),
    initLight(),
    showBtns()
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
comm.getMap6Server = function(e) {
	var map6server = "";
    for (var a = 10,
    m = 0; m < e.length; m++) {
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
    map4server = [];
    for (var a = 10,
    m = 0; m < e.length; m++) {
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
    for (var e = [], a = 0; a < bill.pace.length; a++) {
        var m = bill.pace[a].split(""),
        o = {
            src: {
                x: (parseInt(m[0]) + 1).toString(),
                y: (10 - parseInt(m[1])).toString()
            },
            dst: {
                x: (parseInt(m[2]) + 1).toString(),
                y: (10 - parseInt(m[3])).toString()
            }
        };
        e[a] = o
    }
    return e
}
comm.getMoves6Server = function() {	
	var e = "",o = "";
    for (var a = 0; a < bill.pace.length; a++) {
        var m = bill.pace[a].split("");
        o = " "+(parseInt(m[0])+1)+" "+(10-parseInt(m[1]))+" "+(parseInt(m[2])+1)+" "+(10-parseInt(m[3]));            
        e += o;
    }
    return e
}
/*显示控制板*/
comm.showPane = function(e, a, m, o) {
    comm.box1.visible = !0,
    comm.box1.x = comm.spaceX * e + comm.pointStartX + 3 + parseInt(e / 3),
    comm.box1.y = comm.spaceY * a + comm.pointStartY + 4,
    comm.box2.visible = !0,
    comm.box2.x = comm.spaceX * m + comm.pointStartX + 3 + parseInt(m / 3),
    comm.box2.y = comm.spaceY * o + comm.pointStartY + 4 + parseInt(o / 3)
}
/*隐藏控制板*/
comm.hidePane = function() {
    comm.box1.visible = !1,
    comm.box2.visible = !1
}
/*批量创建棋子*/
comm.createMans = function(e) {
    for (var a = 0; a < e.length; a++) for (var m = 0; m < e[a].length; m++) {
        var o = e[a][m];
        if (o) {
			comm.createMan(a, m, o);
        }
    }
}
/*创建单个棋子*/
comm.createMan = function(a, m, o) {
	var n = new Man(o);
	n.x = m,
	n.y = a,
	comm.mans[o] = n;
	var t = addChess(n.pater);
	n.chess = t,
	n.move()
}
/*发送棋谱信息*/
comm.send = function(e) {
	var a = {};
	a.map = comm.moves4Server,
	a.moves = comm.getMoves4Server();
	var m = -1;
	serverData.head && (m = serverData.head.id),
	a.head = {
		id: m.toString(),
		totalMove: (a.moves.length).toString()
	},
	serverData.meta ? a.meta = serverData.meta: a.meta = {},
	a.meta.FUPAN_TITLE = chapterTitle,
	a.meta.FUPAN_JSON_FROM = "H5",
	a.time =  new Date(),
	console.log("toServerData", a),
	console.log(JSON.stringify(a));
	var o = JSON.stringify(a);
	comm.filename = window.md5(o),
	comm.movesNum = a.moves.length;
	if ( comm.movesNum == 0){
		showFloatTip("还没开始下棋呢");
		return;
	}

	var map = comm.getMap6Server(comm.initMap);
	var moves = comm.getMoves6Server();
	var _json = {"map": map, "moves":moves, "filename":comm.filename};
	$.ajax({
		type: "POST",
		url: saveURL,
		dataType: "text",		
		data: _json,
		success: function(response,status,xhr) {
			console.log(_json);
			var href = replayURL+'&file='+comm.filename;	
			popupDiv('replaydialog');
			$('#replaydialog').on('click', '.btn_dialog_cancle', function () {                    
							hideDiv('replaydialog');
							})
						 .on('click', '.btn_dialog_ok', function () {					
							hideDiv('replaydialog');
							window.parent.location.href = href;								
						});			
		},
		error: function(response,status,xhr){
			alert(status);
		}
	})
}
/*数组克隆*/
comm.arr2Clone = function(e) {
    for (var a = [], m = 0; m < e.length; m++) a[m] = e[m].slice();
    return a
}
/*数组翻转*/
comm.arrReverse = function(e) {
    for (var a = [], m = 0; m < e.length; m++) a[m] = e[e.length-1-m].slice().reverse();
    return a
}
comm.keys = {
	c0: "c", c1: "c", m0: "m", m1: "m", x0: "x", x1: "x", s0: "s", s1: "s", j0: "j", p0: "p", p1: "p", z0: "z", z1: "z", z2: "z", z3: "z", z4: "z", z5: "z", C0: "c", C1: "C", M0: "M", M1: "M", X0: "X", X1: "X", S0: "S", S1: "S", J0: "J", P0: "P", P1: "P", Z0: "Z", Z1: "Z", Z2: "Z", Z3: "Z", Z4: "Z", Z5: "Z"
	}
/*棋子的走法限制*/
comm.bylaw = {};
comm.bylaw.c = function(e, a, m, o) {
	var n = [];
    for (var t = e - 1; t >= 0; t--) {
        if (m[a][t]) {
            comm.mans[m[a][t]].my != o && n.push([t, a]);
            break
        }
        n.push([t, a])
    }
    for (var t = e + 1; 8 >= t; t++) {
        if (m[a][t]) {
            comm.mans[m[a][t]].my != o && n.push([t, a]);
            break
        }
        n.push([t, a])
    }
    for (var t = a - 1; t >= 0; t--) {
        if (m[t][e]) {
            comm.mans[m[t][e]].my != o && n.push([e, t]);
            break
        }
        n.push([e, t])
    }
    for (var t = a + 1; 9 >= t; t++) {
        if (m[t][e]) {
            comm.mans[m[t][e]].my != o && n.push([e, t]);
            break
        }
        n.push([e, t])
    }
    return n
}
comm.bylaw.m = function(e, a, m, o) {
    var n = [];
    return ! (a - 2 >= 0 && 8 >= e + 1) || bill.map[a - 1][e] || comm.mans[m[a - 2][e + 1]] && comm.mans[m[a - 2][e + 1]].my == o || n.push([e + 1, a - 2]),
    !(a - 1 >= 0 && 8 >= e + 2) || bill.map[a][e + 1] || comm.mans[m[a - 1][e + 2]] && comm.mans[m[a - 1][e + 2]].my == o || n.push([e + 2, a - 1]),
    !(9 >= a + 1 && 8 >= e + 2) || bill.map[a][e + 1] || comm.mans[m[a + 1][e + 2]] && comm.mans[m[a + 1][e + 2]].my == o || n.push([e + 2, a + 1]),
    !(9 >= a + 2 && 8 >= e + 1) || bill.map[a + 1][e] || comm.mans[m[a + 2][e + 1]] && comm.mans[m[a + 2][e + 1]].my == o || n.push([e + 1, a + 2]),
    !(9 >= a + 2 && e - 1 >= 0) || bill.map[a + 1][e] || comm.mans[m[a + 2][e - 1]] && comm.mans[m[a + 2][e - 1]].my == o || n.push([e - 1, a + 2]),
    !(9 >= a + 1 && e - 2 >= 0) || bill.map[a][e - 1] || comm.mans[m[a + 1][e - 2]] && comm.mans[m[a + 1][e - 2]].my == o || n.push([e - 2, a + 1]),
    !(a - 1 >= 0 && e - 2 >= 0) || bill.map[a][e - 1] || comm.mans[m[a - 1][e - 2]] && comm.mans[m[a - 1][e - 2]].my == o || n.push([e - 2, a - 1]),
    !(a - 2 >= 0 && e - 1 >= 0) || bill.map[a - 1][e] || comm.mans[m[a - 2][e - 1]] && comm.mans[m[a - 2][e - 1]].my == o || n.push([e - 1, a - 2]),
    n
}
comm.bylaw.x = function(e, a, m, o) {
    var n = [];
    return ((isVerticalReverse == 0 && 1 === o) || (isVerticalReverse == 1 && -1 === o)) ? (!(9 >= a + 2 && 8 >= e + 2) || bill.map[a + 1][e + 1] || comm.mans[m[a + 2][e + 2]] && comm.mans[m[a + 2][e + 2]].my == o || n.push([e + 2, a + 2]), !(9 >= a + 2 && e - 2 >= 0) || bill.map[a + 1][e - 1] || comm.mans[m[a + 2][e - 2]] && comm.mans[m[a + 2][e - 2]].my == o || n.push([e - 2, a + 2]), !(a - 2 >= 5 && 8 >= e + 2) || bill.map[a - 1][e + 1] || comm.mans[m[a - 2][e + 2]] && comm.mans[m[a - 2][e + 2]].my == o || n.push([e + 2, a - 2]), !(a - 2 >= 5 && e - 2 >= 0) || bill.map[a - 1][e - 1] || comm.mans[m[a - 2][e - 2]] && comm.mans[m[a - 2][e - 2]].my == o || n.push([e - 2, a - 2])) : (!(4 >= a + 2 && 8 >= e + 2) || bill.map[a + 1][e + 1] || comm.mans[m[a + 2][e + 2]] && comm.mans[m[a + 2][e + 2]].my == o || n.push([e + 2, a + 2]), !(4 >= a + 2 && e - 2 >= 0) || bill.map[a + 1][e - 1] || comm.mans[m[a + 2][e - 2]] && comm.mans[m[a + 2][e - 2]].my == o || n.push([e - 2, a + 2]), !(a - 2 >= 0 && 8 >= e + 2) || bill.map[a - 1][e + 1] || comm.mans[m[a - 2][e + 2]] && comm.mans[m[a - 2][e + 2]].my == o || n.push([e + 2, a - 2]), !(a - 2 >= 0 && e - 2 >= 0) || bill.map[a - 1][e - 1] || comm.mans[m[a - 2][e - 2]] && comm.mans[m[a - 2][e - 2]].my == o || n.push([e - 2, a - 2])),n 
}
comm.bylaw.s = function(e, a, m, o) {
    var n = [];
    return ((isVerticalReverse == 0 && 1 === o) || (isVerticalReverse == 1 && -1 === o)) ? (9 >= a + 1 && 5 >= e + 1 && (!comm.mans[m[a + 1][e + 1]] || comm.mans[m[a + 1][e + 1]].my != o) && n.push([e + 1, a + 1]), 9 >= a + 1 && e - 1 >= 3 && (!comm.mans[m[a + 1][e - 1]] || comm.mans[m[a + 1][e - 1]].my != o) && n.push([e - 1, a + 1]), a - 1 >= 7 && 5 >= e + 1 && (!comm.mans[m[a - 1][e + 1]] || comm.mans[m[a - 1][e + 1]].my != o) && n.push([e + 1, a - 1]), a - 1 >= 7 && e - 1 >= 3 && (!comm.mans[m[a - 1][e - 1]] || comm.mans[m[a - 1][e - 1]].my != o) && n.push([e - 1, a - 1])) : (2 >= a + 1 && 5 >= e + 1 && (!comm.mans[m[a + 1][e + 1]] || comm.mans[m[a + 1][e + 1]].my != o) && n.push([e + 1, a + 1]), 2 >= a + 1 && e - 1 >= 3 && (!comm.mans[m[a + 1][e - 1]] || comm.mans[m[a + 1][e - 1]].my != o) && n.push([e - 1, a + 1]), a - 1 >= 0 && 5 >= e + 1 && (!comm.mans[m[a - 1][e + 1]] || comm.mans[m[a - 1][e + 1]].my != o) && n.push([e + 1, a - 1]), a - 1 >= 0 && e - 1 >= 3 && (!comm.mans[m[a - 1][e - 1]] || comm.mans[m[a - 1][e - 1]].my != o) && n.push([e - 1, a - 1])), n
}
comm.bylaw.j = function(e, a, m, o) {
    var n = [],
    t = function(e, a) {
        for (var e = comm.mans.j0.y,
        o = comm.mans.J0.x,
        a = comm.mans.J0.y,
        n = e - 1; n > a; n--) if (m[n][o]) return ! 1;
        return ! 0
    } ();
     return ((isVerticalReverse == 0 && 1 === o) || (isVerticalReverse == 1 && -1 === o)) ? (9 >= a + 1 && (!comm.mans[m[a + 1][e]] || comm.mans[m[a + 1][e]].my != o) && n.push([e, a + 1]), a - 1 >= 7 && (!comm.mans[m[a - 1][e]] || comm.mans[m[a - 1][e]].my != o) && n.push([e, a - 1]), comm.mans.j0.x == comm.mans.J0.x && t && n.push([comm.mans.J0.x, comm.mans.J0.y])) : (2 >= a + 1 && (!comm.mans[m[a + 1][e]] || comm.mans[m[a + 1][e]].my != o) && n.push([e, a + 1]), a - 1 >= 0 && (!comm.mans[m[a - 1][e]] || comm.mans[m[a - 1][e]].my != o) && n.push([e, a - 1]), comm.mans.j0.x == comm.mans.J0.x && t && n.push([comm.mans.j0.x, comm.mans.j0.y])), 5 >= e + 1 && (!comm.mans[m[a][e + 1]] || comm.mans[m[a][e + 1]].my != o) && n.push([e + 1, a]),e - 1 >= 3 && (!comm.mans[m[a][e - 1]] || comm.mans[m[a][e - 1]].my != o) && n.push([e - 1, a]), n
}
comm.bylaw.p = function(e, a, m, o) {
    for (var n = [], t = 0, s = e - 1; s >= 0; s--) {
        if (m[a][s]) {
            if (0 == t) {
                t++;
                continue
            }
            comm.mans[m[a][s]].my != o && n.push([s, a]);
            break
        }
        0 == t && n.push([s, a])
    }
    for (var t = 0,
    s = e + 1; 8 >= s; s++) {
        if (m[a][s]) {
            if (0 == t) {
                t++;
                continue
            }
            comm.mans[m[a][s]].my != o && n.push([s, a]);
            break
        }
        0 == t && n.push([s, a])
    }
    for (var t = 0,
    s = a - 1; s >= 0; s--) {
        if (m[s][e]) {
            if (0 == t) {
                t++;
                continue
            }
            comm.mans[m[s][e]].my != o && n.push([e, s]);
            break
        }
        0 == t && n.push([e, s])
    }
    for (var t = 0,
    s = a + 1; 9 >= s; s++) {
        if (m[s][e]) {
            if (0 == t) {
                t++;
                continue
            }
            comm.mans[m[s][e]].my != o && n.push([e, s]);
            break
        }
        0 == t && n.push([e, s])
    }
    return n
}
comm.bylaw.z = function(e, a, m, o) {
    var n = [];
    return ((isVerticalReverse == 0 && 1 === o) || (isVerticalReverse == 1 && -1 === o)) ? ( a - 1 >= 0 && (!comm.mans[m[a - 1][e]] || comm.mans[m[a - 1][e]].my != o) && n.push([e, a - 1]), 8 >= e + 1 && 4 >= a && (!comm.mans[m[a][e + 1]] || comm.mans[m[a][e + 1]].my != o) && n.push([e + 1, a]), e - 1 >= 0 && 4 >= a && (!comm.mans[m[a][e - 1]] || comm.mans[m[a][e - 1]].my != o) && n.push([e - 1, a]) ) : ( 9 >= a + 1 && (!comm.mans[m[a + 1][e]] || comm.mans[m[a + 1][e]].my != o) && n.push([e, a + 1]), 8 >= e + 1 && a >= 5 && (!comm.mans[m[a][e + 1]] || comm.mans[m[a][e + 1]].my != o) && n.push([e + 1, a]), e - 1 >= 0 && a >= 5 && (!comm.mans[m[a][e - 1]] || comm.mans[m[a][e - 1]].my != o) && n.push([e - 1, a]) ), n	
}
/*棋子的权重*/
comm.value = {
    c: [[206, 208, 207, 213, 214, 213, 207, 208, 206], [206, 212, 209, 216, 233, 216, 209, 212, 206], [206, 208, 207, 214, 216, 214, 207, 208, 206], [206, 213, 213, 216, 216, 216, 213, 213, 206], [208, 211, 211, 214, 215, 214, 211, 211, 208], [208, 212, 212, 214, 215, 214, 212, 212, 208], [204, 209, 204, 212, 214, 212, 204, 209, 204], [198, 208, 204, 212, 212, 212, 204, 208, 198], [200, 208, 206, 212, 200, 212, 206, 208, 200], [194, 206, 204, 212, 200, 212, 204, 206, 194]],
    m: [[90, 90, 90, 96, 90, 96, 90, 90, 90], [90, 96, 103, 97, 94, 97, 103, 96, 90], [92, 98, 99, 103, 99, 103, 99, 98, 92], [93, 108, 100, 107, 100, 107, 100, 108, 93], [90, 100, 99, 103, 104, 103, 99, 100, 90], [90, 98, 101, 102, 103, 102, 101, 98, 90], [92, 94, 98, 95, 98, 95, 98, 94, 92], [93, 92, 94, 95, 92, 95, 94, 92, 93], [85, 90, 92, 93, 78, 93, 92, 90, 85], [88, 85, 90, 88, 90, 88, 90, 85, 88]],
    x: [[0, 0, 20, 0, 0, 0, 20, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 23, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 20, 0, 0, 0, 20, 0, 0], [0, 0, 20, 0, 0, 0, 20, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [18, 0, 0, 0, 23, 0, 0, 0, 18], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 20, 0, 0, 0, 20, 0, 0]],
    s: [[0, 0, 0, 20, 0, 20, 0, 0, 0], [0, 0, 0, 0, 23, 0, 0, 0, 0], [0, 0, 0, 20, 0, 20, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 20, 0, 20, 0, 0, 0], [0, 0, 0, 0, 23, 0, 0, 0, 0], [0, 0, 0, 20, 0, 20, 0, 0, 0]],
    j: [[0, 0, 0, 8888, 8888, 8888, 0, 0, 0], [0, 0, 0, 8888, 8888, 8888, 0, 0, 0], [0, 0, 0, 8888, 8888, 8888, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 8888, 8888, 8888, 0, 0, 0], [0, 0, 0, 8888, 8888, 8888, 0, 0, 0], [0, 0, 0, 8888, 8888, 8888, 0, 0, 0]],
    p: [[100, 100, 96, 91, 90, 91, 96, 100, 100], [98, 98, 96, 92, 89, 92, 96, 98, 98], [97, 97, 96, 91, 92, 91, 96, 97, 97], [96, 99, 99, 98, 100, 98, 99, 99, 96], [96, 96, 96, 96, 100, 96, 96, 96, 96], [95, 96, 99, 96, 100, 96, 99, 96, 95], [96, 96, 96, 96, 96, 96, 96, 96, 96], [97, 96, 100, 99, 101, 99, 100, 96, 97], [96, 97, 98, 98, 98, 98, 98, 97, 96], [96, 96, 97, 99, 99, 99, 97, 96, 96]],
    z: [[9, 9, 9, 11, 13, 11, 9, 9, 9], [19, 24, 34, 42, 44, 42, 34, 24, 19], [19, 24, 32, 37, 37, 37, 32, 24, 19], [19, 23, 27, 29, 30, 29, 27, 23, 19], [14, 18, 20, 27, 29, 27, 20, 18, 14], [7, 0, 13, 0, 16, 0, 13, 0, 7], [7, 0, 7, 0, 15, 0, 7, 0, 7], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]]
}
comm.value.C = comm.arr2Clone(comm.value.c).reverse();
comm.value.M = comm.arr2Clone(comm.value.m).reverse();
comm.value.X = comm.value.x;
comm.value.S = comm.value.s;
comm.value.J = comm.value.j;
comm.value.P = comm.arr2Clone(comm.value.p).reverse();
comm.value.Z = comm.arr2Clone(comm.value.z).reverse();
/*棋子参数*/
comm.args = {
    c: { text: "車", img: "r_c", my: 1, bl: "c", value: comm.value.c },
    m: { text: "馬", img: "r_m", my: 1, bl: "m", value: comm.value.m },
    x: { text: "相", img: "r_x", my: 1, bl: "x", value: comm.value.x },
    s: { text: "仕", img: "r_s", my: 1, bl: "s", value: comm.value.s },
    j: { text: "帅", img: "r_j", my: 1, bl: "j", value: comm.value.j },
    p: { text: "炮", img: "r_p", my: 1, bl: "p", value: comm.value.p },
    z: { text: "兵", img: "r_z", my: 1, bl: "z", value: comm.value.z },
    C: { text: "车", img: "b_c", my: -1, bl: "c", value: comm.value.C },
    M: { text: "马", img: "b_m", my: -1, bl: "m", value: comm.value.M },
    X: { text: "象", img: "b_x", my: -1, bl: "x", value: comm.value.X },
    S: { text: "士", img: "b_s", my: -1, bl: "s", value: comm.value.S },
    J: { text: "将", img: "b_j", my: -1, bl: "j", value: comm.value.J },
    P: { text: "炮", img: "b_p", my: -1, bl: "p", value: comm.value.P },
    Z: { text: "卒", img: "b_z", my: -1, bl: "z", value: comm.value.Z }
}
/*生成红子着法*/
comm.createRedMove = function(man,x,y,newX,newY,flag) {
	var h="";
	var mumTo=["一","二","三","四","五","六","七","八","九","十"];    
    newX=8-newX;
    h+= mumTo[8-x];
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
	        if (man.my===1){
	            h += comm.createRedMove(man,x,y,newX,newY,!0);
	        }else{
	            h += comm.createBlackMove(man,x,y,newX,newY,!0);
	        }       
	    }
	    else {
	        man = comm.mans[map[9-y][8-x]];
	        h+= man.text;
	        map[9-newY][8-newX] = map[9-y][8-x];
	        delete map[9-y][8-x];
	        if (man.my===-1){
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
	        if (man.my===1){
	            h += comm.createRedMove(man,x,y,newX,newY,!1);
	        }else{
	            h += comm.createBlackMove(man,x,y,newX,newY,!1);
	        }          
	    }
	    else {        
	        if (man.my===-1){
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
