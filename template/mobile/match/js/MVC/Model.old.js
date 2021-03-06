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
    uuid = generateUUID();
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
	if(waitServerPlay) {
		showFloatTip("电脑思考中,请稍后重试");
		return;
	}
	if (comm.nodes.length == 0) {
		showFloatTip("还没开始下棋呢");
		return;
	}
	if (comm.isAnimating) {
		return;		
	}
	waitServerPlay = !1;
	moves = comm.getMoves4Server();
	computerHold == comm.getHold() ? flag = 1 : flag = 2;
	
	if (movesIndex > 2) {
		movesIndex -= flag;
		comm.gotoStep(moves, movesIndex);			
		comm.nodes.length = movesIndex+1;
		comm.nodes[movesIndex].child = [];
		id -= flag;
	}
	replayBtnUpdate();
}
/*悔棋*/
onCreateRegret = function () {
	if (movesIndex > 0) {
		movesIndex -= 1;
		comm.gotoStep(moves, movesIndex);			
		comm.nodes.length = movesIndex+1;
		comm.nodes[movesIndex].child = [];
		id -= 1;
	}
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
	var moves = comm.getMoves4Server2();
	var notes = comm.getNotes4Server();
    var _json = {"map": map, "moves": moves, "notes": notes, "filename": comm.filename, "BillType": 1};
	$.ajax({
		type: "POST",
		url: saveURL,
		dataType: "text",
		data: _json,
		success: function (response, status, xhr) {
			if(response>0){
				window.parent.location.href = replayURL + "&chessid=" + response;
			}else{
				alert('保存失败');
				window.parent.location.href = indexURL;
			}
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
	if (movesIndex > 0 || comm.nodes.length > 0) {
		return;
	}
	cleanChess();
	comm.isOffensive == 1 ? comm.isOffensive = 0 : comm.isOffensive = 1;
	isVerticalReverse ? comm.init(3, comm.arrReverse(comm.cMap), !0) : comm.init(3, comm.cMap, !0);
	movesIndex = 0;
	comm.nodes.length = 0;
	replayBtnUpdate();
}
/*响应先后手*/
onOffensive = function () {
	if (movesIndex > 0 ||　comm.nodes.length > 0){
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
	//isVerticalReverse ? comm.init(3, comm.arrReverse(comm.cMap), !0) : comm.init(3, comm.cMap, !0);
	comm.init(3, comm.cMap, !0);
	movesIndex = 0;
	comm.nodes.length = 0;
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
	if ($("#blackautoplayTog").hasClass('mui-active')) {
		$("#blackautoplayTog").removeClass('mui-active');
		$("#blackautoplayTog").html('<div class="mui-switch-handle"></div>');
	}
	if ($("#redautoplayTog").hasClass('mui-active')) {
		$("#redautoplayTog").removeClass('mui-active');
		$("#redautoplayTog").html('<div class="mui-switch-handle"></div>');
	}
    $(".mode4").hide(),    
    $(".mode5").show();
    $("#clearBtn").hide();
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
	cleanLine();
	if (mode == playmode.EDITBOARD) {
		cleanChess();
		cleanChessEx();
//		isVerticalReverse ? (isVerticalReverse = 0, 
//			chessBottonLayer.removeChild(verticalReverseboard), 
//			chessBottonLayer.addChild(board),
//			comm.sMap = comm.arr2Clone(sMapFull),
//			emptyMap = comm.arr2Clone(EmptyMap),
//			initMap = comm.arr2Clone(InitMap)
//			) :
//			(isVerticalReverse = 1, 
//			chessBottonLayer.removeChild(board), 
//			chessBottonLayer.addChild(verticalReverseboard),
//			comm.sMap = comm.arr2Clone(sMapFullReveser),
//			emptyMap = comm.arrReverse(EmptyMap),
//			initMap = comm.arrReverse(InitMap)
//			);
		isVerticalReverse = !isVerticalReverse;
		chessBottonLayer.removeChild(verticalReverseboard), 
		chessBottonLayer.addChild(board),
		comm.sMap = comm.arrReverseEx(comm.sMap),
		comm.map = comm.arrReverse(comm.map)
		comm.sMapList = comm.getsMap(); 		
		comm.init(3, comm.map, !1);
		createMansEx(comm.sMap);
		$("#fullBtn").show();
		$("#clearBtn").hide();
	}
	else {
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
	setTimeout(replayNextset, 200);
}
replayNextset = function () {
	if(waitServerPlay) {
		showFloatTip("电脑思考中,请稍后重试");
		return;
	}
	if (comm.isAnimating) {
		return;		
	}
	cleanDetail();
	drawLinetmp = [];
	if (!relayNextLock) {
		relayNextLock = 1;		
		if (b_autoset != 0 && r_autoset != 0) {
			showFloatTip("请取消电脑思考，再点击下一步");
			relayNextLock = 0;
			return;
		}		
		var nextpace = [];
		/*统计分支数*/	
		countPath = comm.getBrachLength();
		if (countPath == 1) {
			/*一条分支直接走棋*/
			var childID = comm.nodes[currentId].child[0];
			var step = comm.nodes[childID].step;
			Player.stepPlay(step, !0);
			movesIndex++;
			currentId = childID;
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
					var childID = comm.nodes[currentId].child[inx];
					var step = comm.nodes[childID].step;
					Player.stepPlay(step);
					movesIndex++;
					currentId = childID;
					replayBtnUpdate();
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
		relayNextLock = 0;
	}
	replayBtnUpdate();
}
/*响应上一步按钮*/
onReplayPrev = function () {
	if(waitServerPlay) {
		showFloatTip("电脑思考中,请稍后重试");
		return;
	}
	if (comm.isAnimating) {
		return;		
	}
	if(mode == playmode.AIPLAY) {
		onRegret();
		OnTimer();
		return;
	}
	cleanDetail();
	drawLinetmp = [];
	if (!relayPrevLock) {
		relayPrevLock = 1;
		if (b_autoset != 0 && r_autoset != 0) {
			showFloatTip("请取消电脑思考，再点击上一步");
			relayPrevLock = 0;
			return;
		}
		moves = comm.getMoves4Server();
		if (movesIndex > 0) {
			movesIndex--;
			comm.gotoStep(moves, movesIndex);			
		}
		relayPrevLock = 0;
	}
	replayBtnUpdate();
}
/*响应开局按钮*/
onReplayFirst = function () {
	if(waitServerPlay) {
		showFloatTip("电脑思考中,请稍后重试");
		return;
	}
	if (comm.isAnimating) {
		return;		
	}
	cleanDetail();
	drawLinetmp = [];
	if (b_autoset != 0 && r_autoset != 0) {
		showFloatTip("请取消电脑思考，再点击开局");
		return;
	}
	moves = comm.getMoves4Server();
	movesIndex = 0;
	comm.gotoStep(moves, movesIndex);
	replayBtnUpdate();
}
/*响应终局按钮*/
onReplayEnd = function () {
	if(waitServerPlay) {
		showFloatTip("电脑思考中,请稍后重试");
		return;
	}
	if (comm.isAnimating) {
		return;		
	}
	cleanDetail();
	drawLinetmp = [];
	if (b_autoset != 0 && r_autoset != 0) {
		showFloatTip("请取消电脑思考，再点击终局");
		return;
	}
	moves = comm.getMoves4Server();
	movesIndex = moves.length;
	comm.gotoStep(moves, movesIndex);

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
	if (isVerticalReverse) {
		$("#verticalreverseTog").addClass('mui-active');
		$("#verticalreverseTog").html('<div class="mui-switch-handle" style="transition-duration: 0.2s; transform: translate(43px, 0px);"></div>');
	}
	mui('#delete').popover('toggle');	
	resizeCanvasAnalyse();	
	onAnalyse();
}
/*保存棋盘*/
onSaveTest = function () {
	if (comm.checkJiang() == !1) {
		showFloatTip("开局不能将");
		return;
	}
	if(mode == playmode.EDITBOARD){
		str = '&fen='+comm.getBoard()+'&reverse='+Boolean(isVerticalReverse);
		//showFloatTip(str);
		console.log(str);
		var _json = {"fen": encodeURIComponent(comm.getBoard()) , "reverse": Boolean(isVerticalReverse)};
		$.ajax({
			type: "POST",
			url: saveTestURL,
			dataType: "text",
			data: _json,
			success: function (response, status, xhr) {
				if(response==1){
					window.parent.location.href = replayTestURL; 
					console.log(_json);
				}
			},
			error: function (response, status, xhr) {
				alert(status);
			}
		})
		
	}
}
/*保存棋盘*/
onSaveCreate = function () {
	if (comm.checkJiang() == !1) {
		showFloatTip("开局不能将");
		return;
	}
	comm.cMap = comm.arr2Clone(comm.map),
	cleanChess(),
	cleanChessEx();
	mode = playmode.CREATE;
	Board.init();
	comm.init(3, comm.map, !0);	
	movesIndex = 0,
	comm.pace = [],
	comm.moves = [],
	comm.notes = [];
	replayBtnUpdate();

	/*方便用户设置*/
	if (isVerticalReverse) {
		$("#verticalreverseTog").addClass('mui-active');
		$("#verticalreverseTog").html('<div class="mui-switch-handle" style="transition-duration: 0.2s; transform: translate(43px, 0px);"></div>');
	}
	mui('#delete').popover('toggle');	
	resizeCanvasCreate();
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
	isVerticalReverse ? emptyMap = comm.arrReverse(EmptyMap) : emptyMap = comm.arr2Clone(EmptyMap);
	isVerticalReverse ? comm.sMap = comm.arr2Clone(sMapFullReveser) : comm.sMap = comm.arr2Clone(sMapFull);
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
	isVerticalReverse ? initMap = comm.arrReverse(InitMap) : initMap = comm.arr2Clone(InitMap);
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
/*是否显示箭头*/
OnshowArrow = function () {
	isShowArrow = (isShowArrow+1)%4;
	switch(isShowArrow) {
		case 0:
			showFloatTip("隐藏提示"),
			cleanLine();
			break;
		case 1:
			showFloatTip("显示提示");
			for (var i=0;i<drawLinetmp.length;i++) {
				drawLine(drawLinetmp[i],i+1);
			}
			break;
		case 2:
			showFloatTip("隐藏红方提示"),
			cleanLine();
			if (comm.getHold() == BLACK) {
				drawLine(drawLinetmp[0],1);
			}
			else {
				drawLine(drawLinetmp[1],2);
			}
			break;
		case 3:
			showFloatTip("隐藏黑方提示"),
			cleanLine();
			if (comm.getHold() == RED) {
				drawLine(drawLinetmp[0],1);
			}
			else {
				drawLine(drawLinetmp[1],2);
			}
			break;
		default:
			break;
	}	
}
/*是否显示提示*/
OnshowAIInfo = function () {
	isShowArrow = (isShowArrow+1)%2;
	if(isShowArrow){
		showFloatTip("隐藏提示");
		$("#chessdbDetailTbody").hide();		
		$("#computerDetailTbody").hide();		
		$("#openbookDetailTbody").hide();		
	}
	else {
		showFloatTip("显示提示");
		$("#chessdbDetailTbody").show();		
		$("#computerDetailTbody").show();		
		$("#openbookDetailTbody").show();
	}	
}
/*反馈错误数据*/
onErrordata = function() {
	if (msg) {		
		cleanChessdbDetail();
		cleanComputerDetail();
		if (mode == playmode.AIPLAY) {
			showFloatTip("已删除错误数据,请重走!");
			onRegret();
			comm.reCompute();
//			var _json = {"id": uuid, "msg": msg};
//			$.ajax({
//				type: "POST",
//				url: "http://westudy.chinaxueyun.com/addons/gongyy_wechess/template/mobile/match/deletedata.php",
//				dataType: "json",
//				data: _json,
//				success: function (data) {	
//						
//				},
//				error: function (response, status, xhr) {			
//				}
//			})			
		}
		else {
			if (isanalyse) {
				showFloatTip("重新思考中!");
				comm.reCompute();
//				var _json = {"id": uuid, "msg": msg};
//				$.ajax({
//					type: "POST",
//					url: "http://westudy.chinaxueyun.com/addons/gongyy_wechess/template/mobile/match/php/deletedata.php",
//					dataType: "json",
//					data: _json,
//					success: function (data) {	
//						myws.Send(msg);		
//					},
//					error: function (response, status, xhr) {			
//					}
//				})			
			}
			else {
				showFloatTip("请打开分析模式后再使用!");
			}
		}					
	}
	else {
		if (mode == playmode.AIPLAY) {
			showFloatTip("还未开始走棋!");
		}
		else {
			showFloatTip("请打开分析模式后再使用!");
		}
	}
}
