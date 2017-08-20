function addChess(e) {
	e || (e = "c");
	var a = new createjs.Container,
		m = LABEL[e],
		o = new m,
		n = new lib.ChessBody;
	return a.body = n, a.label = o, n.framerate = 24, o.framerate = 24, n.stop(), o.stop(), a.addChild(n), a.addChild(o), chessLayer.addChild(a), a.key = e, a
}

function intiBoard() {
	var e = new lib.Board;
	chessBottonLayer.addChild(e)
}

function initDots() {
	for(var e = 0; 10 > e; e++) {
		for(var a = 0; 9 > a; a++) {
			var m = new res.Dot,
				o = comm.pointStartX + comm.spaceX * a + parseInt(a / 3),
				n = comm.pointStartY + comm.spaceY * e + parseInt(e / 3);
			m.x = o + 12, m.y = n + 11, m.visible = !1, chessTopLayer.addChild(m), Dots[a.toString() + e.toString()] = m
		}
		comm.Dots = Dots
	}
}

function intiPane() {
	comm.box1 = new res.Box, comm.box1.visible = !1, chessLayer.addChild(comm.box1), comm.box2 = new res.Box, comm.box2.visible = !1, chessLayer.addChild(comm.box2)
}

function initLight() {
	comm.light = new res.Light, comm.light.visible = !1, chessBottonLayer.addChild(comm.light)
}

function setEnable(e, a) {
	1 == a ? ($("#" + e).removeAttr("disabled"), $("#" + e).addClass(e), $("#" + e).removeClass(e + "Disable")) : ($("#" + e).attr("disabled", "disabled"), $("#" + e).addClass(e + "Disable"), $("#" + e).removeClass(e))
}

function replayMovesStep(e) {
	if(e = e || 1, movesIndex < moves.length && (play.stepPlay(moves[movesIndex].src, moves[movesIndex].dst), movesIndex += e, comm.replayBtnUpdate(), movesIndex == moves.length)) {
		clearInterval(movesInterval);
		var a = new res.PlayEndTip;
		a.alpha = 0, a.x = 176, a.y = 296, comm.chessTopLayer.addChild(a), createjs.Tween.get(a).to({
			alpha: 1
		}, 1e3).wait(1e3).to({
			alpha: 0
		}, 1e3)
	}
}

function onUserShare() {
	return pgvSendClick({
		hottag: "a20150811chess.shareTimeLine.success"
	}), {
		img_url: "http://image.qqchess.qq.com/icon100X100.png",
		img_width: "100",
		img_height: "100",
		link: getShareLink(),
		desc: getShareTitle(),
		title: getShareDesc()
	}
}

function onUserMessage() {
	return pgvSendClick({
		hottag: "a20150811chess.share.success"
	}), {
		img_url: "http://image.qqchess.qq.com/icon100X100.png",
		img_width: "100",
		img_height: "100",
		link: getShareLink(),
		desc: getShareDesc(),
		title: getShareTitle()
	}
}

function getShareDesc() {
	var e = "怎么破怎么破";
	return mode == MODE_PLAY ? (e = chapterTitle + " 我百思不得其解，求大神破局！", play.isPlay || comm.isWin && (e = chapterTitle + " 我用了" + (Math.floor(comm.movesNum / 2) + 1) + "步通过，快来看一下吧！ ")) : mode == MODE_REPLAY && (e = comm.isPVP ? chapterTitle + " 的对局棋谱，快来看一下吧!" : chapterTitle + "，我用了" + (Math.floor(comm.movesNum / 2) + 1) + "步通过，快来看一下吧！ "), e
}

function getShareTitle() {
	var e = "残局求破 ";
	return mode == MODE_PLAY ? (e = "残局求破", play.isPlay || comm.isWin && (e = "过关棋谱")) : mode == MODE_REPLAY && (e = comm.isPVP ? comm.pvpTitle : "过关棋谱"), e
}

function getShareLink() {
	var e = "",
		a = baseURL + "index.html";
	return mode == MODE_PLAY ? (e = null == level_id ? a : a + "?level_id=" + level_id, play.isPlay || comm.isWin && (e = a + "?file=" + comm.filename)) : mode == MODE_REPLAY && (e = a + "?file=" + file), e
}

function moreBtn() {
	window.location = "play.html"
}

function cleanChess() {
	console.log(comm.chessLayer.numChildren);
	for(var e = 0; e < play.map.length; e++)
		for(var a = 0; a < play.map[e].length; a++) {
			var m = play.map[e][a];
			if(m) {
				var o = comm.mans[m].chess;
				o.parent.removeChild(o)
			}
		}
	comm.hidePane(), comm.hideDots(), comm.light.visible = !1
}

function getUrlParam(e) {
	var a = new RegExp("(^|&)" + e + "=([^&]*)(&|$)"),
		m = window.location.search.substr(1).match(a);
	return null != m ? unescape(m[2]) : null
}

function getEnv() {
	var e = navigator.userAgent.toLowerCase();
	return /micromessenger(\/[\d\.]+)*/.test(e) ? "weixin" : /qq\/(\/[\d\.]+)*/.test(e) || /qzone\//.test(e) ? "qq" : "web"
}

function loadConfig() {
	file = getUrlParam("file"), level_id = getUrlParam("level_id");
	var e;
	if(file) e = REPLAY_GET_URL + file, $.getJSON(e, function(e) {
		serverData = e;
		var a;
		serverData.map ? ($("#moreBtn2").addClass("moreBtn2"), $("#moreBtn2").removeClass("moreBtn4"), comm.isPVP = !1, a = comm.parseMap(serverData.map)) : ($("#moreBtn2").addClass("moreBtn4"), $("#moreBtn2").removeClass("moreBtn2"), comm.isPVP = !0, comm.pvpTitle = serverData.meta.FUPAN_GAMESCENE_NAME, a = comm.initMap.concat(), 1 == serverData.meta.FUPAN_CHESS_COLOR && a.reverse()), serverData.meta && serverData.meta.FUPAN_TITLE ? chapterTitle = serverData.meta.FUPAN_TITLE : (chapterTitle = "空章节标题", console.log(chapterTitle)), document.title = chapterTitle;
		var m = comm.parseMoves(serverData.moves);
		comm.movesNum = m.length, comm.initChess(a, m);
		var o = new res.ReplayTip;
		o.x = 116, o.y = 296, comm.chessTopLayer.parent.addChild(o), comm.replayTip = o, comm.replayBtnUpdate()
	}), mode = MODE_REPLAY;
	else if(level_id) {
		var a = "http://image.qqchess.qq.com/ok/QQChessH5/";
		e = a + "PVELevel.json", $.getJSON(e, function(m) {
			var o = m.pvelvlConfig[level_id];
			chapterTitle = o.sChapterName + "-第" + (parseInt(level_id) + 1) + "关", document.title = chapterTitle, e = a + "pieces/pieces" + o.iPiecesID + ".json", $.getJSON(e, function(e) {
				serverData = e;
				var a = comm.parseMap(serverData.map);
				comm.initChess(a), requestServerStart()
			})
		}), mode = MODE_PLAY
	} else {
		comm.initChess(comm.initMap), mode = MODE_PLAY;
		var m = comm.getMap4Server(comm.initMap);
		requestServerStart(m)
	}
}

function requestServerStart(e) {
	e = e || serverData.map;
	var a = {
		Piece: e
	};
	SAI(1, a, onAct, onFault)
}

