/*
 * init.create.js
 * 自定义初始化
 * 2017-08-20
 * chd
 */

/*加载配置信息,根据模块自定义*/
loadConfig = function() {
	/*创建棋谱*/
	onCreate();	
}
/*初始化结构布局*/
initLayer = function(e) {
	onload();
	mode = playmode.EDITBOARD;
	initialization(e);    
    loadConfig(); 
    mode = playmode.CREATE;
}
/*预加载*/
onload = function() {
    $("#isOffensiveBtn").on('tap', onOffensive),
    $("#analyseBtn").on('tap', onAnalyse),
    $("#blackautoplayBtn").on('tap', onBluePlay),
    $("#redautoplayBtn").on('tap', onRedPlay),
    $("#soundBtn").on('tap', onSound),
    $("#verticalreverseBtn").on('tap', onReverse),    
    $("#noteBtn").on('tap', onNote),  
    $("#editboardBtn").on('tap', onEditboard),  
    $("#firstBtn").on('tap', onReplayFirst),
    $("#autoreplayBtn").on('tap', OnshowArrow),
    $("#prevBtn").on('tap', onReplayPrev),
    $("#nextBtn").on('tap', onReplayNext),
    $("#endBtn").on('tap', onReplayEnd),
    $("#regretBtn").on('tap', onRegret),
    $("#sendBtn").on('tap', onSend),
    $("#errordataBtn").on('tap', onErrordata),
    $("#reveseBtn").on('tap', onReverse),    
    $("#fullBtn").on('tap', onFullBroad),
    $("#clearBtn").on('tap', onCleanBroad),               
    $("#saveBtn").on('tap', onSave);      
}
function Setting() {
	timingBegins = !0;
	showThink();
}