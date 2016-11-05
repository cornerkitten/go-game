
// Private properties
let _sprite = new WeakMap();

export default class SpriteRenderer {
	constructor(sprite) {
		_sprite.set(this, sprite);
	}

	get sprite() {
		return _sprite.get(this);
	}

	set sprite(newSprite) {
		_sprite.set(this, newSprite);
	}
}
