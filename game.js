var canvas = document.getElementById("canvas");
var ctx    = canvas.getContext("2d");

window.addEventListener("keydown", checkInput)
window.addEventListener("keyup", checkInput);

// CONSTANS
// =================================================
const BLOCK_HEIGHT = 40;
const LINES        = [];
const KEYS         = {left : false, right : false};

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
  //Background
  // =================================================
  ctx.fillStyle = "#000000";
  ctx.fillRect(0,0, canvas.width, canvas.height);
  // Lines for background parallax
  // =================================================
  ctx.fillStyle = "grey";
  for (line of LINES) {
    ctx.beginPath();
    ctx.rect(line.x, line.y, line.width, line.height);
    ctx.fill();
  }
  // Player
  // =================================================
  ctx.fillStyle = "#ff0000";
  ctx.beginPath();
  ctx.rect(player.x, player.y, player.width, player.height);
  ctx.fill();
  // Block
  // =================================================
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.rect(block.x, block.y, block.width, block.height);
  ctx.fill();
}

function update() {

  checkCollisions();

  if (KEYS.left) {
    console.log("LEFT");
    player.velocity -= 5.35;
  }
  else if (KEYS.right) {
    console.log("RIGHT");
    player.velocity += 5.35;
  }
  // Player
  // =================================================
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
  // Block
  // =================================================
  if (block.y > canvas.height) {
    randomizeBlockPos();
  }
  block.y += 14;
  // LINES
  // =================================================
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

function resetGame() {
  player.x = canvas.width / 2 -  player.width  / 2;
  player.y = canvas.height -  player.height - 20;
  randomizeBlockPos();
}

function checkInput(event) {
  var key_state = (event.type == "keydown") ? true : false;

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
  if (block.y > player.y) {
    if (player.x + player.width > block.x && player.x < block.x + block.width) {
      console.log("x collision");
      resetGame();
    }
  }
}
