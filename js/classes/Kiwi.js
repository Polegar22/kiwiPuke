

function Kiwi(url, x, y, direction) {
	this.currentPos = {'x' : x, 'y' : y};
	this.animation_speed =2;
	this.animation_state = 0;
	this.puke_speed = 8;
	this.speed = 5;
	this.isMoving = false;
	this.isPucking = false;
	this.direction = direction;
	this.ammo = 0;
	this.score = 0;
	this.image = new Image();
	this.image.referenceDuPerso = this;
	this.image.onload = function() {
		if(!this.complete) 
			throw "Erreur de chargement du sprite nommé \"" + url + "\".";
		
		// Taille du Kiwi
		this.referenceDuPerso.largeur = this.width / 3;
		this.referenceDuPerso.hauteur = this.height / 8;
	}
	this.image.src = "sprites/" + url;
}

Kiwi.prototype.dessinerPersonnage = function(context, map) {

	if(this.isPucking)
		this.animation_state++;
	
	if(this.isPucking || this.isMoving){
		var speedCheck = this.isPucking ? this.puke_speed : this.animation_speed;
		if(this.animation_state > speedCheck){
			this.animation_state = 0
			this.frame++;
		}
		if(this.frame > 2) {
			this.frame %= 3;
			if(this.isPucking){
				this.isPucking = false;
				map.addVomit((this.currentPos.x), (this.currentPos.y));
			}
		}
	}
	if(!this.isMoving && !this.isPucking) {
		this.frame = 1;
		this.animation_state = 0;
	}
	if(this.isPucking){
		context.drawImage(
			this.image, 
			this.largeur * this.frame, (this.direction + 4)* this.hauteur, // Point d'origine du rectangle source à prendre dans notre image
			this.largeur, this.hauteur, // Taille du rectangle source (c'est la taille du personnage)
			// Point de destination (dépend de la taille du personnage)
			(this.currentPos.x) - (this.largeur / 2) + 16, (this.currentPos.y) - this.hauteur + 24,
			this.largeur, this.hauteur // Taille du rectangle destination (c'est la taille du personnage)
		);
	}
	else{
		context.drawImage(
			this.image, 
			this.largeur * this.frame, this.direction * this.hauteur, // Point d'origine du rectangle source à prendre dans notre image
			this.largeur, this.hauteur, // Taille du rectangle source (c'est la taille du personnage)
			// Point de destination (dépend de la taille du personnage)
			(this.currentPos.x) - (this.largeur / 2) + 16, (this.currentPos.y) - this.hauteur + 24,
			this.largeur, this.hauteur // Taille du rectangle destination (c'est la taille du personnage)
		);
	}
}

Kiwi.prototype.getScore = function(){
	return this.score;
}

Kiwi.prototype.getAmmo = function(){
	return this.ammo;
}

Kiwi.prototype.puke = function(map){
	if(this.ammo>0){
		this.ammo--;
		this.isPucking = true;
		this.frame = 0;
		var contentAndPos = map.getContentOfTile(this.currentPos, this.direction);
		if(contentAndPos.content == TILE_TYPE.RECORDER){
			this.score++;
			map.recorderBroken(contentAndPos.x, contentAndPos.y);
		}
		return true;
	}
}

Kiwi.prototype.deplacer = function(direction, map) {
	this.isMoving = true;
	this.direction = direction;
	this.animation_state++;
	var nextPos = this.getNextCoord(direction);
	if(this.cantMove(nextPos,direction, map)){
		return false;
	}
	
	this.currentPos.x = nextPos.x;
	this.currentPos.y = nextPos.y;
	
	var contentAndPos = map.getContentOfTile(this.currentPos, direction);
	if(contentAndPos.content == TILE_TYPE.GRASS_TO_EAT){
		this.ammo++;
		map.grassEaten(contentAndPos.x, contentAndPos.y);
	}
		
	return true;
}


Kiwi.prototype.getNextCoord = function(direction) {
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


Kiwi.prototype.cantMove = function(nextPos,direction, map){
	var isOutOfBound = (nextPos.x < 0 || nextPos.y < 0 || nextPos.x >= (map.getLargeur() * 32) - 32 || nextPos.y >= (map.getHauteur() *32) - 24);
	var isOnWall = map.getContentOfTile(nextPos, direction).content == TILE_TYPE.WALL;
	return isOutOfBound || isOnWall;
}


Kiwi.prototype.stop = function(){
	this.isMoving = false;
}


Kiwi.prototype.getCurrentPos = function(){
	return this.currentPos;
}
