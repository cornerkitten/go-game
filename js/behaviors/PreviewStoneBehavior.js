
import sprites from 'resources/sprites';
import Player from 'Player';
import Transform from 'components/Transform';
import SpriteRenderer from 'components/SpriteRenderer';

let _transform = new WeakMap();
let _spriteRenderer = new WeakMap();
let _initialAlpha = new WeakMap();
let _cellSize = new WeakMap();

export default class PreviewStoneBehavior {
	constructor(params, entity){
		_transform.set(this, entity.getComponent(Transform));
		_spriteRenderer.set(this, entity.getComponent(SpriteRenderer));
		_initialAlpha.set(this, _spriteRenderer.get(this).alpha);
	}

	onSetup(e) {
		_cellSize.set(this, e.detail.cellSize);
		let sprite = _spriteRenderer.get(this).sprite;
		let origin = _spriteRenderer.get(this).origin;
		origin.x = sprite.width / 2;
		origin.y = sprite.height / 2;

		let transform = _transform.get(this);
		transform.scaleX = e.detail.cellSize / sprite.width * 0.95;
		transform.scaleY = e.detail.cellSize / sprite.height * 0.95;
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
		let modelPos = viewToModelPos(e.offsetX, e.offsetY, _cellSize.get(this));
		let snappedViewPos = modelToViewPos(modelPos.x, modelPos.y, _cellSize.get(this));

		_transform.get(this).x = snappedViewPos.x;
		_transform.get(this).y = snappedViewPos.y;
	}

	mouseleave() {
		_spriteRenderer.get(this).alpha = 0;
	}

	mouseenter() {
		_spriteRenderer.get(this).alpha = _initialAlpha.get(this);
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
