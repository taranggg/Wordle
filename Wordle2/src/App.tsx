import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { KeyboardProvider } from "./context/KeyboardContext";
import Home from "./Home";

import Login from "./auth/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import type { DayWordData } from "./types/api";
import "./App.css";

export default function App() {
  const [dayWord, setDayWord] = useState<DayWordData>({
    word: "",
    meaning: "",
    phonetic: "",
  });

  useEffect(() => {
    async function fetchRandomWord() {
      try {
        const wordRes = await fetch(
          "https://random-word-api.herokuapp.com/word",
        );
        const wordArr = (await wordRes.json()) as string[];
        const word = wordArr[0];
        const res = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
        );
        const data = (await res.json()) as Array<{
          phonetic?: string;
          phonetics?: Array<{ text?: string }>;
          meanings?: Array<{
            definitions?: Array<{ definition?: string }>;
          }>;
        }>;

        const meaning =
          data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ??
          "No meaning found.";
        const phonetic =
          data?.[0]?.phonetic ??
          data?.[0]?.phonetics?.find((p) => p.text)?.text ??
          "";

        setDayWord({
          word: word ?? "Unknown",
          meaning: meaning ?? "No meaning found.",
          phonetic: phonetic ?? "",
        });
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
      <AuthProvider>
        <KeyboardProvider>
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              className: "toast-glass",
              success: { className: "toast-glass toast-glass-success" },
              error: { className: "toast-glass toast-glass-error" },
            }}
          />
          <Routes>
            <Route path="/" element={<Home dayWord={dayWord} />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </KeyboardProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
