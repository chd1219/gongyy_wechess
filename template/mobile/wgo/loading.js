var width=1;
var max=90;
$(".progress_refresh").width(width+"%")
$(".progress_text").html(width+"%")
var loadObj=setInterval(function(){
	width+=1;
	if(width<max){
		$(".progress_refresh").width(width+"%")
		$(".progress_text").html(width+"%")
	}else if(width==max){
		$(".progress_refresh").width("100%");
		$(".progress_text").html("100%")
		clearInterval(loadObj);
		setTimeout(function(){
			$(".loading").hide();
		},100);
	}
},5);
window.onload=function(){
	max=100;
}