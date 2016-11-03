/*eslint no-console: "off"*/

let _entities = new WeakMap();
let _eventDispatcher = new WeakMap();

export default class EntityManager {
	constructor(eventDispatcher) {
		_entities.set(this, []);
		_eventDispatcher.set(this, eventDispatcher);
	}

	add(entity) {
		// TODO Fix:  This approach won't work since children entities can be
		//      dynamically added over time
		if (entity.behavior !== undefined) {
			if (entity.behavior.onPlaceStone !== undefined) {
				// TODO Consider cleaner approach
				// TODO Consider value of `this` inside callback function
				//      entity.behaviors.onPlaceStone
				_eventDispatcher.get(this).addEventListener('onPlaceStone', entity.behavior.onPlaceStone);
			}
		}
		_entities.get(this).push(entity);
	}

	get entities() {
		return _entities.get(this).slice();
	}
}
