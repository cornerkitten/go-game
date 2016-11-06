
let _entityManager = new WeakMap();
let _boardPos = new WeakMap();
let _entity = new WeakMap();

export default class StoneBehavior {
	constructor(params, entity) {
		_entity.set(this, entity);
		_entityManager.set(this, params.entityManager);
		_boardPos.set(this, params.boardPos);
	}

	onCaptureStone(e) {
		let myPos = _boardPos.get(this);
		if (e.detail.x === myPos.x && e.detail.y === myPos.y) {
			_entityManager.get(this).destroy(_entity.get(this));
		}
	}
}
