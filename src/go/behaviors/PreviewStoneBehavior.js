
import sprites from '../resources/sprites';
import Player from '../Player';
import Transform from '../components/Transform';
import SpriteRenderer from '../components/SpriteRenderer';

const transform_ = Symbol('transform');
const spriteRenderer_ = Symbol('spriteRenderer');
const initialAlpha_ = Symbol('initialAlpha');
const cellSize_ = Symbol('cellSize');
const initialScale_ = Symbol('initialScale');
const isGrowing_ = Symbol('isGrowing');
const boardPosition_ = Symbol('boardPosition');
const invalidMoveTweenCounter_ = Symbol('invalidMoveTweenCounter');

// TODO Refactor into shared location
function modelToViewPos(x, y, cellSize) {
  return {
    x: (x * cellSize) + (cellSize / 2),
    y: (y * cellSize) + (cellSize / 2),
  };
}

// TODO Refactor into shared location
function viewToModelPos(x, y, cellSize) {
  // TODO Consider accuracy of calculation, with respect to drawn grid
  // TODO Generalize calculation to any board size (e.g. 13 x 13, 19 x19)
  return {
    x: Math.floor(x / cellSize),
    y: Math.floor(y / cellSize),
  };
}

// TODO Remove this function and refactor client code (function not needed)
/* eslint-disable no-param-reassign */
function updateViewPosition(transform, boardPos, cellSize) {
  const snappedViewPos = modelToViewPos(boardPos.x, boardPos.y, cellSize);
  transform.x = snappedViewPos.x;
  transform.y = snappedViewPos.y;
}
/* eslint-enable no-param-reassign */

export default class PreviewStoneBehavior {
  constructor(params, entity) {
    this[transform_] = entity.getComponent(Transform);
    this[spriteRenderer_] = entity.getComponent(SpriteRenderer);
    this[initialAlpha_] = this[spriteRenderer_].alpha;
    this[cellSize_] = undefined;
    this[initialScale_] = undefined;
    this[isGrowing_] = true;
    this[boardPosition_] = undefined;
    this[invalidMoveTweenCounter_] = 0;
  }

  onSetup(e) {
    this[cellSize_] = e.detail.cellSize;
    const sprite = this[spriteRenderer_].sprite;
    const origin = this[spriteRenderer_].origin;
    origin.x = sprite.width / 2;
    origin.y = sprite.height / 2;

    const initialScale = (e.detail.cellSize / sprite.width) * 0.95;
    this[initialScale_] = initialScale;

    this[transform_].scaleX = initialScale;
    this[transform_].scaleY = initialScale;
    this[spriteRenderer_].alpha = 0;
  }

  onPlaceStone(e) {
    let sprite = sprites.whiteStone;
    if (e.detail.player === Player.WHITE) {
      sprite = sprites.blackStone;
    }

    this[spriteRenderer_].sprite = sprite;
  }

  mousemove(e) {
    const newBoardPos = viewToModelPos(e.offsetX, e.offsetY, this[cellSize_]);

    if (this[boardPosition_] === undefined ||
      this[boardPosition_].x !== newBoardPos.x ||
      this[boardPosition_].y !== newBoardPos.y
    ) {
      updateViewPosition(this[transform_], newBoardPos, this[cellSize_]);
      this[boardPosition_] = newBoardPos;
    }
  }

  mouseleave() {
    this[spriteRenderer_].alpha = 0;
  }

  mouseenter() {
    this[spriteRenderer_].alpha = this[initialAlpha_];
  }

  onInvalidPlaceStone() {
    this[invalidMoveTweenCounter_] = 1;
  }

  onStep() {
    let scale = this[transform_].scaleX;
    const scalerDelta = 0.003;
    const maxScale = this[initialScale_] + 0.09;

    if (this[isGrowing_]) {
      scale += scalerDelta;
    } else {
      scale -= scalerDelta;
    }

    if (scale > maxScale) {
      scale = maxScale;
      this[isGrowing_] = false;
    } else if (scale < this[initialScale_]) {
      scale = this[initialScale_];
      this[isGrowing_] = true;
    }

    // Prototype for invalid move feedback
    // TODO Fix bug for how alpha is handled upon animation completion
    // TODO Fix bug where animation needs immediately stopped when
    //      preview stone is made to disappear (e.g. when onMouseOut is
    //      fired)
    if (this[invalidMoveTweenCounter_] > 0) {
      this[invalidMoveTweenCounter_] -= 0.05;
      this[spriteRenderer_].alpha = this[initialAlpha_] * this[invalidMoveTweenCounter_];
    }

    this[transform_].scaleX = scale;
    this[transform_].scaleY = scale;
  }
}
