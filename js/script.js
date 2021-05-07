const guessedLettersList = document.querySelector(".guessed-letters");
const guessButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuessesClass = document.querySelector(".remaining");
const remainingGuessesDisplay = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");

let word = "Magnolia";    // test word if connection to API is unsuccessful
let guessedLetters = [];
let remainingGuesses = 8;

// choose a random word
const getWord = async function () {
    const res = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const words = await res.text();
    const wordArray = words.split("\n");
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    updateText(word);
};
// start the game
getWord();

// display a symbol in place of selected word's letters
const updateText = function (word) {        
    const updateTextLetters = [];
    for (const letter of word) {
        console.log(letter);
        updateTextLetters.push("⭐️");   // https://getemoji.com/ 
    }
    wordInProgress.innerText = updateTextLetters.join("");
};

guessButton.addEventListener("click", function (e) {
    e.preventDefault();
    // empty message paragraph
    message.innerText = "";
    // get what was entered in the input
    const guess = letterInput.value;
    // make sure input is a single letter
    const validator = validate(guess);

    if (validator) {
        // a letter has been entered, continue game
        makeGuess(guess);
    }
    letterInput.value = "";
    
    console.log(validator);
});

// validate the player's input
const validate = function (input) {
    const acceptedLetter = /[a-zA-Z]/;
    if (input.length === 0) {
        // the input is empty
        message.innerText = "Please enter a letter";
    } else if (input.length > 1) {
        // more than one letter was entered
        message.innerText = "Please enter only one letter";
    } else if (!input.match(acceptedLetter)) {
        // some other charater or symbol was entered
        message.innerText = "Please enter a letter from A to Z";
    } else {
        // correct entry 
        return input;
    }
}; 

const makeGuess = function (guess) {
    guess = guess.toUpperCase();
    if (guessedLetters.includes(guess)) {
        message.innerText = "You already guessed that letter. Try again."
    } else {
        guessedLetters.push(guess);
        console.log(guessedLetters);
        countRemainingGuesses(guess);
        // display already guessed letters
        pageUpdate();
        // check to see if new letter is in the word
        updateWordInProgress(guessedLetters);
    }
};

const pageUpdate = function () {
    // clear the list first
    guessedLettersList.innerHTML = "";

    for (const letter of guessedLetters) {
        const li = document.createElement("li");
        li.innerText = letter;
        guessedLettersList.append(li);
    }
};

// update the selected word to show the correctly guessed letters
const updateWordInProgress = function (guessedLetters) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    const revealWord = [];
    for (const letter of wordArray) {
        if (guessedLetters.includes(letter)) {
            revealWord.push(letter.toUpperCase());
        } else {
            revealWord.push("⭐️");
        }
    }
    // console.log(revealWord);
    updateWordInProgress.innerText = revealWord.join("");
    successfulGuess();
};

const countRemainingGuesses = function (guess) {
    const guessUpper = word.toUpperCase();
    if (!guessUpper.includes(guess)) {
        message.innerText = `Oops! The letter ${guess} is not in the word`;
        remainingGuesses -= 1;
    } else {
        message.innerText = `Good job! The letter ${guess} is in the word.`;
    }
    if (remainingGuesses === 0) {
        message.innerHTML = `Game Over. The word was <span class="highlight">${word}</span>.`;
    } else if (remainingGuesses === 1) {
        remainingGuessesDisplay.innerText = `${remainingGuesses} guess`;
    } else {
        remainingGuessesDisplay.innerText = `${remainingGuesses} guesses`;
    }
};

const successfulGuess = function () {
    if (word.toUpperCase() === updateWordInProgress.innerText) {
        message.classList.add("win");
        message.innerHTML = `<p class="highlight">You guessed the correct word! Congrats!</p>`;
        startOver();
    }
};

// show the play again button and hide the guess button when the game is over
const startOver = function () {
    guessButton.classList.add("hide");
    remainingGuessesDisplay.classList.add("hide");
    guessedLettersList.classList.add("hide");
    playAgainButton.classList.remove("hide");
};

playAgainButton.addEventListener("click", function () {
    // start new game
    message.classList.remove("win");
    guessedLetters = [];
    remainingGuesses = 8;
    remainingGuessesDisplay.innerText = `{remainingGuesses} guesses`;
    guessedLettersList.innerHTML = "";
    message.innerText = "";

    // get a new word
    getWord();

    // show the corrct UI elements 
    guessButton.classList.remove("hide");
    playAgainButton.classList.add("hide");
    remainingGuessesDisplay.classList.remove("hide");
    guessedLettersList.classList.remove("hide");
});

