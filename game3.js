const mazeContainer = document.getElementById('maze-container');
const timerDisplay = document.getElementById('time');
let timer = 90;
let interval;
let currentLevel = 1;
let player;
let currentMaze;
let backgroundMusic = document.getElementById('background-music');
let storyBoard = document.getElementById('story-board');
let closeStoryButton = document.getElementById('close-storyboard');

// Level configurations
const levels = {
  1: { size: 15, difficulty: 'medium' },
  2: { size: 20, difficulty: 'hard' },
  3: { size: 25, difficulty: 'hardcore' }
};

// Maze class
class Maze {
  constructor(size, customLayout) {
    this.size = size;
    this.grid = [];
    this.cellSize = 30;
    this.start = { x: 1, y: 1 };
    this.exit = { x: size - 2, y: size - 2 };
    this.customLayout = customLayout;
    this.generate();
  }

  generate() {
    // Initialize grid with walls
    for (let y = 0; y < this.size; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.size; x++) {
        this.grid[y][x] = { x, y, wall: true };
      }
    }

    // Recursive backtracking algorithm
    const stack = [];
    const startCell = this.grid[this.start.y][this.start.x];
    startCell.wall = false;
    stack.push(startCell);

    while (stack.length > 0) {
      const current = stack.pop();
      const neighbors = this.getNeighbors(current);

      if (neighbors.length > 0) {
        stack.push(current);
        const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        const wall = this.grid[(current.y + neighbor.y) / 2][(current.x + neighbor.x) / 2];
        wall.wall = false;
        neighbor.wall = false;
        stack.push(neighbor);
      }
    }

    // Ensure exit is open
    this.grid[this.exit.y][this.exit.x].wall = false;

    // Validate path from start to exit
    while (!this.hasPathToExit()) {
      this.generate();
    }
  }

  hasPathToExit() {
    const visited = new Set();
    const stack = [this.start];
    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 }
    ];

    while (stack.length > 0) {
      const { x, y } = stack.pop();
      if (x === this.exit.x && y === this.exit.y) return true;

      visited.add(`${x},${y}`);

      for (const dir of directions) {
        const nx = x + dir.x;
        const ny = y + dir.y;

        if (
          nx >= 0 && ny >= 0 &&
          nx < this.size && ny < this.size &&
          !this.grid[ny][nx].wall &&
          !visited.has(`${nx},${ny}`)
        ) {
          stack.push({ x: nx, y: ny });
        }
      }
    }
    return false;
  }

  getNeighbors(cell) {
    const neighbors = [];
    const directions = [
      { x: 0, y: -2 }, // Up
      { x: 0, y: 2 },  // Down
      { x: -2, y: 0 }, // Left
      { x: 2, y: 0 }   // Right
    ];

    for (const dir of directions) {
      const x = cell.x + dir.x;
      const y = cell.y + dir.y;
      if (x > 0 && x < this.size - 1 && y > 0 && y < this.size - 1 && this.grid[y][x].wall) {
        neighbors.push(this.grid[y][x]);
      }
    }

    return neighbors;
  }

  render() {
    mazeContainer.innerHTML = '';
    mazeContainer.style.width = `${this.size * this.cellSize}px`;
    mazeContainer.style.height = `${this.size * this.cellSize}px`;

    // Render walls and paths
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const cell = this.grid[y][x];
        const element = document.createElement('div');
        element.className = cell.wall ? 'cell wall' : 'cell path';
        element.style.left = `${x * this.cellSize}px`;
        element.style.top = `${y * this.cellSize}px`;
        mazeContainer.appendChild(element);
      }
    }

    // Add exit marker
    const exitElement = document.createElement('div');
    exitElement.className = 'exit';
    exitElement.style.left = `${this.exit.x * this.cellSize}px`;
    exitElement.style.top = `${this.exit.y * this.cellSize}px`;
    mazeContainer.appendChild(exitElement);

    // Add player
    player = document.createElement('div');
    player.className = 'player';
    player.style.left = `${this.start.x * this.cellSize}px`;
    player.style.top = `${this.start.y * this.cellSize}px`;
    mazeContainer.appendChild(player);
  }
}

// Player movement with wall collision
document.addEventListener('keydown', (e) => {
  const step = currentMaze.cellSize;
  const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
  };

  const dir = directions[e.key];
  if (!dir) return;

  const newX = parseInt(player.style.left) + dir.x * step;
  const newY = parseInt(player.style.top) + dir.y * step;
  const gridX = Math.floor(newX / currentMaze.cellSize);
  const gridY = Math.floor(newY / currentMaze.cellSize);

  // Wall collision check
  if (
    gridX >= 0 && gridY >= 0 &&
    gridX < currentMaze.size && gridY < currentMaze.size &&
    !currentMaze.grid[gridY][gridX].wall
  ) {
    player.style.left = `${newX}px`;
    player.style.top = `${newY}px`;
    checkExit(gridX, gridY);
  }
});

function checkExit(gridX, gridY) {
  if (gridX === currentMaze.exit.x && gridY === currentMaze.exit.y) {
    completeLevel();
  }
}

function completeLevel() {
  clearInterval(interval);
  currentLevel++;

  if (currentLevel > 3) {
    window.location.href = "index4.html"; // Redirect to next game
    return;
  }

  alert(`Level ${currentLevel - 1} complete! Starting Level ${currentLevel}...`);
  startGame();
}

function updateTimer() {
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  if (timer <= 0) {
    clearInterval(interval);
    alert('Time’s up! Restarting level.');
    startGame();
  }
  timer--;
}

function startGame() {
  const level = levels[currentLevel];
  currentMaze = new Maze(level.size);
  currentMaze.render();
  timer = 90 + (currentLevel - 1) * 30;
  interval = setInterval(updateTimer, 1000);
}

// Start the game after closing the story board
closeStoryButton.addEventListener('click', () => {
  storyBoard.style.display = 'none';
  backgroundMusic.play(); // Start the background music
  startGame();
});
