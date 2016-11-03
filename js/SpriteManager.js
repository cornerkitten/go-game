
// TODO Move this.sprites and this.loadedSprites into private fields
export default class SpriteManager {
	// TODO Refactor so that this.sprites is merely an array of sprites
	constructor(sprites) {
		// TODO Hide unnecessary public fields
		this.sprites = sprites;
		this.loadedSprites = 0;
	}

	load(callback) {
		let totalSprites = Object.keys(this.sprites).length;

		this.sprites.forEach((sprite) => {
			sprite.load(() => {
				this.loadedSprites++;

				if (this.loadedSprites == totalSprites) {
					callback();
				}
			});
		});
	}
}
