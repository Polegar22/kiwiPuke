var TILE_TYPE = {
	"GRASS" : 1,
	"FLOOR" : 2,
	"RECORDER" : 3,
	"WALL" : 4,
	"GRASS_TO_EAT":5,
	"BROKEN_RECORDER" : 6,

}


function Map(nom) {
	
	this.personnages = new Array();
	this.vomitPositions = new Array();
	var xhr = getXMLHttpRequest();
	this.kiwiCatched = false;
	this.vomitImage = new Image();
	this.vomitImage.onload = function() {
		if(!this.complete) 
			throw "Erreur de chargement du sprite nommé \"" + "vomis.png" + "\".";
		
	}
	this.vomitImage.src = "tilesets/vomis.png";

	xhr.open("GET", './maps/' + nom + '.json', false);
	xhr.send(null);
	if(xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) // Code == 0 en local
		throw new Error("Impossible de charger la carte nommée \"" + nom + "\" (code HTTP : " + 		xhr.status + ").");
	var mapJsonData = xhr.responseText;
	
	var mapData = JSON.parse(mapJsonData);
	this.canvasDrawer = new CanvasDrawer(mapData.tileset);
	this.terrain = mapData.terrain;
	this.nbDevice = mapData.nbDevice;
}

Map.prototype.getHauteur = function() {
	return this.terrain.length;
}
Map.prototype.getLargeur = function() {
	return this.terrain[0].length;
}

Map.prototype.addPersonnage = function(perso) {
	this.personnages.push(perso);
}

Map.prototype.setKiwi = function(kiwi){
	this.kiwi = kiwi;
}


Map.prototype.addVomit = function(x,y){
	this.vomitPositions.push({'x' : x, 'y' : y});
}

Map.prototype.getContentOfTile = function(nextPos, direction){
	var x = nextPos.x;
	var y = nextPos.y;
	switch(direction) {
		case DIRECTION.BAS :
			x += 17
			y += 22;
			break;
		case DIRECTION.GAUCHE : 
			y += 22;
			break;
		case DIRECTION.DROITE :
			y += 22;
			x+= 22;
			break;
		case DIRECTION.HAUT : 
			x += 17
			break;
	}
	var terrainContent = this.terrain[Math.floor(y/32)][Math.floor(x/32)];
	var contentAtPosition = {
		'content' : terrainContent,
		'x' : Math.floor(x/32),
		'y' : Math.floor(y/32)
	}
	return contentAtPosition;
}
Map.prototype.isKiwiCatched = function()
{
	return this.kiwiCatched;
}
Map.prototype.isAllDeviceBroken = function(x,y)
{
	return kiwi.getScore()== this.nbDevice;
}

Map.prototype.grassEaten = function(x,y)
{
	this.terrain[Math.floor(y)][Math.floor(x)] =TILE_TYPE.GRASS;
}

Map.prototype.recorderBroken = function(x,y)
{
	this.terrain[Math.floor(y)][Math.floor(x)] =TILE_TYPE.BROKEN_RECORDER;
}

Map.prototype.moveEnemyToKiwi = function(){
	for(var i = 0, l = this.personnages.length ; i < l ; i++) {
		var enemy = this.personnages[i];
		var direction = DIRECTION.BAS;
		if(Math.floor(enemy.getCurrentPos().x/32) == Math.floor(kiwi.getCurrentPos().x/32)
			&& Math.floor(enemy.getCurrentPos().y/32) == Math.floor(kiwi.getCurrentPos().y/32))
		{
			this.kiwiCatched = true;
		}
		if(Math.floor(enemy.getCurrentPos().x/32) > Math.floor(kiwi.getCurrentPos().x/32)){
			direction = DIRECTION.GAUCHE;
		}
		else if(Math.floor(enemy.getCurrentPos().x/32) < Math.floor(kiwi.getCurrentPos().x/32)){
			direction = DIRECTION.DROITE;
		}
		else if(Math.floor(enemy.getCurrentPos().y/32) > Math.floor(kiwi.getCurrentPos().y/32)){
			direction = DIRECTION.HAUT;
		}
		else{
			direction = DIRECTION.BAS;
		}
		var canMove = this.personnages[i].deplacer(direction, this);
		while(!canMove)
		{
			 direction = Math.floor(Math.random() * (3 - 0)) + 0;
			 canMove = this.personnages[i].deplacer(direction, this);
		}

	}
}

Map.prototype.dessinerMap = function(context) {
	for(var i = 0, l = this.terrain.length ; i < l ; i++) {
		var ligne = this.terrain[i];
		var y = i * 32;
		for(var j = 0, k = ligne.length ; j < k ; j++) {
			this.canvasDrawer.dessinerTile(ligne[j], context, j * 32, y);
		}
	}
	for(var i = 0, l = this.vomitPositions.length ; i < l ; i++) {
		context.drawImage(this.vomitImage,this.vomitPositions[i].x, this.vomitPositions[i].y);
	}

	if(this.kiwi != undefined) {
		this.kiwi.dessinerPersonnage(context, this);
		this.canvasDrawer.writeText("Ammo : "+this.kiwi.getAmmo(),context,10,25);
		this.canvasDrawer.writeText("Score : "+this.kiwi.getScore(),context,350,25);
	}
	for(var i = 0, l = this.personnages.length ; i < l ; i++) {
		this.personnages[i].dessinerPersonnage(context, this);
	}

}