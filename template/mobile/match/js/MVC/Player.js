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
				var src = {x:man.x,y:man.y};
				var dst = point;
				Player.exchangMan(src, dst);	
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
		var src = Player.getNowManPoint();
		var dst = point;
		Player.moveMan(src, dst);
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
Player.exchangMan = function (src, dst) {		
	if (!comm.checkMans(Player.getKey(src), dst)) {		
		showFloatTip("摆放错误，请重试");
		Player.cancleSelected();
		return;
	}
	else if (Player.getKey(src) == "J0" || Player.getKey(src) == "j0" || Player.getKey(dst) == "J0" || Player.getKey(dst) == "j0") {
		showFloatTip("将帅不能移出棋盘");
		Player.cancleSelected();
		return;
	}
	else if (Player.getMan(src).pater == Player.getMan(dst).pater) {
		showFloatTip("棋子相同");
		Player.cancleSelected();
		return;
	}
	/*移出棋盘*/
	var point = {x:1,y:-1};
	Player.moveMan(dst, point);
	/*交换位置*/
	Player.moveMan(src, dst);
}
/*获取之前选中棋子*/
Player.getNowMan = function() {
	return comm.mans[comm.nowManKey];
}
/*获取选中棋子*/
Player.getMan = function(point) {
	var key = Player.getKey(point);
	return comm.mans[key];
}
/*获取选中棋子*/
Player.getKey = function(point) {
	var key;
	if (point.y < 0) {
		col = 0;
		row = parseInt(point.x / boardset.outsidescale);
		key = comm.sMap[col][row];		
	} else if(point.y > 9) {
		col = 1;
		row = parseInt(point.x / boardset.outsidescale);
		key = comm.sMap[col][row];	
	}else {
		key = comm.map[point.y][point.x];		
	}
	return key;
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
		var src = Player.getNowManPoint();
		var dst = point;
		Player.moveMan(src, dst);
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
Player.moveMan = function (src, dst) {
	var flag = true;
	try{ 
		switch (Player.getMoveMode(src, dst)) {
			case Player.MoveTpye.ERROR:
				break;
			case Player.MoveTpye.IN_OUT:	
				flag = Player.PointIn2Out(src, dst);
				break;
			case Player.MoveTpye.IN_IN:
				flag = Player.PointIn2In(src, dst);
				break;
			case Player.MoveTpye.OUT_IN:
				flag = Player.PointOut2In(src, dst)
				break;
			case Player.MoveTpye.OUT_OUT:
				break;
			default:
				break;
		}			
	}catch(e){
		flag = false;
		console.log(e);
	}	
	Player.cancleSelected();
	return 
}
/*PointIn2Out*/
Player.PointIn2Out = function (src, dst) {	
	var nowMan = Player.getMan(src);
    var maptemp = {"C": 0, "M": 1, "P": 2, "X": 3, "S": 4, "Z": 5, "c": 0, "m": 1, "p": 2, "x": 3, "s": 4, "z": 5};
	row = maptemp[nowMan.pater];
	if (row > -1) {
		if (isVerticalReverse) {
			(nowMan.my == RED)  ? (dst.y = boardset.boutside, col = 0) : (dst.y = boardset.routside, col = 1);			
		}
		else {
			(nowMan.my == BLACK)  ? (dst.y = boardset.boutside, col = 0) : (dst.y = boardset.routside, col = 1);	
		}
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
		return false;
	}	
	return true;
}
/*PointIn2In*/
Player.PointIn2In = function (src, dst) {
	comm.nowManKey = comm.map[src.y][src.x];
	if (!comm.checkMans(comm.nowManKey, dst)) {		
		showFloatTip("摆放错误，请重试");
		return false;
	}
	if (mode == playmode.EDITBOARD) {
		Player.AIclickPoint(dst);		
	}
	else {
		var nowMan = Player.getMan(src);
		if (Player.indexOfPs(Player.getNowMan().ps, [dst.x, dst.y])) {
			Player.AIclickPoint(dst);
			move = {src, dst};
			Player.stepEnd(move);
		}
	}
	return true;
}
/*PointOutIn*/
Player.PointOut2In = function (src, dst) {
	src.y < 0 ? (col = 0) : (col = 1);
	row = parseInt(src.x / boardset.outsidescale);
	comm.nowManKey = comm.sMap[col][row];
	
	if (!comm.checkMans(comm.nowManKey, dst)) {		
		showFloatTip("摆放错误，请重试");
		return false;
	}
	var nowMan = comm.mans[comm.nowManKey];
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
	return true;
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
Player.stepEnd = function(move){
	if (mode == playmode.EDITBOARD) {
		return;
	}
	movesIndex++;
	comm.branch(move);
	if (isanalyse) {
		comm.send();
	}
	if (mode == playmode.AIPLAY) {
		computerHold != comm.getHold() || Player.AIPlay();		
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
Player.stepPlay = function (step, type) {
	step = comm.Step2XY(step);
	type = type || !1,
	hideDots(),
	light.visible = !1;
	var o = comm.map[step.src.y][step.src.x];
	comm.nowManKey = o;
	var o = comm.map[step.dst.y][step.dst.x];
	o ? Player.AIclickMan(step.dst, type) : Player.AIclickPoint(step.dst, type)
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
		("j0" == mankey || "J0" == mankey) && comm.onGameEnd(),
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
Player.serverAIPlay = function(step,type) {		
    if (comm.isPlay) {		
        step = step || Player.aiPace;
        Player.aiPace = void 0;
        if (!step) return void(waitServerPlay = !0);		
		if(isVerticalReverse){
			step = comm.reverseStep(step);
		}
		move = comm.Step2XY(step);

        var key = comm.map[move.src.y][move.src.x];
        comm.nowManKey = key;
        key = comm.map[move.dst.y][move.dst.x];
		if (waitServerPlay){
			key ? setTimeout(Player.AIclickMan, 1000, move.dst,type) : setTimeout(Player.AIclickPoint, 1000, move.dst,type);
		}
		type ? 1 : Player.stepEnd(move);
		/*锁定，等待1s后解锁*/
		setTimeout((function(){waitServerPlay = !1;}),1000);
    }
}