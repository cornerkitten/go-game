/*eslint no-console: "off"*/

// import GameState from 'GameState';
import sprites from 'resources/sprites';
import SpriteLoader from 'SpriteLoader';
import CanvasView from 'CanvasView';
import SpriteFactory from 'SpriteFactory';
import EntityManager from 'EntityManager';
import BoardBehavior from 'behaviors/BoardBehavior';
import previewStoneBlueprint from 'blueprints/previewStoneBlueprint';

// Private properties
let _view = new WeakMap();
let _eventDispatcher = new WeakMap();
let _entityManager = new WeakMap();
let _spriteFactory = new WeakMap();

export default class GameEngine {
	constructor() {
	}

	init(boardSize, documentHandle, canvasId) {
		let eventDispatcher = documentHandle.getElementById(canvasId);
		_eventDispatcher.set(this, eventDispatcher);

		_view.set(this, new CanvasView(documentHandle, canvasId));
		_spriteFactory.set(this, new SpriteFactory(documentHandle));
		_entityManager.set(this, new EntityManager(eventDispatcher));

		let spritesToLoad = [
			sprites.gameBoard,
			sprites.blackStone,
			sprites.whiteStone
		];
		let spriteLoader = new SpriteLoader(spritesToLoad);
		// TODO Adjust sprite architecture so that quirky buffer assignment
		//      does not need to manually occur from GameEngine.
		spritesToLoad.forEach( (sprite) => {
			sprite.buffer = documentHandle.createElement('canvas');
		});
		spriteLoader.load(() => {
			this.onStart(boardSize);
		});
	}

	// TODO Rename to start()
	onStart(boardSize) {
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
					component: BoardBehavior
				}
			]
			// TODO Implement gesture regions
			//      e.g. gestureRegion: new RectangleShape(64, 64)
		});
		let boardSetupEvent = new CustomEvent('onSetup', {
			detail: {
				boardSize: boardSize
			}
		});
		gameBoard.dispatchEvent(boardSetupEvent);

		let grid = entityManager.create({
			transform: {
				x: 0,
				y: 0
			},
			spriteRenderer: {
				sprite: spriteFactory.squareGrid(32, 32, boardSize, 64, 0.5, 'black')
			}
		});
		gameBoard.addChild(grid);
		entityManager.add(gameBoard);

		let previewStone = entityManager.create(previewStoneBlueprint);
		entityManager.add(previewStone);

		// TODO Consider refactoring as commands
		// gameState.placeStone(7, 7);
		// gameState.placeStone(6, 6);
		// gameState.placeStone(2, 2);
		// gameState.placeStone(3, 2);
		// gameState.placeStone(5, 2);
		// gameState.placeStone(4, 4);
		// gameState.placeStone(2, 6);

		this.step();
	}

	step() {
		_entityManager.get(this).step();
		_entityManager.get(this).draw(_view.get(this));
		requestAnimationFrame(this.step.bind(this));
	}
}
