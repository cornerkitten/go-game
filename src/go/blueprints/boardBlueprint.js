
import BoardBehavior from '../behaviors/BoardBehavior';
import gridBlueprint from '../blueprints/gridBlueprint';
import previewStoneBlueprint from '../blueprints/previewStoneBlueprint';

export default {
  transform: {
    x: 0,
    y: 0,
  },
  spriteRenderer: {
    // sprite: sprites.gameBoard
  },
  behaviors: [
    {
      component: BoardBehavior,
    },
  ],
  children: [
    gridBlueprint,
    previewStoneBlueprint,
  ],
  // TODO Implement gesture regions
  //      e.g. gestureRegion: new RectangleShape(64, 64)
};
