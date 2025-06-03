import React, { useEffect, useState } from "react";
import GuessRow from "./GuessRow";
import OnScreenKeyboard from "./OnScreenKeyboard";
import { WORDS } from "../util/words";
import Modal from "./Modal";
import Hint from "./Hint";
import { WORD_HINTS } from "../util/wordHints";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

function getLetterStatus(guess, target) {
  const status = Array(WORD_LENGTH).fill("absent");
  const targetLetters = target.split("");
  const used = Array(WORD_LENGTH).fill(false);

  guess.split("").forEach((char, i) => {
    if (char === targetLetters[i]) {
      status[i] = "correct";
      used[i] = true;
    }
  });

  guess.split("").forEach((char, i) => {
    if (status[i] !== "correct") {
      const index = targetLetters.findIndex(
        (t, idx) => t === char && !used[idx]
      );
      if (index !== -1) {
        status[i] = "present";
        used[index] = true;
      }
    }
  });

  return status;
}

export default function WordleGame({ onGameEnd, username }) {
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  console.log(targetWord);

  useEffect(() => {
    const randomWord =
      WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
    setTargetWord(randomWord);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      const key = e.key.toUpperCase();

      if (key === "BACKSPACE") {
        setCurrentInput((prev) => prev.slice(0, -1));
      } else if (key === "ENTER" && currentInput.length === WORD_LENGTH) {
        submitGuess();
      } else if (/^[A-Z]$/.test(key) && currentInput.length < WORD_LENGTH) {
        setCurrentInput((prev) => prev + key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, currentInput]);

  const checkIfWordIsValid = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (!response.ok) return false;
      const data = await response.json();
      return Array.isArray(data) && data.length > 0;
    } catch (error) {
      console.error("Word validation error:", error);
      return false;
    }
  };

  const submitGameResult = async (resultType) => {
    try {
      await fetch("http://localhost:5000/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          score: guesses.length,
          result: resultType,
        }),
      });
    } catch (error) {
      console.error("Error submitting game result:", error);
    }
  };

  const submitGuess = async () => {
    const guess = currentInput.toUpperCase();
    const isValid = await checkIfWordIsValid(guess.toLowerCase());
    if (!isValid) {
      showToast("Not a valid English word.");
      return;
    }

    const status = getLetterStatus(guess, targetWord);
    const newGuess = { word: guess, status };
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrentInput("");

    if (guess === targetWord) {
      setIsWinner(true);
      setGameOver(true);
      await submitGameResult("win");
      onGameEnd({ result: "win", word: targetWord });
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setIsWinner(false);
      setGameOver(true);
      await submitGameResult("loss");
      onGameEnd({ result: "loss", word: targetWord });
    }
  };

  const showToast = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 2500);
  };

  const resetGame = () => {
    const newWord =
      WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
    setTargetWord(newWord);
    setGuesses([]);
    setCurrentInput("");
    setGameOver(false);
    setHintsUsed(0);
    onGameEnd({ type: "reset" });
  };

  const handleOnScreenKey = (key) => {
    if (gameOver) return;
    if (key === "ENTER" && currentInput.length === WORD_LENGTH) {
      submitGuess();
    } else if (key === "BACKSPACE") {
      setCurrentInput((prev) => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentInput.length < WORD_LENGTH) {
      setCurrentInput((prev) => prev + key);
    }
  };

  const handleHint = () => {
    setHintsUsed((prev) => {
      const newValue = Math.min(prev + 1, 2);
      return newValue;
    });
  };

  return (
    <div className="container relative w-full max-w-full mx-auto px-4">
      <div className="text-center mb-8">
        <h1
          className="text-3xl sm:text-4xl font-bold mb-4 md:mb-6 text-orange-400"
          style={{ fontFamily: "'Fredericka the Great', cursive" }}
        >
          WORDLE
        </h1>
        <p className="text-gray-600">Guess the hidden word in 6 tries</p>
      </div>

      <div className="space-y-1 sm:space-y-3 mb-2 sm:mb-6">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => {
          if (i < guesses.length) {
            return <GuessRow key={i} guess={guesses[i]} animate={true} />;
          } else if (i === guesses.length && !gameOver) {
            return (
              <GuessRow
                key={i}
                guess={{
                  word: currentInput.padEnd(WORD_LENGTH),
                  status: [],
                }}
              />
            );
          } else {
            return <GuessRow key={i} guess={null} />;
          }
        })}
      </div>

      {errorMessage && (
        <div className="px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base">
          {errorMessage}
        </div>
      )}

      <OnScreenKeyboard onKeyPress={handleOnScreenKey} />

      <div className="fixed  w-full px-4 py-2 sm:absolute sm:top-10 sm:right-4 sm:w-64 sm:p-4 sm:py-0 z-20">
        <Hint
          hints={
            WORD_HINTS[targetWord.toUpperCase()] || [
              "First letter: " + targetWord[0],
              "Contains: " + targetWord[2],
            ]
          }
          hintsUsed={hintsUsed}
          onHint={handleHint}
          attempts={guesses.length}
        />
      </div>
      {gameOver && (
        <Modal isOpen={gameOver} onClose={resetGame}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            {isWinner ? "🎉 You Won!" : "😞 You Lost!"}
          </h2>
          <p className="text-gray-600 mb-4">The word was: {targetWord}</p>
        </Modal>
      )}
    </div>
  );
}
