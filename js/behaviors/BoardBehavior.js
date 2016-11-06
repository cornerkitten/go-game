
import sprites from 'resources/sprites';
import Player from 'Player';
import StoneBehavior from 'StoneBehavior';

let _entityManager = new WeakMap();
let _gameState = new WeakMap();

// TODO Consider accuracy of calculation, with respect to drawn grid
// TODO Generalize calculation to any board size (e.g. 13 x 13, 19 x19)
// TODO Refactor into shared location
function modelToViewPos(x, y) {
	return {
		x: x * 64 - 12,
		y: y * 64 - 12
	};
}

// TODO Refactor into shared location
function viewToModelPos(x, y) {
	// TODO Consider accuracy of calculation, with respect to drawn grid
	// TODO Generalize calculation to any board size (e.g. 13 x 13, 19 x19)
	return {
		x: Math.floor(x / 64),
		y: Math.floor(y / 64)
	};
}

export default class BoardBehavior {
	constructor(params) {
		_entityManager.set(this, params.entityManager);
		_gameState.set(this, params.gameState);
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
			},
			behaviors: [
				{
					component: StoneBehavior,
					params: {
						entityManager: _entityManager.get(this),
						boardPos: {
							x: e.detail.x,
							y: e.detail.y
						}
					}
				}
			]
		});

		// TODO Consider whether stones should be added as children to
		//      this behavior's entity
		_entityManager.get(this).add(stone);
	}

	// TODO Consider refactoring as GestureTap (to encompass mouse and touch)
	click(e) {
		let modelPos = viewToModelPos(e.offsetX, e.offsetY);

		// TODO Make sure that stone is only for legal moves
		_gameState.get(this).placeStone(modelPos.x, modelPos.y);
	}
}
