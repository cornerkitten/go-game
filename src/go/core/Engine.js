
// TODO Remove eslint debugging settings
/* eslint no-console: "off" */
/* eslint no-debugger: "off" */

/* global requestAnimationFrame */

import * as Pixi from 'pixi.js';
import World from '../core/World';
import { TEXTURE } from '../resources';

const stage_ = Symbol('stage');
const renderer_ = Symbol('renderer');
const initialScene_ = Symbol('initialScene');
const world_ = Symbol('world');

function loadTextures(callback) {
  const textureFiles = Object.keys(TEXTURE).map(key => TEXTURE[key]);
  textureFiles.forEach(file => Pixi.loader.add(file));
  Pixi.loader.once('complete', callback);
  Pixi.loader.load();
}

export default class Engine {
  constructor() {
    this[stage_] = new Pixi.Container();
    this[renderer_] = undefined;
    this[world_] = undefined;
    this[initialScene_] = undefined;
  }

  // TODO Remove default width and height
  // TODO Ensure width and height is dynamically calculated based on viewport
  init(view, initialScene, width = 800, height = 600) {
    this[initialScene_] = initialScene;
    this[renderer_] = Pixi.autoDetectRenderer(width, height, {
      view,
      transparent: true,
    });

    loadTextures(this.onLoad.bind(this));
  }

  onLoad() {
    this[world_] = new World(this[stage_]);
    this[world_].initScene(this[initialScene_]);

    requestAnimationFrame(this.update.bind(this));
  }

  update() {
    // TODO Evaluate needs for update()
    // this[world_].update();

    this[renderer_].render(this[stage_]);

    requestAnimationFrame(this.update.bind(this));
  }
}
