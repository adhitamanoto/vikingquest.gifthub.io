// Updated "game.js" file with requested changes
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Player object
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 70, // Positioned above the bottom
  width: 50,
  height: 70,
  speed: 5,
};

// Flowers array and game variables
let flowers = [];
let score = 0;
let blueFlowerDropped = false;
let gameRunning = false; // Game starts only after entering name

// Load images
const images = {
  red: new Image(),
  green: new Image(),
  pink: new Image(),
  yellow: new Image(),
  blue: new Image(),
  character: new Image(),
};

images.red.src = './Extensions/red_flower.png';
images.green.src = './Extensions/green_flower.png';
images.pink.src = './Extensions/pink_flower.png';
images.yellow.src = './Extensions/yellow_flower.png';
images.blue.src = './Extensions/blue_flower.png';
images.character.src = './Extensions/character.png';

// Load audio
const sounds = {
  collect: new Audio('./Extensions/collect.mp3'),
  error: new Audio('./Extensions/error.mp3'),
  background: new Audio('./Extensions/caramel.mp3'),
};

// Configure background music
sounds.background.loop = true;
sounds.background.volume = 0.3;

// Function to play sound effects
function playSound(effect) {
  sounds[effect].currentTime = 0;
  sounds[effect].play();
}

// Create a random flower
function createFlower() {
  if (!gameRunning) return; // Don't spawn flowers if the game hasn't started

  const colors = ['red', 'green', 'pink', 'yellow'];
  let color = colors[Math.floor(Math.random() * colors.length)];

  // Ensure blue flower drops only after 9 points are collected
  if (score >= 9 && !blueFlowerDropped) {
    color = 'blue';
    blueFlowerDropped = true;
  }

  flowers.push({
    x: Math.random() * (canvas.width - 30), // Random position within canvas
    y: 0,
    width: 30,
    height: 30,
    color,
    speed: Math.random() * 2 + 1, // Random fall speed
  });
}

// Draw the player
function drawPlayer() {
  ctx.drawImage(images.character, player.x, player.y, player.width, player.height);
}

// Draw a flower
function drawFlower(flower) {
  ctx.drawImage(images[flower.color], flower.x, flower.y, flower.width, flower.height);
}

// Check if a flower is inside the pot
function checkCollision(flower) {
  return (
    flower.x < player.x + player.width &&
    flower.x + flower.width > player.x &&
    flower.y + flower.height >= player.y
  );
}

// Handle flower effects
function handleFlowerEffect(color) {
  if (color === 'red' || color === 'green') {
    score++;
    playSound('collect');
  } else if (color === 'pink') {
    playSound('error');
    alert('Game Over! You collected a pink flower.');
    resetGame();
  } else if (color === 'blue') {
    playSound('collect');
    alert('Congratulations! You collected the blue flower and completed Level 1.');
    transitionToLevel2(); // Transition to the next level
  }
}

// Reset the game
function resetGame() {
  flowers = [];
  score = 0;
  blueFlowerDropped = false;
}
  

// Update the game state
function updateGame() {
  if (!gameRunning) return; // Stop updating if the game is not running

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the player
  drawPlayer();

  // Update and draw flowers
  flowers.forEach((flower, index) => {
    flower.y += flower.speed;

    // Check if the flower is collected
    if (checkCollision(flower)) {
      handleFlowerEffect(flower.color);
      flowers.splice(index, 1);
    }

    // Remove flowers that fall off the screen
    if (flower.y > canvas.height) {
      flowers.splice(index, 1);
    }

    // Draw the flower
    drawFlower(flower);
  });

  // Display the score
  ctx.font = '20px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Transition to Level 2
function transitionToLevel2() {
  alert('Get ready for Level 2!');

  // Stop Level 1 mechanics
  gameRunning = false;

  // Save game state (if necessary)
  localStorage.setItem('level1Score', score);

  // Redirect to Level 2
  window.location.href = 'index2.html'; // Ensure `index2.html` exists and loads `game2.js`
}

// Spawn flowers periodically
const flowerSpawner = setInterval(() => {
  if (gameRunning) createFlower();
}, 1000);

// Game loop
function gameLoop() {
  updateGame();
  if (gameRunning) requestAnimationFrame(gameLoop); // Continuously run the game if active
}

// Handle keyboard input for player movement
document.addEventListener('keydown', (e) => {
  if (!gameRunning) return;

  if (e.key === 'ArrowLeft' || e.key === 'a') {
    movePlayer('left');
  } else if (e.key === 'ArrowRight' || e.key === 'd') {
    movePlayer('right');
  }
});

// Move the player left/right
function movePlayer(direction) {
  if (direction === 'left' && player.x > 0) {
    player.x -= player.speed;
  } else if (direction === 'right' && player.x + player.width < canvas.width) {
    player.x += player.speed;
  }
}

// Start game only after name is entered
document.getElementById('start-game').addEventListener('click', () => {
  const nameInput = document.getElementById('character-name');
  const name = nameInput.value.trim();

  if (!name) {
    alert("Please enter your character's name to start!");
    return;
  }

  // Store the character's name
  localStorage.setItem('characterName', name);

  alert(`Welcome, ${name}! Let’s start the adventure.`);

  // Start background music
  sounds.background.play();

  // Start the game
  gameRunning = true;

  // Start the game loop
  gameLoop();
});
