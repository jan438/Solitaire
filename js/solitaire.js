var prefix = Deck.prefix;
var transform = prefix('transform');
var translate = Deck.translate;
var $container = document.getElementById('container');
var $topbar = document.getElementById('topbar');
var $solitaire = document.createElement('button');
$solitaire.setAttribute("style", "background-color:Chartreuse; font-size:2em;");
$solitaire.setAttribute("id", "solitaire");
var $sw_start = document.createElement('button');
$sw_start.setAttribute("id", "sw_start");
var $sw_pause = document.createElement('button');
$sw_pause.setAttribute("id", "sw_pause");
var $sw_stop = document.createElement('button');
$sw_stop.setAttribute("id", "sw_stop");
var $sw_reset = document.createElement('button');
$sw_reset.setAttribute("id", "sw_reset");
$solitaire.textContent = 'Solitaire';
$sw_start.textContent = 'Start';
$sw_pause.textContent = 'Pause';
$sw_stop.textContent = 'Stop';
$sw_reset.textContent = 'Reset';
$topbar.appendChild($solitaire);
$topbar.appendChild($sw_start);
$topbar.appendChild($sw_pause);
$topbar.appendChild($sw_stop);
$topbar.appendChild($sw_reset);
var deck = Deck();
deck.cards.forEach(function (card, i) {
	card.enableDragging()
	card.enableFlipping()
});
$solitaire.addEventListener('click', function () {
  deck.queue(function (next) {
	deck.cards.forEach(function (card, i) {
		setTimeout(function () {
				card.setSide('back')
			}, i * 7.5)
		})
		next()
	})
	deck.shuffle()
	deck.shuffle()
	deck.solitaire()
});
deck.mount($container);
deck.intro();
