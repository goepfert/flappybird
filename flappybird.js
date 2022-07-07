/**
 *
 * author: Thomas Goepfert
 *
 */

const board = document.getElementById('board');
const context = board.getContext('2d');
const resetBtn = document.getElementById('resetBtn');
const gameWidth = board.getAttribute('width');
const gameHeight = board.getAttribute('height');

let frameCounter = 0;
let gameID = 0;
let running = false;

const TOTAL = 100;

let birds = [];
let copyBirds = [];
let obstacles = [];

let genAlg;

/**
 * Setup the game
 */
const setup = () => {
  if (birds.length === 0) {
    for (let idx = 0; idx < TOTAL; idx++) {
      birds[idx] = createBird(context, 64, gameHeight / 2, gameHeight, gameWidth);
    }
  }

  if (obstacles.length === 0) {
    obstacles.push(createObstacle(context, gameWidth, gameHeight));
  }

  if (typeof genAlg === 'undefined') {
    genAlg = createGeneticAlgorithm();
  }
};

/**
 * The draw loop
 */
const draw = () => {
  if (running) {
    gameID = setTimeout(() => {
      frameCounter++;
      clearBoard();

      // Filter out obstacles than run out of screen
      obstacles = obstacles.filter((obstacle) => {
        return !obstacle.offscreen();
      });

      // Update and draw obstacles
      obstacles.forEach((obstacle) => {
        obstacle.update();
        obstacle.show();
      });

      // Update and draw birds
      for (let birdIdx = birds.length - 1; birdIdx >= 0; birdIdx--) {
        birds[birdIdx].think(obstacles);
        birds[birdIdx].update();
        birds[birdIdx].show();

        // Check for collisions
        if (birds[birdIdx].checkCollision(obstacles)) {
          //running = false;
          copyBirds.push(birds.splice(birdIdx, 1)[0]);
        }
      }

      // Create new obstacle if needed
      if (frameCounter % 50 === 0) {
        obstacles.push(createObstacle(context, gameWidth, gameHeight));
      }

      // No bird left
      if (birds.length === 0) {
        genAlg.nextGeneration(birds, copyBirds);
        restartGame();
      }

      draw();
    }, 20);
  } else {
    displayGameOver();
  }
};

/**
 * Draws an empty board
 */
const clearBoard = () => {
  context.fillStyle = getComputedStyle(board).getPropertyValue('--boardBackground');
  context.fillRect(0, 0, gameWidth, gameHeight);
};

/**
 * React on spacebar keypress -> lifting the bird
 */
// const keyPressed = (event) => {
//   const key = event.keyCode;
//   const SPACEBAR = 32;

//   switch (key) {
//     case SPACEBAR:
//       bird.up();
//       break;
//     default:
//       // nothing to do
//       break;
//   }
// };

/**
 * Display Game Over text
 * Enables Restart Button
 */
const displayGameOver = () => {
  context.font = '50px MV Boli';
  context.fillStyle = 'black';
  context.textAlign = 'center';
  context.fillText('Game Over', gameWidth / 2, gameHeight / 2);
  resetBtn.innerHTML = 'Restart';
  //resetBtn.classList.remove('disabled'); // would love to just disable the button, but then it also disables keydown somehow ... :(
};

/**
 * Start a fresh game
 * Block Start/Restart Button
 */
const restartGame = () => {
  console.log('restartGame');
  running = false;
  obstacles.length = 0;
  frameCounter = 0;
  clearTimeout(gameID);
  clearBoard();
  // resetBtn.classList.add('disabled');
  setup();
  running = true;
  draw();
};

restartGame();
// window.addEventListener('keydown', keyPressed, true);
resetBtn.addEventListener('mousedown', restartGame); // not only 'click', since it triggers also on spacebar
