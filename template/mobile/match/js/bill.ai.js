var bill = bill || {};
var isanalyse = isanalyse || 0;
var boutside = -1.1;
var routside = 10.3;
var outsidescale = 1.58;
var redtime = 0;
var blacktime = 0;
var showThinkset = 0;
var first = !1,
isComPlay = 0;
createbroad = !0,
currentId = 0,
id = 0,
moves = [],
chessnum = [],
countPath = 0,
shape = [],
text = [],
autoreplayspan = 2000;
isOffensive = !0;
bill.init = function (e, a, k) {
	mode = MODE_BILL;
	var a = a || comm.initMap;
	bill.cMap = bill.cMap || a.concat();
	var e = e || 3;
	bill.my = bill.my || 1,
	bill.nowMap = a,
	bill.map = comm.arr2Clone(a),
	bill.sMap = bill.sMap || [],
	bill.nowManKey = !1,
	bill.pace = bill.pace || [],
	bill.paceEx = bill.paceEx || [],
	bill.isPlay = !0,
	bill.player = 1,
	bill.isAnimating = !1,
	bill.bylaw = comm.bylaw,
	bill.showPane = comm.showPane,
	bill.isOffensive = isOffensive,
	bill.depth = e,
	bill.isFoul = !1,
	bill.mans = {},
	comm.createMans(a);
	for (var m = 0; m < bill.map.length; m++)
		for (var o = 0; o < bill.map[m].length; o++) {
			var n = bill.map[m][o];
			n && (comm.mans[n].x = o, comm.mans[n].y = m, comm.mans[n].isShow = !0)
		}
	comm.moves4Server = comm.getMap4Server(bill.map),
	k == !0 ? (bill.isPlay = !0) : ($("#saveBtn").show(), bill.isPlay = !1);
},
bill.offensive = function () {
	if (movesIndex > 0 || 　moves.length > 0) {
		return;
	}
	bill.cleanChess();
	bill.isOffensive == !0 ? isOffensive = !1 : isOffensive = !0;
	isVerticalReverse ? bill.init(3, comm.arrReverse(bill.cMap), !0) : bill.init(3, bill.cMap, !0);
	movesIndex = 0;
	moves.length = 0;
	bill.paceEx.length = 0;
	bill.replayBtnUpdate();
},
bill.onChessDrop = function () {
	function e() {
		for (var e = callOnDrops.length - 1; e >= 0; e--) {
			var a = callOnDrops.splice(e, 1)[0],
			m = callOnDropsArgs.splice(e, 1)[0];
		}
		bill.isAnimating = !1
	}

	for (var a = removeOnDrops.length - 1; a >= 0; a--) {
		var m = removeOnDrops.splice(a, 1)[0];
		m.parent.removeChild(m)
	}
	comm.soundplay("drop"),
	setTimeout(e, 200)
},
bill.addCallOnDrop = function (e, a) {
	callOnDrops.push(e),
	callOnDropsArgs.push(a)
},
bill.addRemoveOnDrop = function (e) {
	removeOnDrops.push(e)
},
bill.regret = function () {
	if (bill.paceEx.length == 0 || isVerticalReverse && bill.paceEx.length == 1) {
		showFloatTip("您还没开始走子");
		return;
	}

	bill.cleanLine();
	bill.isend = !1,
	play.isPlay = !0,
	waitServerPlay = !1;
	delsetp = 0;
	moves = bill.getMoves4Server(-1);
	bill.cleanChess();
	bill.init(3, bill.cMap, !0);
	if (movesIndex > 0) {
		isVerticalReverse ? (movesIndex % 2 == 1 ? delsetp = 2 : delsetp = 1) : (movesIndex % 2 == 0 ? delsetp = 2 : delsetp = 1);
		movesIndex -= delsetp;
		movesIndex < 0 ? movesIndex = 0 : 1;
		for (var e = 0; movesIndex > e; e++)
			bill.stepPlay(moves[e].src, moves[e].dst, !0);
	}
	for (var i = 0; i < delsetp; i++) {
		bill.paceEx.pop();
		moves.length--;
		id--;
	}
	preId = bill.paceEx[moves.length-1][0][2];
	currentId = bill.paceEx[moves.length-1][0][1];
		
	bill.replayBtnUpdate();

},
bill.send = function (e) {
	var a = {};
	a.map = bill.moves4Server,
	a.moves = bill.getMoves4Server();
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

	isVerticalReverse ? sendmap = comm.arrReverse(bill.cMap) : sendmap = bill.cMap;

	var map = comm.getMap6Server(sendmap);
	var moves = bill.getMoves6ServerEx();
	var notes = bill.getNotes2Server();
	var _json = {
		"map": map,
		"moves": moves,
		"notes": notes,
		"filename": comm.filename,
		"BillType": 1
	};
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
},
bill.clickCanvas = function (e) {
	if (mode != 5)
		return;
	if (play.isAnimating)
		return !1;
	if (!play.isPlay)
		return !1;
	if (waitServerPlay)
		return !1;
	if (bill.isend == 1)
		return;
		
	var a = bill.getClickMan(e),
	m = bill.getClickPoint(e),
	x = m.x,
	y = m.y;
	a ? bill.clickMan(a, x, y) : bill.clickPoint(x, y);
},
bill.clickMan = function (e, x, y) {
	if ((y > -1 && y < 10))
		bill.clickManIn(e, x, y);	
}
bill.clickManIn = function (e, a, m) { //棋盘内->棋盘内
	var o = comm.mans[e];
	if (bill.nowManKey && bill.nowManKey != e && o.my != bill.my) {
		//吃子
		if (bill.isPlay == !0) {
			if (bill.indexOfPs(comm.mans[bill.nowManKey].ps, [a, m])) {
				o.isShow = !1,
				bill.addRemoveOnDrop(o.chess);
				var n = comm.mans[bill.nowManKey].x + "" + comm.mans[bill.nowManKey].y;
				delete bill.map[comm.mans[bill.nowManKey].y][comm.mans[bill.nowManKey].x],
				bill.map[m][a] = bill.nowManKey,
				comm.showPane(comm.mans[bill.nowManKey].x, comm.mans[bill.nowManKey].y, a, m);				
				comm.mans[bill.nowManKey].x = a,
				comm.mans[bill.nowManKey].y = m,
				comm.mans[bill.nowManKey].alpha = 1,
				comm.mans[bill.nowManKey].animate(),
				bill.nowManKey = !1,
				comm.hidePane(),
				comm.dot.dots = [],
				comm.hideDots(),
				comm.light.visible = !1,
				bill.stepEnd(n + a + m);				
				"j0" == e && bill.onGameEnd(-1),
				"J0" == e && bill.onGameEnd(1);
			} else {
				comm.hideDots();
				showFloatTip("对方下子");
			}
		} else {
			(comm.mans[bill.nowManKey] && (comm.mans[bill.nowManKey].alpha = 1),
				comm.hideDots(),
				comm.hidePane(),
				bill.nowManKey = e,
				comm.mans[e].alpha = 0.6,
				comm.mans[e].ps = comm.mans[e].bl(),
				comm.dot.dots = comm.mans[e].ps,
				(bill.isPlay == !0) ? (comm.showDots()) : (comm.hideDots()),
				first ? (comm.soundplay("drop"), first = !1) : comm.soundplay("select"), comm.light.x = comm.spaceX * o.x + comm.pointStartX - 20, comm.light.y = comm.spaceY * o.y + comm.pointStartY - 25, comm.light.visible = !0)
		}
	} else if (bill.isPlay ? o.my == bill.my : !0) {

		if (b_autoset != 0 && o.my == -1)
			return;
		if (r_autoset != 0 && o.my == 1)
			return;

		if (bill.nowManKey == e) {
			bill.cancleSelected();
		} else {
			(comm.mans[bill.nowManKey] && (comm.mans[bill.nowManKey].alpha = 1),
				createbroad ? !0 : (comm.hideDots(), comm.hidePane(), comm.mans[e].alpha = 0.6, comm.mans[e].ps = comm.mans[e].bl(), comm.dot.dots = comm.mans[e].ps),
				bill.nowManKey = e,
				(bill.isPlay || createbroad) ? (comm.showDots()) : (comm.hideDots()),
				first ? (comm.soundplay("drop"), first = !1) : comm.soundplay("select"),
				comm.light.x = comm.spaceX * o.x + comm.pointStartX - 20, comm.light.y = comm.spaceY * o.y + comm.pointStartY - 25, comm.light.visible = !0)
			cleanComputerDetail();
			cleanChessdbDetail();
		}
	}
};
bill.cancleSelected = function () {
	bill.nowManKey = !1,
	comm.dot.dots = [],
	comm.hideDots(),
	comm.light.visible = !1;
}
bill.branch = function (e) {
	step = e;
	//查找是否存在分支
	if (bill.paceEx.length < movesIndex) {
		bill.paceEx[movesIndex - 1] = new Array();
		id++;
		preId = currentId;
		currentId = id;
		bill.paceEx[movesIndex - 1].push([step, id, preId]);
		m = step.split(""),
		o = {
			src: {
				x: parseInt(m[0]),
				y: parseInt(m[1])
			},
			dst: {
				x: parseInt(m[2]),
				y: parseInt(m[3])
			}
		};
		moves.push(o);
		return;
	}

	id++;
	preId = currentId;
	currentId = id;
	bill.paceEx[movesIndex - 1].push([step, id, preId]);
};
bill.clickPoint = function (e, a) {
	if (bill.isPlay == !0) { //棋谱模式
		bill.clickPointPlaying(e, a)
	} 
	bill.cancleSelected();
},
bill.clickPointPlaying = function (e, a) { //棋谱模式
	var m = bill.nowManKey;
	o = comm.mans[m];
	if (bill.nowManKey && bill.indexOfPs(comm.mans[m].ps, [e, a])) {
		var n = o.x + "" + o.y;
		delete bill.map[o.y][o.x],
		bill.map[a][e] = m,
		comm.showPane(o.x, o.y, e, a);
		o.x = e,
		o.y = a,
		o.animate(),
		bill.stepEnd(n + e + a);		
	}
}
bill.stepEnd = function(e){
	movesIndex++,
	bill.pace.push(e),
	bill.branch(e),
	bill.my = -bill.my;
	bill.AIPlay();
	bill.replayBtnUpdate();
}
bill.indexOfPs = function (e, a) {
	for (var m = 0; m < e.length; m++)
		if (e[m][0] == a[0] && e[m][1] == a[1])
			return !0;
	return !1
}
bill.getClickPoint = function (e) {
	var a,
	m = Math.round((e.stageY - comm.pointStartY - 20) / comm.spaceY);
	(m < 0 || m > 9) ? (a = Math.round((e.stageX - comm.pointStartX - 20) / (outsidescale * comm.spaceX))) : (a = Math.round((e.stageX - comm.pointStartX - 20) / comm.spaceX));
	return {
		x: a,
		y: m
	}
}
bill.getClickMan = function (e) {
	var a = bill.getClickPoint(e),
	m = a.x,
	o = a.y;
	if (o < 0 && createbroad)
		return bill.sMap[0][m];
	else if (o > 9 && createbroad)
		return bill.sMap[1][m];
	else
		return 0 > m || m > 8 || 0 > o || o > 9 ? !1 : bill.map[o][m] && "0" != bill.map[o][m] ? bill.map[o][m] : !1
}
bill.reverse = function () {
	if (b_autoset != 0 || r_autoset != 0) {
		return;
	}

	if (bill.isAnimating)		return !1;
	if (waitServerPlay)		return;
	isVerticalReverse ? (isVerticalReverse = 0, chessBottonLayer.removeChild(verticalReverseboard), chessBottonLayer.addChild(board)) :
	(isVerticalReverse = 1, chessBottonLayer.removeChild(board), chessBottonLayer.addChild(verticalReverseboard));
	bill.reverseMoves();
	bill.map = comm.arrReverse(bill.map);
	bill.cMap = comm.arrReverse(bill.cMap);
	bill.cleanChess();
	bill.init(3, bill.map, !0);
	play.map = bill.map;
}
bill.note = function () {
	popupDiv('notedialog');

	note = bill.notes[currentId];
	$('#notetext').val(note);
	$('#notedialog').on('click', '.btn_dialog_cancle', function () {
		hideDiv('notedialog');
	}).on('click', '.btn_dialog_save', function () {
		hideDiv('notedialog');
		note = $('#notetext').val();
		if (note) {
			bill.notes[currentId] = note;
			$("#noteInfo").text(note);
			$("#noteInfo").parent('.mui-toast-container').addClass('mui-active');
		}
	});
}
bill.showPlaymode = function (e) {
	$("#playmode").text(e);
	$("#playmode").show();
}
bill.cleanLine = function(){}
bill.sound = function () {
	voicemode == 1 ? voicemode = 0 : voicemode = 1
}
bill.showThink = function () {
	 var count = 0;  
    var time = 0;
    count = bill.paceEx.length;
    if( bill.isend == 1) return;
    if (bill.isOffensive == (movesIndex % 2)) {            
        bill.my = -1;
        if (showThinkset != 0) {
            clearInterval(showThinkset);
        }
        showThinkset = setInterval(function(){
        	time++;
        	blacktime++;
        	$("#AIThink").text("第" + movesIndex + "步 / 总" + count + "步    " + "耗时: 红方 "+redtime+"秒/黑方 "+blacktime+"秒"), 
        	$("#AIThink").show()
        }, 1000);                   
    }
    else {
        bill.my = 1;            
        if (showThinkset != 0) {
            clearInterval(showThinkset);
        }
        showThinkset = setInterval(function(){
        	time++;
        	redtime++;
        	$("#AIThink").text("第" + movesIndex + "步 / 总" + count + "步    " + "耗时: 红方 "+redtime+"秒/黑方 "+blacktime+"秒"), 
        	$("#AIThink").show()
        }, 1000);
    }               	
}
bill.replayPrev = function(){
	bill.regret();
}
bill.replayBtnUpdate = function () {
	if (bill.notes[currentId]) {
		$("#noteInfo").text(bill.notes[currentId]),
		$("#noteInfo").parent('.mui-toast-container').addClass('mui-active');
	} else {
		$("#noteInfo").parent('.mui-toast-container').removeClass('mui-active');
	}
	0 >= movesIndex ? setEnable("prevBtn", !1) : setEnable("prevBtn", !0),
	bill.isAnimating ? setTimeout(function () {
		bill.showThink()
	}, 2000) : bill.showThink();

	play.map = bill.map;
}
bill.replayTipHide = function () {
	function e() {
		a.parent.removeChild(a)
	}

	if (comm.replayTip) {
		var a = comm.replayTip;
		comm.replayTip = void 0,
		createjs.Tween.get(a).to({
			lpha: 0
		}, 1e3).call(e)
	}
}
bill.getMoves4Server = function (t) {
	for (var e = [], a = 0; a < bill.paceEx.length; a++) {
		var m = bill.paceEx[a][0][0].split(""),
		o = {
			src: {
				x: parseInt(m[0]),
				y: parseInt(m[1])
			},
			dst: {
				x: parseInt(m[2]),
				y: parseInt(m[3])
			}
		};
		e[a] = o
	}
	return e
}
bill.getNotes2Server = function () {
	var e = "",
	o = "";
	for (var a = 0; a < bill.notes.length; a++) {
		o = (bill.notes[a]);
		if (o) {
			e += " " + a + " " + o;
		}
	}
	return e
}
bill.getMoves6ServerEx = function () {
	var e = "",
	o = "";
	for (a = 0; a < bill.paceEx.length; a++) {

		var nextpaceEx = bill.paceEx[a];
		for (j = 0; j < nextpaceEx.length; j++) {
			o = ' ' + nextpaceEx[j][0] + ' ' + nextpaceEx[j][1] + ' ' + nextpaceEx[j][2] + ' ' + a;
			e += o;
		}
	}
	return e
}
bill.reverseMoves = function () {
	var e = "",
	o = "";
	for (a = 0; a < bill.paceEx.length; a++) {
		var paceEx = bill.paceEx[a];
		for (b = 0; b < paceEx.length; b++) {
			var temp = paceEx[b][0].split("");
			temp[0] = 8 - temp[0];
			temp[1] = 9 - temp[1];
			temp[2] = 8 - temp[2];
			temp[3] = 9 - temp[3];
			paceEx[b][0] = temp.join("");
		}
	}
	for (a = 0; a < bill.pace.length; a++) {
		var pace = bill.pace[a].split("");
		pace[0] = 8 - pace[0];
		pace[1] = 9 - pace[1];
		pace[2] = 8 - pace[2];
		pace[3] = 9 - pace[3];
		bill.pace[a] = pace.join("");
	}
	return e
}
bill.stepPlay = function (e, a, m) {
	m = m || !1,
	comm.hideDots(),
	comm.light.visible = !1;
	var o = bill.map[e.y][e.x];
	bill.nowManKey = o;
	var o = bill.map[a.y][a.x];
	o ? bill.AIclickMan(o, a.x, a.y, m) : bill.AIclickPoint(a.x, a.y, m)
}
bill.AIPlay = function () {
	play.map = bill.map;
	if (movesIndex % 2 == 1) { //黑
		play.bAIPlay();
//		play.my = -1;
//		bill.my = 1;
	}
	if (movesIndex % 2 == 0) { //红
		play.rAIPlay();
//		play.my = 1;
//		bill.my = -1;
	}
}
bill.AIclickMan = function (e, a, m, o) {
	var n = comm.mans[e];
	n.isShow = !1,
	o ? n.chess.parent.removeChild(n.chess) : bill.addRemoveOnDrop(n.chess),
	delete bill.map[comm.mans[bill.nowManKey].y][comm.mans[bill.nowManKey].x],
	bill.map[m][a] = bill.nowManKey,
	bill.showPane(comm.mans[bill.nowManKey].x, comm.mans[bill.nowManKey].y, a, m),
	comm.mans[bill.nowManKey].x = a,
	comm.mans[bill.nowManKey].y = m,
	o ? comm.mans[bill.nowManKey].move() : comm.mans[bill.nowManKey].animate(),
	bill.my = -bill.my,
	"j0" == e && bill.onGameEnd(-1),
	"J0" == e && bill.onGameEnd(1),
	bill.nowManKey = !1;
}
bill.AIclickPoint = function (e, a, m) {
	var o = bill.nowManKey,
	n = comm.mans[o];
	bill.nowManKey && (
		delete bill.map[comm.mans[bill.nowManKey].y][comm.mans[bill.nowManKey].x],
		bill.map[a][e] = o,
		comm.showPane(n.x, n.y, e, a),
		n.x = e,
		n.y = a,
		m ? n.move() : n.animate(),
		bill.nowManKey = !1)
}
bill.replayMovesStep = function (e) {
	e = e || 1,
	bill.stepPlay(moves[movesIndex].src, moves[movesIndex].dst),
	movesIndex += e,
	bill.replayBtnUpdate();
}
bill.cleanChess = function () {
	for (var e = 0; e < bill.map.length; e++)
		for (var a = 0; a < bill.map[e].length; a++) {
			var m = bill.map[e][a];
			if (m)
				removeChess(m);
		}

	comm.hidePane(),
	comm.hideDots(),
	comm.light.visible = !1
}

