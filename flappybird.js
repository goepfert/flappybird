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
const snakeColor = 'Lime'; // https://htmlcolorcodes.com/color-names/
const snakeBorder = 'black';
const foodColor = 'Red';
const unitSize = 25;
let gameID = 0;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [];
let wrap = true; // wrap the snake at the border
let bird;

/**
 * Setup the game
 */
const setup = () => {
  bird = createBird(context, 64, gameHeight / 2, gameHeight);
  running = true;
};

/**
 * The draw loop
 */
const draw = () => {
  if (running) {
    gameID = setTimeout(() => {
      clearBoard();
      bird.update();
      bird.show();
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
  console.log(gameWidth, gameHeight);
  context.fillRect(0, 0, gameWidth, gameHeight);
};

/**
 * Change snake's direction if arrow key is pressed
 */
const keyPressed = (event) => {
  const key = event.keyCode;
  const SPACEBAR = 32;

  switch (key) {
    case SPACEBAR:
      // do sth with the bird
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
  context.font = '50px MV Boli';
  context.fillStyle = 'black';
  context.textAlign = 'center';
  context.fillText('Game Over', gameWidth / 2, gameHeight / 2);
  resetBtn.innerHTML = 'Restart';
  resetBtn.classList.remove('disabled'); // would love to just disable the button, but then it also disables keydown somehow ... :(
};

/**
 * Start a fresh game
 * Block Start/Restart Button
 */
const restartGame = () => {
  running = true;
  resetBtn.classList.add('disabled');
  setup();
  draw();
};

setup();
draw();

window.addEventListener('keydown', keyPressed, true);
resetBtn.addEventListener('click', restartGame);
