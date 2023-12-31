// creating a class of functions. To shuffle cards & set cards & timer
class gameConditions {
  constructor(totalTime, cards) {
    // TO pass time and card from HTML
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timer = document.getElementById("time-remaining"); // To pull time from HTML
    this.audioController = new AudioController(); // To call the audio when game starts
  }
  startGame() {
    this.cardToCheck = null; // To check
    this.timeRemaining = this.totalTime;
    // Using this array we can put all matched cards here to determine victory/lose
    this.matchedCards = [];
    // Using this to test if card is flipped or not.
    this.busy = true;
    //creating this time out to take function
    setTimeout(() => {
      this.audioController.startMusic();
      //Shuffle function when game starts
      this.shuffleCards(this.cardsArray);
      this.countdown = this.startCountdown();
      this.busy = false;
    }, 100);
    this.hideCards();
    //reseting time when game resets
    this.timer.innerText = this.timeRemaining;
  }
  // create a countdown for the win loss condition
  startCountdown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;
      if (this.timeRemaining === 0) this.gameOver();
      // every 1 sec
    }, 1000);
  }
  canFlipCard(card) {
    return (
      !this.busy && //checking if card is flipped. Means its true as we declared it false
      //checks whether the variable matchedCards does not include the value of the card. If the card is not already matched, this condition evaluates to true.
      !this.matchedCards.includes(card) &&
      //This condition checks if the value of card is not equal to the value of this.cardToCheck. If the card is not the same as the one being checked, this condition evaluates to true.
      card !== this.cardToCheck
    );
  }
  flipCard(card) {
    // IF you can flip card you can do the below.
    if (this.canFlipCard(card)) {
      // Allows us to add visibility and flip card
      card.classList.add("visible");
      // Using if statement to check for match or !match
      if (this.cardToCheck) {
        this.checkForCardMatch(card);
      } else {
        this.cardToCheck = card;
      }
    }
  }
  shuffleCards(cardsArray) {
    //Loop
    for (let i = cardsArray.length - 1; i > 0; i--) {
      //math random creates a float that is 0-1 but not 1. (i+1) is so that it falls into the range of unshuffled elements
      let randIndex = Math.floor(Math.random() * (i + 1));
      // we are not shuffling the array itself. But rather the style in CSS.
      cardsArray[randIndex].style.order = i;
      // taking random item, random order in css and swapping
      cardsArray[i].style.order = randIndex;
    }
  }
  // Function to determine if user can flip card using boolean

  hideCards() {
    this.cardsArray.forEach((card) => {
      card.classList.remove("visible");
      // card.classList.remove("matched");
    });
  }
  gameOver() {
    clearInterval(this.countdown);
    // to pop up the game over screen
    document.getElementById("game-over-text").classList.add("visible");
    this.audioController.gameOver();
  }
  victory() {
    // reset timer
    clearInterval(this.countdown);
    // player music
    this.audioController.victory();
    // overlay
    document.getElementById("victory-text").classList.add("visible");
  }
  //to check for matched cards
  checkForCardMatch(card) {
    //matched cards
    if (this.getCardType(card) === this.getCardType(this.cardToCheck))
      this.cardMatch(card, this.cardToCheck);
    //mismatch cards
    else this.cardMismatch(card, this.cardToCheck);

    this.cardToCheck = null;
  }
  //function takes a card, when match card, push both cards to match class
  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    // adding matched class to card
    card1.classList.add("matched");
    card2.classList.add("matched");
    if (this.matchedCards.length === this.cardsArray.length) this.victory();
  }
  // function for card mismatch. if mismatch, will turn back
  cardMismatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      //flipping cards back
      card1.classList.remove("visible");
      card2.classList.remove("visible");
      // allows us not to flip any other card while mismatched cards are showing
      this.busy = false;
      // if u want the card to flip back faster
    }, 1000);
  }
  // return the type of card . the image src value to compare.
  getCardType(card) {
    return card.getElementsByClassName("value")[0].src;
  }
}
// creating audio controller for start and end song

class AudioController {
  constructor() {
    this.bgMusic = new Audio("Music/maple.mp3");
    this.victorySound = new Audio("Music/music.mp3");
    this.gameOverSound = new Audio("Music/music.mp3");
    this.bgMusic.volume = 0.05; //volume
    this.bgMusic.loop = true; // to loop
    this.victorySound.volume = 0.07; //volume
    this.victorySound.loop = true; // to loop
    this.gameOverSound.volume = 0.07; //volume
    this.gameOverSound.loop = true; // to loop
  }
  startMusic() {
    // start music function
    this.stopMusic();
    this.bgMusic.play();
  }
  stopMusic() {
    // start music function
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
    // this.victorySound.pause();
    // this.gameOverSound.pause();
    // this.victorysound.currentTime = 0;
    // this.gameOverSound.currentTime = 0;
  }
  restartMusic() {
    //restart music function
    this.stopMusic();
    this.bgMusic.play();
  }

  victory() {
    // victory music function
    this.stopMusic();
    this.victorySound.play();
  }
  gameOver() {
    // game over function
    this.stopMusic();
    this.gameOverSound.play();
  }
}
// To Start the Game upon loading of webpage
function ready() {
  // query selector
  //to get overlays from htmL to array(overlay). To Use to Code overlay later.
  let overlays = Array.from(document.getElementsByClassName("overlaytext"));
  // to get gamecards from html to array(card)
  let cards = Array.from(document.getElementsByClassName("card"));
  // Adding event listeners to Overlay
  overlays.forEach((overlay) => {
    overlay.addEventListener("click", () => {
      overlay.classList.remove("visible"); // to remove overlay upon click
      game.startGame(); // initialise game
    });
  });
  // Creating click function for the cards itself
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // to each click, we flip the card
      game.flipCard(card);
    });
  });
  //calling main function to ready function
  let game = new gameConditions(60, cards);
}
// Loading process. TO Load the page.
if (document.readyState === "loading") {
  //Once Dom content loaded all html file, it initialises
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}
