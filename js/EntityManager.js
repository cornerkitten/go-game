
import Entity from 'Entity';

let _entities = new WeakMap();
let _eventDispatcher = new WeakMap();
let _entitiesToDestroy = new WeakMap();
const observableEvents = [
	'onPlaceStone',
	'onCaptureStone',
	'click',
	'mousemove'
];

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

export default class EntityManager {
	constructor(eventDispatcher) {
		_entities.set(this, []);
		_entitiesToDestroy.set(this, []);
		_eventDispatcher.set(this, eventDispatcher);

		observableEvents.forEach((eventName) => {
			eventDispatcher.addEventListener(eventName, dispatchEvent.bind(this));
		});
	}

	create(entityConfig) {
		return new Entity(entityConfig);
	}

	add(entity) {
		_entities.get(this).push(entity);
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