function onAct(e) {
	comm.playid = e.playid, comm.seq = e.seq
}

function SAI(e, a, m, o) {
	var n = "http://login.qqchess.qq.com:10022/PVE?do=" + e;
	comm.playid && (n += "&playid=" + comm.playid), comm.seq && (n += "&seq=" + (comm.seq + 1)), $.ajax({
		type: "POST",
		url: n,
		timeout: 3e3,
		dataType: "text",
		async: !1,
		success: function(e) {
			var a = JSON.parse(e);
			0 == a.result ? (comm.seq++, m && m(a)) : 3 == a.result ? (comm.seq++, play.onGameEnd(1)) : 4 == a.result ? (comm.seq++, 0 == a.aifrom.x && 0 == a.aifrom.y && 0 == a.aito.x && 0 == a.aito.y ? play.onGameEnd(-1, 1) : (m && m(a), play.onGameEnd(-1))) : 5 == a.result ? (backUserMove(), showFloatTip(a.msg)) : o && o(a.result)
		},
		error: function(a, m) {
			"timeout" == m && console.log("timeout"), o && o(a.status, e)
		},
		data: JSON.stringify(a)
	})
}

function onFault(e, a) {
	0 == e && (1 == a ? (play.isPlay = !1, showFloatTip("服务器连接初始错误，请稍后重试。", 12e4)) : (backUserMove(), showFloatTip("网络错误，请稍后重试。")))
}

function backUserMove() {
	regret(1), play.hideThink()
}

function loadSound(e) {
	fileLoaded(e)
}

function stageClick(e) {
	mode == MODE_PLAY && play.clickCanvas(e), mode == MODE_REPLAY && comm.clickCanvas(e)
}

function enterFrame() {
	var e = new Date,
		a = e.getTime(),
		m = a - lastTime;
	Math.round(1e3 / m);
	lastTime = a
}

function showMask() {
	$("body").css("overflow", "hidden"), $("#cover").show(), "web" == getEnv() && (console.log("onUserMessage", onUserMessage()), console.log("onUserShare", onUserShare()))
}

function hideMask() {
	$("body").css("overflow", "auto"), $("#cover").hide()
}

function hideLoading() {
	$("#loading").hide()
}

function showBtns() {
	mode == MODE_REPLAY ? ($("#mode1").hide(), $("#mode3").hide()) : ($("#mode2").hide(), $("#mode3").hide()), $("#btnBox").show()
}

function showResult(e) {
	e ? ($("#gameLose").hide(), $("#gameWin").show(), $("#mode1").hide(), $("#mode2").hide(), $("#mode3").show()) : ($("#gameLose").show(), $("#gameWin").hide(), setEnable("regretBtn", !1)), $("#gameResult").show()
}

function hideResult() {
	$("#gameResult").hide()
}

function initLayer(e) {
	canvas = document.getElementById("chess"), images = images || {}, ss = ss || {}, createjs.Sound.alternateExtensions = ["mp3"], createjs.Sound.on("fileload", loadSound), createjs.Sound.registerSound(CDN_PATH + "assets/audio/select.mp3", "select"), createjs.Sound.registerSound(CDN_PATH + "assets/audio/drop.mp3", "drop"), createjs.Sound.registerSound(CDN_PATH + "assets/audio/gamelose.mp3", "gamelose"), createjs.Sound.registerSound(CDN_PATH + "assets/audio/gamewin.mp3", "gamewin");
	var a = e.target;
	ss.chess_slim_atlas_ = a.getResult("chess_slim_atlas_"), exportRoot = new lib.chess_slim, ss.f_atlas_ = a.getResult("f_atlas_"), new res.f, stage = new createjs.Stage(canvas), stage.addChild(exportRoot), stage.update(), createjs.Touch.enable(stage), stage.on("stagemousedown", stageClick), chessLayer = comm.chessLayer = new createjs.Container, chessLayer.mouseEnabled = !1, chessLayer.mouseChildren = !1, chessTopLayer = comm.chessTopLayer = new createjs.Container, chessTopLayer.mouseEnabled = !1, chessTopLayer.mouseChildren = !1, chessBottonLayer = comm.chessBottonLayer = new createjs.Container, chessBottonLayer.mouseEnabled = !1, chessBottonLayer.mouseChildren = !1, chessTopLayer.x = chessLayer.x = 0, chessTopLayer.y = chessLayer.y = 0, stage.addChild(chessBottonLayer), stage.addChild(chessLayer), stage.addChild(chessTopLayer), createjs.Ticker.setFPS(lib.properties.fps), createjs.Ticker.addEventListener("tick", stage), createjs.Ticker.addEventListener("tick", enterFrame), comm.init(), comm.onload(), loadConfig(), showBtns(), setTimeout(hideLoading, 200), setTimeout(loadOthers, 300), commTipsImg = new Image, commTipsImg.src = "assets/images/commTips.png"
}

function showFloatTip(e, a) {
	function m(e) {
		e.parent.removeChild(e)
	}
	a = a || 1200;
	var o = comm.getTips(e);
	o.alpha = 0;
	var n = o.getBounds().width,
		t = (640 - n) / 2 - 50;
	o.x = t, o.y = 300, comm.chessTopLayer.addChild(o), createjs.Tween.get(o).to({
		alpha: 1
	}, 500).wait(a).to({
		alpha: 0
	}, 1e3).call(m, [o])
}

function regret(e) {
	e = e || 2;
	for(var a = comm.arr2Clone(play.cMap), m = 0; m < a.length; m++)
		for(var o = 0; o < a[m].length; o++) {
			var n = a[m][o];
			if(n) {
				var t = comm.mans[n];
				t.x = o, t.y = m, t.move(), comm.chessLayer.addChild(t.chess)
			}
		}
	for(var s = play.pace, o = 0; e > o; o++) s.pop();
	for(var m = 0; m < s.length; m++) {
		var r = s[m].split(""),
			c = parseInt(r[0], 10),
			l = parseInt(r[1], 10),
			i = parseInt(r[2], 10),
			p = parseInt(r[3], 10),
			n = a[l][c],
			y = a[p][i];
		if(y) {
			var h = comm.mans[a[p][i]];
			h.isShow = !1, h.chess.parent && h.chess.parent.removeChild(h.chess)
		}
		var t = comm.mans[n];
		t.x = i, t.y = p, a[p][i] = n, delete a[l][c], m == s.length - 1 && comm.showPane(i, p, c, l), t.move()
	}
	comm.light.visible = !1, comm.hidePane(), play.map = a, play.my = 1, play.isPlay = !0, play.isAnimating = !1
}

function onReqRegret(e) {
	console.log(e)
}

function onReqMove(e) {
	play.aiPace = [e.aifrom.x - 1, comm.reverseY(e.aifrom.y - 1), e.aito.x - 1, comm.reverseY(e.aito.y - 1)], 1 == waitServerPlay && play.serverAIPlay()
}

