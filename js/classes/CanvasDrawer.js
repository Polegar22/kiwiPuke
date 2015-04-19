function CanvasDrawer(url) {
	this.image = new Image();
	this.image.referenceDuTileset = this;
	this.image.onload = function() {
		if(!this.complete) 
			throw new Error("Erreur de chargement du tileset nommé \"" + url + "\".");
		this.referenceDuTileset.largeur = this.width / 32;
	}
	this.image.src = "tilesets/" + url;
}

CanvasDrawer.prototype.drawImage = function(context,x,y){
	context.drawImage(this.image, x, y);
}

CanvasDrawer.prototype.dessinerTile = function(numero, context, xDestination, yDestination) {
	var xSourceEnTiles = numero % this.largeur;
	if(xSourceEnTiles == 0) 
		xSourceEnTiles = this.largeur;
	var ySourceEnTiles = Math.ceil(numero / this.largeur);
	
	var xSource = (xSourceEnTiles - 1) * 32;
	var ySource = (ySourceEnTiles - 1) * 32;
	context.drawImage(this.image, xSource, ySource, 32, 32, xDestination, yDestination, 32, 32);
}

CanvasDrawer.prototype.writeText = function(message, context, xDest, yDest){
	context.font = "bold 22pt Calibri,Geneva,Arial";
	context.fillStyle = "#fff";
	context.fillText(message,xDest,yDest);
}