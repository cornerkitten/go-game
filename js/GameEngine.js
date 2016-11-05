/*eslint no-console: "off"*/

import GameState from 'GameState';
import sprites from 'resources/sprites';
import SpriteManager from 'SpriteManager';
import CanvasView from 'CanvasView';
import SpriteFactory from 'SpriteFactory';
import EntityManager from 'EntityManager';
import BoardBehavior from 'behaviors/BoardBehavior';

// Private properties
let _view = new WeakMap();
let _eventDispatcher = new WeakMap();
let _entityManager = new WeakMap();
let _gameState = new WeakMap();
let _spriteFactory = new WeakMap();

export default class GameEngine {
	constructor() {
	}

	init(boardSize, documentHandle, canvasId) {
		// let eventDispatcher = documentHandle.createElement('div');
		let eventDispatcher = documentHandle.getElementById(canvasId);
		_eventDispatcher.set(this, eventDispatcher);

		_gameState.set(this, new GameState(eventDispatcher, boardSize));
		_view.set(this, new CanvasView(documentHandle, canvasId));
		_spriteFactory.set(this, new SpriteFactory(documentHandle));
		_entityManager.set(this, new EntityManager(eventDispatcher));

		// TODO Consider renaming class SpriteManager to SpriteLoader
		let spriteManager = new SpriteManager([
			sprites.gameBoard,
			sprites.blackStone,
			sprites.whiteStone
		]);
		// TODO Adjust sprite architecture so that quirky buffer assignment
		//      does not need to manually occur from GameEngine.
		spriteManager.sprites.forEach( (sprite) => {
			sprite.buffer = documentHandle.createElement('canvas');
		});
		spriteManager.load(this.onStart.bind(this));
	}

	onStart() {
		let gameState = _gameState.get(this);
		let spriteFactory = _spriteFactory.get(this);
		let entityManager = _entityManager.get(this);

		// TODO Change Entity constructor interface to merely accept a
		//      configuration, not pre-assigned references and such
		let gameBoard = entityManager.create({
			transform: {
				x: 0,
				y: 0
			},
			spriteRenderer: {
				sprite: sprites.gameBoard
			},
			behaviors: [
				{
					component: BoardBehavior,
					params: {
						entityManager: entityManager,
						gameState: gameState
					}
				}
			]
			// gestureRegion: new RectangleShape(64, 64)
		});
		let grid = entityManager.create({
			transform: {
				x: 0,
				y: 0
			},
			spriteRenderer: {
				sprite: spriteFactory.squareGrid(32, 32, gameState.boardSize, 64, 0.5, 'black')
			}
		});
		gameBoard.addChild(grid);
		entityManager.add(gameBoard);

		// TODO Consider refactoring as commands
		gameState.placeStone(7, 7);
		gameState.placeStone(6, 6);
		gameState.placeStone(2, 2);
		gameState.placeStone(3, 2);
		gameState.placeStone(5, 2);
		gameState.placeStone(4, 4);
		gameState.placeStone(2, 6);

		this.step();
	}

	step() {
		_entityManager.get(this).draw(_view.get(this));
		requestAnimationFrame(this.step.bind(this));
	}
}
