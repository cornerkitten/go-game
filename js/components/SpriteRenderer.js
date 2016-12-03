
// Private properties
let _sprite = new WeakMap();
let _alpha = new WeakMap();
let _origin = new WeakMap();

export default class SpriteRenderer {
	constructor(sprite, alpha) {
		_sprite.set(this, sprite);

		if (alpha === undefined) {
			alpha = 1;
		}
		_alpha.set(this, alpha);
		_origin.set(this, {x: 0, y: 0});
	}

	get sprite() {
		return _sprite.get(this);
	}

	set sprite(newSprite) {
		_sprite.set(this, newSprite);
	}

	get alpha() {
		return _alpha.get(this);
	}

	set alpha(newAlpha) {
		return _alpha.set(this, newAlpha);
	}

	get origin() {
		return _origin.get(this);
	}
}
