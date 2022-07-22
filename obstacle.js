/**
 *
 */

'use strict';

const createObstacle = () => {
  //https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range

  const spacing = Math.floor(utils.getRandomArbitrary(100, 250));
  const top = Math.floor(utils.getRandomArbitrary(5, GAME_HEIGHT - spacing - 5));
  const bottom = GAME_HEIGHT - (top + spacing);
  let x = GAME_WIDTH;

  const obstacleWidth = Math.floor(utils.getRandomArbitrary(30, 80));
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
    if (x + obstacleWidth < 0) {
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
