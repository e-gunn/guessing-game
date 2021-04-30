const guessedLettersList = document.querySelector(".guessed-letters");
const guessButton = document.querySelector(".guess");
const letterInput = document.querySelector(".letter");
const wordInProgress = document.querySelector(".word-in-progress");
const remainingGuessesClass = document.querySelector(".remaining");
const remainingGuessesDisplay = document.querySelector(".remaining span");
const message = document.querySelector(".message");
const playAgainButton = document.querySelector(".play-again");

//test word before connecting to API
let word = "Magnolia";    
const guessedLetters = [];
let remainingGuesses = 8;

const getWord = async function () {
    const res = await fetch("https://gist.githubusercontent.com/skillcrush-curriculum/7061f1d4d3d5bfe47efbfbcfe42bf57e/raw/5ffc447694486e7dea686f34a6c085ae371b43fe/words.txt");
    const words = await res.text();
    const wordArray = words.split("\n");
    const randomIndex = Math.floor(Math.random() * wordArray.length);
    word = wordArray[randomIndex].trim();
    updateText(word);
};
getWord();

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
        countRemainingGuesses(guess);
        pageUpdate();
        updateWordInProgress(guessedLetters);
    }
};

const pageUpdate = function () {
    guessedLettersList.innerHTML = "";
    for (const letter of guessedLetters) {
        const li = document.createElement("li");
        li.innerText = letter;
        guessedLettersList.append(li);
    }
};

const updateWordInProgress = function (guessedLetters) {
    const wordUpper = word.toUpperCase();
    const wordArray = wordUpper.split("");
    const revealWord = [];
    for (const letter of wordArray) {
        if (guessedLetters.includes(letter)) {
            revealWord.push(letter.toUpperCase());
        } else {
            revealWord.push("●");
        }
    }
    // console.log(wordArray);
    UpdateWordInProgress.innerText = revealWord.join("");
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
    if (word.toUpperCase() === UpdateWordInProgress.innerText) {
        message.classList.add("win");
        message.innerText = `<p class="highlight">You guessed the correct word! Congrats!</p>`;
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
    message.innerText = "";
    guessedLettersList.innerHTML = "";

    getWord();

    guessButton.classList.remove("hide");
    playAgainButton.classList.add("hide");
    remainingGuessesDisplay.classList.remove("hide");
    guessedLettersList.classList.remove("hide");
});

