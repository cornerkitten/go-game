
let _loadedSprites = new WeakMap();
let _sprites = new WeakMap();

export default class SpriteManager {
	constructor(sprites) {
		_sprites.set(this, sprites);
		_loadedSprites.set(this, 0);
	}

	load(callback) {
		let totalSprites = _sprites.get(this).length;

		_sprites.get(this).forEach((sprite) => {
			sprite.load(() => {
				_loadedSprites.set(this, _loadedSprites.get(this) + 1);

				if (_loadedSprites.get(this) == totalSprites) {
					callback();
				}
			});
		});
	}

	get sprites() {
		return _sprites.get(this).slice();
	}
}
