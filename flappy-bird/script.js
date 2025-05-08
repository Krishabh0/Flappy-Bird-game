const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");
const levelScreen = document.getElementById("levelScreen");

const bgImg = new Image();
bgImg.src = "images/bg.jpg";

const birdImg = new Image();
birdImg.src = "images/bird.jpg";

let bird, pipes, score, gameOver, frame, animationId;
let pipeSpeed = 2;
let pipeGap = 120;
let gravity = 0.6;

function initGame(){
  bird = {
    x: 50,
    y: 150,
    width: 34,
    height: 34,
    gravity: gravity,
    lift: -10,
    velocity: 0
  };
  pipes = [];
  score = 0;
  gameOver = false;
  frame = 0;
}

function drawBird(){
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes(){
  pipes.forEach(pipe =>{
    ctx.fillStyle = "green";
    ctx.fillRect(pipe.x, 0, 50, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, 50, canvas.height - pipe.bottom);
    pipe.x -= pipeSpeed;

    if(
      bird.x < pipe.x + 50 &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
    ) {
      gameOver = true;
    }

    if(pipe.x + 50 === bird.x) {
      score++;
    }
  });

  if(pipes.length && pipes[0].x + 50 < 0){
    pipes.shift();
  }
}

function addPipe(){
  let top = Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 20;
  let bottom = top + pipeGap;
  pipes.push({ x: canvas.width, top, bottom });
}

function drawScore(){
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 30);
}

function showGameOver(){
  ctx.fillStyle = "red";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over!", 120, canvas.height / 2 - 20);
  ctx.fillText("Score: " + score, 140, canvas.height / 2 + 20);
  restartBtn.style.display = "inline-block";
}

function update(){
  if (gameOver) {
    showGameOver();
    cancelAnimationFrame(animationId);
    return;
  }

  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
    gameOver = true;
  }

  drawBird();

  if (frame % 90 === 0){
    addPipe();
  }

  drawPipes();
  drawScore();

  frame++;
  animationId = requestAnimationFrame(update);
}

// User key control
document.addEventListener("keydown", () =>{
  if (!gameOver) bird.velocity = bird.lift;
});

restartBtn.addEventListener("click", () =>{
  initGame();
  restartBtn.style.display = "none";
  update();
});

// Start game with level
function startGame(level){
  // Set difficulty
  if (level === "simple"){
    pipeSpeed = 2;
    pipeGap = 180;
    gravity = 0.5;
  } else if (level === "medium"){
    pipeSpeed = 3;
    pipeGap = 150;
    gravity = 0.6;
  } else if (level === "hard"){
    pipeSpeed = 4;
    pipeGap = 120;
    gravity = 0.75;
  }

levelScreen.style.display = "none";
canvas.style.display = "block";
restartBtn.style.display = "none";
  initGame();
  update();

  
}
