/**
 * I'M A BIRD MOTHA' F*****
 */

const createBird = (context, centerX, centerY, maxY) => {
  // const birdID = Math.random();

  let x = centerX;
  let y = centerY;
  const radius = 16;
  const gravity = 0.5;
  const lift = 15;
  let yVelocity = 0;

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
   * Drags the bird upwards
   */
  function up() {
    yVelocity -= lift;
  }

  function checkCollision(obstacles) {
    let hit = false;

    // forEach sucks in this case ...
    obstacles.forEach((obstacle) => {
      if (y < obstacle.top || y > gameHeight - obstacle.bottom) {
        if (x > obstacle.left() && x < obstacle.right()) {
          console.log('hit');
          hit = true;
        }
      }
    });

    return hit;
  }

  return {
    show,
    update,
    up,
    checkCollision,
  };
};
