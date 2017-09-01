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
	var manKey = Player.getClickMan(point);
	manKey ? Player.clickMan(manKey, point) : Player.clickPoint(point);
}
/*点击棋子*/
Player.clickMan = function(manKey, point) {
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
				Player.exchangMan(point);	
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
		hideDots();
		comm.mans[comm.nowManKey].alpha = 0.6;
		comm.mans[comm.nowManKey].ps = comm.mans[comm.nowManKey].bl();
		comm.dot.dots = comm.mans[comm.nowManKey].ps;
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
	
}
/*吃子*/
Player.eatMan = function (point) {
	manKey = Player.getClickMan(point);
	man = comm.mans[manKey];
	if (Player.indexOfPs(comm.mans[comm.nowManKey].ps, [point.x, point.y])) {
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
}
/*移动棋子*/
Player.moveMan = function (point) {
	if (!comm.checkMans(comm.nowManKey, point)) {		
		showFloatTip("摆放错误，请重试");
		return;
	}

	try{ 
		if (mode == playmode.EDITBOARD) {
			n = comm.mans[comm.nowManKey];
			delete comm.map[comm.mans[comm.nowManKey].y][comm.mans[comm.nowManKey].x],
			comm.map[point.y][point.x] = comm.nowManKey,
			showPane(n.x, n.y, point.x, point.y),
			n.x = point.x,
			n.y = point.y,
			n.animate();
		}
		/*判断走法是否合法*/
		else if (Player.indexOfPs(comm.mans[comm.nowManKey].ps, [point.x, point.y])) {
			n = comm.mans[comm.nowManKey];
			delete comm.map[comm.mans[comm.nowManKey].y][comm.mans[comm.nowManKey].x],
			comm.map[point.y][point.x] = comm.nowManKey,
			showPane(n.x, n.y, point.x, point.y),
			n.x = point.x,
			n.y = point.y,
			n.animate();
			var n = comm.mans[comm.nowManKey].x + "" + comm.mans[comm.nowManKey].y+point.x + point.y;
			Player.stepEnd(n);					
		}
	}catch(e){
		console.log(e);
	}	
	Player.cancleSelected();
}
/*落子*/
Player.stepEnd = function(e){
	movesIndex++;
	comm.pace.push(e);
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
Player.stepPlay = function (e, a, m) {
	m = m || !1,
	hideDots(),
	light.visible = !1;
	var o = comm.map[e.y][e.x];
	comm.nowManKey = o;
	var o = comm.map[a.y][a.x];
	o ? Player.AIclickMan(o, a.x, a.y, m) : Player.AIclickPoint(a.x, a.y, m)
}
/*AI走子*/
Player.AIPlay = function () {
	waitServerPlay = !0;
	sendMessage(comm.getFen());
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
Player.serverPlay = function(p1,p2) {		
	var a = Player.getClickMan(p1);
	a ? Player.clickMan(a, p1) : Player.clickPoint(p1);
	var b = Player.getClickMan(p2);
	b ? Player.clickMan(b, p2) : Player.clickPoint(p2);
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

		movesIndex++; 
		comm.branch(e.join(""));
		
        var a = comm.map[e[1]][e[0]];
        comm.nowManKey = a;
        var a = comm.map[e[3]][e[2]];
		if (waitServerPlay){
			a ? setTimeout(Player.AIclickMan, 1000, a, e[2], e[3]) : setTimeout(Player.AIclickPoint, 1000, e[2], e[3]);
		}
	
		/*锁定，等待1s后解锁*/
		setTimeout((function(){waitServerPlay = !1;}),1000);
    }
}