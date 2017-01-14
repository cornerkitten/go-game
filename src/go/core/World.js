
import * as Pixi from 'pixi.js';
import scenes from '../resources/scenes';
import textures from '../resources/textures';

const stage_ = Symbol('stage');

export default class World {
  constructor(stage) {
    this[stage_] = stage;
  }

  initScene(sceneId) {
    switch (sceneId) {
      case scenes.BASIC: {
        const stone = Pixi.Sprite.from(textures.BLACK_STONE);
        this[stage_].addChild(stone);
        break;
      }
      default:
        break;
    }
  }

  // TODO Evaluate needs for update()
  // update() {
  //   this[stage_].foobar();
  // }
}
