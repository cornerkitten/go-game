
import Entity from 'Entity';
import World from 'World';
import SpriteRenderer from 'components/SpriteRenderer';
import Transform from 'components/Transform';

const entities_ = Symbol('entities');
const entitiesToDestroy_ = Symbol('entitiesToDestroy');
const world_ = Symbol('world');

const observableEvents = [
	'onPlaceStone',
	'onCaptureStone',
	'click',
	'mousemove',
	'mouseenter',
	'mouseleave',
	'onStep',
	'onInvalidPlaceStone',
];

export default class EntityManager {
	constructor(eventDispatcher) {
		this[entities_] = [];
		this[entitiesToDestroy_] = [];
		this[world_] = new World(this, eventDispatcher);

		observableEvents.forEach((eventName) => {
			eventDispatcher.addEventListener(eventName, this.dispatchEvent.bind(this));
		});
	}

	add(entityBlueprint) {
		let entity = new Entity(entityBlueprint, this[world_]);
		this[entities_].push(entity);
		return entity;
	}

	destroy(entity) {
		if (this[entitiesToDestroy_].includes(entity) === false) {
			this[entitiesToDestroy_].push(entity);
		}
	}

	draw(view) {
		view.clear();
		drawEntities(view, this[entities_]);
	}

	step() {
		// TODO Consider need to destroy recursively
		this[entitiesToDestroy_].forEach((entity) => {
			let index = this[entities_].indexOf(entity);
			this[entities_].splice(index, 1);
		});
		this[entitiesToDestroy_] = [];

		let stepEvent = new CustomEvent('onStep');
		this.dispatchEvent(stepEvent);
	}

	dispatchEvent(e) {
		this[entities_].forEach((entity) => {
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
