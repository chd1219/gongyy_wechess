/*
 * Player.js
 * 定义玩家类
 * 2017-08-20
 * chd
 */

var Player = Player || {};
/*点击Canvas*/
Player.clickCanvas = function (e) {
	var point = Player.getClickPoint(e);
	Player.clickBoard(point);
}
/*点击棋盘*/
Player.clickBoard = function(point) {
	var manKey = Player.getClickMan(point);
	manKey ? Player.clickMan(point) : Player.clickPoint(point);
}
/*点击棋子*/
Player.clickMan = function(point) {
	manKey = Player.getClickMan(point);
	/*是否已经选中一个棋子*/
	if (comm.nowManKey) {
		/*两次棋子相同*/
		if (comm.nowManKey == manKey) {
			/*取消选中*/
			Player.cancleSelected();
		}
		else {
			if (mode == playmode.EDITBOARD) {
				/*交换棋子*/			
				var man = Player.getNowMan();
				var scr = {x:man.x,y:man.y};
				var dst = point;
				Player.exchangMan(scr, dst);	
				isexchange = 0;
			}
			else {
				var o = comm.mans[manKey];
				if (o.my != comm.getHold()) {
					/*吃子*/
					Player.eatMan(point);
				}
				else {
					/*选中当前棋子*/
					Player.selected(point);
				}
			}
		}
	}
	else {
		/*选中当前棋子*/
		if (mode == playmode.EDITBOARD) {
			Player.selected(point);			
		}
		else {
			var o = comm.mans[manKey];
			if (o.my != comm.getHold()) {
				hideDots();
				showFloatTip("对方下子");
			}
			else {
				/*选中当前棋子*/
				Player.selected(point);
			}
		}
	}
}
/*点击棋盘点*/
Player.clickPoint = function(point) {
	if (comm.nowManKey) {
		/*移动棋子*/
		Player.moveMan(point);
	}
}
/*选中棋子*/
Player.selected = function (point) {
	comm.nowManKey = Player.getClickMan(point);
	comm.soundplay("select");
	if(point.y < 0) {
		point.x = point.x * boardset.outsidescale;
		point.y = boardset.boutside;
	}
	if(point.y > 9) {
		point.x = point.x * boardset.outsidescale;
		point.y = boardset.routside;
	}
	light.x = comm.spaceX * point.x + comm.pointStartX - 20;	
	light.y = comm.spaceY * point.y + comm.pointStartY - 25; 
	light.visible = !0;
	
	if (mode != playmode.EDITBOARD) {
		var nowMan = Player.getNowMan();
		hideDots();
		nowMan.alpha = 0.6;
		nowMan.ps = nowMan.bl();
		comm.dot.dots = nowMan.ps;
		showDots();
		cleanComputerDetail();
		cleanChessdbDetail();
	}			
}
/*取消选择*/
Player.cancleSelected = function () {
	comm.nowManKey = !1,
	comm.dot.dots = [],
	hideDots(),
	hidePane(),
	light.visible = !1;
}
/*交换棋子*/						
Player.exchangMan = function (point) {	
	Player.moveMan(point);
	
	Player.clickBoard(scr);
	Player.clickBoard(dst);
}
/*获取之前选中棋子*/
Player.getNowMan = function() {
	return comm.mans[comm.nowManKey];
}
/*获取之前选中棋子的XY坐标*/
Player.getNowManPoint = function() {
	var point = {};
	if (comm.nowManKey) {
		var man = Player.getNowMan();
		point.x = man.x;
		point.y = man.y;
	}
	return point;
}
/*吃子*/
Player.eatMan = function (point) {
	manKey = Player.getClickMan(point);
	man = comm.mans[manKey];
	if (Player.indexOfPs(Player.getNowMan().ps, [point.x, point.y])) {
		/*删除被吃棋子*/
		man.isShow = !1;
		addRemoveOnDrop(man.chess);
		/*移动棋子*/
		Player.moveMan(point);
		if ("j0" == manKey || "J0" == manKey) {
			comm.onGameEnd();			
		}
	} else {
		hideDots();
		showFloatTip("对方下子");
	}
	Player.cancleSelected();
}
/*移动棋子*/
Player.moveMan = function (point) {
	try{ 
		var src = Player.getNowManPoint();
		var dst = point;
		switch (Player.getMoveMode(src, dst)) {
			case Player.MoveTpye.ERROR:
				break;
			case Player.MoveTpye.IN_OUT:	
				Player.PointIn2Out(src, dst);
				break;
			case Player.MoveTpye.IN_IN:
				Player.PointIn2In(src, dst);
				break;
			case Player.MoveTpye.OUT_IN:
				Player.PointOut2In(src, dst)
				break;
			case Player.MoveTpye.OUT_OUT:
				break;
			default:
				break;
		}			
	}catch(e){
		console.log(e);
	}	
	Player.cancleSelected();
}
/*PointIn2Out*/
Player.PointIn2Out = function (src, dst) {	
	var nowMan = Player.getNowMan();
    var maptemp = {"C": 0, "M": 1, "P": 2, "X": 3, "S": 4, "Z": 5, "c": 0, "m": 1, "p": 2, "x": 3, "s": 4, "z": 5};
	row = maptemp[nowMan.pater];
	if (row > -1) {
		nowMan.my == -1  ? (dst.y = boardset.boutside, col = 0) : (dst.y = boardset.routside, col = 1);
		delete comm.map[src.y][src.x];
		var templist = [];
		templist = comm.sMapList[nowMan.pater];
		var oldchess = comm.sMap[col][row];
		comm.sMap[col][row] = nowMan.key;
		templist.push(nowMan.key);

		stage.removeChild(chessnum[col * 6 + row]),
		templist.length ? drawNum(col, row, templist.length) : !1;
		nowMan.x = row * boardset.outsidescale,
		nowMan.y = dst.y,	
		nowMan.animate();	
		/*删除原来的棋子*/
		setTimeout(function () {
			removeChess(oldchess)
		}, 300);
	} else {
		showFloatTip("将帅不能移出棋盘");
	}	
}
/*PointIn2In*/
Player.PointIn2In = function (src, dst) {
	if (!comm.checkMans(comm.nowManKey, dst)) {		
		showFloatTip("摆放错误，请重试");
		return;
	}
	if (mode == playmode.EDITBOARD) {
		Player.AIclickPoint(dst);		
	}
	else {
		if (Player.indexOfPs(Player.getNowMan().ps, [dst.x, dst.y])) {
			Player.AIclickPoint(dst);
			Player.stepEnd(src.x + "" + src.y + dst.x + dst.y);
		}
	}
}
/*PointOutIn*/
Player.PointOut2In = function (src, dst) {
	if (!comm.checkMans(comm.nowManKey, dst)) {		
		showFloatTip("摆放错误，请重试");
		return;
	}
	var nowMan = Player.getNowMan();
	src.y < 0 ? (col = 0) : (col = 1);
	row = parseInt(src.x / boardset.outsidescale);
	delete comm.sMap[col][row];
	stage.removeChild(chessnum[col * 6 + row]);
	
	var templist = [];
	templist = comm.sMapList[nowMan.pater];
	for (var i = 0; i < templist.length; i++) {
		if (templist[i] == nowMan.key) {
			delete templist[i];
			for (var j = i; j < templist.length - 1; j++) {
				templist[j] = templist[j + 1];
			}
			break;
		}
	}
	templist.length -= 1;		
	templist.length ? (newchess = templist[0],createMan(newchess, nowMan.y, nowMan.x),comm.sMap[col][row] = newchess,drawNum(col, row, templist.length)) : !1;
	comm.map[dst.y][dst.x] = nowMan.key;
	nowMan.x = dst.x,
	nowMan.y = dst.y,
	nowMan.animate();
}
/*定义移动类型*/
Player.MoveTpye = {
	ERROR:0, IN_OUT:1, IN_IN:2, OUT_IN:3, OUT_OUT:4
}
/*获取移动方式*/
Player.getMoveMode = function (o, e) {
	if (e.x < 0 || e.x > 8) {
		return Player.MoveTpye.ERROR;
	}
	
	if (o.y < 0 || o.y > 9) {
		if (e.y < 0 || e.y > 9) {
			return Player.MoveTpye.OUT_OUT;
		}
		else {
			return Player.MoveTpye.OUT_IN;
		}
	} 
	else {
		if (e.y < 0 || e.y > 9) {
			return Player.MoveTpye.IN_OUT;
		}
		else {
			return Player.MoveTpye.IN_IN;
		}
	}	
}
/*落子*/
Player.stepEnd = function(e){
	if (mode == playmode.EDITBOARD) {
		return;
	}
	movesIndex++;
	comm.branch(e);
	if (isanalyse) {
		comm.send();
	}
	if (mode == playmode.AIPLAY) {
		Player.AIPlay();		
	}
	replayBtnUpdate();
}
/*检查走法是否合法*/
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
Player.getClickMan = function (a) {
	m = a.x,
	o = a.y;
	if (o < 0)
		return comm.sMap[0][m];
	else if (o > 9)
		return comm.sMap[1][m];
	else
		return 0 > m || m > 8 || 0 > o || o > 9 ? !1 : comm.map[o][m] && "0" != comm.map[o][m] ? comm.map[o][m] : !1
}
/*步进*/
Player.stepPlay = function (scr, dst, type) {
	type = type || !1,
	hideDots(),
	light.visible = !1;
	var o = comm.map[scr.y][scr.x];
	comm.nowManKey = o;
	var o = comm.map[dst.y][dst.x];
	o ? Player.AIclickMan(dst, type) : Player.AIclickPoint(dst, type)
}
/*AI走子*/
Player.AIPlay = function () {
	waitServerPlay = !0;
	sendMessage(comm.getFen());
}
/*AI选中棋子*/
Player.AIclickMan = function (dst, type) {
	try{
		mankey = comm.map[dst.y][dst.x];
		var man = comm.mans[mankey];
		man.isShow = !1;
		type ? man.chess.parent.removeChild(man.chess) : addRemoveOnDrop(man.chess);
		nowMan = Player.getNowMan();
		delete comm.map[nowMan.y][nowMan.x];
		comm.map[dst.y][dst.x] = comm.nowManKey;
		showPane(nowMan.x, nowMan.y, dst.x, dst.y);		
		nowMan.x = dst.x;
		nowMan.y = dst.y;
		type ? nowMan.move() : nowMan.animate();
		"j0" == nowMan.key && comm.onGameEnd(-1),
		"J0" == nowMan.key && comm.onGameEnd(1),
		comm.nowManKey = !1;
	}catch(e){
		console.log(e);
	}	
}
/*AI点击棋盘*/
Player.AIclickPoint = function (dst, type) {
	try{		
		if (comm.nowManKey) {
			man = Player.getNowMan();
			delete comm.map[man.y][man.x];
			comm.map[dst.y][dst.x] = man.key;
			showPane(man.x, man.y, dst.x, dst.y);			
			man.x = dst.x;
			man.y = dst.y;
			type ? man.move() : man.animate();
			comm.nowManKey = !1;			
		}			
	}catch(e){
		console.log(e);
	}	
}
/*服务器返回自动走法*/
Player.serverAIPlay = function(e) {		
    if (comm.isPlay) {		
        e = e || Player.aiPace;
        if (!e) return void(waitServerPlay = !0);
		
        Player.aiPace = void 0;
		if(isVerticalReverse){
			e[0] = 8-e[0];
			e[1] = 9-e[1];
			e[2] = 8-e[2];
			e[3] = 9-e[3];
		}
		var src = {x:e[0],y:e[1]};
		var dst = {x:e[2],y:e[3]};
        var a = comm.map[src.y][src.x];
        comm.nowManKey = a;
        var a = comm.map[dst.y][dst.x];
		if (waitServerPlay){
			a ? setTimeout(Player.AIclickMan, 1000, dst) : setTimeout(Player.AIclickPoint, 1000, dst);
		}
		Player.stepEnd(src.x + "" + src.y + dst.x + dst.y);
		/*锁定，等待1s后解锁*/
		setTimeout((function(){waitServerPlay = !1;}),1000);
    }
}