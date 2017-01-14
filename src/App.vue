<template>
  <div id="app">
      <div id="game-info">
          <div class="player-info player-1">
              <div class="captured-stones">0</div>
              <div class="player-name" title="Kida">Kida</div>
          </div>
          <div class="player-info player-2">
              <div class="player-name" title="Milo">Milo</div>
              <div class="captured-stones">0</div>
          </div>
      </div>
      <div id="primary-surface">
          <canvas id="game"></canvas>
      </div>
      <div id="prototype-container">
          <canvas id="go-board" ref="goBoard"></canvas>
      </div>
  </div>
</template>

<script>
/* global document */

import GameEngine from './go/GameEngine';
import GameInfoPanel from './go/panels/GameInfoPanel';
import Engine from './go/core/Engine';
import scenes from './go/resources/scenes';

export default {
  name: 'app',
  mounted() {
    const gameEngine = new GameEngine();
    gameEngine.init(9, document, 'game');

    const gameInfoElement = document.getElementById('game-info');
    const gameElement = document.getElementById('game');
    const gameInfoPanel = new GameInfoPanel(gameInfoElement, gameElement);
    gameInfoPanel.init();

    const engine = new Engine();
    engine.init(this.$refs.goBoard, scenes.BASIC);
  },
};
</script>

<style lang="scss">
$board-size: 80vmin;
$view-width: 576px; // Previous prototyping size: 576px;
$game-info-padding-horizontal: 2vmin;
$game-info-width: $board-size - 4vmin - 2 * $game-info-padding-horizontal;
$game-info-padding: (2 * $game-info-padding-horizontal) $game-info-padding-horizontal;
$medium-box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);

html {
    -ms-touch-action: manipulation;
    touch-action: manipulation;
}

body {
    background: linear-gradient(180deg, hsl(282, 100%, 95%), hsl(0, 82%, 78%));
    background-repeat: no-repeat;
    background-attachment: fixed;
    font-family: Futura, Helvetica, arial, sans-serif;
    font-size: 1.5rem;
    margin: 0;
}

#primary-surface {
    padding: 0;
    position: relative;
    top: 0;

    #game {
        // cursor: none;
        display: block;
        height: $board-size;
        margin: 15vmin auto 0 auto;
        width: $board-size;

        // TODO Determine if better approach should be applied to handle
        //      tap-flicker concern on safari mobile
        -webkit-tap-highlight-color: hsla(0, 0, 0, 0);
    }
}

.player-info {
    font-size: 5vmin;
    font-weight: bold;
    margin: 5vmin;
    position: absolute;
    top: 0;
    z-index: 0;
}

.player-name {
    position: relative;
}

.player-name:before {
    content: attr(title);
    left: 0;
    position: absolute;
    z-index: -1;
}

.player-1 {
    right: 50vw;
    text-align: right;

    .player-name {
        color: black;
        float: right;
    }

    .player-name:before {
        -webkit-text-stroke: 0.25rem white;
    }

    .captured-stones {
        float: left;
        margin-right: 2rem;
    }
}

.player-2 {
    left: 50vw;
    text-align: left;

    .player-name {
        color: white;
        float: left;
    }

    .player-name:before {
        -webkit-text-stroke: 0.25rem black;
    }

    .captured-stones {
        float: right;
        margin-left: 2rem;
    }
}

.captured-stones {
    color: hsla(0, 0%, 0%, 0.5);
    font-weight: normal;
}

#prototype-container {
  text-align: center;
}

#go-board {
  border: 1px solid #eee;
}

</style>
