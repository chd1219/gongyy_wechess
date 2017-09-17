/*bill命名空间*/
var bill = bill || {};
var isanalyse = isanalyse || 0;
var boardset = {boutside:-1.1, routside:10.3, outsidescale:1.58};
var playtime = {red:0,black:0};
var showThinkset = 0;
var first = !1;
var isComPlay = 0;
var createbroad = !0;
var currentId = 0;
var id = 0;
var moves = [];
var chessnum = [];
var countPath = 0;
var stageshape = [];
var stagetext = [];
var autoreplayset = 0;
var relayNextLock = 0;
var relayPrevLock = 0;
var autoreplayspan = 2000;
var isOffensive = !0;
var removeOnDrops = [];
var callOnDrops = [];
var callOnDropsArgs = [];
var first = !1;
var waitServerPlay = !1;
/*初始化*/
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
    for (var m = 0; m < bill.map.length; m++) {
    	for (var o = 0; o < bill.map[m].length; o++) {
	        var n = bill.map[m][o];
	        n && (comm.mans[n].x = o, comm.mans[n].y = m, comm.mans[n].isShow = !0)
	    }
    }    	
    comm.moves4Server = comm.getMap4Server(bill.map),
        k == !0 ? ( bill.isPlay = !0 ) : ($("#saveBtn").show(), bill.isPlay = !1);
}
/*响应先后手*/
bill.aioffensive = function () {
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
}
/*响应先后手*/
bill.offensive = function () {
	if (movesIndex > 0 ||　moves.length > 0){
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
	bill.cleanChess();
	bill.isOffensive == !0 ? isOffensive = !1 : isOffensive = !0;
	isVerticalReverse ? bill.init(3, comm.arrReverse(bill.cMap), !0) : bill.init(3, bill.cMap, !0);
	movesIndex = 0;
	moves.length = 0;
	bill.paceEx.length = 0;
	bill.replayBtnUpdate();
}
/*编辑棋谱*/
bill.editboard = function () {
	bill.cleanLine();
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
    mode = 5;
    createbroad = !0,
    comm.init();
    bill.sMapList = bill.getsMap();  
    var ss = 0;  

    bill.pace = [];
    board.y = 100;    
    cleanChess();
    bill.init(3, bill.map, !1); 
    for (x in bill.sMapList) {
        m = parseInt(ss/6);
        n = ss%6;
        if (bill.sMapList[x].length > 0) {            
            bill.sMap[m][n] = bill.sMapList[x][0];
            m ? flag = boardset.routside : flag = boardset.boutside;
            bill.createMan(bill.sMap[m][n], flag, n * boardset.outsidescale);
            bill.drawNum(m, n, bill.sMapList[x].length);
        }     
        else {
            bill.sMap[m][n] = "";
        }   
        ss++;
    }
}
/*获取棋盘数据*/
bill.getsMap = function () {
    var aa = {
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
    for (var i = 0; i < bill.map.length; i++) {
        for (var j = 0; j < bill.map[i].length ; j++) {
            temp = bill.map[i][j];
            if (temp && temp != "j0" && temp != "J0") {
                item = temp.slice(0,1);
                index = temp.slice(1,2);
                (aa[item]).remove(temp);            
            }
        }
    }
    return JSON.parse(JSON.stringify(aa));
}
/*创建棋谱2*/
bill.create2 = function () {
	$("#createBtn2").hide(),
	$("#tipsInfo").hide(),
	bill.cleanChess(),
	bill.init(3, bill.map, !1);
}
/*创建棋谱*/
bill.create = function () {
	$("#createBtn").hide(),
	$("#mode1").hide(),
	$("#mode2").hide(),
	$("#mode3").hide(),
	$("#mode4").hide(),
	$("#mode5").show(),
	$("#restartdialog").hide(),
	createbroad = !0,
	setEnable("prevBtn2", !1),
	setEnable("nextBtn2", !1),
	bill.pace = [],
	cleanChess();
	bill.init(3, bill.map, !1);
	bill.cleanBroad();
}
/*响应棋子落下事件*/
bill.onChessDrop = function() {
    function e() {
        for (var e = callOnDrops.length - 1; e >= 0; e--) {
            var a = callOnDrops.splice(e, 1)[0],
			m = callOnDropsArgs.splice(e, 1)[0];
           	a.apply(this, m)
        }
        bill.isAnimating = !1
    }
    for (var a = removeOnDrops.length - 1; a >= 0; a--) {
        var m = removeOnDrops.splice(a, 1)[0];
        m.parent.removeChild(m)
    }
    comm.soundplay("drop"),
    setTimeout(e, 200)
}
/*添加callOnDrops*/
bill.addCallOnDrop = function(e, a) {	
    callOnDrops.push(e),
    callOnDropsArgs.push(a)
}
/*添加removeOnDrops*/
bill.addRemoveOnDrop = function(e) {
    removeOnDrops.push(e)
}
/*悔棋*/
bill.airegret = function () {
	if (bill.paceEx.length == 0 || isVerticalReverse && bill.paceEx.length == 1) {
		showFloatTip("您还没开始走子");
		return;
	}

	bill.cleanLine();
	bill.isend = !1,
	bill.isPlay = !0,
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
}
/*悔棋*/
bill.regret = function () {
	if (b_autoset != 0 || r_autoset != 0) {
		showFloatTip("请取消电脑思考，再点击悔棋");
		return;
	}
	if (bill.paceEx.length == 0) {
		showFloatTip("还没开始下棋呢");
		return;
	}
	if (bill.paceEx.length != movesIndex) {
		showFloatTip("不是最后一步");
		return;
	}

	bill.cleanLine();
	bill.isend = !1,
	bill.isPlay = !0,
	moves = bill.getMoves4Server(-1);
	bill.cleanChess();
	isVerticalReverse ? bill.init(3, comm.arrReverse(bill.cMap), !0) : bill.init(3, bill.cMap, !0);
	if (movesIndex > 0) {
		movesIndex--;
		for (var e = 0; movesIndex > e; e++)
			bill.stepPlay(moves[e].src, moves[e].dst, !0);
	}
	bill.paceEx.pop();
	moves.length--;
	bill.replayBtnUpdate();
}
/*发送棋谱*/
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
/*清空棋子*/
bill.cleanBroad = function (e) {
	bill.cleanChess();
	bill.cleanChessEx();
	bill.sMap = comm.arr2Clone(bill.sMapFull),
	bill.sMapList = JSON.parse(JSON.stringify(bill.chessMan)),
	bill.createMans(bill.sMap),
	bill.init(3, bill.emptyMap, !1);
	$("#fullBtn").show();
	$("#clearBtn").hide();
}
/*摆满棋子*/
bill.fullBroad = function (e) {
	bill.cleanChess();
	bill.cleanChessEx();
	bill.sMap = comm.arr2Clone(bill.sMapEmpty),
	bill.sMapList = JSON.parse(JSON.stringify(bill.emptychessMan)),
	bill.init(3, comm.initMap, !1);
	$("#fullBtn").hide();
	$("#clearBtn").show();
}
/*点击Canvas*/
bill.clickCanvas = function (e) {
	if (mode != 5)
		return;
	if (bill.isAnimating)
		return !1;
	if (!bill.isPlay)
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
}
/*点击棋子*/
bill.clickMan = function (e, x, y) {
	if ((y > -1 && y < 10))
		bill.clickManIn(e, x, y);
	if ((y < 0 || y > 9))
		bill.clickManOut(e, x, y);
}
/*棋盘内->棋盘内*/
bill.clickManIn = function (e, a, m) {
	var o = comm.mans[e];
	if (bill.nowManKey && bill.nowManKey != e && o.my != bill.my) {
		/*吃子*/
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
			bill.cleanLine();
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
}
/*棋盘内->棋盘外*/
bill.clickManI2O = function (e, x, y) { 
	var m = bill.nowManKey;
	o = comm.mans[m];

	y < 0 ? (y = boardset.boutside) : (y = boardset.routside);
	y < 0 ? (o.my == -1 ? col = 0 : col = -1) : (o.my == 1 ? col = 1 : col = -1);
	if (col == -1)		return !1;

    var maptemp = {"C": 0, "M": 1, "P": 2, "X": 3, "S": 4, "Z": 5, "c": 0, "m": 1, "p": 2, "x": 3, "s": 4, "z": 5};
	e = maptemp[m.slice(0, 1)];
	if (e > -1) {
		var templist = [];
		templist = bill.sMapList[m.slice(0, 1)];
		var oldchess = bill.sMap[col][e];
		bill.sMap[col][e] = m;
		templist.push(m);

		stage.removeChild(chessnum[col * 6 + e]),
		templist.length ? bill.drawNum(col, e, templist.length) : !1;
	} else {
		showFloatTip("将帅不能移出棋盘");
		bill.cancleSelected();
		return !1;
	}
	delete bill.map[o.y][o.x];
	o.x = e * boardset.outsidescale,
	o.y = y,
	o.animate();
	/*删除原来的棋子*/
	setTimeout(function () {
		removeChess(oldchess)
	}, 300);

	bill.cancleSelected();
}
/*取消选择*/
bill.cancleSelected = function () {
	bill.nowManKey = !1,
	comm.dot.dots = [],
	comm.hideDots(),
	comm.light.visible = !1;
}
/*查找是否存在分支,否则增加分支*/
bill.branch = function (e) {
	step = e;	
	if (bill.paceEx.length < movesIndex) {
		bill.paceEx[movesIndex - 1] = new Array();
		id++;
		preId = currentId;
		currentId = id;
		bill.paceEx[movesIndex - 1].push([step, id, preId]);
		m = step.split("");
        o = {src: {x: parseInt(m[0]), y: parseInt(m[1])}, dst: {x: parseInt(m[2]), y: parseInt(m[3])}};
		moves.push(o);
		return;
	}
	if (bill.checkbranch(step)) {
		return;
	} 
	else {
		id++;
		preId = currentId;
		currentId = id;
		bill.paceEx[movesIndex - 1].push([step, id, preId]);
	}
}
/*点击棋盘外棋子*/
bill.clickManOut = function (e, x, y) {
	if (bill.nowManKey == e) {
		bill.cancleSelected();
	} else {
		if (bill.nowManKey) {
			var o = comm.mans[bill.nowManKey];
			if (o.y > -1 && o.y < 10) {
				bill.clickManI2O(e, x, y)
			} else {
				bill.cancleSelected();
				var o = comm.mans[e];
				bill.nowManKey = e;
                first ? (comm.soundplay("drop"), first = !1) : comm.soundplay("select"), comm.light.x = comm.spaceX * o.x + comm.pointStartX - 20, comm.light.y = comm.spaceY * o.y + comm.pointStartY - 24, comm.light.visible = !0
            }
        }
        else {
            var o = comm.mans[e];
            bill.nowManKey = e;
            first ? (comm.soundplay("drop"), first = !1) : comm.soundplay("select"), comm.light.x = comm.spaceX * o.x + comm.pointStartX - 20, comm.light.y = comm.spaceY * o.y + comm.pointStartY - 24, comm.light.visible = !0
		}
	}
}
/*点击棋盘*/
bill.clickPoint = function (e, a) {
	if (bill.isPlay == !0) { 
		/*棋谱模式*/
		bill.clickPointPlaying(e, a)
	} else if (bill.nowManKey) {
		/*摆棋模式*/
		bill.clickPointPre(e, a)
	}
	bill.cancleSelected();
}
/*点击棋盘-棋谱模式*/
bill.clickPointPlaying = function (e, a) {
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
/*点击棋盘-摆棋模式*/
bill.clickPointPre = function (e, a) { 
	var m = bill.nowManKey;
	o = comm.mans[m];
	/*出界*/
	if (e < 0 || e > 8) {
		return;
	}
	/*棋盘外->棋盘外*/
	if ((a < 0 || a > 9) && (o.y < 0 || o.y > 9)) {
		return;
	}
	/*棋盘内->棋盘外*/
	if (a < 0 || a > 9) {
		a < 0 ? (a = boardset.boutside) : (a = boardset.routside);
		a < 0 ? (o.my == -1 ? col = 0 : col = -1) : (o.my == 1 ? col = 1 : col = -1);
		if (col == -1)			return !1;

        var maptemp = {"C": 0, "M": 1, "P": 2, "X": 3, "S": 4, "Z": 5, "c": 0, "m": 1, "p": 2, "x": 3, "s": 4, "z": 5};
		e = maptemp[m.slice(0, 1)];
		if (e > -1) {
			var templist = [];
			templist = bill.sMapList[m.slice(0, 1)];
			var oldchess = bill.sMap[col][e];
			bill.sMap[col][e] = m;
			e = e * boardset.outsidescale;
			templist.push(m);

			stage.removeChild(chessnum[col * 6 + e / boardset.outsidescale]),
			templist.length ? bill.drawNum(col, e / boardset.outsidescale, templist.length) : !1;
		} else {
			showFloatTip("将帅不能移出棋盘");
			return !1;
		}
	} else { 
		/*棋盘内->棋盘内*/
		if (bill.checkMans(m, a, e)) {
			bill.map[a][e] = m;
		} else {
			showFloatTip("摆放错误，请重试");
			return !1;
		}
	}
	/*棋盘外->棋盘内*/
	if (o.y < 0 || o.y > 9) {
		o.y < 0 ? (col = 0) : (col = 1);
		row = parseInt(o.x / boardset.outsidescale);
		delete bill.sMap[col][row];
		var templist = [];
		templist = bill.sMapList[m.slice(0, 1)];
		for (var i = 0; i < templist.length; i++) {
			if (templist[i] == m) {
				delete templist[i];
				for (var j = i; j < templist.length - 1; j++) {
					templist[j] = templist[j + 1];
				}
				break;
			}
		}
		templist.length -= 1;
		newchess = templist[0];
		bill.createMan(newchess, o.y, o.x),
		stage.removeChild(chessnum[col * 6 + row]),
		templist.length ? bill.drawNum(col, row, templist.length) : !1;
		bill.sMap[col][row] = newchess;
	} else {
		delete bill.map[o.y][o.x];
	}

	o.x = e,
	o.y = a,
	o.animate();
	/*删除原来的棋子*/
	setTimeout(function () {
		removeChess(oldchess)
	}, 300);
}
/*检查分支*/
bill.checkbranch = function (e) {
	for (var i = 0; i < bill.paceEx[movesIndex - 1].length; i++) {
		var o = bill.paceEx[movesIndex - 1][i];
		if (o[2] == currentId && e == o[0]) {
			currentId = o[1];
			return !0;
		}
	}
	return !1;
}
/*回合结束*/
bill.stepEnd = function(e){
	movesIndex++,
	bill.pace.push(e),
	bill.branch(e),
	bill.my = -bill.my;
	bill.AIPlay();
	bill.replayBtnUpdate();
	
	if(document.getElementById("chessDetailTbody")){ 
		n = e.split("");
		p = comm.createMove1(comm.mans[bill.nowManKey],n[0],n[1],n[2],n[3]);		
		tmpStr = document.getElementById("chessDetailTbody").innerHTML + "<tr><td>"+ movesIndex +"</td><td>"+ p +"</td></tr>";		
		document.getElementById("chessDetailTbody").innerHTML = tmpStr;
	}	
	bill.nowManKey = !1;
}
bill.indexOfPs = function (e, a) {
	for (var m = 0; m < e.length; m++)
		if (e[m][0] == a[0] && e[m][1] == a[1])
			return !0;
	return !1
}
/*获取鼠标点击的位置*/
bill.getClickPoint = function (e) {
	var a,
	m = Math.round((e.stageY - comm.pointStartY - 20) / comm.spaceY);
	(m < 0 || m > 9) ? (a = Math.round((e.stageX - comm.pointStartX - 20) / (boardset.outsidescale * comm.spaceX))) : (a = Math.round((e.stageX - comm.pointStartX - 20) / comm.spaceX));
	return { x: a, y: m }
}
/*获取鼠标选中的棋子*/
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
/*划线*/
bill.drawLine = function (e, a) {
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
bill.drawLine2 = function (m, a) {
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
bill.drawNum = function (i, j, n) {
	a = i * 6 + j;
	x = j * boardset.outsidescale;
	i == 0 ? y = boardset.boutside : y = boardset.routside;
	chessnum[a] = new createjs.Text(n, "20px Arial", "red");
	chessnum[a].x = comm.pointStartX + comm.spaceX * x + 45;
	chessnum[a].y = comm.pointStartY + comm.spaceY * y - 22;
	stage.addChild(chessnum[a]);
}
/*清除划线和字*/
bill.cleanLine = function () {
	for (var a = 0; a < text.length; a++) {
		stage.removeChild(stagetext[a]),
		stage.removeChild(stageshape[a])
	}
}
/*翻转*/
bill.reverse = function () {
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

	if (bill.isAnimating)		return;
	if (waitServerPlay)		return;
	isVerticalReverse ? (isVerticalReverse = 0, chessBottonLayer.removeChild(verticalReverseboard), chessBottonLayer.addChild(board)) :
	(isVerticalReverse = 1, chessBottonLayer.removeChild(board), chessBottonLayer.addChild(verticalReverseboard));

	bill.reverseMoves();
	bill.map = comm.arrReverse(bill.map);
	bill.cMap = comm.arrReverse(bill.cMap);
	bill.cleanChess();
	bill.init(3, bill.map, !0);
}
/*保存棋盘*/
bill.save = function () {
	if (bill.checkJiang() == !1) {
		showFloatTip("开局不能将");
		return;
	}
	bill.resizeCanvas();
	createbroad = !1;
	comm.init();
	bill.cMap = comm.arr2Clone(bill.map),
	bill.cleanChess(),
	bill.init(3, bill.map, !0);
	bill.cleanChessEx();
	movesIndex = 0,
	bill.pace = [],
	bill.paceEx = [],
	moves = [],
	bill.notes = [],
	bill.replayBtnUpdate();

	/*方便用户设置*/
	mui('#delete').popover('toggle');
}
/*注释*/
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
/*取消分析模式*/
bill.cancleanalyse = function () {
	if (isanalyse) {
		isanalyse = 0;
		bill.cleanLine();
		if ($("#analyseTog").hasClass('mui-active')) {
			$("#analyseTog").removeClass('mui-active');
			$("#analyseTog").html('<div class="mui-switch-handle"></div>');
		}
	}
}
/*电脑执黑*/
bill.bPlay = function () {
	b_autoset != 0 ? (showFloatTip("取消电脑执黑"), waitServerPlay = !1, clearInterval(b_autoset), b_autoset = 0, cleanComputerDetail()) : (
		showFloatTip("电脑执黑"),
		bill.cancleanalyse(),
		b_autoset = setInterval(function () {
				if (waitServerPlay)
					return;
				if ((movesIndex % 2 == 1 && bill.isOffensive) || (movesIndex % 2 == 0 && !bill.isOffensive)) {
					bill.bAIPlay();
					bill.my = 1;
				}
			}, 2000));
}
/*电脑执红*/
bill.rPlay = function () {
	r_autoset != 0 ? (showFloatTip("取消电脑执红"), waitServerPlay = !1, clearInterval(r_autoset), r_autoset = 0, cleanComputerDetail()) : (
		showFloatTip("电脑执红"),
		bill.cancleanalyse(),
		r_autoset = setInterval(function () {
				if (waitServerPlay)
					return;
				play.map = bill.map;
				if ((movesIndex % 2 == 0 && bill.isOffensive) || (movesIndex % 2 == 1 && !bill.isOffensive)) {
					bill.rAIPlay();
					bill.my = -1;
				}
			}, 2000))
}
/*响应声音按钮*/
bill.sound = function () {
	voicemode == 1 ? voicemode = 0 : voicemode = 1
}
/*显示思考信息*/
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
        	playtime.black++;
        	$("#AIThink").text("第" + movesIndex + "步 / 总" + count + "步    " + "耗时: 红方 "+ playtime.red+"秒/黑方 "+playtime.black+"秒"), 
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
        	playtime.red++;
        	$("#AIThink").text("第" + movesIndex + "步 / 总" + count + "步    " + "耗时: 红方 "+playtime.red+"秒/黑方 "+playtime.black+"秒"), 
        	$("#AIThink").show()
        }, 1000);
    }               	
}
/*响应自动播放按钮*/
bill.autoreplay = function () {
	if (b_autoset != 0 || r_autoset != 0) {
		showFloatTip("请取消电脑思考，再点击自动播放");
		return;
	}
	movesIndex >= moves.length ? showFloatTip("播放结束") : (autoreplayset != 0 ? (showFloatTip("播放结束"), clearInterval(autoreplayset), autoreplayset = 0) : (showFloatTip("开始自动播放"), autoreplayset = setInterval(bill.replayNext, autoreplayspan)));
}
/*响应下一步按钮*/
bill.replayNext = function () {
	cleanChessdbDetail();
	cleanComputerDetail();
	if (!relayNextLock) {
		relayNextLock = 1;
		waitServerPlay = !1;
		setTimeout(bill.replayNextset, 200);
	}
}
/*下一步函数*/
bill.replayNextset = function () {
	if (b_autoset != 0 && r_autoset != 0) {
		showFloatTip("请取消电脑思考，再点击下一步");
		relayNextLock = 0;
		return;
	}
	countPath = 0;
	var nextpace = [];
	nextid = currentId;
	/*统计分支数*/
	if (bill.paceEx[movesIndex]) {
		for (j = 0; j < bill.paceEx[movesIndex].length; j++) {
			if (bill.paceEx[movesIndex][j][2] == nextid) {
				nextpace.push(bill.paceEx[movesIndex][j]);
				countPath++;
			}
			if (movesIndex == 0 && bill.paceEx[movesIndex][j][1] == nextid) {
				nextpace.push(bill.paceEx[movesIndex][j]);
				countPath++;
			}
		}
		if (countPath == 0) {
			bill.replayBtnUpdate();
			relayNextLock = 0;
			return;
		}
		if (countPath == 1) {
			currentId = nextpace[0][1];
			movesIndex++;
			moves = bill.getMoves4Server(1);
			bill.cleanChess();
			bill.init(3, bill.cMap, !0);
			if (movesIndex > 0) {
				for (var e = 0; movesIndex - 1 > e; e++)
					bill.stepPlay(moves[e].src, moves[e].dst, !0);
				bill.stepPlay(moves[e].src, moves[e].dst);
			}
			bill.replayBtnUpdate();
			relayNextLock = 0;
			return;
		}
		/*自动播放控制*/
		if (autoreplayset != 0) {
			clearInterval(autoreplayset);
		}
		bill.cleanLine();
		for (var j = 0; j < countPath; j++) {
			bill.drawLine(nextpace[j][0], j + 1);
			BranchPath = "BranchPath_" + j;
			$("#nextstepdialog").prepend('<input type="button" id=' + BranchPath + ' class="chessbaseBtn chess' + j + 'Btn" value=""/>');
			var ss = ("#BranchPath_") + j;
			$(ss).one('click', function () {
				inx = this.getAttribute("id").split("_")[1];
				currentId = nextpace[inx][1];

				movesIndex++;
				moves = bill.getMoves4Server(1);
				bill.cleanChess();
				bill.init(3, bill.cMap, !0);
				if (movesIndex > 0) {
					for (var e = 0; movesIndex - 1 > e; e++)
						bill.stepPlay(moves[e].src, moves[e].dst, !0);
					bill.stepPlay(moves[e].src, moves[e].dst);
				}
				bill.replayBtnUpdate();
				$("#nextstepdialog").trigger("myclick");
				/*自动播放控制*/
				if (autoreplayset != 0) {
					autoreplayset = setInterval(bill.replayNext, 2000);
				}
			});
		}
		popupDiv('nextstepdialog');
		$("#nextstepdialog").bind('myclick', function () {
			hideDiv('nextstepdialog');
			for (i = 0; i < countPath; i++) {
				$(".chessbaseBtn").remove();
			}
			bill.cleanLine();
		});
	}
	relayNextLock = 0;
}
/*响应上一步按钮*/
bill.replayPrev = function () {
/*	if(mode == 5) {
		bill.regret();	
		return;
	}*/
	cleanChessdbDetail();
	cleanComputerDetail();
	if (!relayPrevLock) {
		relayPrevLock = 1;
		if (b_autoset != 0 && r_autoset != 0) {
			showFloatTip("请取消电脑思考，再点击上一步");
			relayPrevLock = 0;
			return;
		}
		bill.cleanLine();
		bill.isend = !1;
		bill.isPlay = !0;
		waitServerPlay = !1;
		moves = bill.getMoves4Server(-1);
		bill.cleanChess();
		bill.init(3, bill.cMap, !0);
		if (movesIndex > 0) {
			movesIndex--;
			for (var e = 0; movesIndex > e; e++)
				bill.stepPlay(moves[e].src, moves[e].dst, !0);
		}
		relayPrevLock = 0;
	}
	bill.replayBtnUpdate();
}
/*响应开局按钮*/
bill.replayFirst = function () {
	cleanChessdbDetail();
	cleanComputerDetail();
	if (b_autoset != 0 && r_autoset != 0) {
		showFloatTip("请取消电脑思考，再点击开局");
		return;
	}
	bill.cleanLine();
	bill.isend = !1;
	bill.isPlay = !0;
	waitServerPlay = !1;
	moves = bill.getMoves4Server(-1);
	bill.cleanChess();
	bill.init(3, bill.cMap, !0);

	currentId = 0;
	movesIndex = 0;
	bill.replayBtnUpdate();
}
/*响应终局按钮*/
bill.replayEnd = function () {
	cleanChessdbDetail();
	cleanComputerDetail();
	if (b_autoset != 0 && r_autoset != 0) {
		showFloatTip("请取消电脑思考，再点击终局");
		return;
	}
	bill.cleanLine();
	bill.isend = !1;
	bill.isPlay = !0;
	waitServerPlay = !1;
	moves = bill.getMoves4Server(-1);
	bill.cleanChess();
	bill.init(3, bill.cMap, !0);

	movesIndex = moves.length;
	currentId = bill.paceEx[movesIndex - 1][0][1];
	for (var e = 0; movesIndex > e; e++)
		bill.stepPlay(moves[e].src, moves[e].dst, !0);

	bill.replayBtnUpdate();
}
/*刷新函数*/
bill.replayBtnUpdate = function () {
	if (bill.isAnimating) {
		setTimeout(function () {
			bill.replayBtnUpdate();
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
		count = bill.paceEx.length;

	0 >= movesIndex ? setEnable("firstBtn", !1) : setEnable("firstBtn", !0),
	0 >= movesIndex ? setEnable("prevBtn", !1) : setEnable("prevBtn", !0),
	movesIndex >= count ? setEnable("nextBtn", !1) : setEnable("nextBtn", !0),
	movesIndex >= count ? setEnable("endBtn", !1) : setEnable("endBtn", !0);
	if (movesIndex >= count && autoreplayset != 0)
		clearInterval(autoreplayset);
	
	if (bill.notes[currentId]) {
		$("#noteInfo").text(bill.notes[currentId]),
		$("#noteInfo").parent('.mui-toast-container').addClass('mui-active');
	} else {
		$("#noteInfo").parent('.mui-toast-container').removeClass('mui-active');
	}
	bill.isAnimating ? setTimeout(function () {
			bill.showThink()
		}, 2000) : bill.showThink();
	if (mode == 5 && bill.nowManKey == !1 && document.getElementById("chessdbDetailTbody")) {
		setTimeout(function () {
			sendMessage(bill.queryall(isVerticalReverse ? comm.arrReverse(bill.map) : bill.my));
		}, 1000);
	}
	if (isanalyse) {
		bill.cleanLine();
		if (b_autoset) {
			if ((movesIndex % 2 == 1 && bill.isOffensive) || (movesIndex % 2 == 0 && !bill.isOffensive))
				return;
		}
		if (r_autoset) {
			if ((movesIndex % 2 == 0 && bill.isOffensive) || (movesIndex % 2 == 1 && !bill.isOffensive))
				return;
		}
		setTimeout(function () {
			sendMessage(bill.getFen(isVerticalReverse ? comm.arrReverse(bill.map) : bill.my));
		}, 1000);
	}
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
	var e = [];
	e.length = bill.paceEx.length;
	nextid = currentId;
	preid = currentId;

	/*向后延伸*/
	for (a = movesIndex; a < bill.paceEx.length; a++) {
		var nextpaceEx = bill.paceEx[a];
		for (j = 0; nextpaceEx && j < nextpaceEx.length; j++) {
			if (nextpaceEx[j][2] == nextid) {
				nextid = nextpaceEx[j][1];

				var m = nextpaceEx[j][0].split(""),
                        o = {src: {x: parseInt(m[0]), y: parseInt(m[1])}, dst: {x: parseInt(m[2]), y: parseInt(m[3])}};
				e[a] = o;
				break;
			}
		}
	}
	/*向前回溯*/
	for (a = movesIndex - 1; a >= 0; a--) {
		var prepaceEx = bill.paceEx[a];
		for (j = 0; prepaceEx && j < prepaceEx.length; j++) {
			if (prepaceEx[j][1] == preid) {
				preid = prepaceEx[j][2];
				if (t == -1 && a == movesIndex - 1)
					currentId = prepaceEx[j][2];
				var m = prepaceEx[j][0].split(""),
                        o = {src: {x: parseInt(m[0]), y: parseInt(m[1])}, dst: {x: parseInt(m[2]), y: parseInt(m[3])}};
				e[a] = o;
				break;
			}
		}
	}
	if (movesIndex == 0) {
		var prepaceEx = bill.paceEx[0];
		for (j = 0; prepaceEx && j < prepaceEx.length; j++) {
			if (prepaceEx[j][1] == currentId) {
				var m = prepaceEx[j][0].split(""),
                        o = {src: {x: parseInt(m[0]), y: parseInt(m[1])}, dst: {x: parseInt(m[2]), y: parseInt(m[3])}};
				e[0] = o;
				break;
			}
		}
	}
	moves = e;
	return e;
	for (var e = [], a = 0; a < bill.pace.length; a++) {
		var m = bill.pace[a].split(""),
                o = {src: {x: parseInt(m[0]), y: parseInt(m[1])}, dst: {x: parseInt(m[2]), y: parseInt(m[3])}};
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
bill.getMoves6Server = function () {
	var e = "",
	o = "";

	for (var a = 0; a < bill.pace.length; a++) {
		var m = bill.pace[a].split("");
		o = " " + (parseInt(m[0]) + 1) + " " + (10 - parseInt(m[1])) + " " + (parseInt(m[2]) + 1) + " " + (10 - parseInt(m[3]));
		e += o;
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
/*步进*/
bill.stepPlay = function (e, a, m) {
	m = m || !1,
	comm.hideDots(),
	comm.light.visible = !1;
	var o = bill.map[e.y][e.x];
	bill.nowManKey = o;
	var o = bill.map[a.y][a.x];
	o ? bill.AIclickMan(o, a.x, a.y, m) : bill.AIclickPoint(a.x, a.y, m)
}
/*AI走子*/
bill.AIPlay = function () {
	if (waitServerPlay) {
		return;
	}		
	/*黑*/
	if (movesIndex % 2 == 1) {
		bill.bAIPlay();
		bill.my = 1;
	}
	/*红*/
	if (movesIndex % 2 == 0) { 
		bill.rAIPlay();
		bill.my = -1;
	}
}
/*AI选中棋子*/
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
/*AI点击棋盘*/
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
/*清空棋盘*/
bill.cleanChess = function () {
	for (var e = 0; e < bill.map.length; e++){
		for (var a = 0; a < bill.map[e].length; a++) {
			var m = bill.map[e][a];
			if (m)	removeChess(m);
		}
	}		
	comm.hidePane(),
	comm.hideDots(),
	comm.light.visible = !1
}
/*清空扩展棋盘*/
bill.cleanChessEx = function () {
	for (var e = 0; e < bill.sMap.length; e++) {
		for (var a = 0; a < bill.sMap[e].length; a++) {
			var m = bill.sMap[e][a];
			if (m)
				removeChess(m);
		}
	}		
	for (var a = 0; a < chessnum.length; a++) {
		stage.removeChild(chessnum[a])
	}
}
bill.isend = 0,
bill.notes = [],
bill.emptyMap = [[, , , , "J0", , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , , , , , ""], [, , , , "j0", , , , ""]],
bill.sMapFull = [["C0", "M0", "P0", "X0", "S0", "Z0", ""], ["c0", "m0", "p0", "x0", "s0", "z0", ""]],
bill.sMapEmpty = [[, , , , , , , , ], [, , , , , ]],
bill.chessMan = { "C": ["C0", "C1"], "M": ["M0", "M1"], "P": ["P0", "P1"], "X": ["X0", "X1"], "S": ["S0", "S1"], "Z": ["Z0", "Z1", "Z2", "Z3", "Z4"], "c": ["c0", "c1"], "m": ["m0", "m1"], "p": ["p0", "p1"], "x": ["x0", "x1"], "s": ["s0", "s1"], "z": ["z0", "z1", "z2", "z3", "z4"] },
bill.emptychessMan = { "C": [], "M": [], "P": [], "S": [], "X": [], "Z": [], "c": [], "m": [], "p": [], "s": [], "x": [], "z": [] },
/*创建单个棋子*/
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
/*创建多个棋子*/
bill.createMans = function (e) {
	for (var m = 0; m < e[0].length; m++) {
		var o = e[0][m];
		if (o) {
			bill.createMan(o, boardset.boutside, m * boardset.outsidescale);
			m == 5 ? bill.drawNum(0, m, 5) : bill.drawNum(0, m, 2);
		}
	}
	for (var m = 0; m < e[1].length; m++) {
		var o = e[1][m];
		if (o) {
			bill.createMan(o, boardset.routside, m * boardset.outsidescale);
			m == 5 ? bill.drawNum(1, m, 5) : bill.drawNum(1, m, 2);
		}
	}
}
/*检查将、士、象、兵、卒的位置是否合法*/
bill.checkMans = function (e, a, m) {	
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
/*检查将军*/
bill.checkJiang = function () {
	for (var e = 0; e < 3; e++)
		for (var a = 3; a < 6; a++) {
			var m = bill.map[e][a];
			if (m == "J0") {
				var flag = 0;
				for (var o = e + 1; o < bill.map.length; o++) {
					m = bill.map[o][a];
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
/*重绘Canvas*/
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
/*游戏结束*/
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
/*坐标变换(a-i)->(0-8),(0-9)->(9-0)*/
bill.transformat = function(o){
	var a = [];
	for(var i=0;i<4;i++){
		a[i] = {"a":"0","b":"1","c":"2","d":"3","e":"4","f":"5","g":"6","h":"7","i":"8","0":"9","1":"8","2":"7","3":"6","4":"5","5":"4","6":"3","7":"2","8":"1","9":"0"}[o[i]] || "";			                      
	}
	return a;
}
/*将棋盘数组转化成字符串*/
bill.getBoard = function (e,a){
	var map = "";
	var coutZero = 0;
	var board = "";
	for(var i=0;i<10;i++){
		coutZero = 0;
		for(var j=0;j<9;j++){
			map = e[i][j];
		
			if(!map){
				coutZero++;
				continue;
			}			
			if(coutZero > 0){
				board += ""+coutZero;
				coutZero = 0;
			}			
			var boardkey={"J0":"k","X0":"b","X1":"b","S0":"a","S1":"a","Z0":"p","Z1":"p","Z2":"p","Z3":"p","Z4":"p","C0":"r","C1":"r","M0":"n","M1":"n","P0":"c","P1":"c","j0":"K","x0":"B","x1":"B","s0":"A","s1":"A","z0":"P","z1":"P","z2":"P","z3":"P","z4":"P","c0":"R","c1":"R","m0":"N","m1":"N","p0":"C","p1":"C"}[map] || ""; 
			
			board += boardkey;
		}
		if(coutZero > 0){
			board += ""+coutZero;
			coutZero = 0;
		}
		if(i < (e.length-1)){			
			board += "/";
		}		
	}
	a == -1 ? (board += " b") : (board += " w");
	return board;
}
/*将棋盘转化成FEN格式*/
bill.getFen = function(e,a){
	var result = "position fen ";
	var board = bill.getBoard(e,a);
	result += board + " - - 0 1";
	if (result.indexOf("k") != -1 && result.indexOf("K") != -1) return result;    
	return "";
}
/*服务器返回自动走法*/
bill.serverAIPlay = function(e) {		
    if (0 != bill.isPlay) {		
        e = e || bill.aiPace;
        if (!e) return void(waitServerPlay = !0);
		
        bill.aiPace = void 0;
		if(isVerticalReverse){
			e[0] = 8-e[0];
			e[1] = 9-e[1];
			e[2] = 8-e[2];
			e[3] = 9-e[3];
		}

        if (mode == 1) bill.pace.push(e.join(""));
		movesIndex++; 
		bill.branch(e.join(""));
		
        var a = bill.map[e[1]][e[0]];
        bill.nowManKey = a;
        var a = bill.map[e[3]][e[2]];
		if (waitServerPlay){
			a ? setTimeout(bill.AIclickMan, 1000, a, e[2], e[3]) : setTimeout(bill.AIclickPoint, 1000, e[2], e[3]);
		}
		bill.my = -bill.my;
		/*锁定，等待1s后解锁*/
		setTimeout((function(){waitServerPlay = !1;}),1000);
    }
}