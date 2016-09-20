/*global SpriteRenderer*/
/*eslint no-console: "off"*/

function setup() {
	const CANVAS_ID = 'game';
	const GAME_BOARD_IMG_SRC = 'img/go-board-wood-576px.png';
	const BLACK_STONE_IMG_SRC = 'img/go-stone-black.png';
	const WHITE_STONE_IMG_SRC = 'img/go-stone-white.png';
	const BOARD_SIZE = 9;

	let boardModel = new Array(BOARD_SIZE);
	for (let i = 0; i < BOARD_SIZE; i++) {
		boardModel[i] = new Array(BOARD_SIZE);
	}
	boardModel[6][6] = 'b';
	boardModel[3][2] = 'w';
	boardModel[4][2] = 'w';
	boardModel[2][2] = 'b';
	boardModel[5][2] = 'b';

	var gameCanvas = document.getElementById(CANVAS_ID);
	gameCanvas.width = parseInt(window.getComputedStyle(gameCanvas).width);
	gameCanvas.height = parseInt(window.getComputedStyle(gameCanvas).height);
	var ctx = gameCanvas.getContext('2d');
	var spriteRenderer = new SpriteRenderer(ctx);
	
	spriteRenderer.preloadSprite(GAME_BOARD_IMG_SRC, () => {
		spriteRenderer.render(GAME_BOARD_IMG_SRC, {x:0, y:0});

		spriteRenderer.preloadSprite(WHITE_STONE_IMG_SRC, () => {
			spriteRenderer.preloadSprite(BLACK_STONE_IMG_SRC, () => {
				
				spriteRenderer.drawGrid(9, 64, 32, 'black');
			});
		});
	});

	gameCanvas.onmousemove = (e) => {
		console.info(e);

		let pos = gridSnapPosition({x:e.offsetX, y:e.offsetY});

		spriteRenderer.render(GAME_BOARD_IMG_SRC, {x:0, y:0});
		spriteRenderer.drawGrid(9, 64, 32, 'black');
		spriteRenderer.drawPlayedStones(boardModel);
		spriteRenderer.render(BLACK_STONE_IMG_SRC, pos);
	};
}

function gridSnapPosition(pos) {
	let col = Math.floor((pos.x) / 64);
	let row = Math.floor((pos.y) / 64);

	if (col < 0) {
		col = 0;
	} else if (col > 8) {
		col = 8;
	}

	if (row < 0) {
		row = 0;
	} else if (row > 8) {
		row = 8;
	}

	console.info(col + ',' + row);

	let snappedPos = {x:col*64, y:row*64};
	snappedPos.x -= 43 - 32; // half of stone image width - outer margin offset
	snappedPos.y -= 43 - 32; // half of stone image width - outer margin offset
	return snappedPos;
}

window.onload = setup;

