/*eslint no-console: "off"*/

import Player from 'Player';

let _panelElement = new WeakMap();
let _gameElement = new WeakMap();

export default class GameInfoPanel {
	constructor(panelElement, gameElement) {
		_panelElement.set(this, panelElement);
		_gameElement.set(this, gameElement);
	}

	init() {
		_gameElement.get(this).addEventListener('onNewTurn', this.onPlayerChange.bind(this));
		setCurrentPlayer(_panelElement.get(this), Player.BLACK);
	}

	onPlayerChange(e) {
		setCurrentPlayer(_panelElement.get(this), e.detail.player);
	}
}

function setCurrentPlayer(panelElement, player) {
	let currentPlayerClass = 'player-1';
	let otherPlayerClass = 'player-2';
	if (player === Player.WHITE) {
		currentPlayerClass = 'player-2';
		otherPlayerClass = 'player-1';
	}

	panelElement.getElementsByClassName(otherPlayerClass)[0].classList.remove('current-player');
	panelElement.getElementsByClassName(currentPlayerClass)[0].classList.add('current-player');
}
