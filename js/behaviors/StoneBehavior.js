
import sprites from 'resources/sprites';
import Player from 'Player';

let _boardPos = new WeakMap();
let _entity = new WeakMap();

export default class StoneBehavior {
	constructor(params, entity) {
		_entity.set(this, entity);
	}

	onSetup(e) {
		let sprite = sprites.blackStone;
		if (e.detail.player === Player.WHITE) {
			sprite = sprites.whiteStone;
		}
		_entity.get(this).spriteRenderer.sprite = sprite;

		_entity.get(this).transform.x = e.detail.viewPosition.x;
		_entity.get(this).transform.y = e.detail.viewPosition.y;
		_boardPos.set(this, e.detail.boardPosition);
	}

	onCaptureStone(e) {
		let myPos = _boardPos.get(this);
		if (e.detail.x === myPos.x && e.detail.y === myPos.y) {
			this.world.destroyEntity(_entity.get(this));
		}
	}
}
