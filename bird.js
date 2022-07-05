/**
 * I'M A BIRD MOTHA' F*****
 */

const createBird = (context, centerX, centerY, maxY, maxX) => {
  // const birdID = Math.random();

  let x = centerX;
  let y = centerY;
  const radius = 16;
  const gravity = 0.8;
  const lift = -12;
  let yVelocity = 0;
  let score = 0;
  let fitness = 0;

  /**
   * Draws the bird
   */
  function show() {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#003300';
    context.stroke();
  }

  /**
   * Moves the bird
   */
  function update() {
    score++;
    yVelocity = yVelocity + gravity; // v = a*t + v_0; t==1
    y = y + yVelocity;

    if (y > maxY) {
      yVelocity = 0;
      y = maxY;
    } else if (y < 0) {
      yVelocity = 0;
      y = 0;
    }
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
    return y > maxY || y < 0;
  }

  /**
   * Check for collision with obstacles
   */
  function checkCollision(obstacles) {
    let hit = false;

    for (let idx = 0; idx < obstacles.length; idx++) {
      if (x > obstacles[idx].left() && x < obstacles[idx].right()) {
        if (y < obstacles[idx].top || y > gameHeight - obstacles[idx].bottom) {
          hit = true;
          break;
        }
      }
    }

    return hit;
  }

  function think(obstacles) {
    // Find the closest obstacle
    let closest = null;
    let closestD = Infinity;

    if (obstacles.length <= 0) {
      return;
    }

    for (let i = 0; i < obstacles.length; i++) {
      let d = obstacles[i].left() + obstacles[i].width - x;
      if (d < closestD && d > 0) {
        closest = obstacles[i];
        closestD = d;
      }
    }

    let inputs = [];
    inputs[0] = y / maxY;
    inputs[1] = closest.top / maxY;
    inputs[2] = closest.bottom / maxY;
    inputs[3] = closest.x / maxX;
    inputs[4] = yVelocity / 10;

    let output = [Math.random(), Math.random()]; //this.brain.predict(inputs);
    //if (output[0] > output[1] && this.velocity >= 0) {
    if (output[0] > 0.94) {
      //output[1]) {
      this.up();
    }
  }

  return {
    show,
    update,
    up,
    offscreen,
    checkCollision,
    think,
  };
};
