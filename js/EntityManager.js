/*eslint no-console: "off"*/

import Entity from 'Entity';

let _entities = new WeakMap();
let _eventDispatcher = new WeakMap();
const observableEvents = [
	'onPlaceStone'
];

function onAnyEvent(e) {
	_entities.get(this).forEach((entity) => {
		entity.dispatchEvent(e);
		// TODO Do similar for children
		// TODO Consider refactoring code into Entity class
	});
}

export default class EntityManager {
	constructor(eventDispatcher) {
		_entities.set(this, []);
		_eventDispatcher.set(this, eventDispatcher);

		observableEvents.forEach((eventName) => {
			eventDispatcher.addEventListener(eventName, onAnyEvent.bind(this));
		});
	}

	create(entityConfig) {
		return new Entity(entityConfig, this);
	}

	add(entity) {
		// TODO Fix:  This approach won't work since children entities can be
		//      dynamically added over time
		// if (entity.behavior !== undefined) {
		// 	if (entity.behavior.onPlaceStone !== undefined) {
		// 		// TODO Consider cleaner approach
		// 		// TODO Consider value of `this` inside callback function
		// 		//      entity.behaviors.onPlaceStone
		// 		_eventDispatcher.get(this).addEventListener('onPlaceStone', entity.behavior.onPlaceStone);
		// 	}
		// }
		_entities.get(this).push(entity);
	}

	get entities() {
		return _entities.get(this).slice();
	}
}
