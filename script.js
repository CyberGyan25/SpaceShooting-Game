const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const playerImage = new Image();
playerImage.src = 'player.png'; // Replace with your player image path

const enemyImage = new Image();
enemyImage.src = 'enemy.png'; // Replace with your enemy image path

const bulletImage = new Image();
bulletImage.src = 'bullet.png'; // Replace with your bullet image path

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0
};

const bullets = [];
const enemies = [];
let score = 0;
let gameInterval;
let enemyInterval;

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function movePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(index, 1);
    });
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

function generateEnemies() {
    const enemyWidth = 50;
    const enemyHeight = 50;
    const x = Math.random() * (canvas.width - enemyWidth);
    const y = -enemyHeight;
    const speed = Math.random() * 2 + 1;
    enemies.push({ x, y, width: enemyWidth, height: enemyHeight, speed });
}

function detectCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 10; // Increase score by 10 for each enemy hit
            }
        });
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemies();
    movePlayer();
    moveBullets();
    moveEnemies();
    detectCollisions();
    displayScore();
}

function displayScore() {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
    update();
}

function startGame() {
    gameInterval = setInterval(gameLoop, 1000 / 60);
    enemyInterval = setInterval(generateEnemies, 1000);
}

function stopGame() {
    clearInterval(gameInterval);
    clearInterval(enemyInterval);
    alert('Game Over');
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -player.speed;
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        player.dy = -player.speed;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        player.dy = player.speed;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = 0;
    } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'ArrowDown' || e.key === 's') {
        player.dy = 0;
    }
});

document.addEventListener('click', () => {
    const bulletWidth = 5;
    const bulletHeight = 10;
    const x = player.x + player.width / 2 - bulletWidth / 2;
    const y = player.y;
    const speed = 5;
    bullets.push({ x, y, width: bulletWidth, height: bulletHeight, speed });
});

startGame();
