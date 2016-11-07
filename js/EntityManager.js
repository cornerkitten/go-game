
import Entity from 'Entity';

let _entities = new WeakMap();
let _eventDispatcher = new WeakMap();
let _entitiesToDestroy = new WeakMap();
let _world = new WeakMap();

// TODO Consider whether Entity.dispatchEvent should be aware of this list.
const observableEvents = [
	'onPlaceStone',
	'onCaptureStone',
	'click',
	'mousemove'
];

export default class EntityManager {
	constructor(eventDispatcher) {
		_entities.set(this, []);
		_entitiesToDestroy.set(this, []);
		_eventDispatcher.set(this, eventDispatcher);
		_world.set(this, newWorld(this));

		observableEvents.forEach((eventName) => {
			eventDispatcher.addEventListener(eventName, dispatchEvent.bind(this));
		});
	}

	add(entityBlueprint) {
		let entity = new Entity(entityBlueprint, _world.get(this));
		_entities.get(this).push(entity);
		return entity;
	}

	destroy(entity) {
		_entitiesToDestroy.get(this).push(entity);
	}

	draw(view) {
		view.clear();
		drawEntities(view, _entities.get(this));
	}

	step() {
		// TODO Destroy recursively
		_entitiesToDestroy.get(this).forEach((entity) => {
			let index = _entities.get(this).indexOf(entity);
			_entities.get(this).splice(index, 1);
		});
		_entitiesToDestroy.set(this, []);
	}
}

function dispatchEvent(e) {
	_entities.get(this).forEach((entity) => {
		entity.dispatchEvent(e);
	});
}

function drawEntities(view, entities) {
	entities.forEach( (entity) => {
		// TODO Check if entity has sprite
		if (entity.spriteRenderer !== undefined) {
			view.draw(entity.spriteRenderer, entity.transform);
		}
		drawEntities(view, entity.children);
	});
}

// TODO Refactor world into its own class World
function newWorld(entityManager) {
	return {
		addEntity: entityManager.add.bind(entityManager),
		destroyEntity: entityManager.destroy.bind(entityManager),
		dispatchEvent: dispatchEvent.bind(entityManager)
	};
}
