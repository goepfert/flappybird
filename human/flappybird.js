/**
 *
 * author: Thomas Goepfert
 *
 */

'use strict';

const board = document.getElementById('board');
const scoreText = document.getElementById('scoreText');
const resetBtn = document.getElementById('resetBtn');

// Globals
// Maybe used in other modules
const CONTEXT = board.getContext('2d');
const GAME_WIDTH = +board.getAttribute('width');
const GAME_HEIGHT = +board.getAttribute('height');

let frameCounter = 0;
let frame_modulo = generateNewFrameModulo();
let gameID = 0;
let running = false;
let currentScore = 0;
let maxScore = 0;

let bird;
let obstacles = [];

/**
 * Setup the game
 */
const setup = () => {
  bird = createBird();

  obstacles.length = 0;
  obstacles.push(createObstacle());

  currentScore = 0;
  scoreText.textContent = `${currentScore} / ${maxScore}`;
};

/**
 * The draw loop
 */
const draw = () => {
  if (running) {
    gameID = setTimeout(() => {
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

      // Update and draw bird
      bird.update();
      bird.show();

      // Check for collisions and offscreen
      if (bird.checkCollision(obstacles)) {
        running = false;
      }

      // Create new obstacle if needed
      if (frameCounter % frame_modulo === 0) {
        obstacles.push(createObstacle());
        frameCounter = 0;
        frame_modulo = generateNewFrameModulo();
      }
      draw();
    }, 17);
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
const keyPressed = (event) => {
  const key = event.keyCode;
  const SPACEBAR = 32;

  switch (key) {
    case SPACEBAR:
      bird.up();
      break;
    default:
      // nothing to do
      break;
  }
};

/**
 * Display Game Over text
 * Enables Restart Button
 */
const displayGameOver = () => {
  CONTEXT.font = '50px MV Boli';
  CONTEXT.fillStyle = 'black';
  CONTEXT.textAlign = 'center';
  CONTEXT.fillText('Game Over', GAME_WIDTH / 2, GAME_HEIGHT / 2);
  resetBtn.innerHTML = 'Restart';
  resetBtn.classList.remove('disabled'); // would love to just disable the button, but then it also disables keydown somehow ... :(
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
  resetBtn.classList.add('disabled');
  setup();
  running = true;
  draw();
};

// restartGame();
window.addEventListener('keydown', keyPressed, true);
resetBtn.addEventListener('mousedown', restartGame); // not only 'click', since it triggers also on spacebar
