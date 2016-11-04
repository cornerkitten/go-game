/*eslint no-console: "off"*/

import sprites from 'resources/sprites';
import Player from 'Player';

let _entityManager = new WeakMap();
let _gameState = new WeakMap();

function modelToViewPos(x, y) {
	return {
		x: x * 64 - 12,
		y: y * 64 - 12
	};
}

function viewToModelPos(x, y) {
	return {
		x: Math.floor(x / 64),
		y: Math.floor(y / 64)
	};
}

export default class BoardView {
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
			}
		});

		// TODO Consider whether stones should be added as children to
		//      this behavior's entity
		_entityManager.get(this).add(stone);
	}

	// TODO Consider refactoring as GestureTap (to encompass mouse and touch)
	click(e) {
		console.info('BoardView' + e);

		let modelPos = viewToModelPos(e.offsetX, e.offsetY);
		console.info(modelPos);

		// TODO Make sure that stone is only for legal moves
		_gameState.get(this).placeStone(modelPos.x, modelPos.y);
	}

	// gameCanvas.onmousemove = (e) => {
	//
	// 	let pos = gridSnapPosition({x:e.offsetX, y:e.offsetY});
	// 	let gridPos = gridPosition({x:e.offsetX, y:e.offsetY});
	//
	// 	if (boardModel[gridPos.row][gridPos.col] === BLACK_STONE || boardModel[gridPos.row][gridPos.col] === WHITE_STONE) {
	// 		return;
	// 	}
	//
	// 	spriteRenderer.render(GAME_BOARD_IMG_SRC, {x:0, y:0});
	// 	spriteRenderer.drawGrid(9, 64, 32, 'black');
	// 	spriteRenderer.drawPlayedStones(boardModel);
	//
	// 	let imageSource;
	// 	if (currentTurnColor === BLACK_STONE) {
	// 		imageSource = BLACK_STONE_IMG_SRC;
	// 	} else {
	// 		imageSource = WHITE_STONE_IMG_SRC;
	// 	}
	// 	spriteRenderer.render(imageSource, pos);
	// };
	//
	// gameCanvas.onclick = boardOnClick;
}
