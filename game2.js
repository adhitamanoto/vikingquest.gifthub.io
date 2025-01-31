// JavaScript for Level 2 - Alien Letter Guessing Game

// Reference elements
const storySection = document.getElementById("story-section");
const closeStoryButton = document.getElementById("close-story");
const gameContainer = document.getElementById("game-container");
const referenceGrid = document.getElementById("reference-grid");
const alienPngs = document.getElementById("alien-pngs");
const inputBoxes = document.getElementById("input-boxes");
const backgroundMusic = document.getElementById("background-music");
const timerElement = document.getElementById("timer");
const feedback = document.getElementById("feedback");
const submitButton = document.getElementById("submit-button");

// Define alien letter references
const alienFolder = "./Alian/";
const alienLetters = Array.from({ length: 26 }, (_, i) => `${alienFolder}Letter ${i + 1}.png`);

// Populate reference grid
alienLetters.forEach((src, index) => {
  const referenceItem = document.createElement("div");
  const img = document.createElement("img");
  const label = document.createElement("span");

  img.src = src;
  img.alt = `Alien Letter ${String.fromCharCode(65 + index)}`;
  label.textContent = `= ${String.fromCharCode(65 + index)}`;

  referenceItem.appendChild(img);
  referenceItem.appendChild(label);
  referenceGrid.appendChild(referenceItem);
});

// Game logic variables
let currentWord = "";
let timeLeft = 90; // 1:30 in seconds
let timer = null;
let correctAnswers = 0; // Counter for correct answers
const requiredCorrectAnswers = 5; // Number of correct answers needed to win

// Start the game by closing the story
closeStoryButton.addEventListener("click", () => {
  storySection.style.display = "none";
  gameContainer.style.display = "block";

  backgroundMusic.play();
  startNewRound();
  startTimer();
});

// Start a new round
function startNewRound() {
  feedback.textContent = "";
  alienPngs.innerHTML = "";
  inputBoxes.innerHTML = "";

  const words = [
    "sukablyat", "kneegrow", "postaltwo", "feet", "anjing",
    "strongwoman", "Goran", "Borje", "Yavparyadki", "tripoloski",
    "iamracist", "javlafitta", "fodelsedag", "iwannabeyourvacuumcleaner", "lemongrab"
  ];

  currentWord = words[Math.floor(Math.random() * words.length)];

  currentWord.split("").forEach((char) => {
    const img = document.createElement("img");
    const input = document.createElement("input");

    img.src = alienLetters[char.toLowerCase().charCodeAt(0) - 97];
    img.alt = `Alien Letter ${char}`;
    input.type = "text";
    input.maxLength = 1;
    input.classList.add("guess-input");

    alienPngs.appendChild(img);
    inputBoxes.appendChild(input);
  });
}

// Timer logic
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerElement.textContent = `Time Left: ${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, "0")}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("Time's up! Restarting the game.");
      location.reload();
    }
  }, 1000);
}

// Check the player's guess
submitButton.addEventListener("click", () => {
  const guess = Array.from(document.querySelectorAll(".guess-input"))
    .map((input) => input.value.toLowerCase())
    .join("");

  if (guess === currentWord) {
    correctAnswers++;
    feedback.textContent = `Correct! You have answered ${correctAnswers}/${requiredCorrectAnswers} correctly.`;
    feedback.className = "correct";
    clearInterval(timer);

    if (correctAnswers >= requiredCorrectAnswers) {
      setTimeout(() => {
        alert("Congratulations! You've completed the game!");
        window.location.href = "index3.html"; // Move to the next level
      }, 2000);
    } else {
      timeLeft += 30; // Add 30 seconds for each correct answer
      startTimer(); // Restart the timer with the new time
      setTimeout(startNewRound, 1000); // Move to next word after 1 second
    }
  } else {
    feedback.textContent = "Incorrect! Try again.";
    feedback.className = "incorrect";
  }
});
