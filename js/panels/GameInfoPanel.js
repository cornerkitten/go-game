/*eslint no-console: "off"*/

import Player from 'Player';

let _panelElement = new WeakMap();
let _gameElement = new WeakMap();
let _captures = new WeakMap();

export default class GameInfoPanel {
	constructor(panelElement, gameElement) {
		_panelElement.set(this, panelElement);
		_gameElement.set(this, gameElement);

		let captures = [];
		captures[Player.BLACK] = 0;
		captures[Player.WHITE] = 0;
		_captures.set(this, captures);
	}

	init() {
		_gameElement.get(this).addEventListener('onNewTurn', this.onPlayerChange.bind(this));
		_gameElement.get(this).addEventListener('onCaptureStone', this.onCaptureStone.bind(this));
		setCurrentPlayer(_panelElement.get(this), Player.BLACK);
		updateCapturedStones(_panelElement.get(this), Player.BLACK, 0);
		updateCapturedStones(_panelElement.get(this), Player.WHITE, 0);
	}

	onPlayerChange(e) {
		setCurrentPlayer(_panelElement.get(this), e.detail.player);
	}

	onCaptureStone(e) {
		let captures = _captures.get(this)[e.detail.captor];
		captures++;
		_captures.get(this)[e.detail.captor] = captures;
		updateCapturedStones(_panelElement.get(this), e.detail.captor, captures);
	}
}

function setCurrentPlayer(panelElement, player) {
	let otherPlayer = Player.BLACK;
	if (player === Player.BLACK) {
		otherPlayer = Player.WHITE;
	}

	playerInfoElement(panelElement, otherPlayer).classList.remove('current-player');
	playerInfoElement(panelElement, player).classList.add('current-player');
}

function playerInfoElement(panelElement, player) {
	let playerClass = 'player-1';
	if (player === Player.WHITE) {
		playerClass = 'player-2';
	}

	return panelElement.getElementsByClassName(playerClass)[0];
}

function updateCapturedStones(panelElement, player, count) {
	let capturedStonesElement = playerInfoElement(panelElement, player).getElementsByClassName('captured-stones')[0];
	capturedStonesElement.textContent = count;
}
