
/* global requestAnimationFrame */

import * as Pixi from 'pixi.js';

const stage_ = Symbol('stage');
const renderer_ = Symbol('renderer');

export default class Engine {
  constructor() {
    this[stage_] = new Pixi.Container();
    this[renderer_] = undefined;
  }

  init(view, width = 800, height = 600) {
    this[renderer_] = Pixi.autoDetectRenderer(width, height, {
      view,
      transparent: true,
    });

    requestAnimationFrame(this.update.bind(this));
  }

  update() {
    this[renderer_].render(this[stage_]);
  }
}
