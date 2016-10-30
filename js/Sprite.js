
export default class Sprite {
	constructor(source) {
		this.source = source;
		this.image = new Image();
		this.isLoaded = false;
	}

	load(callback) {
		if (this.isLoaded) {
			callback();
			return;
		}

		this.image.onload = () => {
			this.isLoaded = true;
			callback();
		};
		this.image.src = this.source;
	}
}
