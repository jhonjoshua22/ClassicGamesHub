document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const width = 10;
  const height = 15;
  const cellCount = width * height;
  const cells = [];

  // Create grid cells
  for (let i = 0; i < cellCount; i++) {
    const cell = document.createElement('div');
    cells.push(cell);
    grid.appendChild(cell);
  }

  const tetrominoes = {
    'I': {
      shape: [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
      ],
      className: 'I'
    },
    'O': {
      shape: [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
      ],
      className: 'O'
    },
    'T': {
      shape: [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
      ],
      className: 'T'
    },
    'S': {
      shape: [
        [1, 2, width, width + 1],
        [1, width + 1, width + 2, width * 2 + 2],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1]
      ],
      className: 'S'
    },
    'Z': {
      shape: [
        [0, 1, width + 1, width + 2],
        [2, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width * 2 + 1, width * 2 + 2],
        [1, width, width + 1, width * 2]
      ],
      className: 'Z'
    },
    'J': {
      shape: [
        [0, width, width * 2, width * 2 + 1],
        [1, 2, width + 1, width * 2 + 1],
        [0, 1, width + 1, width * 2 + 1],
        [1, width + 1, width + 2, width + 3]
      ],
      className: 'J'
    },
    'L': {
      shape: [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
      ],
      className: 'L'
    }
  };

  let currentPosition = Math.floor(width / 2) - 1;
  let currentRotation = 0;
  let currentTetromino = null;
  let currentShape = [];
  let currentClass = '';
  let gameInterval;
  let gameSpeed = 1000;

  function draw() {
    currentShape.forEach(index => {
      const cellIndex = currentPosition + index;
      if (cellIndex >= 0 && cellIndex < cellCount) {
        cells[cellIndex].classList.add('block', currentClass);
      }
    });
  }

  function undraw() {
    currentShape.forEach(index => {
      const cellIndex = currentPosition + index;
      if (cellIndex >= 0 && cellIndex < cellCount) {
        cells[cellIndex].classList.remove('block', currentClass);
      }
    });
  }

  function moveDown() {
    undraw();

    const canMove = currentShape.every(index => {
      const newPosition = currentPosition + index + width;
      return (
        newPosition < cellCount &&
        !cells[newPosition].classList.contains('block')
      );
    });

    if (canMove) {
      currentPosition += width;
    } else {
      draw();
      checkCompletedRows();
      generateNewTetromino();

      if (!isValidPosition()) {
        clearInterval(gameInterval);
        alert('Game Over!');
      }
    }

    draw();
  }

  function moveLeft() {
    undraw();
    const canMove = currentShape.every(index => {
      const newPosition = currentPosition + index - 1;
      return (
        (currentPosition + index) % width !== 0 &&
        newPosition >= 0 &&
        !cells[newPosition].classList.contains('block')
      );
    });

    if (canMove) currentPosition--;
    draw();
  }

  function moveRight() {
    undraw();
    const canMove = currentShape.every(index => {
      const newPosition = currentPosition + index + 1;
      return (
        (currentPosition + index) % width !== width - 1 &&
        newPosition < cellCount &&
        !cells[newPosition].classList.contains('block')
      );
    });

    if (canMove) currentPosition++;
    draw();
  }

  function rotate() {
    undraw();
    const nextRotation = (currentRotation + 1) % 4;
    const nextShape = currentTetromino.shape[nextRotation];

    const canRotate = nextShape.every(index => {
      const newPosition = currentPosition + index;
      return (
        newPosition >= 0 &&
        newPosition < cellCount &&
        !cells[newPosition].classList.contains('block') &&
        Math.floor((currentPosition + index) / width) === Math.floor(currentPosition / width) + Math.floor(index / width)
      );
    });

    if (canRotate) {
      currentRotation = nextRotation;
      currentShape = nextShape;
    }
    draw();
  }

  function isValidPosition() {
    return currentShape.every(index => {
      const cellIndex = currentPosition + index;
      return (
        cellIndex >= 0 &&
        cellIndex < cellCount &&
        !cells[cellIndex].classList.contains('block')
      );
    });
  }

  function generateNewTetromino() {
    const tetrominoNames = Object.keys(tetrominoes);
    const randomName = tetrominoNames[Math.floor(Math.random() * tetrominoNames.length)];
    currentTetromino = tetrominoes[randomName];
    currentRotation = 0;
    currentShape = currentTetromino.shape[currentRotation];
    currentClass = currentTetromino.className;
    currentPosition = Math.floor(width / 2) - 1;
  }

  let score = 0;
  let hiscore = 0;

  function checkCompletedRows() {
    for (let row = height - 1; row >= 0; row--) {
      const rowStart = row * width;
      const rowEnd = rowStart + width;
      const rowCells = cells.slice(rowStart, rowEnd);

      if (rowCells.every(cell => cell.classList.contains('block'))) {
        rowCells.forEach(cell => cell.classList.remove('block'));
        score += 10;
        document.getElementById('score').textContent = score;
        if (score > hiscore) {
          hiscore = score;
          document.getElementById('hiscore').textContent = hiscore;
        }

        for (let i = rowStart - 1; i >= 0; i--) {
          if (cells[i].classList.contains('block')) {
            const className = Array.from(cells[i].classList).find(cls => cls !== 'block');
            cells[i].classList.remove('block', className);
            cells[i + width].classList.add('block', className);
          }
        }

        row++;
      }
    }
  }

  function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    score = 0;
    document.getElementById('score').textContent = score;
    cells.forEach(cell => cell.className = '');
    generateNewTetromino();
    draw();
    gameInterval = setInterval(moveDown, gameSpeed);
  }

  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('startBtnM').addEventListener('click', startGame);

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (!gameInterval) return;
    switch (e.key) {
      case 'ArrowLeft': moveLeft(); break;
      case 'ArrowRight': moveRight(); break;
      case 'ArrowDown': moveDown(); break;
      case 'ArrowUp': rotate(); break;
    }
  });

  // Touch controls
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const swipeThreshold = 30;

  grid.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  });

  grid.addEventListener('touchend', (e) => {
    const touch = e.changedTouches[0];
    touchEndX = touch.clientX;
    touchEndY = touch.clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (!gameInterval) return;

    if (Math.abs(deltaX) < swipeThreshold && Math.abs(deltaY) < swipeThreshold) {
      rotate();
    } else if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) moveRight();
      else moveLeft();
    } else {
      if (deltaY > 0) moveDown();
    }
  });
});