
import Player from 'Player';

// Private properties for GameState
const currentTurn_ = Symbol('currentTurn');
const boardSize_ = Symbol('boardSize');
const board_ = Symbol('board');

// TODO Consider refactoring GameState into a behavior of an entity
export default class GameState {
	constructor(boardSize) {
		this[currentTurn_] = Player.BLACK;
		this[boardSize_] = boardSize;
		this[board_] = newBoard(boardSize);
	}

	get boardSize() {
		return this[boardSize_];
	}

	get currentTurn() {
		return this[currentTurn_];
	}

	// TODO Refactor so that method is smaller/simpler
	placeStone(x, y) {
		if(hasPlayedAt(this[board_], x, y)) {
			return null;
		}

		this[board_][x][y] = this[currentTurn_];

		let newTurn = Player.BLACK;
		if (this[currentTurn_] === Player.BLACK) {
			newTurn = Player.WHITE;
		}

		let adjacentEnemyChains = adjacentChains(this[board_], x, y, newTurn);
		let capturedChains = [];
		adjacentEnemyChains.forEach((chain) => {
			if (chain.liberties.length === 0) {
				captureStones(this[board_], chain.stones);
				capturedChains.push(chain);
			}
		});

		let liberties = [];
		chainAtPos(this[board_], x, y, this[currentTurn_], [], liberties);
		if (liberties.length === 0) {
			this[board_][x][y] = undefined;
			return null;
		}

		this[currentTurn_] = newTurn;

		return capturedChains;
	}
}

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
