
// Private properties for CanvasView
const ctx_ = Symbol('ctx');
const canvas_ = Symbol('canvas');

export default class CanvasView {
	// TODO Consider whether constructor should only have a single parameter
	//      passed (i.e. canvas), so that there is no dependency on document
	constructor(documentHandle, canvasId) {
		let canvas = documentHandle.getElementById(canvasId);
		this[canvas_] = canvas;
		this[ctx_] = canvas.getContext('2d');

		// TODO Consider whether it's good to assume that
		//      defaultView is non-null
		setCanvasSizeToWindow(canvas, documentHandle.defaultView);
	}

	draw(spriteRenderer, transform) {
		if (spriteRenderer.sprite == null) {
			return;
		}

		let canvas = spriteRenderer.sprite.buffer;
		let ctx = this[ctx_];

		ctx.save();
		ctx.globalAlpha = spriteRenderer.alpha;
		ctx.drawImage(
			canvas,
			transform.x - spriteRenderer.origin.x * transform.scaleX,
			transform.y - spriteRenderer.origin.y * transform.scaleY,
			canvas.width * transform.scaleX,
			canvas.height * transform.scaleY
		);
		ctx.restore();
	}

	clear() {
		this[ctx_].clearRect(0, 0, this[canvas_].width, this[canvas_].height);
	}

	get width() {
		return this[canvas_].width;
	}

	get height() {
		return this[canvas_].height;
	}
}

function setCanvasSizeToWindow(canvas, windowHandle) {
	canvas.width = parseInt(windowHandle.getComputedStyle(canvas).width);
	canvas.height = parseInt(windowHandle.getComputedStyle(canvas).height);
}
