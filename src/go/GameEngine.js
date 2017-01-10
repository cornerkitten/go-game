
// import GameState from 'GameState';
import sprites from 'resources/sprites';
import SpriteLoader from 'SpriteLoader';
import CanvasView from 'CanvasView';
import SpriteFactory from 'SpriteFactory';
import EntityManager from 'EntityManager';
import boardBlueprint from 'blueprints/BoardBlueprint';

// Private properties
const view_ = Symbol('view');
const eventDispatcher_ = Symbol('eventDispatcher');
const entityManager_ = Symbol('entityManager');
const spriteFactory_ = Symbol('spriteFactory');

export default class GameEngine {
	constructor() {
	}

	init(boardSize, documentHandle, canvasId) {
		this[eventDispatcher_] = documentHandle.getElementById(canvasId);

		this[view_] = new CanvasView(documentHandle, canvasId);
		this[spriteFactory_] = new SpriteFactory(documentHandle);
		this[entityManager_] = new EntityManager(this[eventDispatcher_]);

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

	start(boardSize) {
		let gameBoard = this[entityManager_].add(boardBlueprint);
		let boardSetupEvent = new CustomEvent('onSetup', {
			detail: {
				boardSize: boardSize,
				cellSize: this[view_].width / boardSize,
				spriteFactory: this[spriteFactory_]
			}
		});
		gameBoard.dispatchEvent(boardSetupEvent);

		this.step();
	}

	step() {
		this[entityManager_].step();
		this[entityManager_].draw(this[view_]);
		requestAnimationFrame(this.step.bind(this));
	}
}
