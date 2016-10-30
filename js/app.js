
import GameEngine from 'GameEngine';

window.onload = () => {
	let gameEngine = new GameEngine();
	gameEngine.init(9, document, 'game');
};
