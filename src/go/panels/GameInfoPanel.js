/*eslint no-console: "off"*/

import Player from 'Player';

const panelElement_ = Symbol('panelElement');
const gameElement_ = Symbol('gameElement');
const captures_ = Symbol('captures');

export default class GameInfoPanel {
	constructor(panelElement, gameElement) {
		this[panelElement_] = panelElement;
		this[gameElement_] = gameElement;

		let captures = [];
		captures[Player.BLACK] = 0;
		captures[Player.WHITE] = 0;
		this[captures_] = captures;
	}

	init() {
		this[gameElement_].addEventListener('onNewTurn', this.onPlayerChange.bind(this));
		this[gameElement_].addEventListener('onCaptureStone', this.onCaptureStone.bind(this));
		setCurrentPlayer(this[panelElement_], Player.BLACK);
		updateCapturedStones(this[panelElement_], Player.BLACK, 0);
		updateCapturedStones(this[panelElement_], Player.WHITE, 0);
	}

	onPlayerChange(e) {
		setCurrentPlayer(this[panelElement_], e.detail.player);
	}

	onCaptureStone(e) {
		this[captures_][e.detail.captor] += 1;
		updateCapturedStones(this[panelElement_], e.detail.captor, this[captures_][e.detail.captor]);
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
