/*eslint no-console: "off"*/

import Player from 'Player';

// Private properties for GameState
let _currentTurn = new WeakMap();
let _boardSize = new WeakMap();
let _board = new WeakMap();
let _eventDispatcher = new WeakMap();
function newBoard(boardSize) {
	let board = new Array(boardSize);
	for (let i = 0; i < boardSize; i++) {
		board[i] = new Array(boardSize);
	}

	return board;
}
function hasPlayedAt(board, x, y) {
	return board[x][y] !== undefined;
}
function adjacentPositions(board, x, y) {
	let positions = [
		{x: x - 1,	y: y},
		{x: x + 1,	y: y},
		{x: x,		y: y - 1},
		{x: x,		y: y + 1}
	];
	return positions.filter(pos => pos.x >= 0 && pos.x < board.length &&
		pos.y >= 0 && pos.y < board.length);
}
function adjacentChains(board, x, y, player) {
	let chains = [];
	adjacentPositions(board, x, y).forEach((pos) => {
		let hasPosInChainAlready = chains.find(
			chain => chain.stones.find(
				stone => stone.x === pos.x && stone.y === pos.y
			)
		);
		if (hasPosInChainAlready) {
			return;
		}

		let chainStones = [];
		let chainLiberties = [];
		chainAtPos(board, pos.x, pos.y, player, chainStones, chainLiberties);
		if (chainStones.length > 0) {
			chains.push({
				stones: chainStones,
				liberties: chainLiberties
			});
		}
	});

	return chains;
}
function chainAtPos(board, x, y, player, chain, liberties) {
	if (x < 0 || x >= board.length || y < 0 || y >= board.length ||
		chain.find(pos => pos.x === x && pos.y === y) ||
		liberties.find(pos => pos.x === x && pos.y === y)) {
		return null;
	} else if (board[x][y] === undefined) {
		liberties.push({x: x, y: y});
		return null;
	} else if (board[x][y] !== player) {
		return null;
	}
	chain.push({x:x, y:y});
	adjacentPositions(board, x, y).forEach((pos) => {
		chainAtPos(board, pos.x, pos.y, player, chain, liberties);
	});
}
function captureStones(board, stones) {
	stones.forEach((stone) => {
		board[stone.x][stone.y] = undefined;
	});
}

// TODO Consider refactoring GameState into a behavior of an entity
export default class GameState {
	constructor(eventDispatcher, boardSize) {
		_eventDispatcher.set(this, eventDispatcher);
		_currentTurn.set(this, Player.BLACK);

		_boardSize.set(this, boardSize);
		_board.set(this, newBoard(boardSize));
	}

	get boardSize() {
		return _boardSize.get(this);
	}

	get currentTurn() {
		return _currentTurn.get(this);
	}

	placeStone(x, y) {
		let board = _board.get(this);
		if(hasPlayedAt(board, x, y)) {
			return;
		}

		let turn = _currentTurn.get(this);
		board[x][y] = turn;

		let newTurn = Player.BLACK;
		if (_currentTurn.get(this) === Player.BLACK) {
			newTurn = Player.WHITE;
		}

		let potentialCaptures = adjacentChains(board, x, y, newTurn);
		let capturedChains = [];
		potentialCaptures.forEach((chain) => {
			if (chain.liberties.length === 0) {
				captureStones(board, chain.stones);
				capturedChains.push(chain);
			}
		});

		_currentTurn.set(this, newTurn);

		let event = new CustomEvent('onPlaceStone', {
			detail: {
				player: turn,
				x: x,
				y: y
			}
		});
		_eventDispatcher.get(this).dispatchEvent(event);
		capturedChains.forEach((chain) => {
			chain.stones.forEach((stone) => {
				let captureEvent = new CustomEvent('onCaptureStone', {
					detail: {
						x: stone.x,
						y: stone.y
					}
				});
				_eventDispatcher.get(this).dispatchEvent(captureEvent);
			});
		});
	}
}
