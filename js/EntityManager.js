
import Entity from 'Entity';

let _entities = new WeakMap();
let _eventDispatcher = new WeakMap();
const observableEvents = [
	'onPlaceStone',
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
			view.draw(entity.spriteRenderer.sprite.buffer, entity.transform.x, entity.transform.y);
		}
		drawEntities(view, entity.children);
	});
}

export default class EntityManager {
	constructor(eventDispatcher) {
		_entities.set(this, []);
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

	draw(view) {
		view.clear();
		drawEntities(view, _entities.get(this));
	}
}
