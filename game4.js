const puzzleContainer = document.getElementById("puzzle-container");
const closeBoardBtn = document.getElementById("close-board-btn");
const storySection = document.getElementById("story-section");

let musicPlayed = false; // Track if music has been played

// Create puzzle pieces
const numPieces = 9;
const puzzleSize = 626; // 626px x 626px puzzle
let positions = [];
let correctPositions = [];

function generatePuzzle() {
  puzzleContainer.innerHTML = ""; // Clear any existing puzzle
  positions = [];
  correctPositions = [];

  // Generate the positions for the puzzle pieces
  for (let i = 0; i < numPieces; i++) {
    const x = (i % 3) * (puzzleSize / 3); // Updated for larger pieces
    const y = Math.floor(i / 3) * (puzzleSize / 3);
    positions.push({ x, y });
    correctPositions.push({ x, y });
  }

  // Shuffle the pieces
  positions.sort(() => Math.random() - 0.5);

  // Create the puzzle pieces
  positions.forEach((pos, index) => {
    const piece = document.createElement("div");
    piece.classList.add("puzzle-piece");
    piece.style.backgroundImage = "url('winner/present-blue-yellow.png')"; // Puzzle background
    piece.style.backgroundPosition = `-${correctPositions[index].x}px -${correctPositions[index].y}px`;
    piece.dataset.index = index;
    piece.style.width = `${puzzleSize / 3}px`; // Set width of each piece
    piece.style.height = `${puzzleSize / 3}px`; // Set height of each piece
    piece.style.left = `${pos.x}px`;
    piece.style.top = `${pos.y}px`;
    puzzleContainer.appendChild(piece);

    // Add drag functionality
    piece.addEventListener("mousedown", (e) => startDrag(e, piece));
  });
}

// Dragging functionality
let draggingPiece = null;

function startDrag(e, piece) {
  draggingPiece = piece;
  const offsetX = e.clientX - piece.offsetLeft;
  const offsetY = e.clientY - piece.offsetTop;

  const onMove = (e) => {
    piece.style.left = `${e.clientX - offsetX}px`;
    piece.style.top = `${e.clientY - offsetY}px`;
  };

  const onStop = () => {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", onStop);
    checkPlacement(piece);
    draggingPiece = null;
  };

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", onStop);
}

// Check if the piece is placed correctly
function checkPlacement(piece) {
  const index = piece.dataset.index;
  const correctX = correctPositions[index].x;
  const correctY = correctPositions[index].y;
  const currentX = parseInt(piece.style.left);
  const currentY = parseInt(piece.style.top);

  if (
    Math.abs(correctX - currentX) < 15 && // Allow slight offset
    Math.abs(correctY - currentY) < 15
  ) {
    piece.style.left = `${correctX}px`;
    piece.style.top = `${correctY}px`;
    piece.setAttribute("data-correct", "true"); // Mark piece as correctly placed
  }

  // Check if the puzzle is complete
  if (Array.from(document.querySelectorAll(".puzzle-piece")).every((p) => {
    return p.dataset.correct === "true";
  })) {
    showWinner(); // Trigger the winner popup
  }
}

// Display the winner popup (redirect to winner page)
function showWinner() {
  // Redirect to winner page
  window.location.href = "winner.html";
}

// Story Section - Close Board Button functionality
closeBoardBtn.addEventListener("click", () => {
  storySection.style.display = "none"; // Hide story section
  playMusic(); // Start playing the background music
  generatePuzzle(); // Start the game by generating the puzzle
});

// Play background music once the board is closed
function playMusic() {
  if (!musicPlayed) {
    const audio = new Audio("winner/jingle.mp3");
    audio.loop = true; // Loop the music
    audio.play();
    musicPlayed = true; // Mark music as played
  }
}

// Initialize the puzzle (but don't run until story section is closed)
