function loadConfig() {
    comm.initChess(comm.initMap);
	bill.create();	
}
function initLayer(e) {
    initCanvas(e);
    onload(),
    loadConfig()    
}
onload = function() {
    comm.dot = {
        dots: []
    },
    comm.mans = {},
	
    $("#isOffensiveBtn").on('tap',bill.offensive),
    $("#blackautoplayBtn").on('tap',bill.bPlay),
    $("#redautoplayBtn").on('tap',bill.rPlay),
    $("#soundBtn").on('tap',bill.sound),
	$("#verticalreverseBtn").on('tap',bill.reverse),	
	$("#noteBtn").on('tap',bill.note),	
	$("#firstBtn").on('tap',bill.replayFirst),
	$("#autoreplayBtn").on('tap',bill.autoreplay),
	$("#prevBtn").on('tap',bill.replayPrev),
    $("#nextBtn").on('tap',bill.replayNext),
    $("#endBtn").on('tap',bill.replayEnd),
	$("#regretBtn").on('tap',bill.regret),
	$("#sendBtn").on('tap',bill.send),
	$("#fullBtn").on('tap',bill.fullBroad),
	$("#clearBtn").on('tap',bill.cleanBroad),				
	$("#saveBtn").on('tap',bill.save);		
};
