/*eslint no-console: "off"*/

// import GameState from 'GameState';
import sprites from 'resources/sprites';
import SpriteLoader from 'SpriteLoader';
import CanvasView from 'CanvasView';
import SpriteFactory from 'SpriteFactory';
import EntityManager from 'EntityManager';
import boardBlueprint from 'blueprints/BoardBlueprint';

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
			this.start(boardSize);
		});
	}

	// TODO Rename to start()
	start(boardSize) {
		let gameBoard = _entityManager.get(this).add(boardBlueprint);
		let boardSetupEvent = new CustomEvent('onSetup', {
			detail: {
				boardSize: boardSize,
				spriteFactory: _spriteFactory.get(this)
			}
		});
		gameBoard.dispatchEvent(boardSetupEvent);

		this.step();
	}

	step() {
		_entityManager.get(this).step();
		_entityManager.get(this).draw(_view.get(this));
		requestAnimationFrame(this.step.bind(this));
	}
}