function checkIsFinalKill() {
	play.my = 1;
	var e = AI.init(play.pace.join(""), 3);
	return console.log("checkIsFinalKill pace", e), e ? void 0 : void play.onGameEnd(-1, !0)
}
var AI = AI || {}
AI.historyTable = {};
AI.init = function(e, a) {
	var a = a || play.depth,
		m = [];
	if(m.length) {
		for(var o = e.length, n = [], t = 0; t < m.length; t++) m[t].slice(0, o) == e && n.push(m[t]);
		if(n.length) {
			var s = Math.floor(Math.random() * n.length);
			return AI.historyBill = n, n[s].slice(o, o + 4).split("")
		}
		AI.historyBill = []
	}(new Date).getTime();
	AI.treeDepth = a, AI.number = 0, AI.setHistoryTable.lenght = 0;
	var r = AI.getAlphaBeta(-99999, 99999, AI.treeDepth, comm.arr2Clone(play.map), play.my);
	if(r && -8888 != r.value || (AI.treeDepth = 2, r = AI.getAlphaBeta(-99999, 99999, AI.treeDepth, comm.arr2Clone(play.map), play.my)), r && -8888 != r.value) {
		var c = play.mans[r.key];
		(new Date).getTime();
		return [c.x, c.y, r.x, r.y]
	}
	return !1
}
AI.iterativeSearch = function(e, a) {
	var m = 100,
		o = 1,
		n = 8;
	AI.treeDepth = 0;
	for(var t = (new Date).getTime(), s = {}, r = o; n >= r; r++) {
		var c = (new Date).getTime();
		AI.treeDepth = r, AI.aotuDepth = r;
		var s = AI.getAlphaBeta(-99999, 99999, AI.treeDepth, e, a);
		if(c - t > m) return s
	}
	return !1
}
AI.getMapAllMan = function(e, a) {
	for(var m = [], o = 0; o < e.length; o++)
		for(var n = 0; n < e[o].length; n++) {
			var t = e[o][n];
			t && play.mans[t].my == a && (play.mans[t].x = n, play.mans[t].y = o, m.push(play.mans[t]))
		}
	return m
}
AI.getMoves = function(e, a) {
	for(var m = AI.getMapAllMan(e, a), o = [], n = play.isFoul, t = 0; t < m.length; t++)
		for(var s = m[t], r = s.bl(e), c = 0; c < r.length; c++) {
			var l = s.x,
				i = s.y,
				p = r[c][0],
				y = r[c][1];
			(n[0] != l || n[1] != i || n[2] != p || n[3] != y) && o.push([l, i, p, y, s.key])
		}
	return o
}
AI.getAlphaBeta = function(e, a, m, o, n) {
	var t = o.join(),
		s = AI.historyTable[t];
	if(s && s.depth >= AI.treeDepth - m + 1) return s.value * n;
	if(0 == m) return {
		value: AI.evaluate(o, n)
	};
	for(var r = AI.getMoves(o, n), c = 0; c < r.length; c++) {
		var l = r[c],
			i = l[4],
			p = l[0],
			y = l[1],
			h = l[2],
			v = l[3],
			u = o[v][h] || "";
		if(o[v][h] = i, delete o[y][p], play.mans[i].x = h, play.mans[i].y = v, "j0" == u || "J0" == u) return play.mans[i].x = p, play.mans[i].y = y, o[y][p] = i, delete o[v][h], u && (o[v][h] = u), {
			key: i,
			x: h,
			y: v,
			value: 8888
		};
		var d = -AI.getAlphaBeta(-a, -e, m - 1, o, -n).value;
		if(play.mans[i].x = p, play.mans[i].y = y, o[y][p] = i, delete o[v][h], u && (o[v][h] = u), d >= a) return {
			key: i,
			x: h,
			y: v,
			value: a
		};
		if(d > e && (e = d, AI.treeDepth == m)) var g = {
			key: i,
			x: h,
			y: v,
			value: e
		}
	}
	return AI.treeDepth == m ? g ? g : !1 : {
		key: i,
		x: h,
		y: v,
		value: e
	}
}
AI.setHistoryTable = function(e, a, m, o) {
	AI.setHistoryTable.lenght++, AI.historyTable[e] = {
		depth: a,
		value: m
	}
}
AI.evaluate = function(e, a) {
	for(var m = 0, o = 0; o < e.length; o++)
		for(var n = 0; n < e[o].length; n++) {
			var t = e[o][n];
			t && (m += play.mans[t].value[o][n] * play.mans[t].my)
		}
	return AI.number++, m * a
};
var serverData = serverData || {},
	comm = comm || {};
comm["class"] = comm["class"] || {};
var Dots = {};
comm["class"].Man = function(e, a, m) {
	this.pater = e.slice(0, 1);
	var o = comm.args[this.pater];
	this.x = a || 0, this.y = m || 0, this.key = e, this.my = o.my, this.text = o.text, this.value = o.value, this.isShow = !0, this.ps = [], this.move = function() {
		var e = comm.spaceX * this.x + comm.pointStartX,
			a = comm.spaceY * this.y + comm.pointStartY;
		this.chess.x = e - 80, this.chess.y = a - 70
	}, this.animate = function() {
		function e() {}
		var a = comm.spaceX * this.x + comm.pointStartX,
			m = comm.spaceY * this.y + comm.pointStartY,
			o = a - 80,
			n = m - 70;
		play.isAnimating = !0, this.chess.body.addEventListener("dropEnd", this.onDropEnd), this.chess.body.gotoAndPlay(0), this.chess.label.gotoAndPlay(0), comm.chessTopLayer.addChild(this.chess), createjs.Tween.get(this.chess).to({
			x: o,
			y: n
		}, 200).call(e)
	}, this.onDropEnd = function(e) {
		var a = e.target.parent;
		e.target.currentFrame;
		a.label.gotoAndStop(0), a.body.gotoAndStop(0), a.body.removeEventListener("dropEnd", this.onDropEnd), comm.chessLayer.addChild(a), play.onChessDrop()
	}, this.bl = function(e) {
		var e = e || play.map;
		return comm.bylaw[o.bl](this.x, this.y, e, this.my)
	}
}
comm.showDots = function() {
	for(var e = 0; e < comm.dot.dots.length; e++) {
		var a = comm.dot.dots[e].join(""),
			m = comm.Dots[a];
		m.visible = !0
	}
}
comm.hideDots = function() {
	for(var e in comm.Dots) comm.Dots[e].visible = !1
}
comm.init = function(e) {
	comm.width = 640, comm.height = 723, comm.spaceX = 67, comm.spaceY = 67, comm.pointStartX = 32, comm.pointStartY = 29
}
comm.id2name = {
	16: "J",
	17: "S",
	18: "X",
	19: "M",
	20: "C",
	21: "P",
	22: "Z",
	8: "j",
	9: "s",
	10: "x",
	11: "m",
	12: "c",
	13: "p",
	14: "z"
}
comm.name2id = {
	J: 16,
	S: 17,
	X: 18,
	M: 19,
	C: 20,
	P: 21,
	Z: 22,
	j: 8,
	s: 9,
	x: 10,
	m: 11,
	c: 12,
	p: 13,
	z: 14
}
comm.parseMap = function(e) {
	for(var a = e, m = comm.emptyMap.concat(), o = {}, n = 0; n < a.length; n++) {
		var t = a[n],
			s = comm.id2name[t.cid],
			r = "";
		void 0 == o[s] ? (o[s] = 0, r = s + o[s]) : (o[s]++, r = s + o[s]), m[comm.reverseY(t.y - 1)][t.x - 1] = r
	}
	return m
}
comm.parseMoves = function(e) {
	for(var a = e, m = 0; m < a.length; m++) a[m].src.x = a[m].src.x - 1, a[m].dst.x = a[m].dst.x - 1, a[m].src.y = 9 - (a[m].src.y - 1), a[m].dst.y = 9 - (a[m].dst.y - 1), delete a[m].redBlack, delete a[m].reserved, delete a[m].reserved2, delete a[m].reserved3, delete a[m].cid, delete a[m].order;
	return a
}
comm.initChess = function(e, a) {
	play.isPlay = !0;
	var e = e || comm.initMap;
	fullMoves = a || [], fullMap = e.concat(), moves = fullMoves.concat(), play.init(3, e), intiBoard(), initDots(), intiPane(), initLight(), showBtns()
};
var fullMap, fullMoves, moves = [],
	movesIndex = 0,
	movesTipsShow = !0,
	movesInterval;
