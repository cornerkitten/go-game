/*eslint no-console: "off" */

import sprites from 'resources/sprites';
import Player from 'Player';
import Transform from 'components/Transform';
import SpriteRenderer from 'components/SpriteRenderer';

let _transform = new WeakMap();
let _spriteRenderer = new WeakMap();
let _initialAlpha = new WeakMap();
let _cellSize = new WeakMap();
let _initialScale = new WeakMap();
let _isGrowing = new WeakMap();
let _boardPosition = new WeakMap();
let _invalidMoveTweenCounter = new WeakMap();

export default class PreviewStoneBehavior {
	constructor(params, entity){
		_transform.set(this, entity.getComponent(Transform));
		_spriteRenderer.set(this, entity.getComponent(SpriteRenderer));
		_initialAlpha.set(this, _spriteRenderer.get(this).alpha);
		_isGrowing.set(this, true);
		_invalidMoveTweenCounter.set(this, 0);
	}

	onSetup(e) {
		_cellSize.set(this, e.detail.cellSize);
		let sprite = _spriteRenderer.get(this).sprite;
		let origin = _spriteRenderer.get(this).origin;
		origin.x = sprite.width / 2;
		origin.y = sprite.height / 2;

		let transform = _transform.get(this);
		let initialScale = e.detail.cellSize / sprite.width * 0.95;
		_initialScale.set(this, initialScale);

		transform.scaleX = initialScale;
		transform.scaleY = initialScale;
		_spriteRenderer.get(this).alpha = 0;
	}

	onPlaceStone(e) {
		let sprite = sprites.whiteStone;
		if (e.detail.player === Player.WHITE) {
			sprite = sprites.blackStone;
		}

		_spriteRenderer.get(this).sprite = sprite;
	}

	mousemove(e) {
		let boardPos = _boardPosition.get(this);
		let newBoardPos = viewToModelPos(e.offsetX, e.offsetY, _cellSize.get(this));

		if (boardPos === undefined || boardPos.x !== newBoardPos.x || boardPos.y !== newBoardPos.y) {
			updateViewPosition(_transform.get(this), newBoardPos, _cellSize.get(this));
			_boardPosition.set(this, newBoardPos);
		}
	}

	mouseleave() {
		_spriteRenderer.get(this).alpha = 0;
	}

	mouseenter() {
		_spriteRenderer.get(this).alpha = _initialAlpha.get(this);
	}

	onInvalidPlaceStone() {
		_invalidMoveTweenCounter.set(this, 1);
	}

	onStep() {
		let transform = _transform.get(this);
		let initialScale = _initialScale.get(this);
		let scale = transform.scaleX;
		let scalerDelta = 0.003;
		let maxScale = initialScale + 0.09;

		if (_isGrowing.get(this)) {
			scale += scalerDelta;
		} else {
			scale -= scalerDelta;
		}

		if (scale > maxScale) {
			scale = maxScale;
			_isGrowing.set(this, false);
		} else if (scale < initialScale) {
			scale = initialScale;
			_isGrowing.set(this, true);
		}

		// Prototype for invalid move feedback
		// TODO Fix bug for how alpha is handled upon animation completion
		// TODO Fix bug where animation needs immediately stopped when
		//      preview stone is made to disappear (e.g. when onMouseOut is
    //      fired)
		let invalidMoveTweenCounter = _invalidMoveTweenCounter.get(this);
		if (invalidMoveTweenCounter > 0) {
			invalidMoveTweenCounter -= 0.05;
			_spriteRenderer.get(this).alpha = _initialAlpha.get(this) * invalidMoveTweenCounter;

			_invalidMoveTweenCounter.set(this, invalidMoveTweenCounter);
		}

		transform.scaleX = scale;
		transform.scaleY = scale;
	}
}

// TODO Refactor into shared location
function modelToViewPos(x, y, cellSize) {
	return {
		x: x * cellSize + cellSize / 2,
		y: y * cellSize + cellSize / 2
	};
}

// TODO Refactor into shared location
function viewToModelPos(x, y, cellSize) {
	// TODO Consider accuracy of calculation, with respect to drawn grid
	// TODO Generalize calculation to any board size (e.g. 13 x 13, 19 x19)
	return {
		x: Math.floor(x / cellSize),
		y: Math.floor(y / cellSize)
	};
}

function updateViewPosition(transform, boardPos, cellSize) {
	let snappedViewPos = modelToViewPos(boardPos.x, boardPos.y, cellSize);
	transform.x = snappedViewPos.x;
	transform.y = snappedViewPos.y;
}
