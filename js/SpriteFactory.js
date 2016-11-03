
import Sprite from 'Sprite';

// Private properties for CanvasSpriteFactory
let _document = new WeakMap();

function blankCanvas(documentHandle) {
	return documentHandle.createElement('canvas');
}

export default class SpriteFactory {
	// TODO Consider passing some sort of canvas factory, instead of
	//      `documentHandle`, since canvas generation is all
	//      `CanvasSpriteFactory` cares about anyway
	constructor(documentHandle) {
		_document.set(this, documentHandle);
	}

	squareGrid(offsetX, offsetY, gridSize, cellSize, thickness, color) {
		let canvas = blankCanvas(_document.get(this));
		canvas.width = offsetX + gridSize * cellSize;
		canvas.height = offsetY + gridSize * cellSize;

		let ctx = canvas.getContext('2d');

		ctx.lineWidth = thickness;
		ctx.strokeStyle = color;
		ctx.beginPath();
		for (let i = 0; i < gridSize; i++) {
			ctx.moveTo(offsetX + i * cellSize, offsetY);
			ctx.lineTo(offsetX + i * cellSize, offsetY + (gridSize - 1) * cellSize);
			ctx.moveTo(offsetX, offsetY + i * cellSize);
			ctx.lineTo(offsetX + (gridSize - 1) * cellSize, offsetY + i * cellSize);
		}
		ctx.stroke();

		return new Sprite(canvas);
	}
}