comm.replayNext = function() {
	clearInterval(movesInterval), movesTipsShow && (movesIndex = 0, comm.replayTipHide(), movesTipsShow = !1), replayMovesStep()
}
comm.replayPrev = function() {
	if(clearInterval(movesInterval), cleanChess(), moves = fullMoves.concat(), play.init(3, fullMap), movesIndex > 0) {
		movesIndex--;
		for(var e = 0; movesIndex > e; e++) play.stepPlay(moves[e].src, moves[e].dst, !0)
	}
	comm.replayBtnUpdate()
}
comm.replayBtnUpdate = function() {
	0 >= movesIndex ? (setEnable("prevBtn", !1), setEnable("replayBtn", !1)) : (setEnable("prevBtn", !0), setEnable("replayBtn", !0)), movesIndex >= moves.length ? setEnable("nextBtn", !1) : setEnable("nextBtn", !0), $("#tipsInfo").text("第" + movesIndex + "步 / 总" + moves.length + "步"), $("#tipsInfo").show()
}
comm.clickCanvas = function(e) {
	movesTipsShow && (comm.replayMoves(), comm.replayTipHide(), movesTipsShow = !1)
}
comm.replayTipHide = function() {
	function e() {
		a.parent.removeChild(a)
	}
	if(comm.replayTip) {
		var a = comm.replayTip;
		comm.replayTip = void 0, createjs.Tween.get(a).to({
			alpha: 0
		}, 1e3).call(e)
	}
}
comm.replayMoves = function() {
	clearInterval(movesInterval), cleanChess(), moves = fullMoves.concat(), play.init(3, fullMap), movesIndex = 0, replayMovesStep(), movesInterval = setInterval(replayMovesStep, 1500)
}
comm.reverseY = function(e) {
	return 9 - e
}
comm.key2cid = function(e) {
	var a = comm.name2id[e.split("")[0]];
	return a
}
comm.toServerPos = function(e, a) {
	var m = {
		x: parseInt(e) + 1,
		y: 10 - parseInt(a)
	};
	return m
}
comm.getMap4Server = function(e) {
	map4server = [];
	for(var a = 10, m = 0; m < e.length; m++) {
		for(var o = e[m], n = 0; n < o.length; n++) {
			var t = o[n];
			if(t) {
				var s = comm.name2id[t.split("")[0]];
				map4server.push({
					cid: s,
					x: n + 1,
					y: a
				})
			}
		}
		a--
	}
	return map4server
}
comm.getMoves4Server = function() {
	for(var e = [], a = 0; a < play.pace.length; a++) {
		var m = play.pace[a].split(""),
			o = {
				src: {
					x: parseInt(m[0]) + 1,
					y: 10 - parseInt(m[1])
				},
				dst: {
					x: parseInt(m[2]) + 1,
					y: 10 - parseInt(m[3])
				}
			};
		e[a] = o
	}
	return e
}
comm.onGameEnd = function(e) {
	if(1 == e) {
		comm.isWin = 1;
		var a = {};
		a.map = comm.moves4Server, a.moves = comm.getMoves4Server();
		var m = -1;
		serverData.head && (m = serverData.head.id), a.head = {
			id: m,
			totalMove: a.moves.length
		}, serverData.meta ? a.meta = serverData.meta : a.meta = {}, a.meta.FUPAN_TITLE = chapterTitle, a.meta.FUPAN_JSON_FROM = "H5", console.log("toServerData", a), console.log(JSON.stringify(a));
		var o = JSON.stringify(a);
		comm.filename = window.md5(o), comm.movesNum = a.moves.length;
		var n = REPLAY_SAVE_URL + "?filename=" + comm.filename + "&filetype=1";
		$("#sendBtn").hide(), $.ajax({
			type: "POST",
			url: n,
			dataType: "text",
			async: !1,
			success: function(e) {
				"OK" == e && comm.showSendBtn()
			},
			data: o
		})
	} else comm.isWin = 0;
	canRestart = !0
};
var canRestart = !1;
comm.showSendBtn = function() {
	console.log("showSendBtn"), $("#sendBtn").show()
}
comm.onload = function() {
	comm.dot = {
		dots: []
	}
comm.mans = {}, $("#regretBtn").click(play.regret), $("#replayBtn").click(comm.replayMoves), $("#nextBtn").click(comm.replayNext), $("#prevBtn").click(comm.replayPrev), $("#restartBtn").click(function(e) {
		(canRestart || confirm("是否确定要重新开始？")) && (hideResult(), cleanChess(), setEnable("regretBtn", !0), play.isPlay = !0, play.init(play.depth, play.nowMap), canRestart = !1, pgvSendClick({
			hottag: "a20150811chess.game.restart"
		}), requestServerStart())
	}), $("#sendBtn").click(function() {
		showMask()
	}), $("#helpBtn").click(function() {
		showMask()
	}), $("#moreBtn1").click(moreBtn), $("#moreBtn2").click(moreBtn), $("#moreBtn3").click(moreBtn), $("#moreBtn").click(moreBtn)
};
var shareObjTM = {
		img_url: "http://image.qqchess.qq.com/icon100X100.png",
		img_width: "100",
		img_height: "100",
		link: baseURL + "index.html",
		desc: "",
		title: ""
	},
	act_name = "a20150811chess";
