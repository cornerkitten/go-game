
import GameEngine from 'GameEngine';
import GameInfoPanel from 'panels/GameInfoPanel';

window.onload = () => {
	let gameEngine = new GameEngine();
	gameEngine.init(9, document, 'game');

	let gameInfoElement = document.getElementById('game-info');
	let gameElement = document.getElementById('game');
	let gameInfoPanel = new GameInfoPanel(gameInfoElement, gameElement);
	gameInfoPanel.init();
};
