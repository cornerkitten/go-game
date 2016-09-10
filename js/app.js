/*eslint no-console: "off"*/

var setup = function() {
	const CANVAS_ID = 'game-board';
	const CANVAS_WIDTH = 800;
	const CANVAS_HEIGHT = 800;
	const GAME_BOARD_IMG_SRC = 'img/game-board.png';

	console.info('SETUP()');

	var gameBoard = document.getElementById(CANVAS_ID);
	var ctx = gameBoard.getContext('2d');
	var boardImage = new Image();

	gameBoard.width = CANVAS_WIDTH;
	gameBoard.height = CANVAS_HEIGHT;
	boardImage.onload = function() {
		console.info('IMAGE LOADED');
		ctx.drawImage(boardImage, 0, 0, gameBoard.width, gameBoard.height);
	};
	boardImage.src = GAME_BOARD_IMG_SRC;
};

window.onload = setup;