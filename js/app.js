/*global SpriteRenderer*/
/*eslint no-console: "off"*/

var setup = function() {
	const CANVAS_ID = 'game';
	const GAME_BOARD_IMG_SRC = 'img/game-board.png';
	const STONE_IMG_SRC = 'img/go-stone-black.png';

	var gameCanvas = document.getElementById(CANVAS_ID);
	gameCanvas.width = parseInt(window.getComputedStyle(gameCanvas).width);
	gameCanvas.height = parseInt(window.getComputedStyle(gameCanvas).height);
	var ctx = gameCanvas.getContext('2d');
	var spriteRenderer = new SpriteRenderer(ctx);
	
	spriteRenderer.preloadSprite(GAME_BOARD_IMG_SRC, () => {
		spriteRenderer.render(GAME_BOARD_IMG_SRC, {x:0, y:0});

		spriteRenderer.preloadSprite(STONE_IMG_SRC, () => {
			spriteRenderer.render(STONE_IMG_SRC, {x:16, y:16});
		});
	});

	gameCanvas.onmousemove = (e) => {
		console.info(e);
		spriteRenderer.render(GAME_BOARD_IMG_SRC, {x:0, y:0});
		spriteRenderer.render(STONE_IMG_SRC, {x:e.offsetX-43, y:e.offsetY-43});
	};
};

window.onload = setup;

