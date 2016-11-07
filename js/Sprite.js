
let _sourceFile = new WeakMap();
let _isLoaded = new WeakMap();
let _buffer = new WeakMap();

export default class Sprite {
	/**
	 * `sourceFile` is optional
	 */
	constructor(buffer, sourceFile) {
		_sourceFile.set(this, sourceFile);
		_buffer.set(this, buffer);
		_isLoaded.set(this, (sourceFile === undefined));
	}

	load(callback) {
		if (_isLoaded.get(this) === true) {
			callback();
			return;
		}

		if (_sourceFile.get(this) !== undefined) {
			let image = new Image();
			image.onload = () => {
				drawImageToBuffer(_buffer.get(this), image);

				_isLoaded.set(this, true);
				callback();
			};

			// Setting src performs image loading
			image.src = _sourceFile.get(this);
		}
	}

	get buffer() {
		return _buffer.get(this);
	}

	set buffer(newBuffer) {
		_buffer.set(this, newBuffer);
	}
}

function drawImageToBuffer(buffer, image) {
	buffer.width = image.width;
	buffer.height = image.height;

	let ctx = buffer.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);
}
