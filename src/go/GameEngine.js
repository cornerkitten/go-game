
/* global requestAnimationFrame */
/* global CustomEvent */

import sprites from './resources/sprites';
import SpriteLoader from './SpriteLoader';
import CanvasView from './CanvasView';
import SpriteFactory from './SpriteFactory';
import EntityManager from './EntityManager';
import boardBlueprint from './blueprints/boardBlueprint';

// Private properties
const view_ = Symbol('view');
const eventDispatcher_ = Symbol('eventDispatcher');
const entityManager_ = Symbol('entityManager');
const spriteFactory_ = Symbol('spriteFactory');

export default class GameEngine {
  init(boardSize, documentHandle, canvasId) {
    this[eventDispatcher_] = documentHandle.getElementById(canvasId);

    this[view_] = new CanvasView(documentHandle, canvasId);
    this[spriteFactory_] = new SpriteFactory(documentHandle);
    this[entityManager_] = new EntityManager(this[eventDispatcher_]);

    const spritesToLoad = [
      sprites.gameBoard,
      sprites.blackStone,
      sprites.whiteStone,
    ];
    const spriteLoader = new SpriteLoader(spritesToLoad);
    // TODO Adjust sprite architecture so that quirky buffer assignment
    //      does not need to manually occur from GameEngine.
    spritesToLoad.forEach((sprite) => {
      /* eslint-disable no-param-reassign */
      sprite.buffer = documentHandle.createElement('canvas');
      /* eslint-enable no-param-reassign */
    });
    spriteLoader.load(() => {
      this.start(boardSize);
    });
  }

  start(boardSize) {
    const gameBoard = this[entityManager_].add(boardBlueprint);
    const boardSetupEvent = new CustomEvent('onSetup', {
      detail: {
        boardSize,
        cellSize: this[view_].width / boardSize,
        spriteFactory: this[spriteFactory_],
      },
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
