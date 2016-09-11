/*eslint no-console: "off"*/

var setup = function() {
	const CANVAS_ID = 'game-board';
	const GAME_BOARD_IMG_SRC = 'img/game-board.png';

	console.info('SETUP()');

	var gameBoard = document.getElementById(CANVAS_ID);
	var ctx = gameBoard.getContext('2d');
	var boardImage = new Image();

	gameBoard.width = parseInt(window.getComputedStyle(gameBoard).width);
	gameBoard.height = parseInt(window.getComputedStyle(gameBoard).height);

	boardImage.onload = function() {
		console.info('IMAGE LOADED');
		ctx.drawImage(boardImage, 0, 0, gameBoard.width, gameBoard.height);
	};
	
	boardImage.src = GAME_BOARD_IMG_SRC;
};

window.onload = setup;