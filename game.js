var canvas = document.getElementById("canvas");
var ctx    = canvas.getContext("2d");

window.addEventListener("keydown", checkInput)
window.addEventListener("keyup", checkInput);

// CONSTANTS
// =================================================
const BLOCK_HEIGHT = 40;
const LINES        = [];
const KEYS         = {left : false, right : false};
const STATES       = {RUNNING : 0, MENU : 1};

// Normal global variables
// =================================================
var startGame = new Audio();
var score_1   = new Audio();
var score_2   = new Audio();
var gameOver  = new Audio();

var GAME_STATE = STATES.MENU;
var SCORE      = 0;

var localStorage = window.localStorage;
var highscore = localStorage.getItem("score") ? localStorage.getItem("score") : 0;
var player = {
  width : 20,
  height : 30,
  x : 0,
  y : 0,
  velocity : 0
};

var block = {
  x : 0,
  y : 0,
  width: canvas.width * 0.55,
  height : BLOCK_HEIGHT
};

class Line {
  constructor(y) {
    this.x = 0;
    this.y = y;
    this.width = canvas.width;
    this.height = 2;
  }
}

// Start the game
// =================================================
initGame();
gameLoop();
// =================================================
// Implementation
// =================================================
function initGame() {
  loadSound();
  resetGame();
  createBgLines();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function draw() {
  drawBackground();
  drawPlayer();
  drawScore();
  drawHighscore();
  switch (GAME_STATE) {
    case STATES.RUNNING:
      drawBlocks();
      break;
    case STATES.MENU:
      drawStartText();
      break;
    default:
  }
}

function update() {
  // Update the parallax no matter what
  updateLines();
  switch (GAME_STATE) {
    case STATES.RUNNING:
      if (KEYS.left) {
        player.velocity -= 5.35;
      }
      else if (KEYS.right) {
        player.velocity += 5.35;
      }
      updateBlock();
      updatePlayer();
      checkCollisions();
      break;
    case STATES.MENU:
      // TODO add something fun?
      break;
    default:
      break;
  }
}

function resetGame() {
  SCORE = 0;
  GAME_STATE = STATES.MENU;
  player.x = canvas.width / 2 -  player.width  / 2;
  player.y = canvas.height -  player.height - 20;
  randomizeBlockPos();
}

function checkInput(event) {
  var key_state = (event.type == "keydown") ? true : false;
  if (key_state && GAME_STATE === STATES.MENU) {
    startGame.play();
    GAME_STATE = STATES.RUNNING;
  }
  switch(event.keyCode) {
    case 37:
      KEYS.left = key_state;
    break;
    case 39:
      KEYS.right = key_state;
    break;
  }
}

function randomizeBlockPos() {
  block.x = Math.floor(Math.random() * canvas.width / 2);
  block.y = -block.height;
}

function createBgLines() {
  let offset = 0;
  for (let i = 0; i < 6; i++) {
    LINES.push(new Line(offset));
    offset += canvas.height / 6;
  }
}

function checkCollisions() {
  // We only need to check for collision if the block is
  // within in the players range
  if (block.y + block.height > player.y) {
    if (player.x + player.width > block.x && player.x < block.x + block.width) {
      gameOver.play();
      if (SCORE > localStorage.getItem("score")) {
        // Save score in the browser.
        localStorage.setItem("score", SCORE);
        highscore = SCORE;
        console.log("New highscore! " + SCORE);
      }
      resetGame();
    }
  }
}

function loadSound() {
  startGame.src = "sounds/start_game.wav";
  score_1.src   = "sounds/point_1.wav";
  score_2.src   = "sounds/point_2.wav";
  gameOver.src  = "sounds/explosion.wav";

  // Adjust the volumes
  startGame.volume = 0.2;
  score_1.volume = 0.1;
  score_2.volume = 0.05;
  gameOver.volume = 0.2;
}

// Update helpers
// =================================================
function updatePlayer() {
  player.x += player.velocity;
  player.velocity *= 0.75;

  if (player.x < 0) {
    player.x = 0;
    player.velocity = 0;
  }
  else if (player.x > canvas.width - player.width) {
    player.x = canvas.width - player.width;
    player.velocity = 0;
  }
}

function updateBlock() {
  if (block.y > canvas.height) {
    SCORE++;
    SCORE % 2 === 0 ? score_1.play() : score_2.play();
    randomizeBlockPos();
  }
  block.y += 15;
}

function updateLines() {
  // The first pushed element is out of the map.
  // Reuse the same Line object for effiency.
  if (LINES[LINES.length - 1].y > canvas.height) {
    let line = LINES.pop();
    line.y = 0;
    LINES.unshift(line);
  }
  for (line of LINES) {
    line.y++;
  }
}

// Draw helpers
// =================================================
function drawBackground() {
  //Background
  ctx.fillStyle = "#000000";
  ctx.fillRect(0,0, canvas.width, canvas.height);
  // bg lines for background parallax effect
  for (line of LINES) {
    ctx.fillStyle = "#A9A9A9";
    ctx.beginPath();
    ctx.rect(line.x, line.y, line.width, line.height);
    ctx.fill();
  }
}

function drawPlayer() {
  ctx.fillStyle = "#ff0000";
  ctx.beginPath();
  ctx.rect(player.x, player.y, player.width, player.height);
  ctx.fill();
}

function drawBlocks() {
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.rect(block.x, block.y, block.width, block.height);
  ctx.fill();
}

function drawStartText() {
  ctx.fillStyle = "white";
  ctx.font = "30px Verdana";
  ctx.fillText("Press any button to start!", 5, canvas.height / 2);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Verdana";
  ctx.fillText("Score: " + SCORE, 5, 65);
}


function drawHighscore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Verdana";
  ctx.fillText("High Score: " + highscore, 5, 25);
}
