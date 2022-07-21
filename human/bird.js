/**
 * I'M A BIRD MOTHA' F*****
 */

'use strict';

const createBird = () => {
  const x = 64;
  const radius = 15;
  const gravity = 0.8;
  const lift = -12;

  let color = 'red';
  let y = GAME_HEIGHT / 2;
  let yVelocity = 0;
  let score = 0;

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
    yVelocity += gravity; // v = a*t + v_0; t==1
    y += yVelocity;

    // be kind
    if (y > GAME_HEIGHT) {
      yVelocity = 0;
      y = GAME_HEIGHT;
    } else if (y < 0) {
      yVelocity = 0;
      y = 0;
    }
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
    show,
    up,
    offscreen,
    update,
    checkCollision,
  };
};
