
import Transform from 'Transform';
import SpriteRenderer from 'SpriteRenderer';

// Private properties
let _transform = new WeakMap();
let _spriteRenderer = new WeakMap();
let _children = new WeakMap();
let _behaviors = new WeakMap();
let _components = new WeakMap();

// TODO Treat all comonents equally for interface
//      (e.g. Instead of having getter for transform or spriteRenderer
//      components, have a method getComponent(componentClass))
// TODO Add mechanism for components to communicate with other components of the
//      same entity (e.g. behavior talks with sprite render to change sprite)
export default class Entity {
	constructor(config, world) {
		let components = new WeakMap();

		if (config.transform !== undefined) {
			let component = new Transform(config.transform.x, config.transform.y);
			_transform.set(this, component);
			components.set(Transform, component);
		}

		if (config.spriteRenderer !== undefined) {
			let component = new SpriteRenderer(config.spriteRenderer.sprite, config.spriteRenderer.alpha);
			_spriteRenderer.set(this, component);
			components.set(SpriteRenderer, component);
		}

		_behaviors.set(this, []);
		if (config.behaviors !== undefined) {
			config.behaviors.forEach((behaviorConfig) => {
				let behavior = new behaviorConfig.component(behaviorConfig.params, this);
				behavior.owner = this;
				behavior.world = world;
				_behaviors.get(this).push(behavior);
				components.set(behaviorConfig.component, behavior);
			});
		}

		_components.set(this, components);

		_children.set(this, []);
		if (config.children !== undefined) {
			config.children.forEach((childConfig) => {
				_children.get(this).push(new Entity(childConfig, world));
			});
		}
	}

	getComponent(componentClass) {
		return _components.get(this).get(componentClass);
	}

	// TODO Add child should be queued for adding, instead of immediately adding
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
