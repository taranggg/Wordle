import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GuessRow from "./GuessRow";
import { WORDS } from "../util/words";
import HintCard from "./HintCard";
import { useKeyboard } from "../context/KeyboardContext";
import { WORD_HINTS } from "../util/wordHints";
import { getDailyWord, getRandomWord } from "../api/client";

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
        (t, idx) => t === char && !used[idx],
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

export default function GameBoard({
  username = "Player",
  onGameEnd,
  isDark,
  useDailyWord = false,
  isGuest = false,
  compactHint = false,
  denseDesktop = false,
}) {
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { keyPressed, resetKey } = useKeyboard();

  const haptic = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  useEffect(() => {
    if (keyPressed) {
      if (gameOver || isSubmitting) return;
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
  }, [keyPressed, resetKey, gameOver, isSubmitting, currentInput]);

  const availableHintCount = isGuest
    ? guesses.length >= 2
      ? 1
      : 0
    : guesses.length >= 4
      ? 2
      : guesses.length >= 2
        ? 1
        : 0;

  useEffect(() => {
    if (useDailyWord) {
      getDailyWord()
        .then((data) => setTargetWord((data.word || "").toUpperCase()))
        .catch(() => {
          const fallback =
            WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
          setTargetWord(fallback);
        });
    } else {
      getRandomWord()
        .then((data) => setTargetWord((data.word || "").toUpperCase()))
        .catch(() => {
          const fallback =
            WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
          setTargetWord(fallback);
        });
    }
  }, [useDailyWord]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || isSubmitting) return;
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
  }, [gameOver, currentInput, isSubmitting]);

  const checkIfWordIsValid = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
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
    setIsSubmitting(true);
    haptic();
    let isValid = false;
    try {
      isValid = await checkIfWordIsValid(guess.toLowerCase());
    } catch {
      toast.error("Could not verify word. Check your connection.");
      setIsSubmitting(false);
      return;
    }
    if (!isValid) {
      toast.error("Not a valid English word.", { duration: 5000 });
      setIsSubmitting(false);
      return;
    }

    const status = getLetterStatus(guess, targetWord);
    const newGuess = { word: guess, status };
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    setCurrentInput("");
    setIsSubmitting(false);

    const attempts = newGuesses.length;
    if (guess === targetWord) {
      haptic();
      setIsWinner(true);
      setGameOver(true);
      onGameEnd?.({
        result: "win",
        word: targetWord,
        lastGuessStatus: status,
        attempts,
      });
    } else if (newGuesses.length >= MAX_ATTEMPTS) {
      haptic();
      setIsWinner(false);
      setGameOver(true);
      onGameEnd?.({
        result: "loss",
        word: targetWord,
        lastGuessStatus: status,
        attempts,
      });
    }
  };

  const hints = targetWord ? getWordHint(targetWord) : [];

  const isDense = compactHint || denseDesktop;
  return (
    <div
      className={`w-full flex flex-col items-center ${isDense ? "gap-2 sm:gap-3" : "gap-8 md:gap-10"} ${denseDesktop ? "max-w-md" : ""}`}
    >
      <div
        className={`relative flex flex-col items-center justify-center w-full mx-auto rounded-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/30 ${denseDesktop ? "p-2 sm:p-4" : "p-3 sm:p-6 md:p-8"} max-w-md`}
      >
        <div
          className={`w-full ${isDense ? "space-y-0.5 sm:space-y-1" : "space-y-1 sm:space-y-3"}`}
        >
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
        {isSubmitting && (
          <p className="text-sm text-white/70 mt-2 animate-pulse">
            Checking word…
          </p>
        )}
      </div>
      <div className={`w-full ${denseDesktop ? "max-w-md" : "max-w-md"}`}>
        <HintCard
          hints={hints}
          availableHintCount={availableHintCount}
          isDark={isDark}
          compact={denseDesktop}
        />
      </div>
    </div>
  );
}