comm.othersComplete = function() {
	"qq" == getEnv() && mqq.ui.setOnShareHandler(function(e) {
		switch(e + "") {
			case "0":
				mqq.ui.shareMessage({
					title: getShareTitle(),
					desc: getShareDesc(),
					share_type: e,
					share_url: getShareLink(),
					image_url: shareObjTM.img_url
				}, function(e) {
					pgvSendClick({
						hottag: "act." + act_name + ".btnshare.mq" + retCode
					})
				});
				break;
			case "1":
				mqq.ui.shareMessage({
					title: getShareDesc(),
					desc: getShareTitle(),
					share_type: e,
					share_url: getShareLink(),
					image_url: shareObjTM.img_url
				}, function(e) {
					pgvSendClick({
						hottag: "act." + act_name + ".btnshare.qzone" + retCode
					})
				});
				break;
			case "2":
				mqq.ui.shareMessage({
					title: getShareTitle(),
					desc: getShareDesc(),
					share_type: e,
					share_url: getShareLink(),
					image_url: shareObjTM.img_url
				}, function(e) {
					pgvSendClick({
						hottag: "act." + act_name + ".btnshare.friend" + retCode
					})
				});
				break;
			case "3":
				mqq.ui.shareMessage({
					title: getShareDesc(),
					desc: getShareTitle(),
					share_type: e,
					share_url: getShareLink(),
					image_url: shareObjTM.img_url
				}, function(e) {
					pgvSendClick({
						hottag: "act." + act_name + ".btnshare.timeline" + retCode
					})
				})
		}
	})
}
comm.showPane = function(e, a, m, o) {
	comm.box1.visible = !0, comm.box1.x = comm.spaceX * e + comm.pointStartX + 3 + parseInt(e / 3), comm.box1.y = comm.spaceY * a + comm.pointStartY + 4, comm.box2.visible = !0, comm.box2.x = comm.spaceX * m + comm.pointStartX + 3 + parseInt(m / 3), comm.box2.y = comm.spaceY * o + comm.pointStartY + 4 + parseInt(o / 3)
}
comm.hidePane = function() {
	comm.box1.visible = !1, comm.box2.visible = !1
}
comm.createMans = function(e) {
	for(var a = 0; a < e.length; a++)
		for(var m = 0; m < e[a].length; m++) {
			var o = e[a][m];
			if(o) {
				var n = new comm["class"].Man(o);
				n.x = m, n.y = a, comm.mans[o] = n;
				var t = addChess(n.pater, comm.spaceX * n.x + comm.pointStartX, comm.spaceY * n.y + comm.pointStartY);
				n.chess = t, n.move()
			}
		}
}
comm.arr2Clone = function(e) {
	for(var a = [], m = 0; m < e.length; m++) a[m] = e[m].slice();
	return a
}
comm.initMap = [
	["C0", "M0", "X0", "S0", "J0", "S1", "X1", "M1", "C1"],
	[, , , , , , , , ],
	[, "P0", , , , , , "P1"],
	["Z0", , "Z1", , "Z2", , "Z3", , "Z4"],
	[, , , , , , , , ],
	[, , , , , , , , ],
	["z0", , "z1", , "z2", , "z3", , "z4"],
	[, "p0", , , , , , "p1"],
	[, , , , , , , , ],
	["c0", "m0", "x0", "s0", "j0", "s1", "x1", "m1", "c1"]
], comm.keys = {
	c0: "c",
	c1: "c",
	m0: "m",
	m1: "m",
	x0: "x",
	x1: "x",
	s0: "s",
	s1: "s",
	j0: "j",
	p0: "p",
	p1: "p",
	z0: "z",
	z1: "z",
	z2: "z",
	z3: "z",
	z4: "z",
	z5: "z",
	C0: "c",
	C1: "C",
	M0: "M",
	M1: "M",
	X0: "X",
	X1: "X",
	S0: "S",
	S1: "S",
	J0: "J",
	P0: "P",
	P1: "P",
	Z0: "Z",
	Z1: "Z",
	Z2: "Z",
	Z3: "Z",
	Z4: "Z",
	Z5: "Z"
}
comm.bylaw = {}
comm.bylaw.c = function(e, a, m, o) {
	for(var n = [], t = e - 1; t >= 0; t--) {
		if(m[a][t]) {
			comm.mans[m[a][t]].my != o && n.push([t, a]);
			break
		}
		n.push([t, a])
	}
	for(var t = e + 1; 8 >= t; t++) {
		if(m[a][t]) {
			comm.mans[m[a][t]].my != o && n.push([t, a]);
			break
		}
		n.push([t, a])
	}
	for(var t = a - 1; t >= 0; t--) {
		if(m[t][e]) {
			comm.mans[m[t][e]].my != o && n.push([e, t]);
			break
		}
		n.push([e, t])
	}
	for(var t = a + 1; 9 >= t; t++) {
		if(m[t][e]) {
			comm.mans[m[t][e]].my != o && n.push([e, t]);
			break
		}
		n.push([e, t])
	}
	return n
}
comm.bylaw.m = function(e, a, m, o) {
	var n = [];
	return !(a - 2 >= 0 && 8 >= e + 1) || play.map[a - 1][e] || comm.mans[m[a - 2][e + 1]] && comm.mans[m[a - 2][e + 1]].my == o || n.push([e + 1, a - 2]), !(a - 1 >= 0 && 8 >= e + 2) || play.map[a][e + 1] || comm.mans[m[a - 1][e + 2]] && comm.mans[m[a - 1][e + 2]].my == o || n.push([e + 2, a - 1]), !(9 >= a + 1 && 8 >= e + 2) || play.map[a][e + 1] || comm.mans[m[a + 1][e + 2]] && comm.mans[m[a + 1][e + 2]].my == o || n.push([e + 2, a + 1]), !(9 >= a + 2 && 8 >= e + 1) || play.map[a + 1][e] || comm.mans[m[a + 2][e + 1]] && comm.mans[m[a + 2][e + 1]].my == o || n.push([e + 1, a + 2]), !(9 >= a + 2 && e - 1 >= 0) || play.map[a + 1][e] || comm.mans[m[a + 2][e - 1]] && comm.mans[m[a + 2][e - 1]].my == o || n.push([e - 1, a + 2]), !(9 >= a + 1 && e - 2 >= 0) || play.map[a][e - 1] || comm.mans[m[a + 1][e - 2]] && comm.mans[m[a + 1][e - 2]].my == o || n.push([e - 2, a + 1]), !(a - 1 >= 0 && e - 2 >= 0) || play.map[a][e - 1] || comm.mans[m[a - 1][e - 2]] && comm.mans[m[a - 1][e - 2]].my == o || n.push([e - 2, a - 1]), !(a - 2 >= 0 && e - 1 >= 0) || play.map[a - 1][e] || comm.mans[m[a - 2][e - 1]] && comm.mans[m[a - 2][e - 1]].my == o || n.push([e - 1, a - 2]), n
}
comm.bylaw.x = function(e, a, m, o) {
	var n = [];
	return 1 === o ? (!(9 >= a + 2 && 8 >= e + 2) || play.map[a + 1][e + 1] || comm.mans[m[a + 2][e + 2]] && comm.mans[m[a + 2][e + 2]].my == o || n.push([e + 2, a + 2]), !(9 >= a + 2 && e - 2 >= 0) || play.map[a + 1][e - 1] || comm.mans[m[a + 2][e - 2]] && comm.mans[m[a + 2][e - 2]].my == o || n.push([e - 2, a + 2]), !(a - 2 >= 5 && 8 >= e + 2) || play.map[a - 1][e + 1] || comm.mans[m[a - 2][e + 2]] && comm.mans[m[a - 2][e + 2]].my == o || n.push([e + 2, a - 2]), !(a - 2 >= 5 && e - 2 >= 0) || play.map[a - 1][e - 1] || comm.mans[m[a - 2][e - 2]] && comm.mans[m[a - 2][e - 2]].my == o || n.push([e - 2, a - 2])) : (!(4 >= a + 2 && 8 >= e + 2) || play.map[a + 1][e + 1] || comm.mans[m[a + 2][e + 2]] && comm.mans[m[a + 2][e + 2]].my == o || n.push([e + 2, a + 2]), !(4 >= a + 2 && e - 2 >= 0) || play.map[a + 1][e - 1] || comm.mans[m[a + 2][e - 2]] && comm.mans[m[a + 2][e - 2]].my == o || n.push([e - 2, a + 2]), !(a - 2 >= 0 && 8 >= e + 2) || play.map[a - 1][e + 1] || comm.mans[m[a - 2][e + 2]] && comm.mans[m[a - 2][e + 2]].my == o || n.push([e + 2, a - 2]), !(a - 2 >= 0 && e - 2 >= 0) || play.map[a - 1][e - 1] || comm.mans[m[a - 2][e - 2]] && comm.mans[m[a - 2][e - 2]].my == o || n.push([e - 2, a - 2])), n
}
comm.bylaw.s = function(e, a, m, o) {
	var n = [];
	return 1 === o ? (9 >= a + 1 && 5 >= e + 1 && (!comm.mans[m[a + 1][e + 1]] || comm.mans[m[a + 1][e + 1]].my != o) && n.push([e + 1, a + 1]), 9 >= a + 1 && e - 1 >= 3 && (!comm.mans[m[a + 1][e - 1]] || comm.mans[m[a + 1][e - 1]].my != o) && n.push([e - 1, a + 1]), a - 1 >= 7 && 5 >= e + 1 && (!comm.mans[m[a - 1][e + 1]] || comm.mans[m[a - 1][e + 1]].my != o) && n.push([e + 1, a - 1]), a - 1 >= 7 && e - 1 >= 3 && (!comm.mans[m[a - 1][e - 1]] || comm.mans[m[a - 1][e - 1]].my != o) && n.push([e - 1, a - 1])) : (2 >= a + 1 && 5 >= e + 1 && (!comm.mans[m[a + 1][e + 1]] || comm.mans[m[a + 1][e + 1]].my != o) && n.push([e + 1, a + 1]), 2 >= a + 1 && e - 1 >= 3 && (!comm.mans[m[a + 1][e - 1]] || comm.mans[m[a + 1][e - 1]].my != o) && n.push([e - 1, a + 1]), a - 1 >= 0 && 5 >= e + 1 && (!comm.mans[m[a - 1][e + 1]] || comm.mans[m[a - 1][e + 1]].my != o) && n.push([e + 1, a - 1]), a - 1 >= 0 && e - 1 >= 3 && (!comm.mans[m[a - 1][e - 1]] || comm.mans[m[a - 1][e - 1]].my != o) && n.push([e - 1, a - 1])), n
}
comm.bylaw.j = function(e, a, m, o) {
	var n = [],
		t = function(e, a) {
			for(var e = comm.mans.j0.y, o = comm.mans.J0.x, a = comm.mans.J0.y, n = e - 1; n > a; n--)
				if(m[n][o]) return !1;
			return !0
		}();
	return 1 === o ? (9 >= a + 1 && (!comm.mans[m[a + 1][e]] || comm.mans[m[a + 1][e]].my != o) && n.push([e, a + 1]), a - 1 >= 7 && (!comm.mans[m[a - 1][e]] || comm.mans[m[a - 1][e]].my != o) && n.push([e, a - 1]), comm.mans.j0.x == comm.mans.J0.x && t && n.push([comm.mans.J0.x, comm.mans.J0.y])) : (2 >= a + 1 && (!comm.mans[m[a + 1][e]] || comm.mans[m[a + 1][e]].my != o) && n.push([e, a + 1]), a - 1 >= 0 && (!comm.mans[m[a - 1][e]] || comm.mans[m[a - 1][e]].my != o) && n.push([e, a - 1]), comm.mans.j0.x == comm.mans.J0.x && t && n.push([comm.mans.j0.x, comm.mans.j0.y])), 5 >= e + 1 && (!comm.mans[m[a][e + 1]] || comm.mans[m[a][e + 1]].my != o) && n.push([e + 1, a]), e - 1 >= 3 && (!comm.mans[m[a][e - 1]] || comm.mans[m[a][e - 1]].my != o) && n.push([e - 1, a]), n
}
comm.bylaw.p = function(e, a, m, o) {
	for(var n = [], t = 0, s = e - 1; s >= 0; s--) {
		if(m[a][s]) {
			if(0 == t) {
				t++;
				continue
			}
			comm.mans[m[a][s]].my != o && n.push([s, a]);
			break
		}
		0 == t && n.push([s, a])
	}
	for(var t = 0, s = e + 1; 8 >= s; s++) {
		if(m[a][s]) {
			if(0 == t) {
				t++;
				continue
			}
			comm.mans[m[a][s]].my != o && n.push([s, a]);
			break
		}
		0 == t && n.push([s, a])
	}
	for(var t = 0, s = a - 1; s >= 0; s--) {
		if(m[s][e]) {
			if(0 == t) {
				t++;
				continue
			}
			comm.mans[m[s][e]].my != o && n.push([e, s]);
			break
		}
		0 == t && n.push([e, s])
	}
	for(var t = 0, s = a + 1; 9 >= s; s++) {
		if(m[s][e]) {
			if(0 == t) {
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
	return 1 === o ? (a - 1 >= 0 && (!comm.mans[m[a - 1][e]] || comm.mans[m[a - 1][e]].my != o) && n.push([e, a - 1]), 8 >= e + 1 && 4 >= a && (!comm.mans[m[a][e + 1]] || comm.mans[m[a][e + 1]].my != o) && n.push([e + 1, a]), e - 1 >= 0 && 4 >= a && (!comm.mans[m[a][e - 1]] || comm.mans[m[a][e - 1]].my != o) && n.push([e - 1, a])) : (9 >= a + 1 && (!comm.mans[m[a + 1][e]] || comm.mans[m[a + 1][e]].my != o) && n.push([e, a + 1]), 8 >= e + 1 && a >= 6 && (!comm.mans[m[a][e + 1]] || comm.mans[m[a][e + 1]].my != o) && n.push([e + 1, a]), e - 1 >= 0 && a >= 6 && (!comm.mans[m[a][e - 1]] || comm.mans[m[a][e - 1]].my != o) && n.push([e - 1, a])), n
}
comm.value = {
	c: [
		[206, 208, 207, 213, 214, 213, 207, 208, 206],
		[206, 212, 209, 216, 233, 216, 209, 212, 206],
		[206, 208, 207, 214, 216, 214, 207, 208, 206],
		[206, 213, 213, 216, 216, 216, 213, 213, 206],
		[208, 211, 211, 214, 215, 214, 211, 211, 208],
		[208, 212, 212, 214, 215, 214, 212, 212, 208],
		[204, 209, 204, 212, 214, 212, 204, 209, 204],
		[198, 208, 204, 212, 212, 212, 204, 208, 198],
		[200, 208, 206, 212, 200, 212, 206, 208, 200],
		[194, 206, 204, 212, 200, 212, 204, 206, 194]
	],
	m: [
		[90, 90, 90, 96, 90, 96, 90, 90, 90],
		[90, 96, 103, 97, 94, 97, 103, 96, 90],
		[92, 98, 99, 103, 99, 103, 99, 98, 92],
		[93, 108, 100, 107, 100, 107, 100, 108, 93],
		[90, 100, 99, 103, 104, 103, 99, 100, 90],
		[90, 98, 101, 102, 103, 102, 101, 98, 90],
		[92, 94, 98, 95, 98, 95, 98, 94, 92],
		[93, 92, 94, 95, 92, 95, 94, 92, 93],
		[85, 90, 92, 93, 78, 93, 92, 90, 85],
		[88, 85, 90, 88, 90, 88, 90, 85, 88]
	],
	x: [
		[0, 0, 20, 0, 0, 0, 20, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 23, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 20, 0, 0, 0, 20, 0, 0],
		[0, 0, 20, 0, 0, 0, 20, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[18, 0, 0, 0, 23, 0, 0, 0, 18],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 20, 0, 0, 0, 20, 0, 0]
	],
	s: [
		[0, 0, 0, 20, 0, 20, 0, 0, 0],
		[0, 0, 0, 0, 23, 0, 0, 0, 0],
		[0, 0, 0, 20, 0, 20, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 20, 0, 20, 0, 0, 0],
		[0, 0, 0, 0, 23, 0, 0, 0, 0],
		[0, 0, 0, 20, 0, 20, 0, 0, 0]
	],
	j: [
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0],
		[0, 0, 0, 8888, 8888, 8888, 0, 0, 0]
	],
	p: [
		[100, 100, 96, 91, 90, 91, 96, 100, 100],
		[98, 98, 96, 92, 89, 92, 96, 98, 98],
		[97, 97, 96, 91, 92, 91, 96, 97, 97],
		[96, 99, 99, 98, 100, 98, 99, 99, 96],
		[96, 96, 96, 96, 100, 96, 96, 96, 96],
		[95, 96, 99, 96, 100, 96, 99, 96, 95],
		[96, 96, 96, 96, 96, 96, 96, 96, 96],
		[97, 96, 100, 99, 101, 99, 100, 96, 97],
		[96, 97, 98, 98, 98, 98, 98, 97, 96],
		[96, 96, 97, 99, 99, 99, 97, 96, 96]
	],
	z: [
		[9, 9, 9, 11, 13, 11, 9, 9, 9],
		[19, 24, 34, 42, 44, 42, 34, 24, 19],
		[19, 24, 32, 37, 37, 37, 32, 24, 19],
		[19, 23, 27, 29, 30, 29, 27, 23, 19],
		[14, 18, 20, 27, 29, 27, 20, 18, 14],
		[7, 0, 13, 0, 16, 0, 13, 0, 7],
		[7, 0, 7, 0, 15, 0, 7, 0, 7],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0]
	]
}
comm.value.C = comm.arr2Clone(comm.value.c).reverse(), comm.value.M = comm.arr2Clone(comm.value.m).reverse(), comm.value.X = comm.value.x, comm.value.S = comm.value.s, comm.value.J = comm.value.j, comm.value.P = comm.arr2Clone(comm.value.p).reverse(), comm.value.Z = comm.arr2Clone(comm.value.z).reverse(), comm.args = {
	c: {
		text: "车",
		img: "r_c",
		my: 1,
		bl: "c",
		value: comm.value.c
	},
	m: {
		text: "马",
		img: "r_m",
		my: 1,
		bl: "m",
		value: comm.value.m
	},
	x: {
		text: "相",
		img: "r_x",
		my: 1,
		bl: "x",
		value: comm.value.x
	},
	s: {
		text: "仕",
		img: "r_s",
		my: 1,
		bl: "s",
		value: comm.value.s
	},
	j: {
		text: "将",
		img: "r_j",
		my: 1,
		bl: "j",
		value: comm.value.j
	},
	p: {
		text: "炮",
		img: "r_p",
		my: 1,
		bl: "p",
		value: comm.value.p
	},
	z: {
		text: "兵",
		img: "r_z",
		my: 1,
		bl: "z",
		value: comm.value.z
	},
	C: {
		text: "車",
		img: "b_c",
		my: -1,
		bl: "c",
		value: comm.value.C
	},
	M: {
		text: "馬",
		img: "b_m",
		my: -1,
		bl: "m",
		value: comm.value.M
	},
	X: {
		text: "象",
		img: "b_x",
		my: -1,
		bl: "x",
		value: comm.value.X
	},
	S: {
		text: "士",
		img: "b_s",
		my: -1,
		bl: "s",
		value: comm.value.S
	},
	J: {
		text: "帅",
		img: "b_j",
		my: -1,
		bl: "j",
		value: comm.value.J
	},
	P: {
		text: "炮",
		img: "b_p",
		my: -1,
		bl: "p",
		value: comm.value.P
	},
	Z: {
		text: "卒",
		img: "b_z",
		my: -1,
		bl: "z",
		value: comm.value.Z
	}
}
comm.emptyMap = [
	[, , , , , , , , ],
	[, , , , , , , , ],
	[, , , , , , , , ],
	[, , , , , , , , ],
	[, , , , , , , , ],
	[, , , , , , , , ],
	[, , , , , , , , ],
	[, , , , , , , , ],
	[, , , , , , , , ],
	[, , , , , , , , ]
];
var lastTime = 0,
	commTipsImg;
comm.getTips = function(e) {
	var e = new createjs.Text(e, "30px Arial", "#FFE5B4");
	e.x = 60, e.y = 34;
	var a = e.getBounds(),
		m = new createjs.ScaleBitmap(commTipsImg, new createjs.Rectangle(24, 24, 51, 43));
	m.setDrawSize(a.width + 100, 100);
	var o = new createjs.Container;
	return o.addChild(m), o.addChild(e), o
};
var play = play || {};
play.init = function(e, a) {
	var a = a || comm.initMap;
	play.cMap = a.concat();
	var e = e || 3;
	play.my = 1,
	play.nowMap = a,
	play.map = comm.arr2Clone(a), 
	play.nowManKey = !1, 
	play.pace = [], 
	play.isPlay = !0, 
	play.isAnimating = !1, 
	play.bylaw = comm.bylaw, 
	play.showPane = comm.showPane, 
	play.isOffensive = !0, 
	play.depth = e, 
	play.isFoul = !1, 
	play.mans = comm.mans = {};
	comm.createMans(a);
	for(var m = 0; m < play.map.length; m++)
		for(var o = 0; o < play.map[m].length; o++) {
			var n = play.map[m][o];
			n && (comm.mans[n].x = o, comm.mans[n].y = m, comm.mans[n].isShow = !0)
		}
	comm.moves4Server = comm.getMap4Server(play.map)
};
var removeOnDrops = [],
	callOnDrops = [],
	callOnDropsArgs = [];
play.onChessDrop = function() {
	function e() {
		for(var e = callOnDrops.length - 1; e >= 0; e--) {
			var a = callOnDrops.splice(e, 1)[0],
				m = callOnDropsArgs.splice(e, 1)[0];
			a.apply(this, m)
		}
		play.isAnimating = !1
	}
	for(var a = removeOnDrops.length - 1; a >= 0; a--) {
		var m = removeOnDrops.splice(a, 1)[0];
		m.parent.removeChild(m)
	}
	createjs.Sound.play("drop"), play.showThink(), setTimeout(e, 200)
}
play.addCallOnDrop = function(e, a) {
	callOnDrops.push(e), callOnDropsArgs.push(a)
}
play.addRemoveOnDrop = function(e) {
	removeOnDrops.push(e)
}
play.regret = function() {
	play.pace.length >= 2 ? (regret(), SAI(3, {}, onReqRegret, onFault)) : showFloatTip("还没开始下棋呢")
}
play.clickCanvas = function(e) {
	if(play.isAnimating) return !1;
	if(!play.isPlay) return !1;
	var a = play.getClickMan(e),
		m = play.getClickPoint(e),
		o = m.x,
		n = m.y;
	a ? play.clickMan(a, o, n) : play.clickPoint(o, n), play.isFoul = play.checkFoul()
}
play.clickMan = function(e, a, m) {
	var o = comm.mans[e];
	if(play.nowManKey && play.nowManKey != e && o.my != comm.mans[play.nowManKey].my) {
		if(play.indexOfPs(comm.mans[play.nowManKey].ps, [a, m])) {
			o.isShow = !1, play.addRemoveOnDrop(o.chess);
			var n = comm.mans[play.nowManKey].x + "" + comm.mans[play.nowManKey].y;
			delete play.map[comm.mans[play.nowManKey].y][comm.mans[play.nowManKey].x], play.map[m][a] = play.nowManKey, comm.showPane(comm.mans[play.nowManKey].x, comm.mans[play.nowManKey].y, a, m);
			var t = comm.key2cid(e),
				s = comm.toServerPos(comm.mans[play.nowManKey].x, comm.mans[play.nowManKey].y),
				r = comm.toServerPos(a, m),
				c = {
					cid: t,
					from: s,
					to: r
				};
			play.addCallOnDrop(SAI, [2, c, onReqMove, onFault]), comm.mans[play.nowManKey].x = a, comm.mans[play.nowManKey].y = m, comm.mans[play.nowManKey].alpha = 1, comm.mans[play.nowManKey].animate(), play.pace.push(n + a + m), play.nowManKey = !1, comm.hidePane(), comm.dot.dots = [], comm.hideDots(), comm.light.visible = !1, play.addCallOnDrop(play.serverAIPlay), "j0" == e && play.onGameEnd(-1), "J0" == e && play.onGameEnd(1)
		}
	} else 1 === o.my && (comm.mans[play.nowManKey] && (comm.mans[play.nowManKey].alpha = 1), comm.hideDots(), comm.hidePane(), play.nowManKey = e, comm.mans[e].ps = comm.mans[e].bl(), comm.dot.dots = comm.mans[e].ps, comm.showDots(), first ? (createjs.Sound.play("drop"), first = !1) : createjs.Sound.play("select"), comm.light.x = comm.spaceX * o.x + comm.pointStartX - 20, comm.light.y = comm.spaceY * o.y + comm.pointStartY - 24, comm.light.visible = !0)
};
var first = !1;
play.clickPoint = function(e, a) {
	var m = play.nowManKey,
		o = comm.mans[m];
	if(play.nowManKey && play.indexOfPs(comm.mans[m].ps, [e, a])) {
		var n = o.x + "" + o.y;
		delete play.map[o.y][o.x], play.map[a][e] = m, comm.showPane(o.x, o.y, e, a);
		var t = comm.key2cid(m),
			s = comm.toServerPos(o.x, o.y),
			r = comm.toServerPos(e, a),
			c = {
				cid: t,
				from: s,
				to: r
			};
		play.addCallOnDrop(SAI, [2, c, onReqMove, onFault]), o.x = e, o.y = a, o.animate(), play.pace.push(n + e + a), play.nowManKey = !1, comm.dot.dots = [], comm.hideDots(), play.addCallOnDrop(play.serverAIPlay), comm.light.visible = !1
	}
}
play.showThink = function() {
	1 == play.my && mode == MODE_PLAY && $("#AIThink").show()
}
play.hideThink = function() {
	$("#AIThink").hide()
}
play.stepPlay = function(e, a, m) {
	m = m || !1, comm.hideDots(), comm.light.visible = !1;
	var o = play.map[e.y][e.x];
	play.nowManKey = o;
	var o = play.map[a.y][a.x];
	o ? play.AIclickMan(o, a.x, a.y, m) : play.AIclickPoint(a.x, a.y, m)
};
var waitServerPlay = !1;
play.serverAIPlay = function() {
	if(0 != play.isPlay) {
		if(!play.aiPace) return void(waitServerPlay = !0);
		waitServerPlay = !1, play.my = -1;
		var e = play.aiPace;
		play.aiPace = void 0, play.pace.push(e.join(""));
		var a = play.map[e[1]][e[0]];
		play.nowManKey = a;
		var a = play.map[e[3]][e[2]];
		a ? setTimeout(play.AIclickMan, 100, a, e[2], e[3]) : setTimeout(play.AIclickPoint, 100, e[2], e[3])
	}
}
play.AIPlay = function() {
	if(0 != play.isPlay) {
		play.my = -1;
		var e = AI.init(play.pace.join(""));
		if(!e) return void play.onGameEnd(1);
		play.pace.push(e.join(""));
		var a = play.map[e[1]][e[0]];
		play.nowManKey = a;
		var a = play.map[e[3]][e[2]];
		a ? setTimeout(play.AIclickMan, 100, a, e[2], e[3]) : setTimeout(play.AIclickPoint, 100, e[2], e[3])
	}
}
play.checkFoul = function() {
	var e = play.pace,
		a = parseInt(e.length, 10);
	return a > 11 && e[a - 1] == e[a - 5] && e[a - 5] == e[a - 9] ? e[a - 4].split("") : !1
}
play.AIclickMan = function(e, a, m, o) {
	var n = comm.mans[e];
	n.isShow = !1, o ? n.chess.parent.removeChild(n.chess) : play.addRemoveOnDrop(n.chess), delete play.map[comm.mans[play.nowManKey].y][comm.mans[play.nowManKey].x], play.map[m][a] = play.nowManKey, play.showPane(comm.mans[play.nowManKey].x, comm.mans[play.nowManKey].y, a, m), comm.mans[play.nowManKey].x = a, comm.mans[play.nowManKey].y = m, o ? comm.mans[play.nowManKey].move() : comm.mans[play.nowManKey].animate(), play.nowManKey = !1, "j0" == e && play.onGameEnd(-1), "J0" == e && play.onGameEnd(1), mode == MODE_PLAY && play.hideThink()
}
play.AIclickPoint = function(e, a, m) {
	var o = play.nowManKey,
		n = comm.mans[o];
	play.nowManKey && (delete play.map[comm.mans[play.nowManKey].y][comm.mans[play.nowManKey].x], play.map[a][e] = o, comm.showPane(n.x, n.y, e, a), n.x = e, n.y = a, m ? n.move() : n.animate(), play.nowManKey = !1), mode == MODE_PLAY && play.isPlay && play.hideThink()
}
play.indexOfPs = function(e, a) {
	for(var m = 0; m < e.length; m++)
		if(e[m][0] == a[0] && e[m][1] == a[1]) return !0;
	return !1
}
play.getClickPoint = function(e) {
	var a = Math.round((e.stageX - comm.pointStartX - 20) / comm.spaceX),
		m = Math.round((e.stageY - comm.pointStartY - 20) / comm.spaceY);
	return {
		x: a,
		y: m
	}
}
play.getClickMan = function(e) {
	var a = play.getClickPoint(e),
		m = a.x,
		o = a.y;
	return 0 > m || m > 8 || 0 > o || o > 9 ? !1 : play.map[o][m] && "0" != play.map[o][m] ? play.map[o][m] : !1
}
play.onGameEndLose = function() {
	play.onGameEnd(-1, 1)
}
play.onGameEnd = function(e, a) {
	play.isPlay = !1, comm.onGameEnd(e), play.hideThink(), 1 === e ? (console.log("恭喜你，你赢了！"), play.showWin()) : (console.log("很遗憾，你输了！"), a ? play.showLose() : play.addCallOnDrop(play.showLose))
}
play.showWin = function() {
	createjs.Sound.play("gamewin"), showResult(1)
}
play.showLose = function() {
	createjs.Sound.play("gamelose"), showResult(0)
};