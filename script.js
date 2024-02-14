document.addEventListener('DOMContentLoaded', function () {
    const gameContainer = document.getElementById('game-container');
    const cube = document.getElementById('cube');
    const bulletsContainer = document.getElementById('bullets-container');
    const blocksContainer = document.getElementById('blocks-container');
    const scoreElement = document.getElementById('score');
    let cubeLeft = 50; // Initial position
    let isGameOver = false;
    let bullets = [];
    let blocks = [];
    let score = 0;

    document.addEventListener('keydown', function (event) {
        if (!isGameOver) {
            if (event.key === 'a') {
                moveLeft();
            } else if (event.key === 'd') {
                moveRight();
            } else if (event.key === ' ') {
                shootBullet();
            }
        }
    });

    function moveLeft() {
        cubeLeft -= 10;
        updateCubePosition();
    }

    function moveRight() {
        cubeLeft += 10;
        updateCubePosition();
    }

    function updateCubePosition() {
        if (cubeLeft < 0) {
            cubeLeft = 0;
        } else if (cubeLeft > window.innerWidth - 50) {
            cubeLeft = window.innerWidth - 50;
        }

        cube.style.left = cubeLeft + 'px';
    }

    function shootBullet() {
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        bullet.style.left = cubeLeft + 20 + 'px'; // Position the bullet at the center of the cube
        bulletsContainer.appendChild(bullet);
        bullets.push(bullet);
    }

    function createBlock() {
        const block = document.createElement('div');
        block.className = 'block';
        block.style.left = Math.random() * (window.innerWidth - 50) + 'px';
        blocksContainer.appendChild(block);
        blocks.push(block);
    }

    function moveBullets() {
        bullets.forEach(bullet => {
            const bulletTop = parseInt(window.getComputedStyle(bullet).getPropertyValue('bottom'));
            bullet.style.bottom = bulletTop + 10 + 'px';

            if (bulletTop > window.innerHeight) {
                bullet.remove();
                bullets = bullets.filter(b => b !== bullet);
            }

            checkBulletCollision(bullet);
        });
    }

    function moveBlocks() {
        blocks.forEach(block => {
            const blockTop = parseInt(window.getComputedStyle(block).getPropertyValue('top'));
            block.style.top = blockTop + 1 + 'px';

            if (blockTop > window.innerHeight) {
                block.remove();
                blocks = blocks.filter(b => b !== block);
                createBlock();
            }

            checkBlockCollision(block);
        });
    }

    function checkBulletCollision(bullet) {
        const bulletRect = bullet.getBoundingClientRect();

        blocks.forEach(block => {
            const blockRect = block.getBoundingClientRect();

            if (
                bulletRect.bottom > blockRect.top &&
                bulletRect.top < blockRect.bottom &&
                bulletRect.right > blockRect.left &&
                bulletRect.left < blockRect.right
            ) {
                // Handle bullet hitting the block
                bullet.remove();
                bullets = bullets.filter(b => b !== bullet);

                block.remove();
                blocks = blocks.filter(b => b !== block);

                score++;
                updateScore();
            }
        });
    }

    function checkBlockCollision(block) {
        const cubeRect = cube.getBoundingClientRect();
        const blockRect = block.getBoundingClientRect();

        if (
            cubeRect.bottom > blockRect.top &&
            cubeRect.top < blockRect.bottom &&
            cubeRect.right > blockRect.left &&
            cubeRect.left < blockRect.right
        ) {
            // Handle cube colliding with the block
            gameOver();
        }
    }

    function updateScore() {
        scoreElement.textContent = 'Score: ' + score;
    }

    function gameOver() {
        isGameOver = true;
        alert('Game Over! Your Score: ' + score);
        location.reload(); // Reload the page to restart the game
    }

    function gameLoop() {
        if (!isGameOver) {
            moveBullets();
            moveBlocks();
            requestAnimationFrame(gameLoop);
        }
    }

    // Initial setup
    createBlock(); // Start with one block
    setInterval(createBlock, 2000); // Add a new block every 2 seconds
    gameLoop();
});
