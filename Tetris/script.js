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

  // All Tetromino shapes with their colors
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

  // Draw the current shape
  function draw() {
    currentShape.forEach(index => {
      const cellIndex = currentPosition + index;
      if (cellIndex >= 0 && cellIndex < cellCount) {
        cells[cellIndex].classList.add('block', currentClass);
      }
    });
  }

  // Remove the current shape
  function undraw() {
    currentShape.forEach(index => {
      const cellIndex = currentPosition + index;
      if (cellIndex >= 0 && cellIndex < cellCount) {
        cells[cellIndex].classList.remove('block', currentClass);
      }
    });
  }

  // Move the shape down
  function moveDown() {
    undraw();
    
    // Check if we can move down
    const canMove = currentShape.every(index => {
      const newPosition = currentPosition + index + width;
      return (
        newPosition < cellCount && // Within grid bounds
        !cells[newPosition].classList.contains('block') // No collision
      );
    });

    if (canMove) {
      currentPosition += width;
    } else {
      // Can't move down - lock the piece
      draw();
      checkCompletedRows();
      generateNewTetromino();
      
      // Check if game over (new piece can't be placed)
      if (!isValidPosition()) {
        clearInterval(gameInterval);
        alert('Game Over!');
      }
    }
    
    draw();
  }

  // Move left
  function moveLeft() {
    undraw();
    const canMove = currentShape.every(index => {
      const newPosition = currentPosition + index - 1;
      return (
        (currentPosition + index) % width !== 0 && // Not at left edge
        newPosition >= 0 && // Not above grid
        !cells[newPosition].classList.contains('block') // No collision
      );
    });
    
    if (canMove) currentPosition--;
    draw();
  }

  // Move right
  function moveRight() {
    undraw();
    const canMove = currentShape.every(index => {
      const newPosition = currentPosition + index + 1;
      return (
        (currentPosition + index) % width !== width - 1 && // Not at right edge
        newPosition < cellCount && // Not below grid
        !cells[newPosition].classList.contains('block') // No collision
      );
    });
    
    if (canMove) currentPosition++;
    draw();
  }

  // Rotate the tetromino
  function rotate() {
    undraw();
    const nextRotation = (currentRotation + 1) % 4;
    const nextShape = currentTetromino.shape[nextRotation];
    
    // Check if rotation is possible
    const canRotate = nextShape.every(index => {
      const newPosition = currentPosition + index;
      return (
        newPosition >= 0 && // Not above grid
        newPosition < cellCount && // Not below grid
        !cells[newPosition].classList.contains('block') && // No collision
        // Check left/right boundaries
        Math.floor((currentPosition + index) / width) === Math.floor(currentPosition / width) + Math.floor(index / width)
      );
    });
    
    if (canRotate) {
      currentRotation = nextRotation;
      currentShape = nextShape;
    }
    draw();
  }

  // Check if position is valid for new tetromino
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

  // Generate a new random tetromino
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
        // Remove the completed row
        rowCells.forEach(cell => cell.classList.remove('block'));
	score += 10;
	document.getElementById('score').textContent = score;
	if (score > hiscore) {
		hiscore = score;
		document.getElementById('hiscore').textContent = hiscore;

	}
        
        // Move all above rows down
        for (let i = rowStart - 1; i >= 0; i--) {
          if (cells[i].classList.contains('block')) {
            const className = Array.from(cells[i].classList).find(cls => cls !== 'block');
            cells[i].classList.remove('block', className);
            cells[i + width].classList.add('block', className);
          }
        }
        
        // Check the same row again (since we moved everything down)
        row++;
      }
    }
  }

 document.getElementById('startBtn').addEventListener('click', () => {
  if (gameInterval) {
    clearInterval(gameInterval);
  }

  // ✅ Reset the score properly
  score = 0;
  document.getElementById('score').textContent = score;

  // ✅ Remove ALL class names (block + shape class)
  cells.forEach(cell => {
    cell.className = ''; // remove all classes, including 'block' and tetromino types
  });

  // ✅ Generate new piece and start the game
  generateNewTetromino();
  draw();
  gameInterval = setInterval(moveDown, gameSpeed);
});


  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (!gameInterval) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowUp':
        rotate();
        break;
    }
  });
});