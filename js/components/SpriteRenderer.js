
// Private properties
let sprite_ = Symbol('sprite');
let alpha_ = Symbol('alpha');
let origin_ = Symbol('origin');

export default class SpriteRenderer {
	constructor(sprite, alpha) {
		this[sprite_] = sprite;

		if (alpha === undefined) {
			alpha = 1;
		}
		this[alpha_] = alpha;
		this[origin_] = {x: 0, y: 0};
	}

	get sprite() {
		return this[sprite_];
	}

	set sprite(newSprite) {
		this[sprite_] = newSprite;
	}

	get alpha() {
		return this[alpha_];
	}

	set alpha(newAlpha) {
		return this[alpha_] = newAlpha;
	}

	get origin() {
		return this[origin_];
	}
}
