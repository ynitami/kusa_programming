var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 15;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var playerPaddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var cpuPaddleX = (canvas.width - paddleWidth) / 2;
var noiseToCpuPaddleX = 0;

var cutSound = new Audio("./左右.mp3");
var driveSound = new Audio("./上下.mp3");

var playerLife = 3;
var cpuLife = 3;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if (e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
}

function updateCpuPaddleX() {
    cpuPaddleX = x - paddleWidth / 2;
    const noiseArray = [0.025, -0.025];
    const random0or1 = Math.floor(Math.random() * 2);
    noiseToCpuPaddleX += paddleWidth / 2 * noiseArray[random0or1];
    cpuPaddleX += noiseToCpuPaddleX
    if (cpuPaddleX <= 0) {
        cpuPaddleX = 0;
    }
    if (cpuPaddleX + paddleWidth >= canvas.width) {
        cpuPaddleX = canvas.width - paddleWidth;
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
}
function drawPlayerPaddle() {
    ctx.beginPath();
    ctx.rect(playerPaddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function drawCpuPaddle() {
    ctx.beginPath();
    ctx.rect(cpuPaddleX, 0, paddleWidth, paddleHeight);
    ctx.fillStyle = "magenta";
    ctx.fill();
    ctx.closePath();
}

function drawBallSpeed() {
    ctx.font = "16px PixelM";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("|dx|: " + Math.abs(dx), canvas.width - 150, 80);
    ctx.fillText("|dy|: " + Math.abs(dy), canvas.width - 150, 100);
}

function drawLives() {
    ctx.font = "16px PixelM";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Player Lives: " + playerLife, canvas.width - 150, 20);
    ctx.fillStyle = "magenta";
    ctx.fillText("Cpu Lives: " + cpuLife, canvas.width - 150, 40);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPlayerPaddle();
    drawCpuPaddle();
    updateCpuPaddleX();
    drawBallSpeed();
    drawLives();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        if (x > cpuPaddleX && x < cpuPaddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            cpuLife--;
            if (cpuLife == 0) {
                alert("YOU WIN!!");
                document.location.reload();
                clearInterval(interval);
            }
            else {
                x = canvas.width / 2;
                y = 30;
                dx = 2;
                dy = 2;
                playerPaddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }
    else if (y + dy > canvas.height - ballRadius) {
        if (x > playerPaddleX && x < playerPaddleX + paddleWidth) {
            dy = -dy;

            if (rightPressed) {
                dx += 1;
            }
            if (leftPressed) {
                dx -= 1;
            }
            if (upPressed) {
                dy -= 1;
            }

            cutSound.play();

            if (rightPressed || leftPressed) {
                cutSound.play();
            }
            if (upPressed) {
                driveSound.play();
            }
        }
        else {
            playerLife--;
            if (playerLife == 0) {
                alert("GAME OVER");
                document.location.reload();
                clearInterval(interval); // Needed for Chrome to end game
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                playerPaddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    if (rightPressed && playerPaddleX < canvas.width - paddleWidth) {
        playerPaddleX += 7;
    }
    else if (leftPressed && playerPaddleX > 0) {
        playerPaddleX -= 7;
    }

    x += dx;
    y += dy;
}

var interval = setInterval(draw, 10);