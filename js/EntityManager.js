
let _entities = new WeakMap();

export default class EntityManager {
	constructor() {
		_entities.set(this, []);
	}

	add(entity) {
		_entities.get(this).push(entity);
	}

	get entities() {
		return _entities.get(this).slice();
	}
}
