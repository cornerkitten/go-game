
import PreviewStoneBehavior from '../behaviors/PreviewStoneBehavior';
import sprites from '../resources/sprites';

export default {
  transform: {
    x: 0,
    y: 0,
  },
  spriteRenderer: {
    sprite: sprites.blackStone,
    alpha: 0.84,
  },
  behaviors: [
    {
      component: PreviewStoneBehavior,
    },
  ],
};
