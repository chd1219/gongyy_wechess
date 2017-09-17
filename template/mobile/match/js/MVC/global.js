/*
 * global.js
 * 全局变量
 * 2017-08-20
 * chd
 */

var serverData = serverData || {};
var fullMap, 
fullMoves, 
movesIndex = 0,
movesCount = 0,
computelist = [],
movesTipsShow = !0,
isVerticalReverse = 0,
movesInterval,
voicemode = 1,
autoset,
r_autoset = 0,
b_autoset = 0;
canRestart = !1;
lastTime = 0,
/*棋盘位置偏移*/
boardseek = 80;
var commTipsImg;
var Dots = {};
var dot;
var isanalyse = isanalyse || 0;
var boardset = {boutside:-1.1, routside:10.3, outsidescale:1.58};
var playtime = {red:0, black:0};
var playmode = {AIPLAY:0, EDITBOARD:1, ANALYSE:2, REPLAY:3, CREATE:4, ONLINE:5};
var RED = 1;
var BLACK = -1;
var showThinkset = 0;
var first = !1;
var isComPlay = 0;
var currentId = 0;
var id = 0;
var chessnum = [];
var countPath = 0;
var stageshape = [];
var stagetext = [];
var autoreplayset = 0;
var relayNextLock = 0;
var relayPrevLock = 0;
var autoreplayspan = 2000;
var removeOnDrops = [];
var callOnDrops = [];
var callOnDropsArgs = [];
var first = !1;
var mode = 0;
var isexchange = 0;
var waitServerPlay = !1;
var timingBegins = !1;
/*引擎信息缓存*/
var depthinfolist = [];
/*云库信息缓存*/
var cloudinfolist = [];
var comm = comm || {};
InitMap = [
	["C0", "M0", "X0", "S0", "J0", "S1", "X1", "M1", "C1"], 
	[, , , , , , , , ""], 
	[, "P0", , , , , , "P1","",], 
	["Z0", , "Z1", , "Z2", , "Z3", , "Z4"], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	["z0", , "z1", , "z2", , "z3", , "z4"], 
	[, "p0", , , , , , "p1",""], 
	[, , , , , , , , ""], 
	["c0", "m0", "x0", "s0", "j0", "s1", "x1", "m1", "c1"]
];
EmptyMap = [
	[, , , , "J0", , , , ""], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	[, , , , , , , , ""], 
	[, , , , "j0", , , , ""]
];
var isend = 0,
initMap,
emptyMap,
sMapFull = [["C0", "M0", "P0", "X0", "S0", "Z0"], ["c0", "m0", "p0", "x0", "s0", "z0"]],
sMapFullReveser = [["c0", "m0", "p0", "x0", "s0", "z0"],["C0", "M0", "P0", "X0", "S0", "Z0"]],
sMapEmpty = [[, , , , , , , , ], [, , , , , ]],
chessMan = { "C": ["C0", "C1"], "M": ["M0", "M1"], "P": ["P0", "P1"], "X": ["X0", "X1"], "S": ["S0", "S1"], "Z": ["Z0", "Z1", "Z2", "Z3", "Z4"], "c": ["c0", "c1"], "m": ["m0", "m1"], "p": ["p0", "p1"], "x": ["x0", "x1"], "s": ["s0", "s1"], "z": ["z0", "z1", "z2", "z3", "z4"] },
emptychessMan = { "C": [], "M": [], "P": [], "S": [], "X": [], "Z": [], "c": [], "m": [], "p": [], "s": [], "x": [], "z": [] }
