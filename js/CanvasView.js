
// Private properties for CanvasView
let _ctx = new WeakMap();
let _canvas = new WeakMap();

export default class CanvasView {
	// TODO Consider whether constructor should only have a single parameter
	//      passed (i.e. canvas), so that there is no dependency on document
	constructor(documentHandle, canvasId) {
		let canvas = documentHandle.getElementById(canvasId);
		_canvas.set(this, canvas);
		_ctx.set(this, canvas.getContext('2d'));

		// TODO Consider whether it's good to assume that
		//      defaultView is non-null
		setCanvasSizeToWindow(canvas, documentHandle.defaultView);
	}

	draw(spriteRenderer, transform) {
		if (spriteRenderer.sprite == null) {
			return;
		}

		let canvas = spriteRenderer.sprite.buffer;
		let ctx = _ctx.get(this);

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
		let canvas = _canvas.get(this);
		_ctx.get(this).clearRect(0, 0, canvas.width, canvas.height);
	}

	get width() {
		return _canvas.get(this).width;
	}

	get height() {
		return _canvas.get(this).height;
	}
}

function setCanvasSizeToWindow(canvas, windowHandle) {
	canvas.width = parseInt(windowHandle.getComputedStyle(canvas).width);
	canvas.height = parseInt(windowHandle.getComputedStyle(canvas).height);
}
