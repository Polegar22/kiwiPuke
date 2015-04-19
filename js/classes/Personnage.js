var DIRECTION = {
	"BAS"    : 0,
	"GAUCHE" : 1,
	"DROITE" : 2,
	"HAUT"   : 3
}


function Personnage(url, x, y, direction) {
	this.speed =3;
	this.frame = 0;
	this.animation_speed =3;
	this.animation_state = 0;
	this.currentPos = {'x' : x, 'y' : y};
	this.isMoving = false;
	this.direction = direction;
	this.image = new Image();
	this.image.referenceDuPerso = this;
	this.image.onload = function() {
		if(!this.complete) 
			throw "Erreur de chargement du sprite nommé \"" + url + "\".";
		
		// Taille du personnage
		this.referenceDuPerso.largeur = this.width / 3;
		this.referenceDuPerso.hauteur = this.height / 4;
	}
	this.image.src = "sprites/" + url;
}

Personnage.prototype.dessinerPersonnage = function(context, map) {

	
	if(this.isMoving){
		if(this.animation_state > this.animation_speed){
			this.animation_state = 0
			this.frame++;
		}
		if(this.frame > 2) {
			this.frame %= 3;
		}
	}
	if(!this.isMoving) {
		this.frame = 1;
		this.animation_state = 0;
	}
	context.drawImage(
		this.image, 
		this.largeur * this.frame, this.direction * this.hauteur, // Point d'origine du rectangle source à prendre dans notre image
		this.largeur, this.hauteur, // Taille du rectangle source (c'est la taille du personnage)
		// Point de destination (dépend de la taille du personnage)
		(this.currentPos.x) - (this.largeur / 2) + 16, (this.currentPos.y) - this.hauteur + 24,
		this.largeur, this.hauteur // Taille du rectangle destination (c'est la taille du personnage)
	);
}

Personnage.prototype.getNextCoord = function(direction) {
	var coord = {'x' : this.currentPos.x, 'y' : this.currentPos.y};
	switch(direction) {
		case DIRECTION.BAS : 
			coord.y += 1 * this.speed;
			break;
		case DIRECTION.GAUCHE : 
			coord.x -= 1*this.speed;
			break;
		case DIRECTION.DROITE : 
			coord.x+= 1*this.speed;
			break;
		case DIRECTION.HAUT : 
			coord.y-= 1*this.speed;
			break;
	}
	return coord;
}

Personnage.prototype.cantMove = function(nextPos,direction, map){
	var isOutOfBound = (nextPos.x < 0 || nextPos.y < 0 || nextPos.x >= (map.getLargeur() * 32) - 32 || nextPos.y >= (map.getHauteur() *32) - 24);
	var isOnWall = map.getContentOfTile(nextPos, direction).content == TILE_TYPE.WALL;
	return isOutOfBound || isOnWall;
}

Personnage.prototype.deplacer = function(direction, map) {
	this.isMoving = true;
	
	this.animation_state++;
	
	this.direction = direction;
	var nextPos = this.getNextCoord(direction);
	if(this.cantMove(nextPos,direction, map)){
		return false;
	}
	
	this.currentPos.x = nextPos.x;
	this.currentPos.y = nextPos.y;
		
	return true;
}

Personnage.prototype.stop = function(){
	this.isMoving = false;
}

Personnage.prototype.getCurrentPos = function(){
	return this.currentPos;
}