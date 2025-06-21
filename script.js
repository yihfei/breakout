const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const runBtn = document.getElementById('runBtn');

// ball coordinates
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

// shape properties
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;

// paddle coordinates
let paddleX = (canvas.width - paddleWidth) / 2;

// brick properties
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// score variables
let score = 0;

let lives = 3;


// initialize bricks
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1};
    }
}

console.log(bricks);

// key states
let rightPressed = false;
let leftPressed = false;

let interval = 0;

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();

}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}  

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}
  

function bounceBallCheck() {
    if (y + dy - ballRadius < 0) {
        dy = -dy;
    }
    if (x + dx + ballRadius > canvas.width || x + dx - ballRadius < 0) {
        dx = -dx;
    } 
    
    // paddle collision
    if (x > paddleX && x < paddleX + paddleWidth && y + dy + ballRadius >= canvas.height - paddleHeight) {
        dy = -dy;
    }

    // game over condition
    if (y + dy + ballRadius > canvas.height) {
        alert("GAME OVER");
        document.location.reload();
        clearInterval(interval); // Stop the game
    }

}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            (
                // Top collision
                (y + ballRadius >= b.y && y - ballRadius < b.y) ||
                // Bottom collision
                (y - ballRadius <= b.y + brickHeight && y + ballRadius > b.y + brickHeight)
              ))
               {
            dy = -dy;
            b.status = 0;
            score++;
            if (score === brickRowCount * brickColumnCount) {
                lives--;
                if (!lives) {
                    alert("GAME OVER");
                    document.location.reload();
                    clearInterval(interval); // Needed for Chrome to end game
                } else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 2;
                    dy = -2;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
          }
        }
      }
    }
  }
  

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawScore();
    drawLives();


    bounceBallCheck();
    collisionDetection();
    
    // ball movement
    x += dx;
    y += dy;

    // paddle movement
    if (rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
    } else if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
    }
}

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
  }
  
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}


function startGame() {
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);
    interval = setInterval(draw, 10);
}

runBtn.addEventListener('click', () => {
    startGame();
    runBtn.disabled = true; 
});