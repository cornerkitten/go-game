
import Transform from 'Transform';
import SpriteRenderer from 'SpriteRenderer';

// Private properties
let _transform = new WeakMap();
let _spriteRenderer = new WeakMap();
let _children = new WeakMap();
let _behaviors = new WeakMap();

// TODO Update so that all components are optional
// TODO Add mechanism for components to communicate with other components of the
//      same entity (e.g. behavior talks with sprite render to change sprite)
export default class Entity {
	constructor(config) {
		_children.set(this, []);

		if (config.transform !== undefined) {
			_transform.set(this, new Transform(config.transform.x, config.transform.y));
		}

		if (config.spriteRenderer !== undefined) {
			_spriteRenderer.set(this, new SpriteRenderer(config.spriteRenderer.sprite));
		}

		_behaviors.set(this, []);
		if (config.behaviors !== undefined) {
			config.behaviors.forEach((behavior) => {
				_behaviors.get(this).push(new behavior.component(behavior.params));
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

	get spriteRenderer() {
		return _spriteRenderer.get(this);
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
}
