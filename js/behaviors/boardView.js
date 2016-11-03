/*eslint no-console: "off"*/

// import Player from 'Player';
//
// // TODO Refactor code to domain-specific location
// function modelToViewPos(x, y) {
// 	return {
// 		x: x * 64 - 12,
// 		y: y * 64 - 12
// 	};
// }

export default {
	onPlaceStone: (e) => {
		console.info('boardView onPlaceStone' + e);

		// _eventDispatcher.get(this).addEventListener('PlaceStone', (e) => {
		// 	console.info(e.detail.player);
		//
		// 	let sprite = sprites.blackStone;
		// 	if (e.detail.player === Player.WHITE) {
		// 		sprite = sprites.whiteStone;
		// 	}
		//
		// 	let viewPos = modelToViewPos(e.detail.x, e.detail.y);
		//
		// 	let stone = new Entity({
		// 		transform: new Transform(viewPos.x, viewPos.y),
		// 		spriteRenderer: new SpriteRenderer(sprite)
		// 	});
		//
		// 	entityManager.add(stone);
		// });
	}
};
