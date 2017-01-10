
import SpriteRenderer from 'components/SpriteRenderer';

export default class GridBehavior {
	constructor() {
	}

	onSetup(e) {
		let spriteRenderer = this.owner.getComponent(SpriteRenderer);
		let sprite = e.detail.spriteFactory.squareGrid(
			e.detail.cellSize / 2,
			e.detail.cellSize / 2,
			e.detail.boardSize,
			e.detail.cellSize,
			1,
			'black'
		);
		spriteRenderer.sprite = sprite;
	}
}
