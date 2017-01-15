
import { COMPONENT, DISPLAY_TYPE } from '../core/constants';
import { BEHAVIOR, TEXTURE } from '../resources';

export default {
  display: {
    alpha: 0.84,
  },
  behaviors: [
    {
      component: BEHAVIOR.PREVIEW_STONE,
      params: {
        player1Sprite: {
          component: COMPONENT.DISPLAY,
          type: DISPLAY_TYPE.SPRITE,
          texture: TEXTURE.BLACK_STONE,
          //   anchorX: 0.5,
          //   anchorY: 0.5,
          // size: StoneUtil.size,
        },
        player2Sprite: {
          component: COMPONENT.DISPLAY,
          type: DISPLAY_TYPE.SPRITE,
          texture: TEXTURE.WHITE_STONE,
          // anchorX: 0.5,
          // anchorY: 0.5,
          // size: StoneUtil.size,
        },
      },
    },
  ],
};
