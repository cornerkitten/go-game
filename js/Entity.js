
import Transform from 'Transform';
import SpriteRenderer from 'SpriteRenderer';

// Private properties
let _transform = new WeakMap();
let _children = new WeakMap();
// let _behavior = new WeakMap();
let _behaviors = new WeakMap();

export default class Entity {
	constructor(config, entityManager) {
		_children.set(this, []);

		this.spriteRenderer = new SpriteRenderer(config.spriteRenderer.sprite);
		_transform.set(this, new Transform(config.transform.x, config.transform.y));
		// _behavior.set(this, config.behavior);

		_behaviors.set(this, []);
		if (config.behaviors !== undefined) {
			config.behaviors.forEach((behavior) => {
				_behaviors.get(this).push(new behavior(entityManager));
			});
		}
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

	dispatchEvent(e) {
		_behaviors.get(this).forEach((behavior) => {
			if (behavior[e.type] !== undefined) {
				behavior[e.type](e);
			}
		});

		_children.get(this).forEach((child) => {
			child.dispatchEvent(e);
		});
	}

	// get behavior() {
	// 	return _behavior.get(this);
	// }
}
