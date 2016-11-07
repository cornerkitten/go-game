
import SpriteRenderer from 'SpriteRenderer';

export default class GridBehavior {
	constructor() {
	}

	onSetup(e) {
		let spriteRenderer = this.owner.getComponent(SpriteRenderer);
		let sprite = e.detail.spriteFactory.squareGrid(32, 32, e.detail.boardSize, 64, 0.5, 'black');
		spriteRenderer.sprite = sprite;
	}
}
