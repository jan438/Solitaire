'use strict';
var solitaire = {};
var longpress = false;
var presstime = 1000;
var shortpress = false;
var notmoved = true;
var gamestarted = false;
var startTime, endTime;
var startxposition;
var startyposition;
var destinationpile;
var destinationfoundationpile;
var sourcepile;
var endxposition;
var endyposition;
var selectedcard = "";
var indexinthepile;
var destinationcard = "";
const startpileyposition = -100;
const deltapileyposition = 25;
var maxzindex = -1000;
var piles = new Array(7);
var pilesx = new Array(7);
pilesx[0] = -300;
pilesx[1] = -200;
pilesx[2] = -100;
pilesx[3] = 0;
pilesx[4] = 100;
pilesx[5] = 200;
pilesx[6] = 300;
var pilecards = [[],[],[],[],[],[],[]];
var deckcards = [];
var foundationsuit = [[],[],[],[]];
var foundationpiles = new Array(4);
var foundationpilelastindex = new Array(4);
var foundationpilesx = [[0],[100],[200],[300]];
const mindeckx = -325;
const deckx = -300;
const maxdeckx = -275;
const decky = -305.75;
const minwastex = -225;
const wastex = -200;
const maxwastex = -175;
const wastey = -305.75;
var wastez = 0;
var wastepile = new Array(52);
wastepile = ["", ""];
var wastepilelastindex = 0;
const foundationpileyposition = -305.75;
var foundationsymbols = "♠♥♣♦";
var waste = [];
var pile = 0;
var pileposition;
var cardstomove;
var sourcepilelastindex;
var destinationpilelastindex;
var decktowaste = 1;
var longpresspilextarget;
var longpresspileytarget
var previousselection = "chkone";
var foundationcards;
var cardsinthegame;
$( "input[type='checkbox']" ).change(function() {
	if (!gamestarted) {
		if( $(this).is(":checked")) {
			var strid = $(this).attr('id');
			if ($("#" + strid).is(":checked")) {
				if (previousselection.length > 0) {
					$("#" + previousselection).prop('checked', false);				
				}
				previousselection = strid;
			}
		}
		if ($("#chkone").is(":checked")) {
			decktowaste = 1;
		}
		else {
			if ($("#chkthree").is(":checked")) {
				decktowaste = 3;
			}
		}
	}
	else {
		$("#chkone").prop('checked', false);
		$("#chkthree").prop('checked', false);
		$("#" + previousselection).prop('checked', true);
	}
});
function reset() {
//	console.log("Reset");
	wastez = 0;
	if (deckcards.length === 0) {
		for (var j = 0; j < waste.length; j++) {
			deckcards.push(waste[j]);
			waste[j].setSide('back');
			waste[j].animateTo({
				delay: 1000,
				duration: 250,
				x: deckx + j * 0.25,
				y: -300,
				rot: 0,
				onStart: function onStart() {
				},
				onComplete: function onComplete() {
				}
			});
		}
		waste = [];
		wastepile = new Array(52);
		wastepile = ["", ""];
		$("#reset").css("background-color","#ff0000");
	}
}
function foundationcardcheck(card1, card2, pile) {
	var check = false;
	var foundationpile = -1;
//	console.log("FountationCard: " + card1 + " PileCard: " + card2 + " Pile: " + pile);
	for (var i = 0; i < 4; i++) {
		if (card2[0] === foundationsymbols.charAt(i)) {
			foundationpile = i;
		}
	}
	if (foundationpile === pile) {
		var suit2 = card2[0];
		var rank2 = card2[1];
		var suit1;
		var rank1;
		if ((card1 === "") || (card1 === undefined)) {
			if (rank2 === "A") return true;
			else return false;
		}
		else {
			suit1 = card1[1][0];
			rank1 = card1[1][1];
		}
		if (suit1 !== suit2) return check;
		switch (rank1) {
			case "H": return false;
				break;
			case "V": if (rank2 === "H") return true;
				break;
			case "B": if (rank2 === "V") return true;
				break;
			case "0": if (rank2 === "B") return true;
				break;
			case "9": if (rank2 === "0") return true;
				break;
			case "8": if (rank2 === "9") return true;
				break;
			case "7": if (rank2 === "8") return true;
				break;
			case "6": if (rank2 === "7") return true;
				break;
			case "5": if (rank2 === "6") return true;
				break;
			case "4": if (rank2 === "5") return true;
				break;
			case "3": if (rank2 === "4") return true;
				break;
			case "2": if (rank2 === "3") return true;
				break;
			case "A": if (rank2 === "2") return true;
				break;
		}
	}
	return check;
}
function cardcheck(card1, card2) {
	var check = false;
//	console.log("Card1: " + card1 + " Card2: " + card2);
	var suit1 = card1[0];
	var suit2 = card2[0]
	var rank1 = card1[1];
	var rank2 = card2[1];
	switch (suit1) {
		case "♠": if ((suit2 === "♣") || (suit2 === "♠")) return check;
			break;
		case "♥": if ((suit2 === "♦") || (suit2 === "♥")) return check;
			break;
		case "♣": if ((suit2 === "♠") || (suit2 === "♣")) return check;
			break;
		case "♦": if ((suit2 === "♥") || (suit2 === "♦")) return check;
			break;
	}
	switch (rank1) {
		case "H": if (rank2 === "V") return true;
			break;
		case "V": if (rank2 === "B") return true;
			break;
		case "B": if (rank2 === "0") return true;
			break;
		case "0": if (rank2 === "9") return true;
			break;
		case "9": if (rank2 === "8") return true;
			break;
		case "8": if (rank2 === "7") return true;
			break;
		case "7": if (rank2 === "6") return true;
			break;
		case "6": if (rank2 === "5") return true;
			break;
		case "5": if (rank2 === "4") return true;
			break;
		case "4": if (rank2 === "3") return true;
			break;
		case "3": if (rank2 === "2") return true;
			break;
		case "2": return check;
			break;
		case "A": return check;
			break;
	}
	return check;
}
function cardtosymbols(card) {
	var symbols = "";
	var symbol1 = "";
	var symbol2 = "";
	switch (card.suit) {
		case 0: symbol1 = "♠";
			break;
		case 1: symbol1 = "♥";
			break;
		case 2: symbol1 = "♣";
			break;
		case 3: symbol1 = "♦";
			break;
	}
	switch (card.rank) {
		case 13:symbol2 = "H";
			break;
		case 12:symbol2 = "V";
			break;
		case 11:symbol2 = "B";
			break;
		case 10:symbol2 = "0";
			break;
		case 9: symbol2 = "9";
			break;
		case 8: symbol2 = "8";
			break;
		case 7: symbol2 = "7";
			break;
		case 6: symbol2 = "6";
			break;
		case 5: symbol2 = "5";
			break;
		case 4: symbol2 = "4";
			break;
		case 3: symbol2 = "3";
			break;
		case 2: symbol2 = "2";
			break;
		case 1: symbol2 = "A";
			break;
	}
	symbols = symbols + symbol1 + symbol2;
	return symbols;
}
var Deck = (function () {
  'use strict';
  var ticking;
  var animations = [];
  function animationframes(delay, duration) {
    var now = Date.now();
    var start = now + delay;
    var end = start + duration;
    var animation = {
      start: start,
      end: end
    };
    animations.push(animation);
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(tick);
    }
    var self = {
      start: function start(cb) {
        animation.startcb = cb;
        return self;
      },
      progress: function progress(cb) {
        animation.progresscb = cb;
        return self;
      },
      end: function end(cb) {
        animation.endcb = cb;
        return self;
      }
    };
    return self;
  }
  var previousTick = 0;
  function tick() {
    var now = Date.now();
    if (now - previousTick < 1000 / 60) {
      requestAnimationFrame(tick);
      return;
    }
    previousTick = now;
    if (!animations.length) {
      ticking = false;
      return;
    }
    for (var i = 0, animation; i < animations.length; i++) {
      animation = animations[i];
      if (now < animation.start) {
        continue;
      }
      if (!animation.started) {
        animation.started = true;
        animation.startcb && animation.startcb();
      }
      var t = (now - animation.start) / (animation.end - animation.start);
      animation.progresscb && animation.progresscb(t < 1 ? t : 1);
      if (now > animation.end) {
        animation.endcb && animation.endcb();
        animations.splice(i--, 1);
        continue;
      }
    }
    requestAnimationFrame(tick);
  }
  window.requestAnimationFrame || (window.requestAnimationFrame = function (cb) {
    setTimeout(cb, 0);
  });
  var style = document.createElement('p').style;
  var memoized = {};
  function prefix(param) {
    if (typeof memoized[param] !== 'undefined') {
      return memoized[param];
    }
    if (typeof style[param] !== 'undefined') {
      memoized[param] = param;
      return param;
    }
    var camelCase = param[0].toUpperCase() + param.slice(1);
    var prefixes = ['webkit', 'moz', 'Moz', 'ms', 'o'];
    var test;
    for (var i = 0, len = prefixes.length; i < len; i++) {
      test = prefixes[i] + camelCase;
      if (typeof style[test] !== 'undefined') {
        memoized[param] = test;
        return test;
      }
    }
  }
  var has3d;
  function translate(a, b, c) {
    typeof has3d !== 'undefined' || (has3d = check3d());
    c = c || 0;
    if (has3d) {
      return 'translate3d(' + a + ', ' + b + ', ' + c + ')';
    } else {
      return 'translate(' + a + ', ' + b + ')';
    }
  }
  function check3d() {
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) {
      return false;
    }
    var transform = prefix('transform');
    var $p = document.createElement('p');
    document.body.appendChild($p);
    $p.style[transform] = 'translate3d(1px,1px,1px)';
    has3d = $p.style[transform];
    has3d = has3d != null && has3d.length && has3d !== 'none';
    document.body.removeChild($p);
    return has3d;
  }
  var _ticking;
  var _animations = [];
  function animationFrames(delay, duration) {
    var now = Date.now();
    var start = now + delay;
    var end = start + duration;
    var animation = {
      start: start,
      end: end
    };
    _animations.push(animation);
    if (!_ticking) {
      _ticking = true;
      requestAnimationFrame(_tick);
    }
    var self = {
      start: function start(cb) {
        animation.startcb = cb;
        return self;
      },
      progress: function progress(cb) {
        animation.progresscb = cb;
        return self;
      },
      end: function end(cb) {
        animation.endcb = cb;
        return self;
      }
    };
    return self;
  }
  var _previousTick = 0;
  function _tick() {
    var now = Date.now();
    if (now - _previousTick < 1000 / 60) {
      requestAnimationFrame(_tick);
      return;
    }
    _previousTick = now;
    if (!_animations.length) {
      _ticking = false;
      return;
    }
    for (var i = 0, animation; i < _animations.length; i++) {
      animation = _animations[i];
      if (now < animation.start) {
        continue;
      }
      if (!animation.started) {
        animation.started = true;
        animation.startcb && animation.startcb();
      }
      var t = (now - animation.start) / (animation.end - animation.start);
      animation.progresscb && animation.progresscb(t < 1 ? t : 1);
      if (now > animation.end) {
        animation.endcb && animation.endcb();
        _animations.splice(i--, 1);
        continue;
      }
    }
    requestAnimationFrame(_tick);
  }
  window.requestAnimationFrame || (window.requestAnimationFrame = function (cb) {
    setTimeout(cb, 0);
  });
  function createElement(type) {
    return document.createElement(type);
  }
  var maxZ = 52;
  function _card(i) {
	var transform = prefix('transform');
	var rank = i % 13 + 1;
	var suit = i / 13 | 0;
	var z = (52 - i) / 4;
	var $el = createElement('div');
	$el.id = 'card' + i;
	var $face = createElement('div');
	var $back = createElement('div');
	var isDraggable = false;
	var isFlippable = false;
	var self = { i: i, rank: rank, suit: suit, pos: i, $el: $el, mount: mount, unmount: unmount, setSide: setSide };
	var modules = Deck.modules;
	var module;
	$face.classList.add('face');
	$back.classList.add('back');
	$el.style[transform] = translate(-z + 'px', -z + 'px');
	self.x = -z;
	self.y = -z;
	self.z = z;
	self.rot = 0;
	self.setSide('back');
	addListener($el, 'mousedown', onMousedown);
	addListener($el, 'touchstart', onMousedown);
    for (module in modules) {
      addModule(modules[module]);
    }
    self.animateTo = function (params) {
      var delay = params.delay;
      var duration = params.duration;
      var _params$x = params.x;
      var x = _params$x === undefined ? self.x : _params$x;
      var _params$y = params.y;
      var y = _params$y === undefined ? self.y : _params$y;
      var _params$rot = params.rot;
      var rot = _params$rot === undefined ? self.rot : _params$rot;
      var ease$$ = params.ease;
      var onStart = params.onStart;
      var onProgress = params.onProgress;
      var onComplete = params.onComplete;
      var startX, startY, startRot;
      var diffX, diffY, diffRot;
      animationFrames(delay, duration).start(function () {
        startX = self.x || 0;
        startY = self.y || 0;
        startRot = self.rot || 0;
        onStart && onStart();
      }).progress(function (t) {
        var et = ease[ease$$ || 'cubicInOut'](t);
        diffX = x - startX;
        diffY = y - startY;
        diffRot = rot - startRot;
        onProgress && onProgress(t, et);
        self.x = startX + diffX * et;
        self.y = startY + diffY * et;
        self.rot = startRot + diffRot * et;
        $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (diffRot ? 'rotate(' + self.rot + 'deg)' : '');
      }).end(function () {
        onComplete && onComplete();
      });
    };
    self.setRankSuit = function (rank, suit) {
      var suitName = SuitName(suit);
      $el.setAttribute('class', 'card ' + suitName + ' rank' + rank);
    };
    self.setRankSuit(rank, suit);
    self.enableDragging = function () {
      if (isDraggable) {
        return;
      }
      isDraggable = true;
      $el.style.cursor = 'move';
    };
    self.enableFlipping = function () {
      if (isFlippable) {
        return;
      }
      isFlippable = true;
    };
    self.disableFlipping = function () {
      if (!isFlippable) {
        return;
      }
      isFlippable = false;
    };
    self.disableDragging = function () {
      if (!isDraggable) {
        return;
      }
      isDraggable = false;
      $el.style.cursor = '';
    };
    return self;
    function addModule(module) {
      module.card && module.card(self);
    }
    function onMousedown(e) {
	startTime = new Date().getTime();
	for (var i = 0; i < 52; i++) {
		$("#card" + i).removeClass('selected');
		$("#card" + i).removeClass('tomove');
	}
	sourcepile = -1;
	sourcepilelastindex = -1;
	selectedcard = cardtosymbols(self);
	indexinthepile	= -1;
	longpresspilextarget = -1;
	longpresspileytarget = -1;
	if (self.x >= mindeckx && self.x <= maxdeckx && self.y < -200) {
		if (decktowaste === 1) {
			maxzindex = maxzindex + 1;
			self.setSide('front');
			self.enableDragging();
			self.disableFlipping();
			var wastesymbols = cardtosymbols(self);
			var previoussymbols = "";
			if (waste.length > 0) previoussymbols = cardtosymbols(waste[waste.length - 1]);
			if (!(wastesymbols === previoussymbols)) {
				wastepile[wastepilelastindex] = [maxzindex, wastesymbols];
				wastepilelastindex = wastepilelastindex + 1;
				waste.push(self);
				deckcards.splice(-1,1);
			}
			self.$el.style.zIndex = maxzindex;
			wastez = wastez + 0.25;
			self.animateTo({
				delay: 1000,
				duration: 250,
				x: wastex + wastez,
				y: wastey,
				rot: 0,
				onStart: function onStart() {
				},
				onComplete: function onComplete() {
				}
			});
		}
		if (decktowaste === 3) {
			cardstomove = [];
			for (var i = 0; i < 3; i++) {
				if (deckcards.length > 0) {
					cardstomove.push(deckcards[deckcards.length - 1]);
					deckcards.splice(-1,1);
				}
			}
			for (var i = 0; i < cardstomove.length; i++) {
				maxzindex = maxzindex + 1;
				cardstomove[i].setSide('front');
				cardstomove[i].enableDragging();
				cardstomove[i].disableFlipping();
				var wastesymbols = cardtosymbols(cardstomove[i]);
				var previoussymbols = "";
				if (waste.length > 0) previoussymbols = cardtosymbols(waste[waste.length - 1]);
				if (!(wastesymbols === previoussymbols)) {
					wastepile[wastepilelastindex] = [maxzindex, wastesymbols];
					wastepilelastindex = wastepilelastindex + 1;
				}
				waste.push(cardstomove[i]);
				waste[waste.length - 1].$el.style.zIndex = maxzindex;
				wastez = wastez + 0.25;
				waste[waste.length - 1].animateTo({
					delay: 1000,
					duration: 250,
					x: wastex + wastez,
					y: wastey,
					rot: 0,
					onStart: function onStart() {
					},
					onComplete: function onComplete() {
					}
				});
			}
		}
	}
	else
	if (self.x >= minwastex && self.x <= maxwastex && self.y < -200) {
		maxzindex = maxzindex + 1;
		self.$el.style.zIndex = maxzindex;
		sourcepile = -2;
		for (var i = 0; i < 7; i++) {
			for (var j = 0; j < 52; j++) {
				if (piles[i][j] != null) {
					if (cardcheck(piles[i][j][3], selectedcard)) {
						if ((pilecards[i][j].side === "front") && (piles[i][j+1] == null)) {
							$("#" + pilecards[i][j].$el.id).addClass('tomove');
							longpresspilextarget = i;
							longpresspileytarget = j;
						}
					}
				}
				else break;
			}
		}
	}
	else {
		for (var i = 0; i < 7; i++) {
			var pileposition = pilesx[i];
			if (Math.round(self.x) === pileposition) {
				sourcepile = i;
				for (var j = 0; j < 52; j++) {
					if (piles[i][j] != null) {
						sourcepilelastindex = j;
						if (piles[i][j][3] === selectedcard) indexinthepile = j;
					}
					else break;
				}
			}
			else {
				for (var j = 0; j < 52; j++) {
					if (piles[i][j] != null) {
						if (cardcheck(piles[i][j][3], selectedcard)) {
							if ((pilecards[i][j].side === "front") && (piles[i][j+1] == null)) {
								$("#" + pilecards[i][j].$el.id).addClass('tomove');
								longpresspilextarget = i;
								longpresspileytarget = j;
							}
						}
					}
					else {
						if ((j === 0) && (selectedcard[1] === "H")) {
							longpresspilextarget = i;
							longpresspileytarget = -1;
						}
						break;
					}
				}
			}
		}
		if (sourcepile >= 0) {
			cardstomove = [];
			for (var i = indexinthepile; i <= sourcepilelastindex; i++) {
				cardstomove.push(pilecards[sourcepile][i]);
				maxzindex = maxzindex + 1;
				pilecards[sourcepile][i].$el.style.zIndex = maxzindex;
				$("#" + pilecards[sourcepile][i].$el.id).addClass('selected');
			}
		}
	}
	if ((selectedcard[0] === "♠") && (foundationsuit[0].length > 0)) {
		if (foundationcardcheck(foundationpiles[0][foundationsuit[0].length -1], selectedcard, 0)) {
			$("#" + foundationsuit[0][foundationsuit[0].length - 1].$el.id).addClass('tomove');
		}
	}
	if ((selectedcard[0] === "♥") && (foundationsuit[1].length > 0)) {
		if (foundationcardcheck(foundationpiles[1][foundationsuit[1].length -1], selectedcard, 1)) {
			$("#" + foundationsuit[1][foundationsuit[1].length - 1].$el.id).addClass('tomove');
		}
	}
	if ((selectedcard[0] === "♣") && (foundationsuit[2].length > 0)) {
		if (foundationcardcheck(foundationpiles[2][foundationsuit[2].length -1], selectedcard, 2)) {
			$("#" + foundationsuit[2][foundationsuit[2].length - 1].$el.id).addClass('tomove');
		}
	}
	if ((selectedcard[0] === "♦") && (foundationsuit[3].length > 0)) {
		if (foundationcardcheck(foundationpiles[3][foundationsuit[3].length -1], selectedcard, 3)) {
			$("#" + foundationsuit[3][foundationsuit[3].length - 1].$el.id).addClass('tomove');
		}
	}
	if ($("#" + $el.id).find('div').hasClass('face')) $("#" + $el.id).addClass('selected');
	var startPos = {};
	var pos = {};
	e.preventDefault();
	if (e.type === 'mousedown') {
		startPos.x = pos.x = e.clientX;
		startPos.y = pos.y = e.clientY;
		addListener(window, 'mousemove', onMousemove);
		addListener(window, 'mouseup', onMouseup);
		startxposition = self.x;
		startyposition = self.y;
	} else {
		startPos.x = pos.x = e.touches[0].clientX;
		startPos.y = pos.y = e.touches[0].clientY;
		addListener(window, 'touchmove', onMousemove);
		addListener(window, 'touchend', onMouseup);
	}
	if (!isDraggable) {
		return;
	}
	$el.style[transform] = translate(self.x + 'px', self.y + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
      function onMousemove(e) {
        if (!isDraggable) {
          return;
        }
        if (e.type === 'mousemove') {
          pos.x = e.clientX;
          pos.y = e.clientY;
        } else {
          pos.x = e.touches[0].clientX;
          pos.y = e.touches[0].clientY;
        }
	if (sourcepile === -1) {
	}
	else
	if (sourcepile === -2) {
		$el.style[transform] = translate(Math.round(self.x + pos.x - startPos.x) + 'px', Math.round(self.y + pos.y - startPos.y) + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
	}
	else {
		for (var i = indexinthepile; i <= sourcepilelastindex; i++) {
			pilecards[sourcepile][i].$el.style[transform] = translate(Math.round(self.x + pos.x - startPos.x) + 'px', Math.round(self.y + pos.y - startPos.y + (i - indexinthepile)*deltapileyposition) + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
		}
	}
      }
      function onMouseup(e) {
	endTime = new Date().getTime();
	if (endTime - startTime < presstime) {
		shortpress = true;
		longpress = false;
	}
	else
	if (endTime - startTime >= presstime) {
		longpress = true;
		shortpress = false;
	}
	if (e.type === 'mouseup') {
		removeListener(window, 'mousemove', onMousemove);
		removeListener(window, 'mouseup', onMouseup);
	}
	else {
		removeListener(window, 'touchmove', onMousemove);
		removeListener(window, 'touchend', onMouseup);
	}
	if (!isDraggable) {
		return;
	}
	if (self.x >= mindeckx && self.x <= maxdeckx && self.y < -200) {
		if ((deckcards.length === 0) && (cardsinthegame > 0)) {
			$("#reset").css("background-color","#4CAF50");
		}
	}
	else
//      end position for waste cards in the piles after a move or a long press or the foundation after a short press or a move
	if (self.x >= minwastex && self.x <= maxwastex && self.y < -200) {
		self.x = self.x + pos.x - startPos.x;
		self.y = self.y + pos.y - startPos.y;
		destinationpile = -1;
		destinationpilelastindex = -1;
		var tomove = false;
		for (var i = 0; i < 7; i++) {
			var pileposition = pilesx[i];
			for (var j = 0; j < 52; j++) {
				if (piles[i][j] != null) {
					if ((self.x > pileposition - 10) && (self.x < pileposition + 10) && (self.y >=startpileyposition)) {
						destinationpile = i;
						destinationpilelastindex = j;
					}
				}
				else {
					if ((j === 0) && (indexinthepile !== 0) && (sourcepile !== -1) && (self.rank === 13)) {
						destinationpile = i;
						tomove = true;
					}
					break;
				}
			}
		}
		destinationfoundationpile = -1;
		for (var i = 0; i < 4; i++) {
			var pileposition = foundationpilesx[i];
			if ((self.x > pileposition - 60) && (self.x < pileposition + 60) && (self.y < foundationpileyposition)) {
				destinationfoundationpile = i;
			}
		}
		if ((destinationpile >= 0) && !(destinationpile === sourcepile)) {
			endxposition = pilesx[destinationpile];
			endyposition = startpileyposition + (destinationpilelastindex + 1) * deltapileyposition;
			if (destinationpilelastindex >= 0) {
				destinationcard = piles[destinationpile][destinationpilelastindex][3];
				tomove = cardcheck(destinationcard, selectedcard);
			}
			if (tomove) {
				maxzindex = maxzindex + 1;
				if (sourcepile === -2) {
					wastepile.splice(-1,1);
					wastepile[wastepilelastindex - 1] = null;
					waste.splice(-1,1);
					pilecards[destinationpile].push(self);
					piles[destinationpile][destinationpilelastindex + 1] = [pilesx[destinationpile], startpileyposition + (destinationpilelastindex + 1)*deltapileyposition, maxzindex, selectedcard];
					self.animateTo({
						delay: 1000,
						duration: 250,
						x: endxposition,
						y: endyposition,
						rot: 0,
						onStart: function onStart() {
						},
						onComplete: function onComplete() {
						}
					});
				}
			}
			else {
				if (sourcepile < 0) {
					self.animateTo({
						delay: 1000,
						duration: 250,
						x: startxposition,
						y: startyposition,
						rot: 0,
						onStart: function onStart() {
						},
						onComplete: function onComplete() {
						}
					});
				}
			}
		}
		else {
			notmoved = (Math.abs(self.x - startxposition) < 10) && (Math.abs(self.y - startyposition) < 10);
			if (destinationfoundationpile >=0 || (longpress && notmoved && (sourcepile !== -2 && indexinthepile === sourcepilelastindex || sourcepile === -2)) || (shortpress && notmoved && (sourcepile !== -2 && indexinthepile === sourcepilelastindex || sourcepile === -2))) {
				if (shortpress || destinationfoundationpile >=0) {
					if (destinationfoundationpile < 0) {
						for (var i = 0; i < 4; i++) {
							if (selectedcard[0] === foundationsymbols.charAt(i)) {
								destinationfoundationpile = i;
							}
						}
					}
					endxposition = foundationpilesx[destinationfoundationpile];
					endyposition = foundationpileyposition;
					destinationcard = foundationpiles[destinationfoundationpile][foundationpilelastindex[destinationfoundationpile] - 1];
					tomove = foundationcardcheck(destinationcard, selectedcard, destinationfoundationpile);
					if (tomove) {
						maxzindex = maxzindex + 1;
						if (sourcepile === -2) {
							wastepile.splice(-1,1);
							wastepile[wastepilelastindex - 1] = null;
							waste.splice(-1,1);
						}
						else {
							pilecards[sourcepile].splice(-1,1);
							piles[sourcepile][indexinthepile] = null;
							if (pilecards[sourcepile].length > 0) {
								pilecards[sourcepile][pilecards[sourcepile].length - 1].setSide("front");
								pilecards[sourcepile][pilecards[sourcepile].length - 1].enableDragging();
							}
						}
						foundationsuit[destinationfoundationpile].push(self);
						foundationpiles[destinationfoundationpile][foundationpilelastindex[destinationfoundationpile]] = [maxzindex, cardtosymbols(self)];
						foundationpilelastindex[destinationfoundationpile] = foundationpilelastindex[destinationfoundationpile] + 1;
						self.animateTo({
							delay: 1000,
							duration: 250,
							x: endxposition,
							y: endyposition,
							rot: 0,
							onStart: function onStart() {
							},
							onComplete: function onComplete() {
							}
						});
					}
					else {
						self.animateTo({
							delay: 1000,
							duration: 250,
							x: startxposition,
							y: startyposition,
							rot: 0,
							onStart: function onStart() {
							},
							onComplete: function onComplete() {
							}
						});
					}
				}
				else {
					if (longpresspilextarget !== -1) {
						endxposition = pilesx[longpresspilextarget];
						endyposition = startpileyposition + (longpresspileytarget + 1) * deltapileyposition;
						pilecards[longpresspilextarget].push(self);
						piles[longpresspilextarget][longpresspileytarget + 1] = [pilesx[longpresspilextarget], startpileyposition + (longpresspileytarget + 1) * deltapileyposition, maxzindex, selectedcard];

						wastepile.splice(-1,1);
						wastepile[wastepilelastindex - 1] = null;
						waste.splice(-1,1);
						self.animateTo({
							delay: 1000,
							duration: 250,
							x: endxposition,
							y: endyposition,
							rot: 0,
							onStart: function onStart() {
							},
							onComplete: function onComplete() {
							}
						});
					}
				}
			}
		}
	}
//      end position for pile cards in the piles after a move or a long press or the foundation after a short press or a move
	else {
		self.x = self.x + pos.x - startPos.x;
		self.y = self.y + pos.y - startPos.y;
		destinationpile = -1;
		destinationpilelastindex = -1;
		var tomove = false;
		for (var i = 0; i < 7; i++) {
			var pileposition = pilesx[i];
			for (var j = 0; j < 52; j++) {
				if (piles[i][j] != null) {
					if ((self.x > pileposition - 10) && (self.x < pileposition + 10) && (self.y >=startpileyposition)) {
						destinationpile = i;
						destinationpilelastindex = j;
					}
				}
				else {
					if ((j === 0) && (indexinthepile !== 0) && (sourcepile !== -1) && (self.rank === 13)) {
						destinationpile = i;
						if (piles[i][0] == null) destinationpilelastindex = -1;
						tomove = true;
					}
					break;
				}
			}
		}
		destinationfoundationpile = -1;
		for (var i = 0; i < 4; i++) {
			var pileposition = foundationpilesx[i];
			if ((self.x > pileposition - 60) && (self.x < pileposition + 60) && (self.y < foundationpileyposition)) {
				destinationfoundationpile = i;
			}
		}
		if ((destinationpile >= 0) && !(destinationpile === sourcepile)) {
			endxposition = pilesx[destinationpile];
			endyposition = startpileyposition + (destinationpilelastindex + 1) * deltapileyposition;
			if (destinationpilelastindex >= 0) {
				destinationcard = piles[destinationpile][destinationpilelastindex][3];
				tomove = cardcheck(destinationcard, selectedcard);
			}
			if (tomove) {
				maxzindex = maxzindex + 1;
				if (sourcepile === -2) {
					wastepile.splice(-1,1);
					wastepile[wastepilelastindex - 1] = null;
					waste.splice(-1,1);
				}
				else {
					pilecards[sourcepile].splice(-cardstomove.length, cardstomove.length);
					for (var i = 0; i < cardstomove.length; i++) {
						piles[sourcepile][indexinthepile + i] = null;
					}
					if (pilecards[sourcepile].length > 0) {
						pilecards[sourcepile][pilecards[sourcepile].length - 1].setSide("front");
						pilecards[sourcepile][pilecards[sourcepile].length - 1].enableDragging();
					}
				}
				if (sourcepile < 0) {
					pilecards[destinationpile].push(self);
					piles[destinationpile][destinationpilelastindex + 1] = [pilesx[destinationpile], startpileyposition + (destinationpilelastindex + 1)*deltapileyposition, maxzindex, selectedcard];
					self.animateTo({
						delay: 1000,
						duration: 250,
						x: endxposition,
						y: endyposition,
						rot: 0,
						onStart: function onStart() {
						},
						onComplete: function onComplete() {
						}
					});
				}
				else {
					for (var i = 0; i < cardstomove.length; i++) {
						pilecards[destinationpile].push(cardstomove[i]);
						piles[destinationpile][destinationpilelastindex + 1 + i] = [pilesx[destinationpile], startpileyposition + (destinationpilelastindex + 1 + i)*deltapileyposition, maxzindex++, cardtosymbols(cardstomove[i])];
						endyposition = startpileyposition + (destinationpilelastindex + 1 + i) * deltapileyposition;
						if (i > 0) {
							cardstomove[i].x = cardstomove[0].x;
							cardstomove[i].y = cardstomove[0].y + i * deltapileyposition;
						}
						cardstomove[i].animateTo({
							delay: 1000,
							duration: 250,
							x: endxposition,
							y: endyposition,
							rot: 0,
							onStart: function onStart() {
							},
							onComplete: function onComplete() {
							}
						});
					}
				}
			}
			else {
				if (sourcepile < 0) {
					self.animateTo({
						delay: 1000,
						duration: 250,
						x: startxposition,
						y: startyposition,
						rot: 0,
						onStart: function onStart() {
						},
						onComplete: function onComplete() {
						}
					});
				}
				else {
					for (var i = 0; i < cardstomove.length; i++) {
						cardstomove[i].animateTo({
							delay: 1000,
							duration: 250,
							x: startxposition,
							y: startyposition + i * deltapileyposition,
							rot: 0,
							onStart: function onStart() {
							},
							onComplete: function onComplete() {
							}
						});
					}
				}
			}
		}
		else {
			notmoved = (Math.abs(self.x - startxposition) < 10) && (Math.abs(self.y - startyposition) < 10);
			if (destinationfoundationpile >=0 || (longpress && notmoved && (sourcepile !== -2 && (indexinthepile + cardstomove.length) === (sourcepilelastindex + 1) || sourcepile === -2)) || (shortpress && notmoved && (sourcepile !== -2 && indexinthepile === sourcepilelastindex || sourcepile === -2))) {
				if (shortpress || destinationfoundationpile >=0) {
					if (destinationfoundationpile < 0) {
						for (var i = 0; i < 4; i++) {
							if (selectedcard[0] === foundationsymbols.charAt(i)) {
								destinationfoundationpile = i;
							}
						}
					}
					endxposition = foundationpilesx[destinationfoundationpile];
					endyposition = foundationpileyposition;
					destinationcard = foundationpiles[destinationfoundationpile][foundationpilelastindex[destinationfoundationpile] - 1];
					tomove = foundationcardcheck(destinationcard, selectedcard, destinationfoundationpile);
					if (tomove) {
						maxzindex = maxzindex + 1;
						if (sourcepile === -2) {
							wastepile.splice(-1,1);
							wastepile[wastepilelastindex - 1] = null;
							waste.splice(-1,1);
						}
						else {
							pilecards[sourcepile].splice(-1,1);
							piles[sourcepile][indexinthepile] = null;
							if (pilecards[sourcepile].length > 0) {
								pilecards[sourcepile][pilecards[sourcepile].length - 1].setSide("front");
								pilecards[sourcepile][pilecards[sourcepile].length - 1].enableDragging();
							}
						}
						foundationsuit[destinationfoundationpile].push(self);
						foundationpiles[destinationfoundationpile][foundationpilelastindex[destinationfoundationpile]] = [maxzindex, cardtosymbols(self)];
						foundationpilelastindex[destinationfoundationpile] = foundationpilelastindex[destinationfoundationpile] + 1;
						self.animateTo({
							delay: 1000,
							duration: 250,
							x: endxposition,
							y: endyposition,
							rot: 0,
							onStart: function onStart() {
							},
							onComplete: function onComplete() {
							}
						});
					}
					else {
						self.animateTo({
							delay: 1000,
							duration: 250,
							x: startxposition,
							y: startyposition,
							rot: 0,
							onStart: function onStart() {
							},
							onComplete: function onComplete() {
							}
						});
					}
				}
				else {
					if (longpresspilextarget !== -1) {
						endxposition = pilesx[longpresspilextarget];
						endyposition = startpileyposition + (longpresspileytarget + 1) * deltapileyposition;		
						for (var i = 0; i < cardstomove.length; i++) {
							pilecards[longpresspilextarget].push(cardstomove[i]);
							piles[longpresspilextarget][longpresspileytarget + i + 1] = [pilesx[longpresspilextarget], startpileyposition + (longpresspileytarget + i + 1) * deltapileyposition, maxzindex, cardtosymbols(cardstomove[i])];
							cardstomove[i].animateTo({
								delay: 1000,
								duration: 250,
								x: endxposition,
								y: endyposition + i * deltapileyposition,
								rot: 0,
								onStart: function onStart() {
								},
								onComplete: function onComplete() {
								}
							});
						}
						for (var i = 0; i < cardstomove.length; i++) {
							pilecards[sourcepile].splice(-1,1);
							piles[sourcepile][indexinthepile + i] = null;
						}
						if (pilecards[sourcepile].length > 0) {
							pilecards[sourcepile][pilecards[sourcepile].length - 1].setSide("front");
							pilecards[sourcepile][pilecards[sourcepile].length - 1].enableDragging();
						}
					}
				}
			}
			else {
				self.animateTo({
					delay: 1000,
					duration: 250,
					x: startxposition,
					y: startyposition,
					rot: 0,
					onStart: function onStart() {
					},
					onComplete: function onComplete() {
					}
				});
			}
		}
	}
	foundationcards = foundationsuit[0].length + foundationsuit[1].length + foundationsuit[2].length + foundationsuit[3].length;
	cardsinthegame = deckcards.length + waste.length + foundationcards + pilecards[0].length + pilecards[1].length + + pilecards[2].length + pilecards[3].length + pilecards[4].length + pilecards[5].length + pilecards[6].length;
	if ((cardsinthegame > 0) && (cardsinthegame !== 52)) {
		var errormsg = "Deck:" + deckcards.length + ":";
		for (var i = 0; i < deckcards.length; i++) {
			if (i === 10) errormsg = errormsg + "<br>";
			if (i === 20) errormsg = errormsg + "<br>";
			errormsg = errormsg + cardtosymbols(deckcards[i]);
		}
		errormsg = errormsg + "<br>Waste:" + waste.length + ":";
		for (var i = 0; i < waste.length; i++) {
			if (i === 10) errormsg = errormsg + "<br>";
			if (i === 20) errormsg = errormsg + "<br>";
			errormsg = errormsg + cardtosymbols(waste[i]);
		}
		swal({
			title: "HTML <small>Something went wrong:</small>!",
			text: errormsg,
			html: true
		});
	}
	if (foundationcards === 52) {
		swal({
			title: "HTML <small>Game Over</small>!",
			text: "All cards are on the foundation",
			html: true
		});
		setTimeout(function () { $("#solitaire").trigger('click'); }, 1000);
	}
      }
    }
    function mount(target) {
      target.appendChild($el);
      self.$root = target;
    }
    function unmount() {
      self.$root && self.$root.removeChild($el);
      self.$root = null;
    }
    function setSide(newSide) {
      if (newSide === 'front') {
        if (self.side === 'back') {
          $el.removeChild($back);
        }
        self.side = 'front';
        $el.appendChild($face);
        self.setRankSuit(self.rank, self.suit);
      } else {
        if (self.side === 'front') {
          $el.removeChild($face);
        }
        self.side = 'back';
        $el.appendChild($back);
        $el.setAttribute('class', 'card');
      }
    }
  }
  function SuitName(suit) {
    return suit === 0 ? 'spades' : suit === 1 ? 'hearts' : suit === 2 ? 'clubs' : suit === 3 ? 'diamonds' : 'joker';
  }
  function addListener(target, name, listener) {
    target.addEventListener(name, listener);
  }
  function removeListener(target, name, listener) {
    target.removeEventListener(name, listener);
  }
  var ease = {
    linear: function linear(t) {
      return t;
    },
    quadIn: function quadIn(t) {
      return t * t;
    },
    quadOut: function quadOut(t) {
      return t * (2 - t);
    },
    quadInOut: function quadInOut(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    cubicIn: function cubicIn(t) {
      return t * t * t;
    },
    cubicOut: function cubicOut(t) {
      return --t * t * t + 1;
    },
    cubicInOut: function cubicInOut(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    quartIn: function quartIn(t) {
      return t * t * t * t;
    },
    quartOut: function quartOut(t) {
      return 1 - --t * t * t * t;
    },
    quartInOut: function quartInOut(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    quintIn: function quintIn(t) {
      return t * t * t * t * t;
    },
    quintOut: function quintOut(t) {
      return 1 + --t * t * t * t * t;
    },
    quintInOut: function quintInOut(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };
  function plusminus(value) {
    var plusminus = Math.round(Math.random()) ? -1 : 1;
    return plusminus * value;
  }
  function fisherYates(array) {
    var rnd, temp;
    for (var i = array.length - 1; i; i--) {
      rnd = Math.random() * i | 0;
      temp = array[i];
      array[i] = array[rnd];
      array[rnd] = temp;
    }
    return array;
  }
  function fontSize() {
    return window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0, -2);
  }
  var ____fontSize;
  var shuffle = {
    deck: function deck(_deck3) {
      _deck3.shuffle = _deck3.queued(shuffle);
      function shuffle(next) {
        var cards = _deck3.cards;
        ____fontSize = fontSize();
        fisherYates(cards);
        cards.forEach(function (card, i) {
          card.pos = i;
          card.shuffle(function (i) {
            if (i === cards.length - 1) {
              next();
            }
          });
        });
        return;
      }
    },
    card: function card(_card3) {
      var $el = _card3.$el;
      _card3.shuffle = function (cb) {
        var i = _card3.pos;
        var z = i / 4;
        var delay = i * 2;
        _card3.animateTo({
          delay: delay,
          duration: 200,
          x: deckx + plusminus(Math.random() * 40 + 20) * ____fontSize / 16,
          y: -300 -z,
          rot: 0
        });
        _card3.animateTo({
		delay: 200 + delay,
		duration: 200,
		x: deckx -z,
		y: -300 -z,
		rot: 0,
		onStart: function onStart() {
			$el.style.zIndex = i;
		},
		onComplete: function onComplete() {
			cb(i);
          }
        });
      };
    }
  };
  var __fontSize;
  var solitaire = {
    deck: function deck(_deck4) {
      _deck4.solitaire = _deck4.queued(solitaire);
      function solitaire(next) {
	gamestarted = true;
	piles[0] = new Array(52);
	piles[1] = new Array(52);
	piles[2] = new Array(52);
	piles[3] = new Array(52);
	piles[4] = new Array(52);
	piles[5] = new Array(52);
	piles[6] = new Array(52);
	piles[0][0] = [pilesx[0], startpileyposition, 51, ""];
	piles[1][0] = [pilesx[1], startpileyposition, 52, ""];
	piles[1][1] = [pilesx[1], startpileyposition + deltapileyposition, 53, ""];
	piles[2][0] = [pilesx[2], startpileyposition, 54, ""];
	piles[2][1] = [pilesx[2], startpileyposition + deltapileyposition, 55, ""];
	piles[2][2] = [pilesx[2], startpileyposition + 2*deltapileyposition, 56, ""];
	piles[3][0] = [pilesx[3], startpileyposition, 57, ""];
	piles[3][1] = [pilesx[3], startpileyposition + deltapileyposition, 58, ""];
	piles[3][2] = [pilesx[3], startpileyposition + 2*deltapileyposition, 59, ""];
	piles[3][3] = [pilesx[3], startpileyposition + 3*deltapileyposition, 60, ""];
	piles[4][0] = [pilesx[4], startpileyposition, 61, ""];
	piles[4][1] = [pilesx[4], startpileyposition + deltapileyposition, 62, ""];
	piles[4][2] = [pilesx[4], startpileyposition + 2*deltapileyposition, 63, ""];
	piles[4][3] = [pilesx[4], startpileyposition + 3*deltapileyposition, 64, ""];
	piles[4][4] = [pilesx[4], startpileyposition + 4*deltapileyposition, 65, ""];
	piles[5][0] = [pilesx[5], startpileyposition, 66, ""];
	piles[5][1] = [pilesx[5], startpileyposition + deltapileyposition, 67, ""];
	piles[5][2] = [pilesx[5], startpileyposition + 2*deltapileyposition, 68, ""];
	piles[5][3] = [pilesx[5], startpileyposition + 3*deltapileyposition, 69, ""];
	piles[5][4] = [pilesx[5], startpileyposition + 4*deltapileyposition, 70, ""];
	piles[5][5] = [pilesx[5], startpileyposition + 5*deltapileyposition, 71, ""];
	piles[6][0] = [pilesx[6], startpileyposition, 72, ""];
	piles[6][1] = [pilesx[6], startpileyposition + deltapileyposition, 73, ""];
	piles[6][2] = [pilesx[6], startpileyposition + 2*deltapileyposition, 74, ""];
	piles[6][3] = [pilesx[6], startpileyposition + 3*deltapileyposition, 75, ""];
	piles[6][4] = [pilesx[6], startpileyposition + 4*deltapileyposition, 76, ""];
	piles[6][5] = [pilesx[6], startpileyposition + 5*deltapileyposition, 77, ""];
	piles[6][6] = [pilesx[6], startpileyposition + 6*deltapileyposition, 78, ""];
	pilecards = [[],[],[],[],[],[],[]];
	deckcards = [];
	foundationsuit = [[],[],[],[]];
	foundationpiles[0] = ["", ""];
	foundationpiles[1] = ["", ""];
	foundationpiles[2] = ["", ""];
	foundationpiles[3] = ["", ""];
	foundationpilelastindex[0] = 0;
	foundationpilelastindex[1] = 0;
	foundationpilelastindex[2] = 0;
	foundationpilelastindex[3] = 0;
	waste = [];
        var cards = _deck4.cards;
        var len = cards.length;
        __fontSize = fontSize();
        cards.slice(-52).reverse().forEach(function (card, i) {
		card.solitaire(i, len, function (i) {
			card.disableDragging();
			card.disableFlipping();
			card.setSide('back');
			if (i === 0) {
				card.setSide('front');
				card.enableDragging();
			}
			if (i === 2) {
				card.setSide('front');
				card.enableDragging();
			}
			if (i === 5) {
				card.setSide('front');
				card.enableDragging();
			}
			if (i === 9) {
				card.setSide('front');
				card.enableDragging();
			}
			if (i === 14) {
				card.setSide('front');
				card.enableDragging();
			}
			if (i === 20) {
				card.setSide('front');
				card.enableDragging();
			}
			if (i === 27) {
				card.setSide('front');
				card.enableDragging();
			}
			if (i === 51) {
				next();
			}
		});
        });
      }
    },
    card: function card(_card4) {
	var $el = _card4.$el;
	_card4.solitaire = function (i, len, cb) {
		var delay = i * 250;
		var duration = 250;
		if (i === 0) {
			pile = 0;
			pileposition = 0;
		}
		if (i === 1) {
			pile = 1;
			pileposition = 0;
		}
		if (i === 3) {
			pile = 2;
			pileposition = 0;
		}
		if (i === 6) {
			pile = 3;
			pileposition = 0;
		}
		if (i === 10) {
			pile = 4;
			pileposition = 0;
		}
		if (i === 15) {
			pile = 5;
			pileposition = 0;
		}
		if (i === 21) {
			pile = 6;
			pileposition = 0;
		}
		if (i > 27) {
			pile = -1;
			pileposition = 0;
			delay = 0;
			duration = 0;
		}
		if (pile >= 0) {
			var cardxpos = piles[pile][pileposition][0];
			var cardypos = piles[pile][pileposition][1];
			var cardzpos = piles[pile][pileposition][2];
			piles[pile][pileposition][3] = cardtosymbols(_card4);
			if (cardzpos > maxzindex) {
				maxzindex = cardzpos;
			}
			pileposition = pileposition + 1;
			pilecards[pile].push(_card4);
		}
		else {
			cardxpos = deckx + (i - 28) * 0.25;
			cardypos = -300;
			maxzindex = maxzindex + 1;
			cardzpos = maxzindex;
			deckcards.push(_card4);
		}
		_card4.animateTo({
			delay: delay,
			duration: duration,
			x: cardxpos,
			y: cardypos,
			rot: 0,
			onStart: function onStart() {
				$el.style.zIndex = cardzpos;
			},
			onComplete: function onComplete() {
				cb(i);
			}
		});
	};
    }
  };
  var intro = {
    deck: function deck(_deck5) {
      _deck5.intro = _deck5.queued(intro);
      function intro(next) {
        var cards = _deck5.cards;
        cards.forEach(function (card, i) {
          card.setSide('front');
          card.intro(i, function (i) {
            animationframes(250, 0).start(function () {
              card.setSide('back');
            });
            if (i === cards.length - 1) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card5) {
      var transform = prefix('transform');
      var $el = _card5.$el;
      _card5.intro = function (i, cb) {
        var delay = 500 + i * 10;
        var z = i / 4;
        $el.style[transform] = translate(-z + 'px', '-250px');
        $el.style.opacity = 0;
        _card5.x = -z;
        _card5.y = -250 - z;
        _card5.rot = 0;
        _card5.animateTo({
          delay: delay,
          duration: 1000,
          x: deckx -z,
          y: -300 -z,
          onStart: function onStart() {
            $el.style.zIndex = i;
          },
          onProgress: function onProgress(t) {
            $el.style.opacity = t;
          },
          onComplete: function onComplete() {
            $el.style.opacity = '';
            cb && cb(i);
          }
        });
      };
    }
  };
  function queue(target) {
    var array = Array.prototype;
    var queueing = [];
    target.queue = queue;
    target.queued = queued;
    return target;
    function queued(action) {
      return function () {
        var self = this;
        var args = arguments;

        queue(function (next) {
          action.apply(self, array.concat.apply(next, args));
        });
      };
    }
    function queue(action) {
      if (!action) {
        return;
      }
      queueing.push(action);
      if (queueing.length === 1) {
        next();
      }
    }
    function next() {
      queueing[0](function (err) {
        if (err) {
          throw err;
        }
        queueing = queueing.slice(1);
        if (queueing.length) {
          next();
        }
      });
    }
  }
  function observable(target) {
    target || (target = {});
    var listeners = {};
    target.on = on;
    target.one = one;
    target.off = off;
    target.trigger = trigger;
    return target;
    function on(name, cb, ctx) {
      listeners[name] || (listeners[name] = []);
      listeners[name].push({ cb: cb, ctx: ctx });
    }
    function one(name, cb, ctx) {
      listeners[name] || (listeners[name] = []);
      listeners[name].push({
        cb: cb, ctx: ctx, once: true
      });
    }
    function trigger(name) {
      var self = this;
      var args = Array.prototype.slice(arguments, 1);
      var currentListeners = listeners[name] || [];
      currentListeners.filter(function (listener) {
        listener.cb.apply(self, args);
        return !listener.once;
      });
    }
    function off(name, cb) {
      if (!name) {
        listeners = {};
        return;
      }
      if (!cb) {
        listeners[name] = [];
        return;
      }
      listeners[name] = listeners[name].filter(function (listener) {
        return listener.cb !== cb;
      });
    }
  }
  function Deck(jokers) {
    var cards = new Array(jokers ? 55 : 52);
    var $el = createElement('div');
    var self = observable({ mount: mount, unmount: unmount, cards: cards, $el: $el });
    var $root;
    var modules = Deck.modules;
    var module;
    queue(self);
    for (module in modules) {
      addModule(modules[module]);
    }
    $el.classList.add('deck');
    var card;
    for (var i = cards.length; i; i--) {
      card = cards[i - 1] = _card(i - 1);
      card.mount($el);
    }
    return self;
    function mount(root) {
      $root = root;
      $root.appendChild($el);
    }
    function unmount() {
      $root.removeChild($el);
    }
    function addModule(module) {
      module.deck && module.deck(self);
    }
  }
  Deck.animationFrames = animationframes;
  Deck.ease = ease;
  Deck.modules = { intro: intro, solitaire: solitaire, shuffle: shuffle };
  Deck.Card = _card;
  Deck.prefix = prefix;
  Deck.translate = translate;
  return Deck;
})();
