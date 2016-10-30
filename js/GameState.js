
import Player from 'Player';

// Private properties for GameState
let _currentTurn = new WeakMap();
let _boardSize = new WeakMap();
let _board = new WeakMap();
function newBoard(boardSize) {
	let board = new Array(boardSize);
	for (let i = 0; i < boardSize; i++) {
		board[i] = new Array(boardSize);
	}

	return board;
}
export default class GameState {
	constructor(boardSize) {
		_currentTurn.set(this, Player.BLACK);

		_boardSize.set(this, boardSize);
		_board.set(this, newBoard(boardSize));

	}

	get currentTurn() {
		return _currentTurn.get(this);
	}

	placeStone(x, y) {
		let board = _board.get(this);
		board[x][y] = _currentTurn.get(this);

		if (_currentTurn.get(this) === Player.BLACK) {
			_currentTurn.set(this, Player.WHITE);
		} else {
			_currentTurn.set(this, Player.BLACK);
		}
	}
}
