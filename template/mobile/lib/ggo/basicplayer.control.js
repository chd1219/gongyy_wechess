(function(WGo, undefined) {

	"use strict";

	var compare_widgets = function(a, b) {
		if (a.weight < b.weight) return -1;
		else if (a.weight > b.weight) return 1;
		else return 0;
	}

	var prepare_dom = function(player) {

		this.iconBar = document.createElement("div");
		this.iconBar.className = "wgo-control-wrapper";
		this.element.appendChild(this.iconBar);

		var widget;

		for (var w in Control.widgets) {
			widget = new Control.widgets[w].constructor(player, Control.widgets[w].args);
			widget.appendTo(this.iconBar);
			this.widgets.push(widget);
		}
	}

	var Control = WGo.extendClass(WGo.BasicPlayer.component.Component, function(player) {
		this.super(player);

		this.widgets = [];
		this.element.className = "wgo-player-control";

		prepare_dom.call(this, player);
	});

	Control.prototype.updateDimensions = function() {
		this.element.className = "wgo-player-control";
	}

	var control = WGo.BasicPlayer.control = {};

	var butupd_first = function(e) {
		if (!e.node.parent && !this.disabled) this.disable();
		else if (e.node.parent && this.disabled) this.enable();
	}

	var butupd_last = function(e) {
		if (!e.node.children.length && !this.disabled) this.disable();
		else if (e.node.children.length && this.disabled) this.enable();
	}

	var but_frozen = function(e) {
		this._disabled = this.disabled;
		if (!this.disabled) this.disable();
	}

	var but_unfrozen = function(e) {
		if (!this._disabled) this.enable();
		delete this._disabled;
	}

	/**
	 * Control.Widget base class. It is used for implementing buttons and other widgets.
	 * First parameter is BasicPlayer object, second can be configuratioon object. 
	 *
	 * args = {
	 *   name: String, // required - it is used for class name
	 *	 init: Function, // other initialization code can be here
	 *	 disabled: BOOLEAN, // default false
	 * }
	 */

	control.Widget = function(player, args) {
		this.element = this.element || document.createElement(args.type || "div");
		this.element.className = "wgo-widget-" + args.name;
		this.init(player, args);
	}

	control.Widget.prototype = {
		constructor: control.Widget,

		/**
		 * Initialization function.
		 */

		init: function(player, args) {
			if (!args) return;
			if (args.disabled) this.disable();
			if (args.init) args.init.call(this, player);
		},

		/**
		 * Append to element.
		 */

		appendTo: function(target) {
			target.appendChild(this.element);
		},

		/**
		 * Make button disabled - eventual click listener mustn't be working.
		 */

		disable: function() {
			this.disabled = true;
			if (this.element.className.search("wgo-disabled") == -1) {
				this.element.className += " wgo-disabled";
			}
		},

		/**
		 * Make button working
		 */

		enable: function() {
			this.disabled = false;
			this.element.className = this.element.className.replace(" wgo-disabled", "");
			this.element.disabled = "";
		},

	}

	/**
	 * Group of widgets
	 */

	control.Group = WGo.extendClass(control.Widget, function(player, args) {
		this.element = document.createElement("div");
		this.element.className = "wgo-ctrlgroup wgo-ctrlgroup-" + args.name;

		var widget;
		for (var w in args.widgets) {
			widget = new args.widgets[w].constructor(player, args.widgets[w].args);
			widget.appendTo(this.element);
		}
	});

	/**
	 * Clickable widget - for example button. It has click action. 
	 *
	 * args = {
	 *   title: String, // required
	 *	 init: Function, // other initialization code can be here
	 *	 click: Function, // required *** onclick event
	 *   togglable: BOOLEAN, // default false
	 *	 selected: BOOLEAN, // default false
	 *	 disabled: BOOLEAN, // default false
	 *	 multiple: BOOLEAN
	 * }
	 */

	control.Clickable = WGo.extendClass(control.Widget, function(player, args) {
		this.super(player, args);
	});

	control.Clickable.prototype.init = function(player, args) {
		var fn, _this = this;

		if (args.togglable) {
			fn = function() {
				if (_this.disabled) return;

				if (args.click.call(_this, player)) _this.select();
				else _this.unselect();
			};
		} else {
			fn = function() {
				if (_this.disabled) return;
				args.click.call(_this, player);
			};
		}

		this.element.addEventListener("click", fn);
//		this.element.addEventListener("touchstart", function(e) {
//			e.preventDefault();
//			fn();
//			if (args.multiple) {
//				_this._touch_i = 0;
//				_this._touch_int = window.setInterval(function() {
//					if (_this._touch_i > 500) {
//						fn();
//					}
//					_this._touch_i += 100;
//				}, 100);
//			}
//			return false;
//		});

//		if (args.multiple) {
//			this.element.addEventListener("touchend", function(e) {
//				window.clearInterval(_this._touch_int);
//			});
//		}

		if (args.disabled) this.disable();
		if (args.init) args.init.call(this, player);
	};

	control.Clickable.prototype.select = function() {
		this.selected = true;
		if (this.element.className.search("wgo-selected") == -1) this.element.className += " wgo-selected";
	};

	control.Clickable.prototype.unselect = function() {
		this.selected = false;
		this.element.className = this.element.className.replace(" wgo-selected", "");
	};

	/**
	 * Widget of button with image icon. 
	 */

	control.Button = WGo.extendClass(control.Clickable, function(player, args) {
		if(args.name=="last"&&!player.board.otherCB){
			return null;
		}
		var elem = this.element = document.createElement("button");
		elem.className = "wgo-button wgo-button-" + args.name;
		elem.title = WGo.t(args.name);

		this.init(player, args);
	});

	control.Button.prototype.disable = function() {
		control.Button.prototype.super.prototype.disable.call(this);
		this.element.disabled = "disabled";
	}

	control.Button.prototype.enable = function() {
		control.Button.prototype.super.prototype.enable.call(this);
		this.element.disabled = "";
	}

	/**
	 * List of widgets (probably Button objects) to be displayed.
	 *
	 * widget = {
	 *	 constructor: Function, // construct a instance of widget
	 *	 args: Object,
	 * }
	 */

	Control.widgets = [{
		constructor: control.Group,
		args: {
			name: "control",
			widgets: [{
				constructor: control.Button,
				args: {
					name: "first",
					disabled: true,
					init: function(player) {
						player.addEventListener("update", butupd_first.bind(this));
						player.addEventListener("frozen", but_frozen.bind(this));
						player.addEventListener("unfrozen", but_unfrozen.bind(this));
					},
					click: function(player) {
						player.first();
						player.board.otherCB&&player.board.otherCB();
					},
				}
			}, {
				constructor: control.Button,
				args: {
					name: "multiprev",
					disabled: true,
					multiple: false,
					init: function(player) {
						player.addEventListener("update", butupd_first.bind(this));
						player.addEventListener("frozen", but_frozen.bind(this));
						player.addEventListener("unfrozen", but_unfrozen.bind(this));
					},
					click: function(player) {
						var p = WGo.clone(player.kifuReader.path);
						p.m -= 10;
						player.goTo(p);
						player.board.otherCB&&player.board.otherCB();
					},
				}
			}, {
				constructor: control.Button,
				args: {
					name: "previous",
					disabled: true,
					multiple: false,
					init: function(player) {
						player.addEventListener("update", butupd_first.bind(this));
						player.addEventListener("frozen", but_frozen.bind(this));
						player.addEventListener("unfrozen", but_unfrozen.bind(this));
					},
					click: function(player) {
						player.previous();
						player.board.otherCB&&player.board.otherCB();
					},
				}
			}, {
				constructor: control.Button,
				args: {
					name: "marks",
					disabled: true,
					multiple: false,
					init: function(player) {
						player.addEventListener("update", butupd_first.bind(this));
						player.addEventListener("frozen", but_frozen.bind(this));
						player.addEventListener("unfrozen", but_unfrozen.bind(this));
					},
					click: function(player) {
						setTimeout(function() {
							var curIndex = player.kifuReader.path.m;
							player.first();
							if (player.board.clearMarker && player.board.marketStyle == "LB") {
								player.board.clearMarker = true;
								player.board.marketStyle = "CR";
							} else if (player.board.clearMarker && player.board.marketStyle == "CR") {
								player.board.clearMarker = false;
								player.board.marketStyle = "LB";
							} else {
								player.board.clearMarker = !player.board.clearMarker;
							}
							player.goToOffSet(curIndex);
						}, 1);
					},
				}
			}, {
				constructor: control.Button,
				args: {
					name: "next",
					disabled: true,
					multiple: false,
					init: function(player) {
						player.addEventListener("update", butupd_last.bind(this));
						player.addEventListener("frozen", but_frozen.bind(this));
						player.addEventListener("unfrozen", but_unfrozen.bind(this));
					},
					click: function(player) {
						player.next();
						player.board.otherCB&&player.board.otherCB();
					},
				}
			}, {
				constructor: control.Button,
				args: {
					name: "multinext",
					disabled: true,
					multiple: false,
					init: function(player) {
						player.addEventListener("update", butupd_last.bind(this));
						player.addEventListener("frozen", but_frozen.bind(this));
						player.addEventListener("unfrozen", but_unfrozen.bind(this));
					},
					click: function(player) {
						var p = WGo.clone(player.kifuReader.path);
						p.m += 10;
						player.goTo(p);
						player.board.otherCB&&player.board.otherCB();
					},
				}
			}, {
				constructor: control.Button,
				args: {
					name: "last",
					disabled: true,
					init: function(player) {
						player.addEventListener("update", butupd_last.bind(this));
						player.addEventListener("frozen", but_frozen.bind(this));
						player.addEventListener("unfrozen", but_unfrozen.bind(this));
					},
					click: function(player) {
						player.last()
					},
				}
			}]
		}
	}];

	var bp_layouts = WGo.BasicPlayer.layouts;
	bp_layouts["right_top"].top.push("Control");
	bp_layouts["right"].right.push("Control");
	bp_layouts["one_column"].top.push("Control");
	bp_layouts["no_comment"].bottom.push("Control");
	bp_layouts["minimal"].bottom.push("Control");

	var player_terms = {
		"about": "About",
		"first": "First",
		"multiprev": "10 moves back",
		"previous": "Previous",
		"next": "Next",
		"multinext": "10 moves forward",
		"last": "Last",
		"switch-coo": "Display coordinates",
		"menu": "Menu",
	};

	for (var key in player_terms) WGo.i18n.en[key] = player_terms[key];
	WGo.BasicPlayer.component.Control = Control;

})(WGo);