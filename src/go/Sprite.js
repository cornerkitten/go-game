
const sourceFile_ = Symbol('sourceFile');
const isLoaded_ = Symbol('isLoaded');
const buffer_ = Symbol('buffer');

export default class Sprite {
	/**
	 * `sourceFile` is optional
	 */
	constructor(buffer, sourceFile) {
		this[sourceFile_] = sourceFile;
		this[buffer_] = buffer;
		this[isLoaded_] = (sourceFile === undefined);
	}

	load(callback) {
		if (this[isLoaded_] === true) {
			callback();
			return;
		}

		if (this[sourceFile_] !== undefined) {
			let image = new Image();
			image.onload = () => {
				drawImageToBuffer(this[buffer_], image);

				this[isLoaded_] = true;
				callback();
			};

			// Setting src performs image loading
			image.src = this[sourceFile_];
		}
	}

	get buffer() {
		return this[buffer_];
	}

	set buffer(newBuffer) {
		this[buffer_] = newBuffer;
	}

	get width() {
		return this[buffer_].width;
	}

	get height() {
		return this[buffer_].height;
	}
}

function drawImageToBuffer(buffer, image) {
	buffer.width = image.width;
	buffer.height = image.height;

	let ctx = buffer.getContext('2d');
	ctx.drawImage(image, 0, 0, image.width, image.height);
}
