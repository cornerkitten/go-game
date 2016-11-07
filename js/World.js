
let _entityManager = new WeakMap();

export default class World {
	constructor(entityManager) {
		_entityManager.set(this, entityManager);
	}

	addEntity(entity) {
		return _entityManager.get(this).add(entity);
	}

	destroyEntity(entity) {
		return _entityManager.get(this).destroy(entity);
	}

	dispatchEvent(e) {
		_entityManager.get(this).dispatchEvent(e);
	}
}
