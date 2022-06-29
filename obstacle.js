/**
 *
 */

const createObstacle = (context, gameWidth, gameHeight) => {
  let top = (Math.random() * gameHeight) / 2;
  let bottom = (Math.random() * gameHeight) / 2;
  let x = gameWidth;

  const obstacleWidth = 20;
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
    left,
    right,
  };
};
