/*
 * Player.js
 * 定义玩家类
 * 2017-08-20
 * chd
 */

/*定义玩家类*/
Player = function(){
	/*是否先手*/
	var isOffensive;
	/*是否电脑*/
	var isAI;
	/*执红或执黑*/
	var color;
	/*棋子正在走动*/
	var isAnimating;
	/*等待服务器*/
	var waitServerPlay;	
}
/*初始化*/
Player.init = function() {
	
}
/*点击棋子*/
Player.clickMan = function() {
	
}
/*点击Canvas*/
Player.clickCanvas = function (e) {
	if (mode != 5)
		return;
	if (comm.isAnimating)
		return !1;
	if (!comm.isPlay)
		return !1;
	if (waitServPlay) {
		return !1;
	}
	if (comm.nowManKey == e) {
		Player.cancleSelected();
	} else {
		if (comm.nowManKey) {
			var o = comm.mans[comm.nowManKey];
			if (o.y > -1 && o.y < 10) {
				comm.clickManI2O(e, x, y)
			} else {
				Player.cancleSelected();
				var o = comm.mans[e];
				comm.nowManKey = e;
                first ? (comm.soundplay("drop"), first = !1) : comm.soundplay("select"), comm.light.x = comm.spaceX * o.x + comm.pointStartX - 20, comm.light.y = comm.spaceY * o.y + comm.pointStartY - 24, comm.light.visible = !0
            }
        }
        else {
            var o = comm.mans[e];
            comm.nowManKey = e;
            first ? (comm.soundplay("drop"), first = !1) : comm.soundplay("select"), comm.light.x = comm.spaceX * o.x + comm.pointStartX - 20, comm.light.y = comm.spaceY * o.y + comm.pointStartY - 24, comm.light.visible = !0
		}
	}
}
/*取消选择*/
Player.cancleSelected = function () {
	comm.nowManKey = !1,
	comm.dot.dots = [],
	comm.hideDots(),
	comm.light.visible = !1;
}
/*点击棋盘*/
Player.clickPoint = function (e, a) {
	if (comm.isPlay == !0) { 
		/*棋谱模式*/
		comm.clickPointPlaying(e, a)
	} else if (comm.nowManKey) {
		/*摆棋模式*/
		comm.clickPointPre(e, a)
	}
	Player.cancleSelected();
}
/*点击棋盘-棋谱模式*/
Player.clickPointPlaying = function (e, a) {
	var m = comm.nowManKey;
	o = comm.mans[m];
	if (comm.nowManKey && comm.indexOfPs(comm.mans[m].ps, [e, a])) {
		var n = o.x + "" + o.y;
		delete comm.map[o.y][o.x],
		comm.map[a][e] = m,
		showPane(o.x, o.y, e, a);
		o.x = e,
		o.y = a,
		o.animate(),
		comm.stepEnd(n + e + a);		
	}
}
/*点击棋盘-摆棋模式*/
Player.clickPointPre = function (e, a) { 
	var m = comm.nowManKey;
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
			templist = comm.sMapList[m.slice(0, 1)];
			var oldchess = comm.sMap[col][e];
			comm.sMap[col][e] = m;
			e = e * boardset.outsidescale;
			templist.push(m);

			stage.removeChild(chessnum[col * 6 + e / boardset.outsidescale]),
			templist.length ? comm.drawNum(col, e / boardset.outsidescale, templist.length) : !1;
		} else {
			showFloatTip("将帅不能移出棋盘");
			return !1;
		}
	} else {
		/*棋盘内->棋盘内*/
		if (comm.checkMans(m, a, e)) {
			comm.map[a][e] = m;
		} else {
			showFloatTip("摆放错误，请重试");
			return !1;
		}
	}
	/*棋盘外->棋盘内*/
	if (o.y < 0 || o.y > 9) {
		o.y < 0 ? (col = 0) : (col = 1);
		row = parseInt(o.x / boardset.outsidescale);
		delete comm.sMap[col][row];
		var templist = [];
		templist = comm.sMapList[m.slice(0, 1)];
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
		comm.createMan(newchess, o.y, o.x),
		stage.removeChild(chessnum[col * 6 + row]),
		templist.length ? comm.drawNum(col, row, templist.length) : !1;
		comm.sMap[col][row] = newchess;
	} else {
		delete comm.map[o.y][o.x];
	}

	o.x = e,
	o.y = a,
	o.animate();
	/*删除原来的棋子*/
	setTimeout(function () {
		removeChess(oldchess)
	}, 300);
}
Player.indexOfPs = function (e, a) {
	for (var m = 0; m < e.length; m++)
		if (e[m][0] == a[0] && e[m][1] == a[1])
			return !0;
	return !1
}
/*获取鼠标点击的位置*/
Player.getClickPoint = function (e) {
	var a,
	m = Math.round((e.stageY - comm.pointStartY - 20) / comm.spaceY);
	(m < 0 || m > 9) ? (a = Math.round((e.stageX - comm.pointStartX - 20) / (boardset.outsidescale * comm.spaceX))) : (a = Math.round((e.stageX - comm.pointStartX - 20) / comm.spaceX));
	return { x: a, y: m }
}
/*获取鼠标选中的棋子*/
Player.getClickMan = function (e) {
	var a = comm.getClickPoint(e),
	m = a.x,
	o = a.y;
	if (o < 0 && createbroad)
		return comm.sMap[0][m];
	else if (o > 9 && createbroad)
		return comm.sMap[1][m];
	else
		return 0 > m || m > 8 || 0 > o || o > 9 ? !1 : comm.map[o][m] && "0" != comm.map[o][m] ? comm.map[o][m] : !1
}
/*步进*/
Player.stepPlay = function (e, a, m) {
	m = m || !1,
	comm.hideDots(),
	comm.light.visible = !1;
	var o = comm.map[e.y][e.x];
	comm.nowManKey = o;
	var o = comm.map[a.y][a.x];
	o ? Player.AIclickMan(o, a.x, a.y, m) : Player.AIclickPoint(a.x, a.y, m)
}
/*AI走子*/
Player.AIPlay = function () {
	if (waitServerPlay) {
		return;
	}		
	/*黑*/
	if (movesIndex % 2 == 1) {
		comm.bAIPlay();
		comm.my = 1;
	}
	/*红*/
	if (movesIndex % 2 == 0) { 
		comm.rAIPlay();
		comm.my = -1;
	}
}
/*AI选中棋子*/
Player.AIclickMan = function (e, a, m, o) {
	try{
		var n = comm.mans[e];
		n.isShow = !1,
		o ? n.chess.parent.removeChild(n.chess) : addRemoveOnDrop(n.chess),
		delete comm.map[comm.mans[comm.nowManKey].y][comm.mans[comm.nowManKey].x],
		comm.map[m][a] = comm.nowManKey,
		showPane(comm.mans[comm.nowManKey].x, comm.mans[comm.nowManKey].y, a, m),
		comm.mans[comm.nowManKey].x = a,
		comm.mans[comm.nowManKey].y = m,
		o ? comm.mans[comm.nowManKey].move() : comm.mans[comm.nowManKey].animate(),
		comm.my = -comm.my,
		"j0" == e && comm.onGameEnd(-1),
		"J0" == e && comm.onGameEnd(1),
		comm.nowManKey = !1;
	}catch(e){
		console.log(e);
	}	
}
/*AI点击棋盘*/
Player.AIclickPoint = function (e, a, m) {
	try{
		var o = comm.nowManKey,
		n = comm.mans[o];
		comm.nowManKey && (
			delete comm.map[comm.mans[comm.nowManKey].y][comm.mans[comm.nowManKey].x],
			comm.map[a][e] = o,
			showPane(n.x, n.y, e, a),
			n.x = e,
			n.y = a,
			m ? n.move() : n.animate(),
			comm.nowManKey = !1)
	}catch(e){
		console.log(e);
	}	
}
/*服务器返回自动走法*/
Player.serverAIPlay = function(e) {		
    if (0 != comm.isPlay) {		
        e = e || comm.aiPace;
        if (!e) return void(waitServerPlay = !0);
		
        comm.aiPace = void 0;
		if(isVerticalReverse){
			e[0] = 8-e[0];
			e[1] = 9-e[1];
			e[2] = 8-e[2];
			e[3] = 9-e[3];
		}

        if (mode == 1) comm.pace.push(e.join(""));
		movesIndex++; 
		comm.branch(e.join(""));
		
        var a = comm.map[e[1]][e[0]];
        comm.nowManKey = a;
        var a = comm.map[e[3]][e[2]];
		if (waitServerPlay){
			a ? setTimeout(Player.AIclickMan, 1000, a, e[2], e[3]) : setTimeout(Player.AIclickPoint, 1000, e[2], e[3]);
		}
		comm.my = -comm.my;
		/*锁定，等待1s后解锁*/
		setTimeout((function(){waitServerPlay = !1;}),1000);
    }
}
Player.bAIPlay = function() {
	/*黑*/
	waitServerPlay = !0;
	sendMessage(comm.getFen(isVerticalReverse ? comm.arrReverse(comm.map) : comm.map, -1));
}
Player.rAIPlay = function() {
	/*红*/
	waitServerPlay = !0;
	sendMessage(comm.getFen(isVerticalReverse ? comm.arrReverse(comm.map) : comm.map, 1));
}