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
	if(mode == playmode.EDITBOARD){
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
    var e = e || InitMap;
    fullMoves = a || [],
    fullMap = e.concat(),
    comm.moves = fullMoves.concat(),
    comm.init(3, e),
    initBoard(),
    initDots(),
    initPane(),
    initLight()
}
/*扩展棋盘参数初始化*/
initChessEx = function(e, a) {
    var e = e || InitMap;
    fullMoves = a || [],
    fullMap = e.concat(),
    comm.moves = fullMoves.concat(),
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
/*棋盘初始化*/
initBoard = function() {
	board = new lib.Board;
	verticalReverseboard = new lib.VerticalReverseBoard;
	if(mode == playmode.EDITBOARD){
		board.y = boardseek;
		verticalReverseboard.y = boardseek;
	}	
	chessBottonLayer.addChild(board)	
}
/*棋盘重置*/
resizeBoard = function() {
	if(mode == playmode.EDITBOARD){
		board.y = boardseek;
		verticalReverseboard.y = boardseek;
	}	
	else {
		board.y = 0;
		verticalReverseboard.y = 0;
	}	
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
			if(mode == playmode.EDITBOARD){
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
	if (document.getElementById("computerDetailTbody")) {
		document.getElementById("computerDetailTbody").innerHTML = "";
	}        
}
/*清除云库信息*/
cleanChessdbDetail = function() {
	if (document.getElementById("chessdbDetailTbody")) {
		document.getElementById("chessdbDetailTbody").innerHTML = "";
	}        
}
/*删除棋子*/
removeChess = function(e) {
	try {
		if (e) {
			var o = comm.mans[e].chess;
			if (o.parent) {
				o.parent.removeChild(o)				
			}
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

	if(mode == playmode.EDITBOARD){
		stageHeight = (window.screen.width - 10)/ 640 * 706 ;
	}else{
		stageHeight = window.screen.width / 640 * 706 ;
		canvasHeight = canvasWidth / 640 * 706;
	}
	if(stageHeight + 100 > window.screen.height){
		/*如果屏幕太矮*/
		stageHeight = window.screen.height - 100;
		console.log(stageHeight);
		if(mode == playmode.EDITBOARD){
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

	if (mode == playmode.ANALYSE) {
		stageHeight = (window.screen.width - 10) / 640 * 706 - 10;
	} else {
		stageHeight = window.screen.width / 640 * 866;
	}

	if (stageHeight + 100 > window.screen.height) {
		/*如果屏幕太矮*/
		stageHeight = window.screen.height - 100;
		console.log(stageHeight);
		if (mode == playmode.ANALYSE) {
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

	if (mode == playmode.AIPLAY) {
		stageHeight = (window.screen.width - 10) / 640 * 706 - 10;
	} else {
		stageHeight = window.screen.width / 640 * 866;
	}

	if (stageHeight + 100 > window.screen.height) {
		//如果屏幕太矮
		stageHeight = window.screen.height - 100;
		console.log(stageHeight);
		if (mode == playmode.AIPLAY) {

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
	$(document).attr("title", "人机对弈");
	$(".mui-title").html("人机对弈");
}
/*初始化Canvas*/
initCanvas = function(e){	
	switch(mode) {
		case playmode.AIPLAY:
			resizeCanvasAI();
			break;
		case playmode.EDITBOARD:
			resizeCanvas();
			break;
		case playmode.ANALYSE:
			resizeCanvasAnalyse();
			break;
		case playmode.REPLAY:
			break;
		case playmode.CREATE:
			break;
		case playmode.ONLINE:
			break;
		default:
			resizeCanvas();
			break;
	}
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
/*显示提示走法*/
showTipsStep = function (e, a) {
	drawLinetmp[a-1] = e;
	switch(isShowArrow) {
		case 0:
			break;
		case 1:
			drawLine(e,a);
			break;
		case 2:
			if (comm.getHold() == BLACK) {
				if(a==1) {
					drawLine(e,a);					
				}
			}
			else {
				if(a==2){
					drawLine(e,a);					
				}
			}
			break;
		case 3:
			if (comm.getHold() == RED) {
				if(a==1) {
					drawLine(e,a);					
				}
			}
			else {
				if(a==2){
					drawLine(e,a);					
				}
			}
			break;
		default:
			break;
	}	
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
    for (var e = 0; e < comm.dot.dots.length; e++) {
        var a = comm.dot.dots[e].join(""),
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
	mode = playmode.EDITBOARD;
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
	var isFirst = comm.isFirst();
	var isEnd = comm.isEnd();
	
	if (mode == playmode.AIPLAY) {
		setEnable("prevBtn",  !isFirst);
	}
	else {
		setEnable("firstBtn", !isFirst);
		setEnable("prevBtn",  !isFirst);
		setEnable("nextBtn", !isEnd);
		setEnable("endBtn", !isEnd);
		setEnable("autoreplayBtn", isanalyse);
	}
	
	if (isEnd)
		clearInterval(autoreplayset);
	movesCount = comm.getMovesLength();
	showThink();
	if (comm.notes[currentId]) {
		$("#noteInfo").text(comm.notes[currentId]),
		$("#noteInfo").parent('.mui-toast-container').addClass('mui-active');
	} else {
		$("#noteInfo").parent('.mui-toast-container').removeClass('mui-active');
	}
}
/*计时*/
OnTimer = function () {
	if (showThinkset != 0)  return;
	/*人机对弈计时从设置完成后开始*/
    if (mode == playmode.AIPLAY && !timingBegins) return;
    
    showThinkset = setInterval(function(){    	
    	if (mode == playmode.EDITBOARD) {
    		clearInterval(showThinkset);
    	}
    	
    	 /*人机对弈计时从设置完成后开始*/
    	if (timingBegins) {
    		comm.getHold() == BLACK ? playtime.black++ : playtime.red++;    		
    	}
    	showThink();
    }, 1000);      
}
/*显示思考信息*/
showThink = function () {
	if (mode == playmode.AIPLAY) {
		$("#AIThink").text("第" + movesIndex + "步 / 总" + movesCount + "步    " + "耗时: 红方 "+ playtime.red+"秒/黑方 "+playtime.black+"秒");		
	}
	else if (mode == playmode.ANALYSE) {
		var str;
		comm.getHold() == BLACK ? str = "黑方思考中。。。" : str = "红方思考中。。。";   
		$("#AIThink").text("第" + movesIndex + "步 / 总" + movesCount + "步    " + str);
		
	}
    $("#AIThink").show()
}
/*弹出DIV*/
popupDiv = function (div_id) {    
	var $div_obj = $("#" + div_id);       
	var windowWidth = $(window).width();          
	var windowHeight = $(window).height();
	var popupHeight = $div_obj.height();      
	var popupWidth = $div_obj.width();            
	if	(div_id == "nextstepdialog"){
		$("<div id='bg1'></div>").width(windowWidth * 0.99)          
							.height(windowHeight * 0.99).click(function() {           
								hideDiv(div_id); 
								cleanLine();								
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
hideDiv = function (div_id) {     
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