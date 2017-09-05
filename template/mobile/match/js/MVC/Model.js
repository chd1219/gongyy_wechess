/*
 * Model.js
 * 实现主要业务逻辑
 * 2017-08-20
 * chd
 */
    
/*初始化*/
initialization = function (e) {
	initCanvas(e);
	comm.dot = {
        dots: []
       };
    comm.mans = {};	
    Board.init(e);
    initChess(comm.initMap);
}
/*获取运行环境信息*/
getEnv = function () {
    var e = navigator.userAgent.toLowerCase();
    return /micromessenger(\/[\d\.]+)*/.test(e) ? "weixin": /qq\/(\/[\d\.]+)*/.test(e) || /qzone\//.test(e) ? "qq": "web"
}
/*电脑执黑*/
onBluePlay = function () {
	b_autoset != 0 ? (showFloatTip("取消电脑执黑"), waitServerPlay = !1, clearInterval(b_autoset), b_autoset = 0, cleanComputerDetail()) : (
		showFloatTip("电脑执黑"),
		comm.cancleanalyse(),
		b_autoset = setInterval(function () {
				if (waitServerPlay)
					return;
				if (comm.getHold() == BLACK) {
					Player.AIPlay();
				}
			}, 2000));
}
/*电脑执红*/
onRedPlay = function () {
	r_autoset != 0 ? (showFloatTip("取消电脑执红"), waitServerPlay = !1, clearInterval(r_autoset), r_autoset = 0, cleanComputerDetail()) : (
		showFloatTip("电脑执红"),
		comm.cancleanalyse(),
		r_autoset = setInterval(function () {
				if (waitServerPlay)
					return;
				if (comm.getHold() == RED) {
					Player.AIPlay();
				}
			}, 2000))
}
/*悔棋*/
onRegret = function () {
	if (b_autoset != 0 || r_autoset != 0) {
		showFloatTip("请取消电脑思考，再点击悔棋");
		return;
	}
	if (comm.nodes.length == 0) {
		showFloatTip("还没开始下棋呢");
		return;
	}
	if (comm.getBrachLength() > 0) {
		showFloatTip("不是最后一步");
		return;
	}

	cleanLine();
	comm.isend = !1,
	comm.isPlay = !0,
	comm.moves = comm.getMoves4ServerEx(-1);
	cleanChess();
	isVerticalReverse ? comm.init(3, comm.arrReverse(comm.cMap), !0) : comm.init(3, comm.cMap, !0);
	if (movesIndex > 0) {
		movesIndex--;
		for (var e = 0; movesIndex > e; e++)
			Player.stepPlay(comm.moves[e].src, comm.moves[e].dst, !0);
	}
	comm.moves.length--;
	replayBtnUpdate();
}
/*发送棋谱*/
onSend = function (e) {
	var a = {};
	a.map = comm.moves4Server,
	a.moves = comm.getMoves4Server();
	var m = -1;
	serverData.head && (m = serverData.head.id),
	a.head = {
		id: m,
		totalMove: a.moves.length
	},
	serverData.meta ? a.meta = serverData.meta : a.meta = {},
	a.meta.FUPAN_TITLE = chapterTitle,
	a.meta.FUPAN_JSON_FROM = "H5",
	console.log("toServerData", a),
	console.log(JSON.stringify(a));
	var o = JSON.stringify(a);
	comm.filename = window.md5(o),
	comm.movesNum = a.moves.length;
	if (comm.movesNum == 0) {
		showFloatTip("还没开始下棋呢")
		return;
	}

	isVerticalReverse ? sendmap = comm.arrReverse(comm.cMap) : sendmap = comm.cMap;

	var map = comm.getMap4Server2(sendmap);
	var moves = comm.getMoves4ServerEx();
	var notes = comm.getNotes4Server();
        var _json = {"map": map, "moves": moves, "notes": notes, "filename": comm.filename, "BillType": 1};
	$.ajax({
		type: "POST",
		url: saveURL,
		dataType: "text",
		data: _json,
		success: function (response, status, xhr) {
			window.parent.location.href = replayURL + "&file=" + comm.filename;
			console.log(_json);
		},
		error: function (response, status, xhr) {
			alert(status);
		}
	})
}
/*创建棋谱2*/
onCreate2 = function () {
	$("#createBtn2").hide(),
	$("#tipsInfo").hide(),
	cleanChess(),
	comm.init(3, comm.map, !1);
}
/*创建棋谱*/
onCreate = function () {
	mode = playmode.EDITBOARD;
	setEnable("prevBtn2", !1),
	setEnable("nextBtn2", !1),
	comm.pace = [],
	cleanChess();
	comm.init(3, comm.map, !1);
	onCleanBroad();	
}
/*响应先后手*/
onAIOffensive = function () {
	if (movesIndex > 0 || 　comm.moves.length > 0) {
		return;
	}
	cleanChess();
	comm.isOffensive == 1 ? comm.isOffensive = 0 : comm.isOffensive = 1;
	isVerticalReverse ? comm.init(3, comm.arrReverse(comm.cMap), !0) : comm.init(3, comm.cMap, !0);
	movesIndex = 0;
	comm.moves.length = 0;
	replayBtnUpdate();
}
/*响应先后手*/
onOffensive = function () {
	if (movesIndex > 0 ||　comm.moves.length > 0){
		showFloatTip("棋局已开始，请重新开始后再选择");
        isComPlay = 1;
        console.log($("#isOffensiveTog").attr('class'));
		if($("#isOffensiveTog").hasClass('mui-active')){
                $("#isOffensiveTog").removeClass('mui-active');
                $("#isOffensiveTog").html('<div class="mui-switch-handle"></div>');
            }else{
                $("#isOffensiveTog").addClass('mui-active');
                $("#isOffensiveTog").html('<div class="mui-switch-handle" style="transition-duration: 0.2s; transform: translate(43px, 0px);"></div>');
            }
		return;
	}
	cleanChess();
	comm.isOffensive == 1 ? comm.isOffensive = 0 : comm.isOffensive = 1;
	isVerticalReverse ? comm.init(3, comm.arrReverse(comm.cMap), !0) : comm.init(3, comm.cMap, !0);
	movesIndex = 0;
	comm.moves.length = 0;
	replayBtnUpdate();
}
/*编辑棋谱*/
onEditboard = function () {
	cleanLine();
	if (isanalyse) {
		isanalyse = 0;
	}
	if (b_autoset) {
		clearInterval(b_autoset),
		b_autoset = 0;
	}
	if (r_autoset) {
		clearInterval(r_autoset),
		r_autoset = 0;
	}
	if ($("#analyseTog").hasClass('mui-active')) {
		$("#analyseTog").removeClass('mui-active');
		$("#analyseTog").html('<div class="mui-switch-handle"></div>');
	}
	if ($("#blackautoplayTog").hasClass('mui-active')) {
		$("#blackautoplayTog").removeClass('mui-active');
		$("#blackautoplayTog").html('<div class="mui-switch-handle"></div>');
	}
	if ($("#redautoplayTog").hasClass('mui-active')) {
		$("#redautoplayTog").removeClass('mui-active');
		$("#redautoplayTog").html('<div class="mui-switch-handle"></div>');
	}
    $(".mode4").hide(),
    mode = playmode.EDITBOARD;
    Board.init();
    
    comm.sMapList = comm.getsMap();  
    var ss = 0;  

    comm.pace = [];
    board.y = 100;    
    cleanChess();
    comm.init(3, comm.map, !1); 
    for (x in comm.sMapList) {
        m = parseInt(ss/6);
        n = ss%6;
        if (comm.sMapList[x].length > 0) {            
            comm.sMap[m][n] = comm.sMapList[x][0];
            m ? flag = boardset.routside : flag = boardset.boutside;
            createMan(comm.sMap[m][n], flag, n * boardset.outsidescale);
            drawNum(m, n, comm.sMapList[x].length);
        }     
        else {
            comm.sMap[m][n] = "";
        }   
        ss++;
    }
    resizeBoard();
}
/*响应翻转按钮*/
onReverse = function () {
	if (b_autoset != 0 || r_autoset != 0) {
		isComPlay = 1;
		showFloatTip("请取消电脑思考，再点击翻转");
		if ($("#verticalreverseTog").hasClass('mui-active')) {
			$("#verticalreverseTog").removeClass('mui-active');
			$("#verticalreverseTog").html('<div class="mui-switch-handle"></div>');
		} else {
			$("#verticalreverseTog").addClass('mui-active');
			$("#verticalreverseTog").html('<div class="mui-switch-handle" style="transition-duration: 0.2s; transform: translate(43px, 0px);"></div>');
		}
		return;
	}

	if (comm.isAnimating)		return;
	if (waitServerPlay)		return;
	isVerticalReverse ? (isVerticalReverse = 0, chessBottonLayer.removeChild(verticalReverseboard), chessBottonLayer.addChild(board)) :
	(isVerticalReverse = 1, chessBottonLayer.removeChild(board), chessBottonLayer.addChild(verticalReverseboard));

	comm.reverseMoves();
	comm.map = comm.arrReverse(comm.map);
	comm.cMap = comm.arrReverse(comm.cMap);
	cleanChess();
	comm.init(3, comm.map, !0);
}
/*响应声音按钮*/
onSound = function () {
	voicemode == 1 ? voicemode = 0 : voicemode = 1
}
/*响应自动播放按钮*/
onAutoreplay = function () {
	if (b_autoset != 0 || r_autoset != 0) {
		showFloatTip("请取消电脑思考，再点击自动播放");
		return;
	}
	movesIndex >= comm.moves.length ? showFloatTip("播放结束") : (autoreplayset != 0 ? (showFloatTip("播放结束"), clearInterval(autoreplayset), autoreplayset = 0) : (showFloatTip("开始自动播放"), autoreplayset = setInterval(comm.replayNext, autoreplayspan)));
}
/*响应下一步按钮*/
onReplayNext = function () {
	cleanChessdbDetail();
	cleanComputerDetail();
	if (!relayNextLock) {
		relayNextLock = 1;
		waitServerPlay = !1;
		//setTimeout(comm.replayNextset, 200);
		comm.replayNextset();
	}
	replayBtnUpdate();
}
/*响应上一步按钮*/
onReplayPrev = function () {
	if(mode == playmode.AIPLAY) {
		comm.airegret();	
		return;
	}
	cleanChessdbDetail();
	cleanComputerDetail();
	if (!relayPrevLock) {
		relayPrevLock = 1;
		if (b_autoset != 0 && r_autoset != 0) {
			showFloatTip("请取消电脑思考，再点击上一步");
			relayPrevLock = 0;
			return;
		}
		cleanLine();
		comm.isend = !1;
		comm.isPlay = !0;
		waitServerPlay = !1;
		comm.moves = comm.getMoves4Server();
		cleanChess();
		comm.init(3, comm.cMap, !0);
		if (movesIndex > 0) {
			movesIndex--;
			for (var e = 0; e < movesIndex; e++)
				Player.stepPlay(comm.moves[e].src, comm.moves[e].dst, !0);
		}
		relayPrevLock = 0;
	}
	replayBtnUpdate();
}
/*响应开局按钮*/
onReplayFirst = function () {
	cleanChessdbDetail();
	cleanComputerDetail();
	if (b_autoset != 0 && r_autoset != 0) {
		showFloatTip("请取消电脑思考，再点击开局");
		return;
	}
	cleanLine();
	comm.isend = !1;
	comm.isPlay = !0;
	waitServerPlay = !1;
	comm.moves = comm.getMoves4ServerEx(-1);
	cleanChess();
	comm.init(3, comm.cMap, !0);

	currentId = 0;
	movesIndex = 0;
	replayBtnUpdate();
}
/*响应终局按钮*/
onReplayEnd = function () {
	cleanChessdbDetail();
	cleanComputerDetail();
	if (b_autoset != 0 && r_autoset != 0) {
		showFloatTip("请取消电脑思考，再点击终局");
		return;
	}
	cleanLine();
	comm.isend = !1;
	comm.isPlay = !0;
	waitServerPlay = !1;
	comm.moves = comm.getMoves4Server();
	cleanChess();
	comm.init(3, comm.cMap, !0);

	movesIndex = comm.moves.length;
	for (var e = 0; e < movesIndex; e++)
		Player.stepPlay(comm.moves[e].src, comm.moves[e].dst, !0);

	replayBtnUpdate();
}
/*响应分析模式*/
onAnalyse = function () {
    isanalyse ?  comm.closeAnalyse() : comm.startAnalyse();
}
/*保存棋盘*/
onSave = function () {
	if (comm.checkJiang() == !1) {
		showFloatTip("开局不能将");
		return;
	}
	comm.cMap = comm.arr2Clone(comm.map),
	cleanChess(),
	cleanChessEx();
	mode = playmode.ANALYSE;
	Board.init();
	comm.init(3, comm.map, !0);	
	movesIndex = 0,
	comm.pace = [],
	comm.moves = [],
	comm.notes = [];
	replayBtnUpdate();

	/*方便用户设置*/
	mui('#delete').popover('toggle');	
	resizeCanvasAnalyse();
}
/*注释*/
onNote = function () {
	popupDiv('notedialog');

	note = comm.notes[currentId];
	$('#notetext').val(note);
	$('#notedialog').on('click', '.btn_dialog_cancle', function () {
		hideDiv('notedialog');
	}).on('click', '.btn_dialog_save', function () {
		hideDiv('notedialog');
		note = $('#notetext').val();
		if (note) {
			comm.notes[currentId] = note;
			$("#noteInfo").text(note);			
			$("#noteInfo").parent('.mui-toast-container').addClass('mui-active');
		}
	});
}
/*清空棋子*/
onCleanBroad = function (e) {
	cleanChess();
	cleanChessEx();
	comm.sMap = comm.arr2Clone(sMapFull);
	comm.sMapList = JSON.parse(JSON.stringify(chessMan));	
	comm.init(3, emptyMap, !1);
	createMansEx(comm.sMap);
	$("#fullBtn").show();
	$("#clearBtn").hide();
}
/*摆满棋子*/
onFullBroad = function (e) {
	cleanChess();
	cleanChessEx();
	comm.sMap = comm.arr2Clone(sMapEmpty),
	comm.sMapList = JSON.parse(JSON.stringify(emptychessMan)),
	comm.init(3, initMap, !1);
	$("#fullBtn").hide();
	$("#clearBtn").show();
}
/*解析消息*/
onMessage = function (e) {
	comm.ParseMsg(e);
}
