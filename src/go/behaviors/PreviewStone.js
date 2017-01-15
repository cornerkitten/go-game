
import { COMPONENT } from '../core/constants';

const boardPos_ = Symbol('boardPos');
const player1Sprite_ = Symbol('player1Sprite');
const player2Sprite_ = Symbol('player2Sprite');

/*
  Required Params:
   - player1Sprite
   - player2Sprite
*/
export default class PreviewStone {
  constructor(params, services) {
    // this.on('placeStone', (e) => {
    //   this.setPlayer(e.detail.player);
    // });
    // this.on('invalidPlaceStone', () => {
    //   this[shakeAnimation_].play();
    // });

    this[boardPos_] = undefined;
    this[player1Sprite_] = params.player1Sprite;
    this[player2Sprite_] = params.player2Sprite;

    // TODO Make true upon game start
    this[player1Sprite_].renderable = true;
    this[player2Sprite_].renderable = false;
    services.component(COMPONENT.DISPLAY).addChild(this[player1Sprite_]);
    services.component(COMPONENT.DISPLAY).addChild(this[player2Sprite_]);
  }

  // setPlayer(player) {
  //   if (player === 1) {
  //     this.$params.player1Sprite.renderable = true;
  //     this.$params.player2Sprite.renderable = false;
  //   } else {
  //     this.$params.player1Sprite.renderable = false;
  //     this.$params.player2Sprite.renderable = true;
  //   }
  // }
  //
  // move(to) {
  //   if (this[boardPos_] === undefined ||
  //     this[boardPos_].x !== to.x ||
  //     this[boardPos_].y !== to.y
  //   ) {
  //     this[boardPos_] = to;
  //
  //     const viewPos = this.$store.getters.boardToViewPos(to);
  //     const transform = this.$component(COMPONENT.TRANSFORM);
  //     transform.x = viewPos.x;
  //     transform.y = viewPos.y;
  //   }
  // }
}
