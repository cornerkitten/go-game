
import Entity from 'Entity';
import World from 'World';
import SpriteRenderer from 'components/SpriteRenderer';
import Transform from 'components/Transform';

let _entities = new WeakMap();
let _entitiesToDestroy = new WeakMap();
let _world = new WeakMap();

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
		_world.set(this, new World(this, eventDispatcher));

		observableEvents.forEach((eventName) => {
			eventDispatcher.addEventListener(eventName, this.dispatchEvent.bind(this));
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
		// TODO Consider need to destroy recursively
		_entitiesToDestroy.get(this).forEach((entity) => {
			let index = _entities.get(this).indexOf(entity);
			_entities.get(this).splice(index, 1);
		});
		_entitiesToDestroy.set(this, []);
	}

	dispatchEvent(e) {
		_entities.get(this).forEach((entity) => {
			entity.dispatchEvent(e);
		});
	}
}

function drawEntities(view, entities) {
	entities.forEach( (entity) => {
		let spriteRenderer = entity.getComponent(SpriteRenderer);
		if (spriteRenderer !== undefined) {
			view.draw(spriteRenderer, entity.getComponent(Transform));
		}
		drawEntities(view, entity.children);
	});
}
