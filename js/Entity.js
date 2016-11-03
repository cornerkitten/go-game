
// Private properties
let _transform = new WeakMap();
let _children = new WeakMap();

export default class Entity {
	constructor(config) {
		_children.set(this, []);

		this.spriteRenderer = config.spriteRenderer;
		_transform.set(this, config.transform);
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
}
