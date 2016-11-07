
import GridBehavior from 'behaviors/GridBehavior';

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
			component: GridBehavior
		}
	]
};
