var flexible=(function(){
	var _flexible={
		calcFontSize:function(){
			var rootW=window.screen.width;
			var rootWin=window.innerWidth;
			var rootWidth=rootW>rootWin?rootWin:rootW;
			var width = (rootWidth <= 320) ? 320 : (rootWidth > 640 ? 640 : rootWidth);
			var fontSize = 16 * (width / 320);
			return fontSize;
		},
		handlerOrientationChange:function() {
			var fontSize=this.calcFontSize();
			document.documentElement.style.fontSize = fontSize + "px";
			console.log(fontSize+"窗体文字大小");
		}
		
	};
	window.onresize = _flexible.handlerOrientationChange();
	setTimeout(function() {
		_flexible.handlerOrientationChange();
	}, 0);
	return _flexible;
})();