/*eslint no-console: "off"*/

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

SpriteRenderer.prototype.drawGrid = function(size, cellSize, offset, color) {
	this.ctx.lineWidth = 0.5;
	this.ctx.strokeStyle = color;
	this.ctx.beginPath();
	for (let i = 0; i < size; i++) {
		this.ctx.moveTo(offset + i * cellSize,			offset);
		this.ctx.lineTo(offset + i * cellSize,			offset + (size - 1) * cellSize);
		this.ctx.moveTo(offset, 						offset + i * cellSize);
		this.ctx.lineTo(offset + (size - 1) * cellSize,	offset + i * cellSize);
	}
	this.ctx.stroke();
};

SpriteRenderer.prototype.drawPlayedStones = function(boardModel) {
	const BLACK_STONE_IMG_SRC = 'img/go-stone-black.png';
	const WHITE_STONE_IMG_SRC = 'img/go-stone-white.png';

	boardModel.forEach( (row, rowIndex) => {
		row.forEach( (placedStone, colIndex) => {
			let sprite;
			if (placedStone === 'w') {
				sprite = WHITE_STONE_IMG_SRC;
			} else if (placedStone === 'b') {
				sprite = BLACK_STONE_IMG_SRC;
			} else {
				return;
			}

			let pos = {x:colIndex*64, y:rowIndex*64};
			pos.x -= 43 - 32; // half of stone image width - outer margin offset
			pos.y -= 43 - 32; // half of stone image width - outer margin offset

			this.render(sprite, pos);
		}, this);
	}, this);
};