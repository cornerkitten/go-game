
import sprites from 'resources/sprites';
import Player from 'Player';
import SpriteRenderer from 'components/SpriteRenderer';
import Transform from 'components/Transform';

let _boardPos = new WeakMap();

export default class StoneBehavior {
	constructor() {
	}

	onSetup(e) {
		let sprite = sprites.blackStone;
		if (e.detail.player === Player.WHITE) {
			sprite = sprites.whiteStone;
		}
		this.owner.getComponent(SpriteRenderer).sprite = sprite;

		this.owner.getComponent(Transform).x = e.detail.viewPosition.x;
		this.owner.getComponent(Transform).y = e.detail.viewPosition.y;
		_boardPos.set(this, e.detail.boardPosition);
	}

	onCaptureStone(e) {
		let myPos = _boardPos.get(this);
		if (e.detail.x === myPos.x && e.detail.y === myPos.y) {
			this.world.destroyEntity(this.owner);
		}
	}
}
