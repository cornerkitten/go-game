
// TODO Remove eslint debugging settings
/* eslint no-console: "off" */
/* eslint no-debugger: "off" */

/* global requestAnimationFrame */

import * as Pixi from 'pixi.js';
import textures from '../resources/textures';

const stage_ = Symbol('stage');
const renderer_ = Symbol('renderer');

function loadTextures(callback) {
  const textureFiles = Object.keys(textures).map(key => textures[key]);
  textureFiles.forEach(file => Pixi.loader.add(file));
  Pixi.loader.once('complete', callback);
  Pixi.loader.load();
}

export default class Engine {
  constructor() {
    this[stage_] = new Pixi.Container();
    this[renderer_] = undefined;
  }

  // TODO Remove default width and height
  // TODO Ensure width and height is dynamically calculated based on viewport
  init(view, width = 800, height = 600) {
    this[renderer_] = Pixi.autoDetectRenderer(width, height, {
      view,
      transparent: true,
    });

    loadTextures(this.onLoad.bind(this));
  }

  onLoad() {
    const stone = Pixi.Sprite.from(textures.BLACK_STONE);
    this[stage_].addChild(stone);
    requestAnimationFrame(this.update.bind(this));
  }

  update() {
    this[renderer_].render(this[stage_]);

    requestAnimationFrame(this.update.bind(this));
  }
}
