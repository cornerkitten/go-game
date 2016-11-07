
import StoneBehavior from 'behaviors/StoneBehavior';

export default {
	transform: {
		x: 0,
		y: 0
	},
	spriteRenderer: {
		sprite: null
	},
	behaviors: [
		{
			component: StoneBehavior
		}
	]
};
