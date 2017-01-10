
// Private properties
const sprite_ = Symbol('sprite');
const alpha_ = Symbol('alpha');
const origin_ = Symbol('origin');

export default class SpriteRenderer {
  constructor(sprite, alpha = 1) {
    this[sprite_] = sprite;

    this[alpha_] = alpha;
    this[origin_] = { x: 0, y: 0 };
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
    this[alpha_] = newAlpha;
  }

  get origin() {
    return this[origin_];
  }
}
