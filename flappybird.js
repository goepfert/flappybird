/**
 *
 * author: Thomas Goepfert
 *
 */

'use strict';

const board = document.getElementById('board');
const scoreText = document.getElementById('scoreText');
const pause = document.getElementById('pauseBtn');

// Globals
// Maybe used in other modules
const CONTEXT = board.getContext('2d');
const GAME_WIDTH = +board.getAttribute('width');
const GAME_HEIGHT = +board.getAttribute('height');
const N_BIRDS = 50;

let frameCounter = 0;
let frame_modulo = generateNewFrameModulo();
let gameID = 0;
let running = false;
let currentScore = 0;
let maxScore = 0;

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

  currentScore = 0;
  scoreText.textContent = `${currentScore} / ${maxScore}`;
};

/**
 * The draw loop
 */
const draw = () => {
  if (running) {
    gameID = setTimeout(() => {
      pauseBtn.innerHTML = 'Pause';
      frameCounter++;
      currentScore++;
      maxScore = currentScore > maxScore ? currentScore : maxScore;
      scoreText.textContent = `${currentScore} / ${maxScore}`;

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
          copyBirds.push(birds.splice(birdIdx, 1)[0]); // shallow copy
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
 * Display Game Over text
 * Enables Restart Button
 */
const displayGameOver = () => {
  CONTEXT.font = '50px MV Boli';
  CONTEXT.fillStyle = 'black';
  CONTEXT.textAlign = 'center';
  CONTEXT.fillText('Pause', GAME_WIDTH / 2, GAME_HEIGHT / 2);
  pauseBtn.innerHTML = 'Continue';
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
  setup();
  running = true;
  draw();
};

restartGame();

pauseBtn.addEventListener('mousedown', () => {
  running = !running;

  if (running) {
    draw();
  }
}); // not only 'click', since it triggers also on spacebar
