
import sprites from 'resources/sprites';
import Player from 'Player';

let _transform = new WeakMap();
let _spriteRenderer = new WeakMap();

// TODO Refactor into shared location
function modelToViewPos(x, y) {
	return {
		x: x * 64 - 12,
		y: y * 64 - 12
	};
}

// TODO Refactor into shared location
function viewToModelPos(x, y) {
	// TODO Consider accuracy of calculation, with respect to drawn grid
	// TODO Generalize calculation to any board size (e.g. 13 x 13, 19 x19)
	return {
		x: Math.floor(x / 64),
		y: Math.floor(y / 64)
	};
}

export default class PreviewStoneBehavior {
	constructor(params, entity){
		_transform.set(this, entity.transform);
		_spriteRenderer.set(this, entity.spriteRenderer);
	}

	onPlaceStone(e) {
		let sprite = sprites.whiteStone;
		if (e.detail.player === Player.WHITE) {
			sprite = sprites.blackStone;
		}

		_spriteRenderer.get(this).sprite = sprite;
	}

	mousemove(e) {
		let modelPos = viewToModelPos(e.offsetX, e.offsetY);
		let snappedViewPos = modelToViewPos(modelPos.x, modelPos.y);

		_transform.get(this).x = snappedViewPos.x;
		_transform.get(this).y = snappedViewPos.y;
	}
}
