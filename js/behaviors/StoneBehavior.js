
import sprites from 'resources/sprites';
import Player from 'Player';
import SpriteRenderer from 'components/SpriteRenderer';
import Transform from 'components/Transform';

let _boardPos = new WeakMap();
let _isBeingCaptured = new WeakMap();

export default class StoneBehavior {
	constructor() {
		_isBeingCaptured.set(this, false);
	}

	onSetup(e) {
		let sprite = sprites.blackStone;
		if (e.detail.player === Player.WHITE) {
			sprite = sprites.whiteStone;
		}
		let spriteRenderer = this.owner.getComponent(SpriteRenderer);
		spriteRenderer.sprite = sprite;

		let transform = this.owner.getComponent(Transform);
		transform.x = e.detail.viewPosition.x;
		transform.y = e.detail.viewPosition.y;
		transform.scaleX = e.detail.cellSize / sprite.width * 0.95;
		transform.scaleY = e.detail.cellSize / sprite.height * 0.95;

		let origin = spriteRenderer.origin;
		origin.x = sprite.width / 2;
		origin.y = sprite.height / 2;

		_boardPos.set(this, e.detail.boardPosition);
	}

	onCaptureStone(e) {
		let myPos = _boardPos.get(this);
		if (e.detail.x === myPos.x && e.detail.y === myPos.y) {
			_isBeingCaptured.set(this, true);
		}
	}

	onStep() {
		if (_isBeingCaptured.get(this)) {
			let transform = this.owner.getComponent(Transform);
			let scaleDelta = -0.1;
			transform.scaleX += scaleDelta;
			transform.scaleY += scaleDelta;

			if (transform.scaleX < 0) {
				this.world.destroyEntity(this.owner);
			}
		}
	}
}
