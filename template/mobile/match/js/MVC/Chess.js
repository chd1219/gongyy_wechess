/*
 * Chess.js
 * 定义棋子类
 * 2017-08-20
 * chd
 */

/*定义棋子类*/
Man = function(e, a, m) {
    this.pater = e.slice(0, 1);
    var o = Chess.args[this.pater];
    this.x = a || 0,
    this.y = m || 0,
    this.key = e,
    this.my = o.my,
    this.text = o.text,
    this.value = o.value,
    this.isShow = !0,
    this.ps = [];
	var pointSeek = 15;
    this.move = function() {
        var e = comm.spaceX * this.x + comm.pointStartX - pointSeek,
        a = comm.spaceY * this.y + comm.pointStartY - pointSeek;
        this.chess.x = e - 80,
        this.chess.y = a - 70
    },
    this.animate = function() {
        function e() {}
        var a = comm.spaceX * this.x + comm.pointStartX - pointSeek,
        m = comm.spaceY * this.y + comm.pointStartY - pointSeek,
        o = a - 80,
        n = m - 70;
        comm.isAnimating = !0,
        this.chess.body.addEventListener("dropEnd", this.onDropEnd),
        this.chess.body.gotoAndPlay(0),
        this.chess.label.gotoAndPlay(0),
        comm.chessTopLayer.addChild(this.chess),
        createjs.Tween.get(this.chess).to({
            x: o,
            y: n
        },
        200).call(e)
    },
    this.onDropEnd = function(e) {
        var a = e.target.parent;
        e.target.currentFrame;
        a.label.gotoAndStop(0),
        a.body.gotoAndStop(0),
        a.body.removeEventListener("dropEnd", this.onDropEnd),
        comm.chessLayer.addChild(a),
        onChessDrop()
    },
    this.bl = function(e) {
        var e = e || comm.map;
        return Chess.bylaw[o.bl](parseInt(this.x), parseInt(this.y), e, this.my)
    }
}
/*响应棋子落下事件*/
onChessDrop = function() {
    function e() {
        for (var e = callOnDrops.length - 1; e >= 0; e--) {
            var a = callOnDrops.splice(e, 1)[0],
			m = callOnDropsArgs.splice(e, 1)[0];
           	a.apply(this, m)
        }
        comm.isAnimating = !1
    }
    for (var a = removeOnDrops.length - 1; a >= 0; a--) {
        var m = removeOnDrops.splice(a, 1)[0];
        m.parent.removeChild(m)
    }
    comm.soundplay("drop"),
    setTimeout(e, 200)
}
/*添加callOnDrops*/
addCallOnDrop = function(e, a) {	
    callOnDrops.push(e),
    callOnDropsArgs.push(a)
}
/*添加removeOnDrops*/
addRemoveOnDrop = function(e) {
    removeOnDrops.push(e)
}
/*批量创建棋子*/
createMans = function(e) {
    for (var a = 0; a < e.length; a++) for (var m = 0; m < e[a].length; m++) {
        var o = e[a][m];
        if (o) {
			createMan(o, a, m);
        }
    }
}
/*创建单个棋子*/
createMan = function(o, a, m) {
	var n = new Man(o);
	n.x = m,
	n.y = a,
	comm.mans[o] = n;
	var t = addChess(n.pater);
	n.chess = t,
	n.move()
}
/*创建单个棋子*/
createManEx = function (e, a, m) {
	if (e) {
		var n = new Man(e);
		n.x = m,
		n.y = a,
		comm.mans[e] = n;
		var t = addChess(n.pater, comm.spaceX * n.x + comm.pointStartX, comm.spaceY * n.y + comm.pointStartY);
		n.chess = t,
		n.move()
	}
}
/*创建多个棋子*/
createMansEx = function (e) {
	for (var m = 0; m < e[0].length; m++) {
		var o = e[0][m];
		if (o) {
			createManEx(o, boardset.boutside, m * boardset.outsidescale);
			m == 5 ? drawNum(0, m, 5) : drawNum(0, m, 2);
		}
	}
	for (var m = 0; m < e[1].length; m++) {
		var o = e[1][m];
		if (o) {
			createManEx(o, boardset.routside, m * boardset.outsidescale);
			m == 5 ? drawNum(1, m, 5) : drawNum(1, m, 2);
		}
	}
}
/*添加棋子*/
addChess = function (e) {
	var scale = 1.15;
    e || (e = "c");	
    var a = new createjs.Container,
    m = LABEL[e],
    o = new m,
    n = new lib.ChessBody;
    return a.body = n,
    a.label = o,
    n.framerate = 24,
    o.framerate = 24,
    n.stop(),
    o.stop(),
	n.scaleX = scale,
	n.scaleY = scale,
	o.scaleX = scale,
	o.scaleY = scale,	
    a.addChild(n),
    a.addChild(o),
    chessLayer.addChild(a),
    a.key = e,
    a
}
var Chess = Chess || {};
/*棋子的走法限制*/
Chess.bylaw = {};
Chess.bylaw.c = function(e, a, m, o) {
	var n = [];
    for (var t = e - 1; t >= 0; t--) {
        if (m[a][t]) {
            comm.mans[m[a][t]].my != o && n.push([t, a]);
            break
        }
        n.push([t, a])
    }
    for (var t = e + 1; 8 >= t; t++) {
        if (m[a][t]) {
            comm.mans[m[a][t]].my != o && n.push([t, a]);
            break
        }
        n.push([t, a])
    }
    for (var t = a - 1; t >= 0; t--) {
        if (m[t][e]) {
            comm.mans[m[t][e]].my != o && n.push([e, t]);
            break
        }
        n.push([e, t])
    }
    for (var t = a + 1; 9 >= t; t++) {
        if (m[t][e]) {
            comm.mans[m[t][e]].my != o && n.push([e, t]);
            break
        }
        n.push([e, t])
    }
    return n
}
Chess.bylaw.m = function(e, a, m, o) {
    var n = [];
    return ! (a - 2 >= 0 && 8 >= e + 1) || comm.map[a - 1][e] || comm.mans[m[a - 2][e + 1]] && comm.mans[m[a - 2][e + 1]].my == o || n.push([e + 1, a - 2]),
    !(a - 1 >= 0 && 8 >= e + 2) || comm.map[a][e + 1] || comm.mans[m[a - 1][e + 2]] && comm.mans[m[a - 1][e + 2]].my == o || n.push([e + 2, a - 1]),
    !(9 >= a + 1 && 8 >= e + 2) || comm.map[a][e + 1] || comm.mans[m[a + 1][e + 2]] && comm.mans[m[a + 1][e + 2]].my == o || n.push([e + 2, a + 1]),
    !(9 >= a + 2 && 8 >= e + 1) || comm.map[a + 1][e] || comm.mans[m[a + 2][e + 1]] && comm.mans[m[a + 2][e + 1]].my == o || n.push([e + 1, a + 2]),
    !(9 >= a + 2 && e - 1 >= 0) || comm.map[a + 1][e] || comm.mans[m[a + 2][e - 1]] && comm.mans[m[a + 2][e - 1]].my == o || n.push([e - 1, a + 2]),
    !(9 >= a + 1 && e - 2 >= 0) || comm.map[a][e - 1] || comm.mans[m[a + 1][e - 2]] && comm.mans[m[a + 1][e - 2]].my == o || n.push([e - 2, a + 1]),
    !(a - 1 >= 0 && e - 2 >= 0) || comm.map[a][e - 1] || comm.mans[m[a - 1][e - 2]] && comm.mans[m[a - 1][e - 2]].my == o || n.push([e - 2, a - 1]),
    !(a - 2 >= 0 && e - 1 >= 0) || comm.map[a - 1][e] || comm.mans[m[a - 2][e - 1]] && comm.mans[m[a - 2][e - 1]].my == o || n.push([e - 1, a - 2]),
    n
}
Chess.bylaw.x = function(e, a, m, o) {
    var n = [];
    return ((isVerticalReverse == 0 && 1 === o) || (isVerticalReverse == 1 && -1 === o)) ? (!(9 >= a + 2 && 8 >= e + 2) || comm.map[a + 1][e + 1] || comm.mans[m[a + 2][e + 2]] && comm.mans[m[a + 2][e + 2]].my == o || n.push([e + 2, a + 2]), !(9 >= a + 2 && e - 2 >= 0) || comm.map[a + 1][e - 1] || comm.mans[m[a + 2][e - 2]] && comm.mans[m[a + 2][e - 2]].my == o || n.push([e - 2, a + 2]), !(a - 2 >= 5 && 8 >= e + 2) || comm.map[a - 1][e + 1] || comm.mans[m[a - 2][e + 2]] && comm.mans[m[a - 2][e + 2]].my == o || n.push([e + 2, a - 2]), !(a - 2 >= 5 && e - 2 >= 0) || comm.map[a - 1][e - 1] || comm.mans[m[a - 2][e - 2]] && comm.mans[m[a - 2][e - 2]].my == o || n.push([e - 2, a - 2])) : (!(4 >= a + 2 && 8 >= e + 2) || comm.map[a + 1][e + 1] || comm.mans[m[a + 2][e + 2]] && comm.mans[m[a + 2][e + 2]].my == o || n.push([e + 2, a + 2]), !(4 >= a + 2 && e - 2 >= 0) || comm.map[a + 1][e - 1] || comm.mans[m[a + 2][e - 2]] && comm.mans[m[a + 2][e - 2]].my == o || n.push([e - 2, a + 2]), !(a - 2 >= 0 && 8 >= e + 2) || comm.map[a - 1][e + 1] || comm.mans[m[a - 2][e + 2]] && comm.mans[m[a - 2][e + 2]].my == o || n.push([e + 2, a - 2]), !(a - 2 >= 0 && e - 2 >= 0) || comm.map[a - 1][e - 1] || comm.mans[m[a - 2][e - 2]] && comm.mans[m[a - 2][e - 2]].my == o || n.push([e - 2, a - 2])),n 
}
Chess.bylaw.s = function(e, a, m, o) {
    var n = [];
    return ((isVerticalReverse == 0 && 1 === o) || (isVerticalReverse == 1 && -1 === o)) ? (9 >= a + 1 && 5 >= e + 1 && (!comm.mans[m[a + 1][e + 1]] || comm.mans[m[a + 1][e + 1]].my != o) && n.push([e + 1, a + 1]), 9 >= a + 1 && e - 1 >= 3 && (!comm.mans[m[a + 1][e - 1]] || comm.mans[m[a + 1][e - 1]].my != o) && n.push([e - 1, a + 1]), a - 1 >= 7 && 5 >= e + 1 && (!comm.mans[m[a - 1][e + 1]] || comm.mans[m[a - 1][e + 1]].my != o) && n.push([e + 1, a - 1]), a - 1 >= 7 && e - 1 >= 3 && (!comm.mans[m[a - 1][e - 1]] || comm.mans[m[a - 1][e - 1]].my != o) && n.push([e - 1, a - 1])) : (2 >= a + 1 && 5 >= e + 1 && (!comm.mans[m[a + 1][e + 1]] || comm.mans[m[a + 1][e + 1]].my != o) && n.push([e + 1, a + 1]), 2 >= a + 1 && e - 1 >= 3 && (!comm.mans[m[a + 1][e - 1]] || comm.mans[m[a + 1][e - 1]].my != o) && n.push([e - 1, a + 1]), a - 1 >= 0 && 5 >= e + 1 && (!comm.mans[m[a - 1][e + 1]] || comm.mans[m[a - 1][e + 1]].my != o) && n.push([e + 1, a - 1]), a - 1 >= 0 && e - 1 >= 3 && (!comm.mans[m[a - 1][e - 1]] || comm.mans[m[a - 1][e - 1]].my != o) && n.push([e - 1, a - 1])), n
}
Chess.bylaw.j = function(e, a, m, o) {
    var n = [],
    t = function(e, a) {
        for (var e = comm.mans.j0.y,
        o = comm.mans.J0.x,
        a = comm.mans.J0.y,
        n = e - 1; n > a; n--) if (m[n][o]) return ! 1;
        return ! 0
    } ();
     return ((isVerticalReverse == 0 && 1 === o) || (isVerticalReverse == 1 && -1 === o)) ? (9 >= a + 1 && (!comm.mans[m[a + 1][e]] || comm.mans[m[a + 1][e]].my != o) && n.push([e, a + 1]), a - 1 >= 7 && (!comm.mans[m[a - 1][e]] || comm.mans[m[a - 1][e]].my != o) && n.push([e, a - 1]), comm.mans.j0.x == comm.mans.J0.x && t && n.push([comm.mans.J0.x, comm.mans.J0.y])) : (2 >= a + 1 && (!comm.mans[m[a + 1][e]] || comm.mans[m[a + 1][e]].my != o) && n.push([e, a + 1]), a - 1 >= 0 && (!comm.mans[m[a - 1][e]] || comm.mans[m[a - 1][e]].my != o) && n.push([e, a - 1]), comm.mans.j0.x == comm.mans.J0.x && t && n.push([comm.mans.j0.x, comm.mans.j0.y])), 5 >= e + 1 && (!comm.mans[m[a][e + 1]] || comm.mans[m[a][e + 1]].my != o) && n.push([e + 1, a]),e - 1 >= 3 && (!comm.mans[m[a][e - 1]] || comm.mans[m[a][e - 1]].my != o) && n.push([e - 1, a]), n
}
Chess.bylaw.p = function(e, a, m, o) {
    for (var n = [], t = 0, s = e - 1; s >= 0; s--) {
        if (m[a][s]) {
            if (0 == t) {
                t++;
                continue
            }
            comm.mans[m[a][s]].my != o && n.push([s, a]);
            break
        }
        0 == t && n.push([s, a])
    }
    for (var t = 0,
    s = e + 1; 8 >= s; s++) {
        if (m[a][s]) {
            if (0 == t) {
                t++;
                continue
            }
            comm.mans[m[a][s]].my != o && n.push([s, a]);
            break
        }
        0 == t && n.push([s, a])
    }
    for (var t = 0,
    s = a - 1; s >= 0; s--) {
        if (m[s][e]) {
            if (0 == t) {
                t++;
                continue
            }
            comm.mans[m[s][e]].my != o && n.push([e, s]);
            break
        }
        0 == t && n.push([e, s])
    }
    for (var t = 0,
    s = a + 1; 9 >= s; s++) {
        if (m[s][e]) {
            if (0 == t) {
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
Chess.bylaw.z = function(e, a, m, o) {
    var n = [];
    return ((isVerticalReverse == 0 && 1 === o) || (isVerticalReverse == 1 && -1 === o)) ? ( a - 1 >= 0 && (!comm.mans[m[a - 1][e]] || comm.mans[m[a - 1][e]].my != o) && n.push([e, a - 1]), 8 >= e + 1 && 4 >= a && (!comm.mans[m[a][e + 1]] || comm.mans[m[a][e + 1]].my != o) && n.push([e + 1, a]), e - 1 >= 0 && 4 >= a && (!comm.mans[m[a][e - 1]] || comm.mans[m[a][e - 1]].my != o) && n.push([e - 1, a]) ) : ( 9 >= a + 1 && (!comm.mans[m[a + 1][e]] || comm.mans[m[a + 1][e]].my != o) && n.push([e, a + 1]), 8 >= e + 1 && a >= 5 && (!comm.mans[m[a][e + 1]] || comm.mans[m[a][e + 1]].my != o) && n.push([e + 1, a]), e - 1 >= 0 && a >= 5 && (!comm.mans[m[a][e - 1]] || comm.mans[m[a][e - 1]].my != o) && n.push([e - 1, a]) ), n	
}
/*棋子的权重*/
Chess.value = {
    c: [[206, 208, 207, 213, 214, 213, 207, 208, 206], [206, 212, 209, 216, 233, 216, 209, 212, 206], [206, 208, 207, 214, 216, 214, 207, 208, 206], [206, 213, 213, 216, 216, 216, 213, 213, 206], [208, 211, 211, 214, 215, 214, 211, 211, 208], [208, 212, 212, 214, 215, 214, 212, 212, 208], [204, 209, 204, 212, 214, 212, 204, 209, 204], [198, 208, 204, 212, 212, 212, 204, 208, 198], [200, 208, 206, 212, 200, 212, 206, 208, 200], [194, 206, 204, 212, 200, 212, 204, 206, 194]],
    m: [[90, 90, 90, 96, 90, 96, 90, 90, 90], [90, 96, 103, 97, 94, 97, 103, 96, 90], [92, 98, 99, 103, 99, 103, 99, 98, 92], [93, 108, 100, 107, 100, 107, 100, 108, 93], [90, 100, 99, 103, 104, 103, 99, 100, 90], [90, 98, 101, 102, 103, 102, 101, 98, 90], [92, 94, 98, 95, 98, 95, 98, 94, 92], [93, 92, 94, 95, 92, 95, 94, 92, 93], [85, 90, 92, 93, 78, 93, 92, 90, 85], [88, 85, 90, 88, 90, 88, 90, 85, 88]],
    x: [[0, 0, 20, 0, 0, 0, 20, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 23, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 20, 0, 0, 0, 20, 0, 0], [0, 0, 20, 0, 0, 0, 20, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [18, 0, 0, 0, 23, 0, 0, 0, 18], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 20, 0, 0, 0, 20, 0, 0]],
    s: [[0, 0, 0, 20, 0, 20, 0, 0, 0], [0, 0, 0, 0, 23, 0, 0, 0, 0], [0, 0, 0, 20, 0, 20, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 20, 0, 20, 0, 0, 0], [0, 0, 0, 0, 23, 0, 0, 0, 0], [0, 0, 0, 20, 0, 20, 0, 0, 0]],
    j: [[0, 0, 0, 8888, 8888, 8888, 0, 0, 0], [0, 0, 0, 8888, 8888, 8888, 0, 0, 0], [0, 0, 0, 8888, 8888, 8888, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 8888, 8888, 8888, 0, 0, 0], [0, 0, 0, 8888, 8888, 8888, 0, 0, 0], [0, 0, 0, 8888, 8888, 8888, 0, 0, 0]],
    p: [[100, 100, 96, 91, 90, 91, 96, 100, 100], [98, 98, 96, 92, 89, 92, 96, 98, 98], [97, 97, 96, 91, 92, 91, 96, 97, 97], [96, 99, 99, 98, 100, 98, 99, 99, 96], [96, 96, 96, 96, 100, 96, 96, 96, 96], [95, 96, 99, 96, 100, 96, 99, 96, 95], [96, 96, 96, 96, 96, 96, 96, 96, 96], [97, 96, 100, 99, 101, 99, 100, 96, 97], [96, 97, 98, 98, 98, 98, 98, 97, 96], [96, 96, 97, 99, 99, 99, 97, 96, 96]],
    z: [[9, 9, 9, 11, 13, 11, 9, 9, 9], [19, 24, 34, 42, 44, 42, 34, 24, 19], [19, 24, 32, 37, 37, 37, 32, 24, 19], [19, 23, 27, 29, 30, 29, 27, 23, 19], [14, 18, 20, 27, 29, 27, 20, 18, 14], [7, 0, 13, 0, 16, 0, 13, 0, 7], [7, 0, 7, 0, 15, 0, 7, 0, 7], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0]]
}
Chess.value.C = comm.arr2Clone(Chess.value.c).reverse();
Chess.value.M = comm.arr2Clone(Chess.value.m).reverse();
Chess.value.X = Chess.value.x;
Chess.value.S = Chess.value.s;
Chess.value.J = Chess.value.j;
Chess.value.P = comm.arr2Clone(Chess.value.p).reverse();
Chess.value.Z = comm.arr2Clone(Chess.value.z).reverse();
/*棋子参数*/
Chess.args = {
    c: { text: "車", img: "r_c", my: 1, bl: "c", value: Chess.value.c },
    m: { text: "馬", img: "r_m", my: 1, bl: "m", value: Chess.value.m },
    x: { text: "相", img: "r_x", my: 1, bl: "x", value: Chess.value.x },
    s: { text: "仕", img: "r_s", my: 1, bl: "s", value: Chess.value.s },
    j: { text: "帅", img: "r_j", my: 1, bl: "j", value: Chess.value.j },
    p: { text: "炮", img: "r_p", my: 1, bl: "p", value: Chess.value.p },
    z: { text: "兵", img: "r_z", my: 1, bl: "z", value: Chess.value.z },
    C: { text: "车", img: "b_c", my: -1, bl: "c", value: Chess.value.C },
    M: { text: "马", img: "b_m", my: -1, bl: "m", value: Chess.value.M },
    X: { text: "象", img: "b_x", my: -1, bl: "x", value: Chess.value.X },
    S: { text: "士", img: "b_s", my: -1, bl: "s", value: Chess.value.S },
    J: { text: "将", img: "b_j", my: -1, bl: "j", value: Chess.value.J },
    P: { text: "炮", img: "b_p", my: -1, bl: "p", value: Chess.value.P },
    Z: { text: "卒", img: "b_z", my: -1, bl: "z", value: Chess.value.Z }
}