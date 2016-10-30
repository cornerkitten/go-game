/*eslint no-console: "off"*/

import GameState from 'GameState';
import sprites from 'resources/sprites';
import SpriteManager from 'SpriteManager';
import CanvasView from 'CanvasView';
import CanvasSpriteFactory from 'CanvasSpriteFactory';

// Private properties
let _view = new WeakMap();
let _canvasSprites = new WeakMap();

export default class GameEngine {
	constructor() {
	}

	init(boardSize, documentHandle, canvasId) {
		let gameState = new GameState(boardSize);
		gameState.placeStone(7, 7);
		gameState.placeStone(6, 6);
		gameState.placeStone(2, 2);
		gameState.placeStone(3, 2);
		gameState.placeStone(5, 2);
		gameState.placeStone(4, 4);
		gameState.placeStone(2, 6);

		_view.set(this, new CanvasView(documentHandle, canvasId));
		let spriteManager = new SpriteManager(sprites);

		let canvasSpriteFactory = new CanvasSpriteFactory(documentHandle);
		_canvasSprites.set(this, {
			grid: canvasSpriteFactory.squareGrid(32, 32, boardSize, 64, 0.5, 'black')
		});

		spriteManager.load(this.step.bind(this));
		// () => {
		// 	documentHandle.defaultView.requestAnimationFrame(step);
		// }
		// let gameBoard = new Entity({
		// 	gestureRegion: new RectangleShape(64, 64),
		// 	spriteRender:
		// 	transform: new Transform(0, 0)
		// })


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

	// function boardOnClick(e) {
	// 	let gamePos = gridPosition({x:e.offsetX, y:e.offsetY});
	//
	// 	boardModel[gamePos.row][gamePos.col] = currentTurnColor;
	//
	// 	if (currentTurnColor === BLACK_STONE) {
	// 		currentTurnColor = WHITE_STONE;
	// 	} else {
	// 		currentTurnColor = BLACK_STONE;
	// 	}
	// }
	//
	// function gridPosition(pos) {
	// 	let col = Math.floor((pos.x) / 64);
	// 	let row = Math.floor((pos.y) / 64);
	//
	// 	if (col < 0) {
	// 		col = 0;
	// 	} else if (col > 8) {
	// 		col = 8;
	// 	}
	//
	// 	if (row < 0) {
	// 		row = 0;
	// 	} else if (row > 8) {
	// 		row = 8;
	// 	}
	//
	// 	return {row:row, col:col};
	// }
	//
	// function gridSnapPosition(pos) {
	// 	let gridPos = gridPosition(pos);
	// 	let snappedPos = {x:gridPos.col*64, y:gridPos.row*64};
	// 	snappedPos.x -= 43 - 32; // half of stone image width - outer margin offset
	// 	snappedPos.y -= 43 - 32; // half of stone image width - outer margin offset
	// 	return snappedPos;
	// }

	step(time) {
		_view.get(this).drawSprite(sprites.gameBoard, 0, 0);
		_view.get(this).drawCanvas(_canvasSprites.get(this).grid, 0, 0);
		console.info(time);
		//requestAnimationFrame(step);
	}
}
