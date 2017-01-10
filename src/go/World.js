
const entityManager_ = Symbol('entityManager');
const eventDispatcher_ = Symbol('eventDispatcher');

export default class World {
	constructor(entityManager, eventDispatcher) {
		this[entityManager_] = entityManager;
		this[eventDispatcher_] = eventDispatcher;
	}

	addEntity(entity) {
		return this[entityManager_].add(entity);
	}

	destroyEntity(entity) {
		return this[entityManager_].destroy(entity);
	}

	dispatchEvent(e) {
		this[eventDispatcher_].dispatchEvent(e);
	}
}
