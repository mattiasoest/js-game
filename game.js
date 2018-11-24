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

// normal global variables
// =================================================
var GAME_STATE = STATES.MENU;
var SCORE      = 0;
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

function Line(y) {
  this.x = 0;
  this.y = y;
  this.width = canvas.width;
  this.height = 2;
}

// Start the game
// =================================================
initGame();
gameLoop();
// =================================================
// Implementation
// =================================================
function initGame() {
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
        console.log("LEFT");
        player.velocity -= 5.35;
      }
      else if (KEYS.right) {
        console.log("RIGHT");
        player.velocity += 5.35;
      }
      updateBlock();
      updatePlayer();
      checkCollisions();
      break;
    case STATES.MENU:
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
    GAME_STATE = STATES.RUNNING;
  }
  switch(event.keyCode) {
    case 37:// left key
      KEYS.left = key_state;
      console.log("LEFT");
    break;
    case 39:// right key
      KEYS.right = key_state;
      console.log("RIGHT");
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
      resetGame();
    }
  }
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
    randomizeBlockPos();
  }
  block.y += 15;
}

function updateLines() {
  // The first pushed element is out of the map
  // reuse it!
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
  ctx.fillStyle = "grey";
  for (line of LINES) {
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
  ctx.fillText("Score: " + SCORE, 5, 25);
}
