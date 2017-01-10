
import Player from './Player';

// Private properties for GameState
const currentTurn_ = Symbol('currentTurn');
const boardSize_ = Symbol('boardSize');
const board_ = Symbol('board');

function newBoard(boardSize) {
  const board = new Array(boardSize);
  for (let i = 0; i < boardSize; i += 1) {
    board[i] = new Array(boardSize);
  }

  return board;
}

function hasPlayedAt(board, x, y) {
  return board[x][y] !== undefined;
}

function adjacentPositions(board, x, y) {
  const positions = [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ];
  return positions.filter(pos => pos.x >= 0 && pos.x < board.length &&
    pos.y >= 0 && pos.y < board.length);
}

function chainAtPos(board, x, y, player, chain, liberties) {
  if (x < 0 || x >= board.length || y < 0 || y >= board.length ||
    chain.find(pos => pos.x === x && pos.y === y) ||
    liberties.find(pos => pos.x === x && pos.y === y)) {
    return;
  } else if (board[x][y] === undefined) {
    liberties.push({ x, y });
    return;
  } else if (board[x][y] !== player) {
    return;
  }
  chain.push({ x, y });
  adjacentPositions(board, x, y).forEach((pos) => {
    chainAtPos(board, pos.x, pos.y, player, chain, liberties);
  });
}

function adjacentChains(board, x, y, player) {
  const chains = [];
  adjacentPositions(board, x, y).forEach((pos) => {
    const hasPosInChainAlready = chains.find(
      chain => chain.stones.find(
        stone => stone.x === pos.x && stone.y === pos.y
      )
    );
    if (hasPosInChainAlready) {
      return;
    }

    const chainStones = [];
    const chainLiberties = [];
    chainAtPos(board, pos.x, pos.y, player, chainStones, chainLiberties);
    if (chainStones.length > 0) {
      chains.push({
        stones: chainStones,
        liberties: chainLiberties,
      });
    }
  });

  return chains;
}

/* eslint-disable no-param-reassign */
function captureStones(board, stones) {
  stones.forEach((stone) => {
    board[stone.x][stone.y] = undefined;
  });
}
/* eslint-enable no-param-reassign */

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
    if (hasPlayedAt(this[board_], x, y)) {
      return null;
    }

    this[board_][x][y] = this[currentTurn_];

    let newTurn = Player.BLACK;
    if (this[currentTurn_] === Player.BLACK) {
      newTurn = Player.WHITE;
    }

    const adjacentEnemyChains = adjacentChains(this[board_], x, y, newTurn);
    const capturedChains = [];
    adjacentEnemyChains.forEach((chain) => {
      if (chain.liberties.length === 0) {
        captureStones(this[board_], chain.stones);
        capturedChains.push(chain);
      }
    });

    const liberties = [];
    chainAtPos(this[board_], x, y, this[currentTurn_], [], liberties);
    if (liberties.length === 0) {
      this[board_][x][y] = undefined;
      return null;
    }

    this[currentTurn_] = newTurn;

    return capturedChains;
  }
}
