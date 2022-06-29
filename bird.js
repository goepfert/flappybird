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

  function show() {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#003300';
    context.stroke();
  }

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

  function up() {
    yVelocity -= lift;
  }

  return {
    show,
    update,
    up,
  };
};
