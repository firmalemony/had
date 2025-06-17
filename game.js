const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

// Debug information
console.log('Canvas:', canvas);
console.log('Context:', ctx);
console.log('Score element:', scoreElement);

const GRID_SIZE = 20;
const GRID_COUNT = canvas.width / GRID_SIZE;
const SNAKE_COLOR = '#00ff00';
const FOOD_COLOR = '#ff0000';

let snake = {
    positions: [{x: GRID_COUNT / 2, y: GRID_COUNT / 2}],
    direction: {x: 1, y: 0},
    length: 1,
    score: 0
};

let food = {
    position: {x: 0, y: 0}
};

let gameLoop;
let gameSpeed = 150; // milliseconds between updates

function randomizeFood() {
    food.position = {
        x: Math.floor(Math.random() * GRID_COUNT),
        y: Math.floor(Math.random() * GRID_COUNT)
    };
    // Make sure food doesn't spawn on snake
    while (snake.positions.some(pos => pos.x === food.position.x && pos.y === food.position.y)) {
        food.position = {
            x: Math.floor(Math.random() * GRID_COUNT),
            y: Math.floor(Math.random() * GRID_COUNT)
        };
    }
}

function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    ctx.strokeStyle = color === SNAKE_COLOR ? '#00cc00' : '#cc0000';
    ctx.strokeRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.positions.forEach(pos => {
        drawSquare(pos.x, pos.y, SNAKE_COLOR);
    });

    // Draw food
    drawSquare(food.position.x, food.position.y, FOOD_COLOR);
}

function moveSnake() {
    const head = {
        x: (snake.positions[0].x + snake.direction.x + GRID_COUNT) % GRID_COUNT,
        y: (snake.positions[0].y + snake.direction.y + GRID_COUNT) % GRID_COUNT
    };

    // Check for collision with self
    if (snake.positions.some(pos => pos.x === head.x && pos.y === head.y)) {
        gameOver();
        return;
    }

    snake.positions.unshift(head);

    // Check if snake ate food
    if (head.x === food.position.x && head.y === food.position.y) {
        snake.score += 1;
        scoreElement.textContent = `Score: ${snake.score}`;
        randomizeFood();
    } else {
        snake.positions.pop();
    }
}

function gameOver() {
    clearInterval(gameLoop);
    finalScoreElement.textContent = snake.score;
    gameOverElement.style.display = 'block';
}

function restartGame() {
    snake = {
        positions: [{x: GRID_COUNT / 2, y: GRID_COUNT / 2}],
        direction: {x: 1, y: 0},
        length: 1,
        score: 0
    };
    scoreElement.textContent = 'Score: 0';
    gameOverElement.style.display = 'none';
    randomizeFood();
    gameLoop = setInterval(() => {
        moveSnake();
        draw();
    }, gameSpeed);
}

// Handle keyboard controls
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (snake.direction.y !== 1) {
                snake.direction = {x: 0, y: -1};
            }
            break;
        case 'ArrowDown':
            if (snake.direction.y !== -1) {
                snake.direction = {x: 0, y: 1};
            }
            break;
        case 'ArrowLeft':
            if (snake.direction.x !== 1) {
                snake.direction = {x: -1, y: 0};
            }
            break;
        case 'ArrowRight':
            if (snake.direction.x !== -1) {
                snake.direction = {x: 1, y: 0};
            }
            break;
    }
});

// Start the game
document.addEventListener('DOMContentLoaded', () => {
    randomizeFood();
    gameLoop = setInterval(() => {
        moveSnake();
        draw();
    }, gameSpeed);
}); 