bill.isend = 0,
bill.notes = [],
bill.emptyMap = [[, , , , "J0", , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , "j0", , , , ""]],
bill.sMapFull = [["C0", "M0", "P0", "X0", "S0", "Z0", ""], ["c0", "m0", "p0", "x0", "s0", "z0", ""]],
bill.sMapEmpty = [[, , , , , , , , ], [, , , , , ]],
bill.chessMan = { "C": ["C0", "C1"], "M": ["M0", "M1"], "P": ["P0", "P1"], "X": ["X0", "X1"], "S": ["S0", "S1"], "Z": ["Z0", "Z1", "Z2", "Z3", "Z4"], "c": ["c0", "c1"], "m": ["m0", "m1"], "p": ["p0", "p1"], "x": ["x0", "x1"], "s": ["s0", "s1"], "z": ["z0", "z1", "z2", "z3", "z4"] }
bill.emptychessMan = { "C": [], "M": [], "P": [], "S": [], "X": [], "Z": [], "c": [], "m": [], "p": [], "s": [], "x": [], "z": [] }
bill.createMan = function (e, a, m) {
	if (e) {
		var n = new comm["class"].Man(e);
		n.x = m,
		n.y = a,
		comm.mans[e] = n;
		var t = addChess(n.pater, comm.spaceX * n.x + comm.pointStartX, comm.spaceY * n.y + comm.pointStartY);
		n.chess = t,
		n.move()
	}
}
bill.createMans = function (e) {
	for (var m = 0; m < e[0].length; m++) {
		var o = e[0][m];
		if (o) {
			bill.createMan(o, boutside, m * outsidescale);
			m == 5 ? bill.drawNum(0, m, 5) : bill.drawNum(0, m, 2);
		}
	}
	for (var m = 0; m < e[1].length; m++) {
		var o = e[1][m];
		if (o) {
			bill.createMan(o, routside, m * outsidescale);
			m == 5 ? bill.drawNum(1, m, 5) : bill.drawNum(1, m, 2);
		}
	}
}
bill.bylawX = function () {
	var n = [];
	n.push([2, 0]),
	n.push([6, 0]),
	n.push([2, 4]),
	n.push([6, 4]),
	n.push([0, 2]),
	n.push([4, 2]),
	n.push([8, 2]);
	return n;
}
bill.bylawS = function (e, a, m, o) {
	var n = [];
	n.push([3, 0]),
	n.push([5, 0]),
	n.push([4, 1]),
	n.push([3, 2]),
	n.push([5, 2]);
	return n;
}
bill.bylawJ = function (e, a, m, o) {
	var n = [];
	n.push([4, 0]),
	n.push([5, 0]),
	n.push([3, 0]),
	n.push([4, 1]),
	n.push([5, 1]),
	n.push([3, 1]),
	n.push([4, 2]),
	n.push([5, 2]),
	n.push([3, 2]);
	return n;
}
bill.bylawZ = function (e, a, m, o) {
	var n = [];
	n.push([0, 3]),
	n.push([0, 4]),
	n.push([2, 3]),
	n.push([2, 4]),
	n.push([4, 3]),
	n.push([4, 4]),
	n.push([6, 3]),
	n.push([6, 4]),
	n.push([8, 3]),
	n.push([8, 4]);
	for (var i = 0; i < 9; i++)
		for (var j = 5; j < 10; j++)
			n.push([i, j]);
	return n;
}
bill.bylawx = function () {
	var n = [];
	n.push([2, 5]),
	n.push([6, 5]),
	n.push([2, 9]),
	n.push([6, 9]),
	n.push([0, 7]),
	n.push([4, 7]),
	n.push([8, 7]);
	return n;
}
bill.bylaws = function (e, a, m, o) {
	var n = [];
	n.push([3, 7]),
	n.push([5, 7]),
	n.push([4, 8]),
	n.push([3, 9]),
	n.push([5, 9]);
	return n;
}
bill.bylawj = function (e, a, m, o) {
	var n = [];
	n.push([4, 7]),
	n.push([5, 7]),
	n.push([3, 7]),
	n.push([4, 8]),
	n.push([5, 8]),
	n.push([3, 8]),
	n.push([4, 9]),
	n.push([5, 9]),
	n.push([3, 9]);
	return n;
}
bill.bylawz = function (e, a, m, o) {
	var n = [];
	n.push([0, 5]),
	n.push([0, 6]),
	n.push([2, 5]),
	n.push([2, 6]),
	n.push([4, 5]),
	n.push([4, 6]),
	n.push([6, 5]),
	n.push([6, 6]),
	n.push([8, 5]),
	n.push([8, 6]);
	for (var i = 0; i < 9; i++)
		for (var j = 0; j < 5; j++)
			n.push([i, j]);
	return n;
}
bill.checkMans = function (e, a, m) {
	//检查将、士、象、兵、卒的位置是否合法
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
bill.checkManDots = function (e) {
	comm.hideDots();
	e = e.slice(0, 1);
	//显示可走的点
	isVerticalReverse == 0 ? (comm.dot.dots = { "J": bill.bylawJ(), "S": bill.bylawS(), "X": bill.bylawX(), "Z": bill.bylawZ(), "j": bill.bylawj(), "s": bill.bylaws(), "x": bill.bylawx(), "z": bill.bylawz() } [e] || []) : (comm.dot.dots = { "J": bill.bylawj(), "S": bill.bylaws(), "X": bill.bylawx(), "Z": bill.bylawz(), "j": bill.bylawJ(), "s": bill.bylawS(), "x": bill.bylawX(), "z": bill.bylawZ() } [e] || [])

	comm.showDots();
}
bill.resizeCanvas = function () {

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
bill.onGameEnd = function (e, a) {
	if (b_autoset != 0) {
        clearInterval(b_autoset);
    }
    if (r_autoset != 0) {
        clearInterval(r_autoset);
    }

    if (showThinkset != 0) {
        clearInterval(showThinkset);        
    }   
	
    bill.isend = 1;
    /*锁定，等待1s后解锁*/
    setTimeout((function () {
        waitServerPlay = !1;
        e == 1 ? o = "红" : o = "黑";
        $("#AIThink").text(o + "方胜! 游戏结束!"), 
    	$("#AIThink").show();
    }), 1000);
}
