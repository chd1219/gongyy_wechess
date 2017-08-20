/*
 * View.js
 * 定义MVC的View
 * 2017-08-20
 * chd
 */

/*定义棋盘类*/
Board = function(){
	/*是否翻转*/
	var isVerticalReverse;
}
/*初始化*/
Board.init = function(e){
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
/*重绘*/
Board.resize = function(){
	
}
/*棋盘参数初始化*/
initChess = function(e, a) {
    var e = e || initMap;
    fullMoves = a || [],
    fullMap = e.concat(),
    moves = fullMoves.concat(),
    comm.init(3, e),
    initBoard(),
    initDots(),
    initPane(),
    initLight()
}
/*扩展棋盘参数初始化*/
initChessEx = function(e, a) {
    var e = e || initMap;
    fullMoves = a || [],
    fullMap = e.concat(),
    moves = fullMoves.concat(),
	comm.init(3, e, !0);
    initBoard(),
    initDots(),
    initPane(),
    initLight()
}
/*清空棋盘*/
cleanChess = function () {
	for (var e = 0; e < comm.map.length; e++){
		for (var a = 0; a < comm.map[e].length; a++) {
			var m = comm.map[e][a];
			if (m)	removeChess(m);
		}
	}		
	comm.hidePane(),
	comm.hideDots(),
	comm.light.visible = !1
}
/*清空扩展棋盘*/
cleanChessEx = function () {
	for (var e = 0; e < comm.sMap.length; e++) {
		for (var a = 0; a < comm.sMap[e].length; a++) {
			var m = comm.sMap[e][a];
			if (m)
				removeChess(m);
		}
	}		
	for (var a = 0; a < chessnum.length; a++) {
		stage.removeChild(chessnum[a])
	}
}
/*棋盘初始化*/
initBoard = function() {
	board = new lib.Board;
	verticalReverseboard = new lib.VerticalReverseBoard;
	if(mode == 5){
		board.y = boardseek;
		verticalReverseboard.y = boardseek;
	}	
	chessBottonLayer.addChild(board)	
}
/*棋盘重置*/
resizeBoard = function() {
	board.y = 0;	
	verticalReverseboard.y = 0;
}
/*初始化提示点*/
initDots = function () {
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
        dots = Dots
    }
}
/*初始化控制板*/
initPane = function () {
    box1 = new res.Box,
    box1.visible = !1,
    chessLayer.addChild(box1),
    box2 = new res.Box,
    box2.visible = !1,
    chessLayer.addChild(box2)
}
/*初始化光圈*/
initLight = function () {
    light = new res.Light,
    light.visible = !1,
    chessBottonLayer.addChild(light)
}
/*设置是否可用*/
setEnable = function (e, a) {
    1 == a ? ($("#" + e).removeAttr("disabled"), $("#" + e).addClass(e), $("#" + e).removeClass(e + "Disable")) : ($("#" + e).attr("disabled", "disabled"), $("#" + e).addClass(e + "Disable"), $("#" + e).removeClass(e))
}
/*清除引擎信息*/
cleanComputerDetail = function() {
	if (mode == 5 && document.getElementById("computerDetailTbody")) {
		document.getElementById("computerDetailTbody").innerHTML = "";
	}        
}
/*清除云库信息*/
cleanChessdbDetail = function() {
	if (mode == 5 && document.getElementById("chessdbDetailTbody")) {
		document.getElementById("chessdbDetailTbody").innerHTML = "";
	}        
}
/*删除棋子*/
removeChess = function(e) {
	try {
		if (e) {
			var o = comm.mans[e].chess;
			o.parent.removeChild(o)
		}
	}
	catch (e) {
		console.log(e);
	}	
}
/*重绘Canvas*/
resizeCanvas = function(){
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
/*重绘Canvas*/
resizeCanvasAnalyse = function () {
	canvas = document.getElementById("chess");
	stageWidth = window.screen.width;
	stageHeight = 0;
	canvasWidth = window.screen.width - 10;
	canvasHeight = canvasWidth / 640 * 866;

	if (mode == 5) {
		stageHeight = (window.screen.width - 10) / 640 * 706 - 10;
	} else {
		stageHeight = window.screen.width / 640 * 866;
	}

	if (stageHeight + 100 > window.screen.height) {
		/*如果屏幕太矮*/
		stageHeight = window.screen.height - 100;
		console.log(stageHeight);
		if (mode == 5) {
			stageWidth = stageHeight / 706 * 640 + 10;
		} else {
			stageWidth = stageHeight / 866 * 640 + 10;
		}
		canvasWidth = stageWidth - 10;
		canvasHeight = canvasWidth / 640 * 866;
	}

	canvas.style.width = canvasWidth + 'px';
	canvas.style.height = canvasHeight + 'px';
	$('.wgo-board').css('width', stageWidth + 'px');
	$('.wgo-board').css('height', stageHeight + 'px');
	$(".mode5").hide();
	$(".mode4").show();
	$(document).attr("title", "开始拆解");
	$(".mui-title").html("开始拆解");
	resizeBoard();
}
/*重绘Canvas*/
resizeCanvasAI = function () {
	canvas = document.getElementById("chess");
	stageWidth = window.screen.width;
	stageHeight = 0;

	canvasWidth = window.screen.width - 10;
	canvasHeight = canvasWidth / 640 * 866;

	if (mode == 5) {
		stageHeight = (window.screen.width - 10) / 640 * 706 - 10;
	} else {
		stageHeight = window.screen.width / 640 * 866;
	}

	if (stageHeight + 100 > window.screen.height) {
		//如果屏幕太矮
		stageHeight = window.screen.height - 100;
		console.log(stageHeight);
		if (mode == 5) {

			stageWidth = stageHeight / 706 * 640 + 10;

		} else {
			stageWidth = stageHeight / 866 * 640 + 10;
		}
		canvasWidth = stageWidth - 10;
		canvasHeight = canvasWidth / 640 * 866;
	}

	canvas.style.width = canvasWidth + 'px';
	canvas.style.height = canvasHeight + 'px';
	$('.wgo-board').css('width', stageWidth + 'px');
	$('.wgo-board').css('height', stageHeight + 'px');
	//console.log('现在的屏幕和canvas的宽度之差为'+window.screen.height+' - '+stageHeight);
	$(".mode5").hide();
	$(".mode4").show();
	$(document).attr("title", "人机对弈");
	$(".mui-title").html("人机对弈");
	resizeBoard();
}
/*初始化Canvas*/
initCanvas = function(e){
	resizeCanvas();
	
	canvas = document.getElementById("chess");
    images = images || {},
    ss = ss || {},
    createjs.Sound.alternateExtensions = ["mp3"],
    createjs.Sound.on("fileload", comm.loadSound),
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
    stage.on("stagemousedown", comm.stageClick),
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
}
/*划线*/
drawLine = function (e, a) {
	var m = e.split("");
	stageshape[a - 1] = new createjs.Shape();
	var graphics = stageshape[a - 1].graphics;

	stagetext[a - 1] = new createjs.Text(a, "16px Arial", "blue");
	stagetext[a - 1].x = comm.pointStartX + comm.spaceX * m[2] + 20;
	stagetext[a - 1].y = comm.pointStartY + comm.spaceY * m[3] + 20;
	stage.addChild(stagetext[a - 1]);

	graphics.beginStroke("red");
	graphics.setStrokeStyle(2);
	graphics.moveTo(comm.pointStartX + comm.spaceX * m[0] + 20, comm.pointStartY + comm.spaceY * m[1] + 20);
	graphics.lineTo(comm.pointStartX + comm.spaceX * m[2] + 20, comm.pointStartY + comm.spaceY * m[3] + 20);

	stage.addChild(stageshape[a - 1]);
	stage.update();
}
/*划线2*/
drawLine2 = function (m, a) {
	stageshape[a - 1] = new createjs.Shape();
	var graphics = stageshape[a - 1].graphics;

	stagetext[a - 1] = new createjs.Text(a, "20px Arial", "blue");
	stagetext[a - 1].x = comm.pointStartX + comm.spaceX * m[2] + 20;
	stagetext[a - 1].y = comm.pointStartY + comm.spaceY * m[3] + 20;
	stage.addChild(stagetext[a - 1]);

	graphics.beginStroke("red");
	graphics.setStrokeStyle(2);
	graphics.moveTo(comm.pointStartX + comm.spaceX * m[0] + 20, comm.pointStartY + comm.spaceY * m[1] + 20);
	graphics.lineTo(comm.pointStartX + comm.spaceX * m[2] + 20, comm.pointStartY + comm.spaceY * m[3] + 20);

	stage.addChild(stageshape[a - 1]);
	stage.update();
}
/*写字*/
drawNum = function (i, j, n) {
	a = i * 6 + j;
	x = j * boardset.outsidescale;
	i == 0 ? y = boardset.boutside : y = boardset.routside;
	chessnum[a] = new createjs.Text(n, "20px Arial", "red");
	chessnum[a].x = comm.pointStartX + comm.spaceX * x + 45;
	chessnum[a].y = comm.pointStartY + comm.spaceY * y - 22;
	stage.addChild(chessnum[a]);
}
/*清除划线和字*/
cleanLine = function () {
	for (var a = 0; a < stagetext.length; a++) {
		stage.removeChild(stagetext[a]),
		stage.removeChild(stageshape[a])
	}
}
enterFrame = function () {
    var e = new Date,
    a = e.getTime(),
    m = a - lastTime;
    Math.round(1e3 / m);
    lastTime = a
}
showMask = function () {
    $("body").css("overflow", "hidden"),
    $("#cover").show(),
    "web" == getEnv() && (console.log("onUserMessage", onUserMessage()), console.log("onUserShare", onUserShare()))
}
hideMask = function () {
    $("body").css("overflow", "auto"),
    $("#cover").hide()
}
hideLoading = function () {
    $("#loading").hide()
}
showBtns = function () {
    $("#mode1").hide();
	$("#mode2").hide();
	$("#mode3").hide();
	$("#mode4").hide();
	$("#mode5").hide();
	(mode == 1 && $("#mode1").show()) || (mode == 2 && $("#mode2").show()) || (mode == 3 && $("#mode3").show()) || (mode == 4 && $("#mode4").show()) || (mode == 5 && $("#mode5").show());
    $("#btnBox").show()
}
showResult = function (e) {
    e ? ($("#gameLose").hide(), $("#gameWin").show(), $("#mode1").hide(), $("#mode2").hide(), $("#mode3").show()) : ($("#gameLose").show(), $("#gameWin").hide(), setEnable("regretBtn", !1)),
    $("#gameResult").show()
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
/*显示控制板*/
showPane = function(e, a, m, o) {
    box1.visible = !0,
    box1.x = comm.spaceX * e + comm.pointStartX + 3 + parseInt(e / 3),
    box1.y = comm.spaceY * a + comm.pointStartY + 4,
    box2.visible = !0,
    box2.x = comm.spaceX * m + comm.pointStartX + 3 + parseInt(m / 3),
    box2.y = comm.spaceY * o + comm.pointStartY + 4 + parseInt(o / 3)
}
/*隐藏控制板*/
hidePane = function() {
    box1.visible = !1,
    box2.visible = !1
}
/*显示提示点*/
showDots = function() {
    for (var e = 0; e < dot.dots.length; e++) {
        var a = dot.dots[e].join(""),
        m = dots[a];
        m.visible = !0
    }
}
/*隐藏提示点*/
hideDots = function() {
    for (var e in dots) dots[e].visible = !1
}
/*创建棋谱2*/
create2 = function () {
	cleanChess(),
	comm.init(3, comm.map, !1);
}
/*创建棋谱*/
create = function () {
	createbroad = !0,
	setEnable("prevBtn2", !1),
	setEnable("nextBtn2", !1),
	comm.pace = [],
	cleanChess();
	comm.init(3, comm.map, !1);
	onCleanBroad();
}
/*清空棋盘*/
cleanChess = function () {
	for (var e = 0; e < comm.map.length; e++){
		for (var a = 0; a < comm.map[e].length; a++) {
			var m = comm.map[e][a];
			if (m)	removeChess(m);
		}
	}		
	hidePane(),
	hideDots(),
	light.visible = !1
}
/*清空扩展棋盘*/
cleanChessEx = function () {
	for (var e = 0; e < comm.sMap.length; e++) {
		for (var a = 0; a < comm.sMap[e].length; a++) {
			var m = comm.sMap[e][a];
			if (m)
				removeChess(m);
		}
	}		
	for (var a = 0; a < chessnum.length; a++) {
		stage.removeChild(chessnum[a])
	}
}
/*刷新函数*/
replayBtnUpdate = function () {
	if (comm.isAnimating) {
		setTimeout(function () {
			replayBtnUpdate();
		}, 200);
		return;
	}
	moves = moves || [];
	var count = 0;
	for (var i = 0; i < moves.length; i++) {
		if (moves[i])
			count++;
	}
	if (count == 0)
		count = comm.paceEx.length;

	0 >= movesIndex ? setEnable("firstBtn", !1) : setEnable("firstBtn", !0),
	0 >= movesIndex ? setEnable("prevBtn", !1) : setEnable("prevBtn", !0),
	movesIndex >= count ? setEnable("nextBtn", !1) : setEnable("nextBtn", !0),
	movesIndex >= count ? setEnable("endBtn", !1) : setEnable("endBtn", !0);
	if (movesIndex >= count && autoreplayset != 0)
		clearInterval(autoreplayset);
	
	if (notes[currentId]) {
		$("#noteInfo").text(notes[currentId]),
		$("#noteInfo").parent('.mui-toast-container').addClass('mui-active');
	} else {
		$("#noteInfo").parent('.mui-toast-container').removeClass('mui-active');
	}
	comm.isAnimating ? setTimeout(function () {
			showThink()
		}, 2000) : showThink();
	if (mode == 5 && comm.nowManKey == !1 && document.getElementById("chessdbDetailTbody")) {
		setTimeout(function () {
			sendMessage(comm.queryall(isVerticalReverse ? comm.arrReverse(comm.map) : comm.map), comm.my);
		}, 1000);
	}
	if (isanalyse) {
		cleanLine();
		if (b_autoset) {
			if ((movesIndex % 2 == 1 && comm.isOffensive) || (movesIndex % 2 == 0 && !comm.isOffensive))
				return;
		}
		if (r_autoset) {
			if ((movesIndex % 2 == 0 && comm.isOffensive) || (movesIndex % 2 == 1 && !comm.isOffensive))
				return;
		}
		setTimeout(function () {
			sendMessage(comm.getFen(isVerticalReverse ? comm.arrReverse(comm.map) : comm.map), comm.my);
		}, 1000);
	}
}
/*显示思考信息*/
showThink = function () {
	 var count = 0;  
    var time = 0;
    count = comm.paceEx.length;
    if( comm.isend == 1) return;
    if (comm.isOffensive == (movesIndex % 2)) {            
        comm.my = -1;
        if (showThinkset != 0) {
            clearInterval(showThinkset);
        }
        showThinkset = setInterval(function(){
        	time++;
        	playtime.black++;
        	$("#AIThink").text("第" + movesIndex + "步 / 总" + count + "步    " + "耗时: 红方 "+ playtime.red+"秒/黑方 "+playtime.black+"秒"), 
        	$("#AIThink").show()
        }, 1000);                   
    }
    else {
        comm.my = 1;            
        if (showThinkset != 0) {
            clearInterval(showThinkset);
        }
        showThinkset = setInterval(function(){
        	time++;
        	playtime.red++;
        	$("#AIThink").text("第" + movesIndex + "步 / 总" + count + "步    " + "耗时: 红方 "+playtime.red+"秒/黑方 "+playtime.black+"秒"), 
        	$("#AIThink").show()
        }, 1000);
    }               	
}