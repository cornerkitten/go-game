
import * as Pixi from 'pixi.js';
import { DISPLAY_TYPE } from '../core/constants';
import { SCENE } from '../resources';
import stonePrefab from '../prefabs/stone';

const stage_ = Symbol('stage');

export default class World {
  constructor(stage) {
    this[stage_] = stage;
  }

  initScene(sceneId) {
    switch (sceneId) {
      case SCENE.BASIC: {
        this.createEntity(stonePrefab);
        break;
      }
      default:
        break;
    }
  }

  createEntity(config) {
    if (config.display) {
      this.createDisplay(config.display);
    }
  }

  createDisplay(config) {
    const type = config.type || DISPLAY_TYPE.CONTAINER;
    let display;

    switch (type) {
      case DISPLAY_TYPE.SPRITE:
        display = Pixi.Sprite.from(config.texture);
        break;
      case DISPLAY_TYPE.CONTAINER:
        display = new Pixi.Container();
        break;
      default:
        break;
    }

    this[stage_].addChild(display);
  }

  // TODO Evaluate needs for update()
  // update() {
  //   this[stage_].foobar();
  // }
}
