
// TODO Move this.sprites and this.loadedSprites into private fields
export default class SpriteManager {
	// TODO Refactor so that this.sprites is merely an array of sprites
	constructor(sprites) {
		this.sprites = sprites;
		this.loadedSprites = 0;
	}

	load(callback) {
		let totalSprites = Object.keys(this.sprites).length;

		Object.keys(this.sprites).forEach((key) => {
			this.sprites[key].load(() => {
				this.loadedSprites++;

				if (this.loadedSprites == totalSprites) {
					callback();
				}
			});
		});
	}
}
