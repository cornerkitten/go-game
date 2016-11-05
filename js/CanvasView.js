
// Private properties for CanvasView
let _ctx = new WeakMap();
let _canvas = new WeakMap();
function setCanvasSizeToWindow(canvas, windowHandle) {
	canvas.width = parseInt(windowHandle.getComputedStyle(canvas).width);
	canvas.height = parseInt(windowHandle.getComputedStyle(canvas).height);
}

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

	draw(canvas, x, y) {
		_ctx.get(this).drawImage(canvas, x, y, canvas.width, canvas.height);
	}

	clear() {
		let canvas = _canvas.get(this);
		_ctx.get(this).clearRect(0, 0, canvas.width, canvas.height);
	}
}
