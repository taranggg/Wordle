import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GuessRow from "./GuessRow";
import { WORDS } from "../util/words";
import HintCard from "./HintCard";
import { useKeyboard } from "../context/KeyboardContext";
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

function getWordHint(word) {
  if (!word) return [];
  return WORD_HINTS[word.toUpperCase()] || [];
}

export default function GameBoard({ username = "Player", onGameEnd, isDark }) {
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const { keyPressed, resetKey } = useKeyboard();

  useEffect(() => {
    if (keyPressed) {
      console.log("Key pressed from context:", keyPressed);
      if (gameOver) return;
      const key = keyPressed.toUpperCase();

      if (key === "BACKSPACE") {
        setCurrentInput((prev) => prev.slice(0, -1));
      } else if (key === "ENTER" && currentInput.length === WORD_LENGTH) {
        submitGuess();
      } else if (/^[A-Z]$/.test(key) && currentInput.length < WORD_LENGTH) {
        setCurrentInput((prev) => prev + key);
      }
      resetKey();
    }
  }, [keyPressed, resetKey]);

  console.log(targetWord);
  const availableHintCount =
    guesses.length >= 4 ? 2 : guesses.length >= 2 ? 1 : 0;

  useEffect(() => {
    const randomWord =
      WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
    setTargetWord(randomWord);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      const key = e.key.toUpperCase();

      if (key === "DEL" || key === "BACKSPACE") {
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
    } catch {
      return false;
    }
  };

  const submitGuess = async () => {
    const guess = currentInput.toUpperCase();
    const isValid = await checkIfWordIsValid(guess.toLowerCase());
    if (!isValid) {
      toast.error("Not a valid English word.", {
        duration: 5000,
      });
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
      onGameEnd?.({ result: "win", word: targetWord });
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      setIsWinner(false);
      setGameOver(true);
      onGameEnd?.({ result: "loss", word: targetWord });
    }
  };

  const hints = targetWord ? getWordHint(targetWord) : [];

  return (
    <div className="w-full flex flex-col items-center gap-10">
      <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30 p-4 sm:p-8">
        <div className="space-y-1 sm:space-y-3 w-full">
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
                  isDark={isDark}
                />
              );
            } else {
              return <GuessRow key={i} guess={null} isDark={isDark} />;
            }
          })}
        </div>
      </div>
      <div className="w-full max-w-md">
        <HintCard
          hints={hints}
          availableHintCount={availableHintCount}
          isDark={isDark}
        />
      </div>
    </div>
  );
}
