// Toggle the visibility of the story text
document.getElementById('toggle-story').addEventListener('click', () => {
    const storyText = document.getElementById('story-text');
    storyText.style.display = storyText.style.display === 'none' ? 'block' : 'none';
  });
  
  // Handle starting the game
  document.getElementById('start-game').addEventListener('click', () => {
    const nameInput = document.getElementById('character-name');
    const name = nameInput.value.trim();
  
    if (!name) {
      alert("Please enter your character's name to start!");
      return;
    }
  
    // Store the character's name for use in the game
    localStorage.setItem('characterName', name); // Save name for later use
  
    alert(`Welcome, ${name}! Let’s start the adventure.`);
  
    // Hide the story text and disable further edits
    const storySection = document.getElementById('story-section');
    storySection.style.display = 'none';
  
    // Call the function to start Level 1
    startLevel1();
  });
  
  // Placeholder function to start Level 1
  function startLevel1() {
    // This function can handle initialization of Level 1
    alert('Level 1 is starting...');
  
    // Example: Focus the game canvas for immediate gameplay
    const gameCanvas = document.getElementById('game-canvas');
    gameCanvas.focus();
  
    // Optionally trigger Level 1 logic in game.js if required
    if (typeof initializeGame === 'function') {
      initializeGame(); // Assuming you have this function in game.js
    }
  }
  