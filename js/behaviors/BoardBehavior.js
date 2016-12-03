
import stoneBlueprint from 'blueprints/stoneBlueprint';
import GameState from 'GameState';
import Transform from 'components/Transform';

let _gameState = new WeakMap();
let _cellSize = new WeakMap();

export default class BoardBehavior {
	constructor() {
	}

	onSetup(e) {
		_gameState.set(this, new GameState(e.detail.boardSize));
		_cellSize.set(this, e.detail.cellSize);

		let transform = this.owner.getComponent(Transform);
		transform.scaleX = 2; // TODO Accomodate for all devices
		transform.scaleY = 2; // TODO Accomodate for all devices

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
		let viewPos = modelToViewPos(e.detail.x, e.detail.y, _cellSize.get(this));

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
				cellSize: _cellSize.get(this),
				player: e.detail.player
			}
		});
		stone.dispatchEvent(setupEvent);
	}

	// TODO Consider refactoring as GestureTap (to encompass mouse and touch)
	click(e) {
		let modelPos = viewToModelPos(e.offsetX, e.offsetY, _cellSize.get(this));
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
function modelToViewPos(x, y, cellSize) {
	return {
		x: x * cellSize + cellSize / 2,
		y: y * cellSize + cellSize / 2
	};
}

// TODO Refactor into shared location
function viewToModelPos(x, y, cellSize) {
	// TODO Consider accuracy of calculation, with respect to drawn grid
	// TODO Generalize calculation to any board size (e.g. 13 x 13, 19 x19)
	return {
		x: Math.floor(x / cellSize),
		y: Math.floor(y / cellSize)
	};
}
