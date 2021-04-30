const guessedLettersList = document.querySelector(".guessed-letters");
const guessButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuesses = document.querySelector(".remaining");
const remainingGuessesDisplay = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");

//test word before connecting to API
const word = "Magnolia";    
const guessedLetters = [];

const updateText = function (word) {        
    const updateTextLetters = [];
    for (const text of word) {
        console.log(text);
        updateTextLetters.push("●");
    }
    wordInProgress.innerText = updateTextLetters.join("");
};

updateText(word);

guessButton.addEventListener("click", function (e) {
    e.preventDefault();
    // empty message paragraph
    message.innerText = "";
    // get what was entered in the input
    const guess = letterInput.value;
    // make sure input is a single letter
    const validator = validate(guess);
    if (validator) {
        makeGuess(guess);
    }
    letterInput.value = "";
    
    console.log(validator);
});

// validate the player's input
const validate = function (input) {
    const acceptedLetter = /[a-zA-Z]/;
    if (input.length === 0) {
        message.innerText = "Please enter a letter.";
    } else if (input.length > 1) {
        message.innerText = "Please enter only one letter.";
    } else if (!input.match(acceptedLetter)) {
        message.innerText = "Please enter a letter from A to Z.";
    } else {
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
    }
};

