
function SpriteRenderer(ctx) {
	this.ctx = ctx;
	this.sprites = new Map();
}

SpriteRenderer.prototype.preloadSprite = function(spriteLocation, callback) {
	if (this.sprites.has(spriteLocation)) {
		return;
	}
	
	let sprite = {
		image: new Image(),
		isLoaded: false
	};
	this.sprites.set(spriteLocation, sprite);

	sprite.image.onload = () => {
		sprite.isLoaded = true;
		callback();
	};
	sprite.image.src = spriteLocation;
};

SpriteRenderer.prototype.render = function(spriteLocation, pos) {
	let image = this.sprites.get(spriteLocation).image;
	this.ctx.drawImage(image, pos.x, pos.y, image.width, image.height);
};
