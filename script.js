"use strict";
// Variables
let playerChoice;
let playerScore = 0;
let computerScore = 0;
const computerChoice = function () {
  let choice = Math.floor(Math.random() * 3 + 1); // Generating computer choice

  switch (choice) {
    case 1:
      return "rock";
    case 2:
      return "paper";

    case 3:
      return "scissor";
  }
};
let isPlaying = false;
let isAnimating = false;
// Player choice will be udpated everytime the button was clicked
const choiceBtn = document.querySelectorAll(".choice-btn");
choiceBtn.forEach((item) => {
  item.addEventListener("click", function () {
    playerChoice = item.innerText.toLowerCase();
    playRound(playerChoice, computerChoice());
  });
});
// Start & Reset Game
const screen = document.querySelector(".game-screen");
const gameStart = document.querySelector(".btn-start");
const startCont = document.querySelector(".start-container");
const intro = document.querySelector(".intro");
const loader = document.querySelector(".loader");
const loadText = document.querySelector(".loading-text");
gameStart.addEventListener("click", showScreen);
let timer;
// Status
const roundStatus = document.querySelector(".text");
// Variables for HP Bar
let offsetPlayer;
let offsetEnemy;

// Variables needed for animation
// Player
const mainIdle = document.querySelector(".main.idle");
const mainRun = document.querySelector(".main.run");
const mainAtk = document.querySelector(".main.attack");
const mainHit = document.querySelector(".main.hit");
const mainLose = document.querySelector(".main.defeat");

// Computer
const enemyIdle = document.querySelector(".enemy.idle");
const enemyBlink = document.querySelector(".enemy.blink");
const enemyAtk = document.querySelector(".enemy.attack");
const enemyHit = document.querySelector(".enemy.hit");
const enemyLose = document.querySelector(".enemy.defeat");

// Show the game screen
function showScreen() {
  isPlaying = !isPlaying;
  isPlaying ? playGame() : resetGame();
}
// If isPlaying = false;
function playGame() {
  gameStart.innerText = "RESET";
  intro.classList.toggle("hidden");
  loader.classList.toggle("hidden"); // Shows the loading screen
  loadText.classList.toggle("hidden"); // Shows the loading screen
  timer = setTimeout(() => {
    screen.classList.toggle("hidden"); // Shows the game screen
    choiceBtn.forEach((buttons) => {
      buttons.classList.remove("disabled");
      buttons.disabled = false;
    });
    offsetPlayer = document.querySelector(".mainhp-layer").offsetWidth;
    offsetEnemy = document.querySelector(".enemyhp-layer").offsetWidth;
  }, 2500);
}
// If isPlaying = true;
function resetGame() {
  gameStart.innerText = "START";
  playerScore = 0;
  computerScore = 0;
  document.querySelector(".mainhp-layer").style.width = "65px";
  document.querySelector(".enemyhp-layer").style.width = "0px";
  clearTimeout(timer);
  screen.classList.add("hidden"); // Hides the game screen
  intro.classList.remove("hidden"); // Shows the intro msg
  loader.classList.add("hidden"); // Hides the loading screen
  loadText.classList.add("hidden"); // Hides the loading screen
  choiceBtn.forEach((buttons) => {
    buttons.classList.add("disabled");
    buttons.disabled = true;
  });
  mainLose.classList.add("hidden");
  mainIdle.classList.remove("hidden");
  enemyLose.classList.add("hidden");
  enemyIdle.classList.remove("hidden");
  roundStatus.innerText = "";
}
// Play a round
function playRound(player, computer) {
  if (playerScore !== 5 && computerScore !== 5) {
    if (player === computer) {
      if (!isAnimating) {
        isAnimating = true;
        roundStatus.innerText = `Round DRAW. No one moves...`;
        animTimer();
      }
    } else if (
      (player === "rock" && computer === "scissor") ||
      (player === "paper" && computer === "rock") ||
      (player === "scissor" && computer === "paper")
    ) {
      if (!isAnimating) {
        isAnimating = true;
        playerAtk();
        printStatus("Player", player, computer);
      }
    } else if (
      (player === "rock" && computer === "paper") ||
      (player === "paper" && computer === "scissor") ||
      (player === "scissor" && computer === "rock")
    ) {
      if (!isAnimating) {
        isAnimating = true;
        computerAtk();
        printStatus("Computer", player, computer);
      }
    }
  }
}

// Function for round status
function printStatus(winner, player, computer) {
  if (playerScore === 5 || computerScore === 5)
    roundStatus.innerText = `${
      playerScore > computerScore ? "Player" : "Computer"
    } wins the game...`;

  if (playerScore < 5 && computerScore < 5) {
    winner === "Player"
      ? (roundStatus.innerText = `Player wins. ${player.toUpperCase()} beats ${computer.toUpperCase()}...`)
      : (roundStatus.innerText = `Computer wins. ${computer.toUpperCase()} beats ${player.toUpperCase()}...`);
  }
}

// Buttons won't work during attack animation
function animTimer() {
  setTimeout(() => {
    isAnimating = false;
  }, 2000);
}

// Functions that handles the animation for the player
function playerAtk() {
  mainIdle.classList.toggle("hidden");
  mainRun.classList.toggle("hidden");
  mainRun.classList.toggle("animate");

  setTimeout(function () {
    playerScore++;
    backToIdle();
    animTimer();
  }, 3000);
}
// Player char blinks back to starting point
function backToIdle() {
  mainRun.classList.add("hidden");
  mainRun.classList.remove("animate");
  mainAtk.classList.toggle("hidden");
  enemyIdle.classList.toggle("hidden");
  enemyHit.classList.toggle("hidden");
  enemyHit.classList.add("animate");
  // Enemy HP bar reduced
  offsetEnemy += 13;
  offsetEnemy += "px";
  document.querySelector(".enemyhp-layer").style.width = offsetEnemy;
  offsetEnemy = offsetEnemy.slice(0, 2);
  offsetEnemy = Number(offsetEnemy);

  setTimeout(() => {
    mainAtk.classList.toggle("hidden");
    enemyHit.classList.toggle("hidden");
    mainIdle.classList.remove("hidden");
    if (playerScore === 5) {
      enemyLose.classList.remove("hidden");
    } else {
      enemyIdle.classList.remove("hidden");
    }
  }, 1800);
}

// Functions that handles the animation for the enemy
function computerAtk() {
  enemyIdle.classList.toggle("hidden");
  enemyBlink.classList.toggle("hidden");
  enemyAtk.classList.toggle("hidden");
  mainIdle.classList.toggle("hidden");
  mainHit.classList.toggle("hidden");
  mainHit.classList.toggle("animate");
  setTimeout(() => {
    enemyBlink.classList.toggle("hidden");
    setTimeout(() => {
      computerScore++;
      // Player HP bar reduced
      offsetPlayer -= 13;
      offsetPlayer += "px";
      document.querySelector(".mainhp-layer").style.width = offsetPlayer;
      offsetPlayer = offsetPlayer.slice(0, 2);
      offsetPlayer = Number(offsetPlayer);

      enemyAtk.classList.toggle("hidden");
      mainIdle.classList.toggle("hidden");
      mainHit.classList.toggle("hidden");
      mainHit.classList.toggle("animate");
      enemyIdle.classList.toggle("hidden");
      animTimer();
      if (computerScore === 5) {
        mainIdle.classList.add("hidden");
        mainHit.classList.toggle("hidden");
        mainLose.classList.remove("hidden");
      }
    }, 1500);
  }, 500);
}
