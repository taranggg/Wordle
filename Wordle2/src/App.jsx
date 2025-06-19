import { Toaster } from "react-hot-toast";
import "./App.css";
import Home from "./Home";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { useEffect, useState } from "react";
import { KeyboardProvider } from "./context/KeyboardContext.jsx";
import { Routes, Route } from "react-router-dom";
import Register from "./auth/Register.jsx";
import Login from "./auth/login.jsx";

function App() {
  const [dayWord, setDayWord] = useState({
    word: "",
    meaning: "",
    phonetic: "",
  });

  useEffect(() => {
    async function fetchRandomWord() {
      try {
        const wordRes = await fetch(
          "https://random-word-api.herokuapp.com/word"
        );
        const wordArr = await wordRes.json();
        const word = wordArr[0];
        const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );
        const data = await res.json();

        const meaning =
          data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ||
          "No meaning found.";
        const phonetic =
          data?.[0]?.phonetic ||
          (data?.[0]?.phonetics?.find((p) => p.text)?.text ?? "");

        setDayWord({ word, meaning, phonetic });
      } catch {
        setDayWord({
          word: "Unknown",
          meaning: "No meaning found.",
          phonetic: "",
        });
      }
    }
    fetchRandomWord();
  }, []);
  return (
    <ThemeProvider>
      <KeyboardProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Home dayWord={dayWord} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </KeyboardProvider>
    </ThemeProvider>
  );
}

export default App;
