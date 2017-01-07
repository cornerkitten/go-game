
const loadedSprites_ = Symbol('loadedSprites');
const sprites_ = Symbol('sprites');

export default class SpriteLoader {
	constructor(sprites) {
		this[sprites_] = sprites;
		this[loadedSprites_] = 0;
	}

	load(callback) {
		let totalSprites = this[sprites_].length;

		this[sprites_].forEach((sprite) => {
			sprite.load(() => {
				this[loadedSprites_]++;

				if (this[loadedSprites_] === totalSprites) {
					callback();
				}
			});
		});
	}
}
