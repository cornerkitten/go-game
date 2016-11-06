
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
		_currentTurn.set(this, newTurn);

		let event = new CustomEvent('onPlaceStone', {
			detail: {
				player: turn,
				x: x,
				y: y
			}
		});
		_eventDispatcher.get(this).dispatchEvent(event);
	}
}
