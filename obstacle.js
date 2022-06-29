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

    context.fillRect(x, 0, obstacleWidth, top);
    context.strokeRect(x, 0, obstacleWidth, top);

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

  function checkCollision(bird) {}

  return {
    show,
    update,
    offscreen,
    checkCollision,
  };
};
