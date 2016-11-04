/*eslint no-console: "off"*/

import Entity from 'Entity';

let _entities = new WeakMap();
let _eventDispatcher = new WeakMap();
const observableEvents = [
	'onPlaceStone',
	'click'
];

function dispatchEvent(e) {
	console.info(e);
	_entities.get(this).forEach((entity) => {
		entity.dispatchEvent(e);
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

	get entities() {
		return _entities.get(this).slice();
	}
}
