/**
 *
 */

const createObstacle = (context, gameWidth, gameHeight) => {
  //https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  const spacing = 125;
  const top = getRandomArbitrary(gameHeight / 6, (3 / 4) * gameHeight);
  const bottom = gameHeight - (top + spacing);
  let x = gameWidth;

  const obstacleWidth = 80;
  let xVelocity = 5;

  function show() {
    context.fillStyle = 'red';
    context.strokeStyle = 'black';

    // upper part of the obstacle
    context.fillRect(x, 0, obstacleWidth, top);
    context.strokeRect(x, 0, obstacleWidth, top);

    // lower part of the obstacle
    context.fillRect(x, gameHeight - bottom, obstacleWidth, gameHeight);
    context.strokeRect(x, gameHeight - bottom, obstacleWidth, gameHeight);
  }

  function update() {
    x -= xVelocity;
  }

  function offscreen() {
    let ret = false;
    if (x < 0 - gameWidth) {
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
