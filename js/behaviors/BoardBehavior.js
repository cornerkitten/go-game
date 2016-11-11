
import stoneBlueprint from 'blueprints/stoneBlueprint';
import GameState from 'GameState';

let _gameState = new WeakMap();

export default class BoardBehavior {
	constructor() {
	}

	onSetup(e) {
		_gameState.set(this, new GameState(e.detail.boardSize));

		// Sample setup
		// gameState.placeStone(7, 7);
		// gameState.placeStone(6, 6);
		// gameState.placeStone(2, 2);
		// gameState.placeStone(3, 2);
		// gameState.placeStone(5, 2);
		// gameState.placeStone(4, 4);
		// gameState.placeStone(2, 6);
	}

	onPlaceStone(e) {
		let viewPos = modelToViewPos(e.detail.x, e.detail.y);

		// TODO Consider whether stones should be added as children to
		//      this behavior's entity
		let stone = this.world.addEntity(stoneBlueprint);

		let setupEvent = new CustomEvent('onSetup', {
			detail: {
				viewPosition: {
					x: viewPos.x,
					y: viewPos.y
				},
				boardPosition: {
					x: e.detail.x,
					y: e.detail.y
				},
				player: e.detail.player
			}
		});
		stone.dispatchEvent(setupEvent);
	}

	// TODO Consider refactoring as GestureTap (to encompass mouse and touch)
	click(e) {
		let modelPos = viewToModelPos(e.offsetX, e.offsetY);
		let gameState = _gameState.get(this);
		let turn = gameState.currentTurn;

		// TODO Make sure that stone is only for legal moves
		let capturedChains = gameState.placeStone(modelPos.x, modelPos.y);

		// Move is illegal
		if (capturedChains == null) {
			return;
		}

		let event = new CustomEvent('onPlaceStone', {
			detail: {
				player: turn,
				x: modelPos.x,
				y: modelPos.y
			}
		});
		this.world.dispatchEvent(event);

		capturedChains.forEach((chain) => {
			chain.stones.forEach((stone) => {
				let captureEvent = new CustomEvent('onCaptureStone', {
					detail: {
						captor: turn,
						x: stone.x,
						y: stone.y
					}
				});
				this.world.dispatchEvent(captureEvent);
			});
		});

		let newTurnEvent = new CustomEvent('onNewTurn', {
			detail: {
				player: _gameState.get(this).currentTurn
			}
		});
		this.world.dispatchEvent(newTurnEvent);
	}
}

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
