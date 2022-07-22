/**
 * I'M A BIRD MOTHA' F*****
 */

'use strict';

const createBird = (_brain) => {
  const x = 64;
  const radius = 15;
  const gravity = 0.8;
  const lift = -12;

  let color = utils.getRandomColor();
  let y = GAME_HEIGHT / 2;
  let yVelocity = 0;
  let score = 0;
  let fitness = 0;
  let brain;

  if (_brain !== undefined) {
    brain = _brain.copy();
  } else {
    brain = createNetwork(5, 2);
  }

  function dispose() {
    brain.dispose();
  }

  /**
   * Draws the bird
   */
  function show() {
    CONTEXT.beginPath();
    CONTEXT.arc(x, y, radius, 0, 2 * Math.PI, false);
    CONTEXT.fillStyle = color;
    CONTEXT.fill();
    CONTEXT.lineWidth = 1;
    CONTEXT.strokeStyle = '#003300';
    CONTEXT.stroke();
  }

  /**
   * Lift the bird upwards
   */
  function up() {
    yVelocity += lift;
  }

  function mutate(rate, fitness) {
    brain.mutate(rate, fitness);
  }

  function think(obstacles) {
    // Find the closest obstacle
    let closest = null;
    let closestD = Infinity;

    if (obstacles.length <= 0) {
      return;
    }

    for (let i = 0; i < obstacles.length; i++) {
      let d = obstacles[i].left() + obstacles[i].width / 2 - x;
      if (d < closestD && d > 0) {
        closest = obstacles[i];
        closestD = d;
      }
    }

    let inputs = [];
    inputs[0] = y / GAME_HEIGHT;
    inputs[1] = closest.top / GAME_HEIGHT;
    inputs[2] = closest.bottom / GAME_HEIGHT;
    inputs[3] = closest.left() / GAME_WIDTH;
    inputs[4] = yVelocity / 10;

    let xs = tf.tensor2d([inputs]);
    let output = brain.predict(xs);
    // console.log(inputs, output);
    if (output[0] > output[1]) {
      up();
    }
  }

  /**
   * Checks if bird is above or below screen
   */
  function offscreen() {
    return y > GAME_HEIGHT || y < 0;
  }

  /**
   * Moves the bird
   */
  function update() {
    score++;
    yVelocity = yVelocity + gravity; // v = a*t + v_0; t==1
    y = y + yVelocity;

    // if (y > GAME_HEIGHT) {
    //   yVelocity = 0;
    //   y = GAME_HEIGHT;
    // } else if (y < 0) {
    //   yVelocity = 0;
    //   y = 0;
    // }
  }

  function setScore(_score) {
    score = _score;
  }

  function getScore() {
    return score;
  }

  function getBrain() {
    return brain;
  }

  function setFitness(_fitness) {
    fitness = _fitness;
  }

  function getFitness() {
    return fitness;
  }

  /**
   * Check for collision with obstacles
   */
  function checkCollision(obstacles) {
    let hit = false;

    for (let idx = 0; idx < obstacles.length; idx++) {
      if (x > obstacles[idx].left() && x < obstacles[idx].right()) {
        if (y < obstacles[idx].top || y > GAME_HEIGHT - obstacles[idx].bottom) {
          hit = true;
          break;
        }
      }
    }

    return hit;
  }

  return {
    dispose,
    show,
    up,
    mutate,
    think,
    offscreen,
    update,
    setScore,
    getScore,
    getBrain,
    setFitness,
    getFitness,
    checkCollision,
  };
};
