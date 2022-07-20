/**
 *
 */

'use strict';

const createObstacle = () => {
  //https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range

  const spacing = 150;
  const top = utils.getRandomArbitrary(GAME_HEIGHT / 6, (3 / 4) * GAME_HEIGHT);
  const bottom = GAME_HEIGHT - (top + spacing);
  let x = GAME_WIDTH;

  const obstacleWidth = 50;
  let xVelocity = 5;

  function show() {
    CONTEXT.fillStyle = 'red';
    CONTEXT.strokeStyle = 'black';

    // upper part of the obstacle
    CONTEXT.fillRect(x, 0, obstacleWidth, top);
    CONTEXT.strokeRect(x, 0, obstacleWidth, top);

    // lower part of the obstacle
    CONTEXT.fillRect(x, GAME_HEIGHT - bottom, obstacleWidth, GAME_HEIGHT);
    CONTEXT.strokeRect(x, GAME_HEIGHT - bottom, obstacleWidth, GAME_HEIGHT);
  }

  function update() {
    x -= xVelocity;
  }

  function offscreen() {
    let ret = false;
    if (x < 0 - GAME_WIDTH) {
      ret = true;
    }
    return ret;
  }

  // Why do I need a function here?
  // https://stackoverflow.com/questions/8893099/javascript-revealing-module-pattern-public-properties
  function left() {
    return x;
  }

  function right() {
    return x + obstacleWidth;
  }

  return {
    show,
    update,
    offscreen,
    top,
    bottom,
    width: obstacleWidth,
    left,
    right,
  };
};
