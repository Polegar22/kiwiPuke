var map = new Map("premiere");
var kiwi = new Kiwi("real_kiwi.png", 7 * 32, 14 * 32, DIRECTION.BAS);
var enemy = new Personnage("enemy.png", 1 * 32, 1 * 32, DIRECTION.BAS);

map.setKiwi(kiwi);
map.addPersonnage(enemy);

var isStarted = false;

window.onload = function() {
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var miaou = new Audio('sound/miaou.mp3');


	// Gestion du clavier
	window.onkeydown = function(event) {
		if(isStarted==false){
			miaou.play();
			isStarted = true;
		}
		var e = event || window.event;
		var key = e.which || e.keyCode;
		switch(key) {
			case 38 :// Flèche haut
				kiwi.deplacer(DIRECTION.HAUT, map);
				break;
			case 40 :// Flèche bas
				kiwi.deplacer(DIRECTION.BAS, map);
				break;
			case 37 :// Flèche gauche
				kiwi.deplacer(DIRECTION.GAUCHE, map);
				break;
			case 39 :// Flèche droite
				kiwi.deplacer(DIRECTION.DROITE, map);
				break;
			case 32 :
				var hadPuke = kiwi.puke(map);
				if(hadPuke){
					var audio = new Audio('sound/puke.mp3');
					audio.play();
				}
				break;
			default : 
				return true;
				
			return false;
		}
	}
	
	// Gestion du clavier
	window.onkeyup = function(event) {
		var e = event || window.event;
		var key = e.which || e.keyCode;
		switch(key) {
			case 38 : case 40 : case 37 : case 39 :
				kiwi.stop();
				break;
			default : 
				return true;
				
			return false;
		}
	}
	
	canvas.width  = map.getLargeur() * 32;
	canvas.height = map.getHauteur() * 32;
	
	setInterval(function() {
		var kiwiCatch = map.isKiwiCatched();
		var allDeviceBroken = map.isAllDeviceBroken();
		if(!kiwiCatch && isStarted && !allDeviceBroken)
		{
			map.moveEnemyToKiwi();
			map.dessinerMap(ctx);
		}
		else if(!isStarted)
		{
			var startDrawer = new CanvasDrawer('startScreen.png');
			startDrawer.drawImage(ctx,0,0);
		}
		else if(allDeviceBroken)
		{
			var successDrawer = new CanvasDrawer('successScreen.png');
			successDrawer.drawImage(ctx,0,0);
		}
		else{
			var endDrawer = new CanvasDrawer('gameOver.png');
			endDrawer.drawImage(ctx,0,0);
		}

	}, 40);
}