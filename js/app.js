//global SpriteRenderer
/*eslint no-console: "off"*/

// class GoBoard {
//
// }

// TODO Rename to "player"
let Player = {
	BLACK: Symbol('black'),
	WHITE: Symbol('white')
};
Object.freeze(Player);

// Private properties for GameState
let _currentTurn = new WeakMap();
let _boardSize = new WeakMap();
let _board = new WeakMap();
function newBoard(boardSize) {
	let board = new Array(boardSize);
	for (let i = 0; i < boardSize; i++) {
		board[i] = new Array(boardSize);
	}

	return board;
}
class GameState {
	constructor(boardSize) {
		_currentTurn.set(this, Player.BLACK);

		_boardSize.set(this, boardSize);
		_board.set(this, newBoard(boardSize));

	}

	get currentTurn() {
		return _currentTurn.get(this);
	}

	placeStone(x, y) {
		let board = _board.get(this);
		board[x][y] = _currentTurn.get(this);

		if (_currentTurn.get(this) === Player.BLACK) {
			_currentTurn.set(this, Player.WHITE);
		} else {
			_currentTurn.set(this, Player.BLACK);
		}
	}
}

class Sprite {
	constructor(source) {
		this.source = source;
		this.image = new Image();
		this.isLoaded = false;
	}

	load(callback) {
		if (this.isLoaded) {
			callback();
			return;
		}

		this.image.onload = () => {
			this.isLoaded = true;
			callback();
		};
		this.image.src = this.source;
	}
}

let sprites = {
	gameBoard: new Sprite('img/go-board-wood-576px.png'),
	blackStone: new Sprite('img/go-stone-black.png'),
	whiteStone: new Sprite('img/go-stone-white.png')
};

// TODO Move this.sprites and this.loadedSprites into private fields
class SpriteManager {
	// TODO Refactor so that this.sprites is merely an array of sprites
	constructor(sprites) {
		this.sprites = sprites;
		this.loadedSprites = 0;
	}

	load(callback) {
		let totalSprites = Object.keys(this.sprites).length;

		Object.keys(this.sprites).forEach((key) => {
			this.sprites[key].load(() => {
				this.loadedSprites++;

				if (this.loadedSprites == totalSprites) {
					callback();
				}
			});
		});
	}
}

// Private properties for CanvasView
let _ctx = new WeakMap();
let _canvas = new WeakMap();
function setCanvasSizeToWindow(canvas, windowHandle) {
	canvas.width = parseInt(windowHandle.getComputedStyle(canvas).width);
	canvas.height = parseInt(windowHandle.getComputedStyle(canvas).height);
}
class CanvasView {
	// TODO Consider whether constructor should only have a single parameter
	//      passed (i.e. canvas), so that there is no dependency on document
	constructor(documentHandle, canvasId) {
		let canvas = documentHandle.getElementById(canvasId);
		_canvas.set(this, canvas);
		_ctx.set(this, canvas.getContext('2d'));

		// TODO Consider whether it's good to assume that
		//      defaultView is non-null
		setCanvasSizeToWindow(canvas, documentHandle.defaultView);
	}

	drawSprite(sprite, x, y) {
		_ctx.get(this).drawImage(sprite.image, x, y, sprite.image.width,
			sprite.image.height);
	}

	drawCanvas(canvas, x, y) {
		_ctx.get(this).drawImage(canvas, x, y, canvas.width, canvas.height);
	}
}

// Private properties for CanvasSpriteFactory
let _document = new WeakMap();
class CanvasSpriteFactory {
	constructor(documentHandle) {
		_document.set(this, documentHandle);
	}

	squareGrid(offsetX, offsetY, gridSize, cellSize, thickness, color) {
		let canvas = _document.get(this).createElement('canvas');
		canvas.width = offsetX + gridSize * cellSize;
		canvas.height = offsetY + gridSize * cellSize;

		let ctx = canvas.getContext('2d');

		ctx.lineWidth = thickness;
		ctx.strokeStyle = color;
		ctx.beginPath();
		for (let i = 0; i < gridSize; i++) {
			ctx.moveTo(offsetX + i * cellSize, offsetY);
			ctx.lineTo(offsetX + i * cellSize, offsetY + (gridSize - 1) * cellSize);
			ctx.moveTo(offsetX, offsetY + i * cellSize);
			ctx.lineTo(offsetX + (gridSize - 1) * cellSize, offsetY + i * cellSize);
		}
		ctx.stroke();

		return canvas;
	}
}

let GameEngine = (() => {
	// Private properties
	let _view = new WeakMap();
	let _canvasSprites = new WeakMap();

	class GameEngine {
		constructor() {
		}

		// TODO Make sure setup is called as
		//      setup(9, document, 'game')
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

	return GameEngine;
})();

window.onload = () => {
	let gameEngine = new GameEngine();
	gameEngine.init(9, document, 'game');
};
