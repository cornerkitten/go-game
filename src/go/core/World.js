
/* eslint no-debugger: "off" */

import * as Pixi from 'pixi.js';
import { COMPONENT, DISPLAY_TYPE } from '../core/constants';
import { SCENE, BEHAVIOR } from '../resources';
import stonePrefab from '../prefabs/stone';
import previewStonePrefab from '../prefabs/previewStone';
// TODO Remove as depenency
import PreviewStone from '../behaviors/PreviewStone';

const stage_ = Symbol('stage');

function createDisplay(config) {
  const type = config.type || DISPLAY_TYPE.CONTAINER;
  let display;

  switch (type) {
    case DISPLAY_TYPE.SPRITE:
      display = Pixi.Sprite.from(config.texture);
      display.anchor.x = config.anchor.x || 0;
      display.anchor.y = config.anchor.y || 0;
      break;
    case DISPLAY_TYPE.CONTAINER:
      display = new Pixi.Container();
      break;
    default:
      break;
  }
  display.alpha = config.alpha || 1;

  return display;
}

function createBehaviorParam(param) {
  if (param.component === undefined) {
    return param;
  }

  switch (param.component) {
    case COMPONENT.DISPLAY:
      return createDisplay(param);
    default:
      // TODO Throw exception
      return null;
  }
}

// TODO Protect the passed in services
function createBehavior(config, services) {
  const params = {};

  if (config.params) {
    const paramKeys = Object.keys(config.params);
    paramKeys.forEach((paramKey) => {
      params[paramKey] = createBehaviorParam(config.params[paramKey]);
    });
  }

  // TODO Generalize process
  switch (config.component) {
    case BEHAVIOR.PREVIEW_STONE:
      return new PreviewStone(params, services);
    default:
      // TODO Throw exception
      debugger;
      return null;
  }
}

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
      case SCENE.PREVIEW: {
        this.createEntity(previewStonePrefab);
        break;
      }
      default:
        break;
    }
  }

  createEntity(config) {
    // TODO If no display component is described,
    //      create container by default
    let display;
    if (config.display) {
      display = createDisplay(config.display);
      this[stage_].addChild(display);
    }

    const services = {
      component: (componentId) => {
        switch (componentId) {
          case COMPONENT.DISPLAY:
            return display;
          default:
            return null;
        }
      },
    };

    if (config.behaviors) {
      for (let i = 0; i < config.behaviors.length; i += 1) {
        createBehavior(config.behaviors[i], services);
      }
    }
  }

  // TODO Evaluate needs for update()
  // update() {
  //   this[stage_].foobar();
  // }
}
