/**
 * I'M A BIRD MOTHA' F*****
 *
 * Bird can fly, has a brain and can think about it's next move
 *
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
  let closestGate = 0;
  let brain;

  if (_brain !== undefined) {
    brain = _brain.copy();
  } else {
    brain = createNetwork(6, 2);
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

  /**
   * Mutate the brain with some rate (probability that weight get mutated or kept/inherited/copied unchanged)
   */
  function mutate(rate, fitness) {
    brain.mutate(rate, fitness);
  }

  /**
   * What shall the bird do with the current constellation of itself and the obstacles?
   * Flapping it wings or let gravity win?
   */
  function think(obstacles) {
    // Find the closest obstacle, all others are irgnored
    let closest = null;
    let closestD = Infinity;

    if (obstacles.length <= 0) {
      return;
    }

    for (let i = 0; i < obstacles.length; i++) {
      //let d = obstacles[i].left() + obstacles[i].width / 2 - x;
      let d = obstacles[i].right() - x;
      if (d < closestD && d > 0) {
        closest = obstacles[i];
        closestD = d;
      }
    }

    // Define some reasonable inputs for the neural net
    let inputs = [];
    inputs[0] = y / GAME_HEIGHT;
    inputs[1] = yVelocity / 10;
    inputs[2] = closest.top / GAME_HEIGHT;
    inputs[3] = closest.bottom / GAME_HEIGHT;
    inputs[4] = closest.left() / GAME_WIDTH;
    inputs[5] = closest.right() / GAME_WIDTH;

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

    // uncomment if you want to allow hitting top and bottom
    // if (y > GAME_HEIGHT) {
    //   yVelocity = 0;
    //   y = GAME_HEIGHT;
    // } else if (y < 0) {
    //   yVelocity = 0;
    //   y = 0;
    // }
  }

  /**
   * Check for collision with obstacles
   */
  function checkCollision(obstacles) {
    let hit = false;

    for (let idx = 0; idx < obstacles.length; idx++) {
      if (x > obstacles[idx].left() && x < obstacles[idx].right()) {
        if (y < obstacles[idx].top || y > obstacles[idx].bottom) {
          hit = true;

          let min = Math.abs(y - obstacles[idx].top);
          let min2 = Math.abs(GAME_HEIGHT - obstacles[idx].bottom - y);
          if (min2 < min) {
            min = min2;
          }
          closestGate = min;
          break;
        }
      }
    }

    return hit;
  }

  /**
   * Bunch of setter and getters
   * Why do I need a function here? :(
   * https://stackoverflow.com/questions/8893099/javascript-revealing-module-pattern-public-properties
   */
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

  function getClosestGate() {
    return closestGate;
  }

  return {
    dispose,
    show,
    up,
    mutate,
    think,
    offscreen,
    update,
    checkCollision,
    setScore,
    getScore,
    getBrain,
    setFitness,
    getFitness,
    getClosestGate,
  };
};
