
import Transform from './components/Transform';
import SpriteRenderer from './components/SpriteRenderer';

// Private properties
const components_ = Symbol('components');
const behaviors_ = Symbol('behaviors');
const children_ = Symbol('children');

export default class Entity {
  // TODO Consider refactor - constructor generally should not have much logic
  constructor(config, world) {
    const components = new WeakMap();
    this[components_] = components;

    if (config.transform !== undefined) {
      const component = new Transform(config.transform.x, config.transform.y);
      components.set(Transform, component);
    }

    if (config.spriteRenderer !== undefined) {
      const component = new SpriteRenderer(config.spriteRenderer.sprite,
        config.spriteRenderer.alpha);
      components.set(SpriteRenderer, component);
    }

    this[behaviors_] = [];
    if (config.behaviors !== undefined) {
      config.behaviors.forEach((behaviorConfig) => {
        /* eslint-disable new-cap */
        const behavior = new behaviorConfig.component(behaviorConfig.params, this);
        /* eslint-enable new-cap */
        behavior.owner = this;
        behavior.world = world;
        this[behaviors_].push(behavior);
        components.set(behaviorConfig.component, behavior);
      });
    }

    this[children_] = [];
    if (config.children !== undefined) {
      config.children.forEach((childConfig) => {
        this[children_].push(new Entity(childConfig, world));
      });
    }
  }

  getComponent(componentClass) {
    return this[components_].get(componentClass);
  }

  // TODO Add child should be queued for adding, instead of immediately adding
  addChild(entity) {
    this[children_].push(entity);
  }

  get children() {
    return this[children_].slice();
  }

  dispatchEvent(e) {
    this[behaviors_].forEach((behavior) => {
      if (behavior[e.type] !== undefined) {
        behavior[e.type](e);
      }
    });

    this[children_].forEach((child) => {
      child.dispatchEvent(e);
    });
  }
}
