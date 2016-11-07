
import Transform from 'components/Transform';
import SpriteRenderer from 'components/SpriteRenderer';

// Private properties
let _components = new WeakMap();
let _behaviors = new WeakMap();
let _children = new WeakMap();

export default class Entity {
	constructor(config, world) {
		let components = new WeakMap();
		_components.set(this, components);

		if (config.transform !== undefined) {
			let component = new Transform(config.transform.x, config.transform.y);
			components.set(Transform, component);
		}

		if (config.spriteRenderer !== undefined) {
			let component = new SpriteRenderer(config.spriteRenderer.sprite, config.spriteRenderer.alpha);
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
