/*eslint no-console: "off"*/

import GameState from 'GameState';
import sprites from 'resources/sprites';
import SpriteManager from 'SpriteManager';
import CanvasView from 'CanvasView';
import SpriteFactory from 'SpriteFactory';
import EntityManager from 'EntityManager';
import BoardView from 'behaviors/BoardView';

// Private properties
let _view = new WeakMap();
let _eventDispatcher = new WeakMap();
let _entityManager = new WeakMap();
let _gameState = new WeakMap();
let _spriteFactory = new WeakMap();

function drawEntities(view, entities) {
	entities.forEach( (entity) => {
		// TODO Check if entity has sprite
		view.draw(entity.spriteRenderer.sprite.buffer, entity.transform.x, entity.transform.y);
		drawEntities(view, entity.children);
	});
}

export default class GameEngine {
	constructor() {
	}

	init(boardSize, documentHandle, canvasId) {
		let eventDispatcher = documentHandle.createElement('div');
		_eventDispatcher.set(this, eventDispatcher);

		_gameState.set(this, new GameState(eventDispatcher, boardSize));
		_view.set(this, new CanvasView(documentHandle, canvasId));
		_spriteFactory.set(this, new SpriteFactory(documentHandle));
		_entityManager.set(this, new EntityManager(eventDispatcher));

		// TODO Consider renaming class SpriteManager to SpriteLoader
		let spriteManager = new SpriteManager([
			sprites.gameBoard,
			sprites.blackStone,
			sprites.whiteStone
		]);
		// TODO Adjust sprite architecture so that quirky buffer assignment
		//      does not need to manually occur from GameEngine.
		spriteManager.sprites.forEach( (sprite) => {
			sprite.buffer = documentHandle.createElement('canvas');
		});
		spriteManager.load(this.onStart.bind(this));

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

	onStart() {
		let gameState = _gameState.get(this);
		let spriteFactory = _spriteFactory.get(this);
		let entityManager = _entityManager.get(this);

		// TODO Change Entity constructor interface to merely accept a
		//      configuration, not pre-assigned references and such
		let gameBoard = entityManager.create({
			transform: {
				x: 0,
				y: 0
			},
			spriteRenderer: {
				sprite: sprites.gameBoard
			},
			behaviors: [
				BoardView
			]
			// gestureRegion: new RectangleShape(64, 64)
		});
		let grid = entityManager.create({
			transform: {
				x: 0,
				y: 0
			},
			spriteRenderer: {
				sprite: spriteFactory.squareGrid(32, 32, gameState.boardSize, 64, 0.5, 'black')
			}
		});
		gameBoard.addChild(grid);
		entityManager.add(gameBoard);

		// TODO Consider refactoring as commands
		gameState.placeStone(7, 7);
		gameState.placeStone(6, 6);
		gameState.placeStone(2, 2);
		gameState.placeStone(3, 2);
		gameState.placeStone(5, 2);
		gameState.placeStone(4, 4);
		gameState.placeStone(2, 6);

		this.step();
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

	step() {
		// _view.get(this).drawSprite(sprites.gameBoard, 0, 0);
		// _view.get(this).drawCanvas(_canvasSprites.get(this).grid, 0, 0);
		drawEntities(_view.get(this), _entityManager.get(this).entities);
		requestAnimationFrame(this.step.bind(this));
	}
}
