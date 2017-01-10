
import sprites from '../resources/sprites';
import Player from '../Player';
import SpriteRenderer from '../components/SpriteRenderer';
import Transform from '../components/Transform';

const boardPos_ = Symbol('boardPos');
const isBeingCaptured_ = Symbol('isBeingCaptured');

export default class StoneBehavior {
  constructor() {
    this[isBeingCaptured_] = false;
    this[boardPos_] = undefined;
  }

  onSetup(e) {
    let sprite = sprites.blackStone;
    if (e.detail.player === Player.WHITE) {
      sprite = sprites.whiteStone;
    }
    const spriteRenderer = this.owner.getComponent(SpriteRenderer);
    spriteRenderer.sprite = sprite;

    const transform = this.owner.getComponent(Transform);
    transform.x = e.detail.viewPosition.x;
    transform.y = e.detail.viewPosition.y;
    transform.scaleX = (e.detail.cellSize / sprite.width) * 0.95;
    transform.scaleY = (e.detail.cellSize / sprite.height) * 0.95;

    const origin = spriteRenderer.origin;
    origin.x = sprite.width / 2;
    origin.y = sprite.height / 2;

    this[boardPos_] = e.detail.boardPosition;
  }

  onCaptureStone(e) {
    if (e.detail.x === this[boardPos_].x && e.detail.y === this[boardPos_].y) {
      this[isBeingCaptured_] = true;
    }
  }

  onStep() {
    if (this[isBeingCaptured_]) {
      const transform = this.owner.getComponent(Transform);
      const scaleDelta = -0.1;
      transform.scaleX += scaleDelta;
      transform.scaleY += scaleDelta;

      if (transform.scaleX < 0) {
        this.world.destroyEntity(this.owner);
      }
    }
  }
}
