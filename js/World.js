
let _entityManager = new WeakMap();
let _eventDispatcher = new WeakMap();

export default class World {
	constructor(entityManager, eventDispatcher) {
		_entityManager.set(this, entityManager);
		_eventDispatcher.set(this, eventDispatcher);
	}

	addEntity(entity) {
		return _entityManager.get(this).add(entity);
	}

	destroyEntity(entity) {
		return _entityManager.get(this).destroy(entity);
	}

	dispatchEvent(e) {
		_eventDispatcher.get(this).dispatchEvent(e);
	}
}
