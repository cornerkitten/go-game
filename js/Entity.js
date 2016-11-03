
// Private properties
let _transform = new WeakMap();
let _children = new WeakMap();
let _behavior = new WeakMap();

export default class Entity {
	constructor(config) {
		_children.set(this, []);

		this.spriteRenderer = config.spriteRenderer;
		_transform.set(this, config.transform);
		_behavior.set(this, config.behavior);
	}

	addChild(entity) {
		_children.get(this).push(entity);
	}

	get children() {
		return _children.get(this).slice();
	}

	get transform() {
		return _transform.get(this);
	}

	get behavior() {
		return _behavior.get(this);
	}
}
