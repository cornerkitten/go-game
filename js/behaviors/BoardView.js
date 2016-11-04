
import sprites from 'resources/sprites';
import Player from 'Player';

let _entityManager = new WeakMap();

function modelToViewPos(x, y) {
	return {
		x: x * 64 - 12,
		y: y * 64 - 12
	};
}

// TODO Change exports to not be single object sent as default
export default class BoardView {
	constructor(entityManager) {
		_entityManager.set(this, entityManager);
	}

	onPlaceStone(e) {
		let sprite = sprites.blackStone;
		if (e.detail.player === Player.WHITE) {
			sprite = sprites.whiteStone;
		}

		let viewPos = modelToViewPos(e.detail.x, e.detail.y);

		let stone = _entityManager.get(this).create({
			transform: {
				x: viewPos.x,
				y: viewPos.y
			},
			spriteRenderer: {
				sprite: sprite
			}
		});

		// TODO Consider whether stones should be added as children to
		//      this behavior's entity
		_entityManager.get(this).add(stone);
	}
}
