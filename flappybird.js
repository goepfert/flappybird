/**
 *
 * author: Thomas Goepfert
 *
 */

'use strict';

const board = document.getElementById('board');
const resetBtn = document.getElementById('resetBtn');

// Globals
// Maybe used in other modules
const CONTEXT = board.getContext('2d');
const GAME_WIDTH = board.getAttribute('width');
const GAME_HEIGHT = board.getAttribute('height');
const N_BIRDS = 50;

let frameCounter = 0;
let frame_modulo = generateNewFrameModulo();
let gameID = 0;
let running = false;

let birds = [];
let copyBirds = [];
let obstacles = [];
let genAlg;

tf.setBackend('cpu');

/**
 * Setup the game
 */
const setup = () => {
  if (birds.length == 0) {
    for (let idx = 0; idx < N_BIRDS; idx++) {
      birds[idx] = createBird();
    }
  }

  obstacles.length = 0;
  obstacles.push(createObstacle());

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
      // Iterate backwards
      for (let birdIdx = birds.length - 1; birdIdx >= 0; birdIdx--) {
        birds[birdIdx].think(obstacles);
        birds[birdIdx].update();
        birds[birdIdx].show();

        // Check for collisions and offscreen
        if (birds[birdIdx].checkCollision(obstacles) || birds[birdIdx].offscreen()) {
          //running = false;
          // Cut out bird and copy into copyBirds array
          copyBirds.push(birds.splice(birdIdx, 1)[0]);
        }
      }

      // Create new obstacle if needed
      if (frameCounter % frame_modulo === 0) {
        obstacles.push(createObstacle());
        frameCounter = 0;
        frame_modulo = generateNewFrameModulo();
      }

      // No bird left
      if (birds.length === 0) {
        genAlg.nextGeneration(birds, copyBirds);
        restartGame();
      }

      draw();
    }, 15);
  } else {
    displayGameOver();
  }
};

function generateNewFrameModulo() {
  return Math.floor(utils.getRandomArbitrary(40, 80));
}

/**
 * Draws an empty board
 */
const clearBoard = () => {
  CONTEXT.fillStyle = getComputedStyle(board).getPropertyValue('--boardBackground'); // from css
  CONTEXT.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
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
