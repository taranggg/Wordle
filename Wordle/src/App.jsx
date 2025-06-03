import React, { useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./Home";

export default function App() {
  // lift authentication state
  const [username, setUsername] = useState("");

  // pass props down to Home
  const [darkMode, setDarkMode] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleGameEnd = useCallback((result) => {
    if (result.type !== "reset") {
      setGameHistory((prev) => [...prev, result]);
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          username ? (
            <Home
              username={username}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              gameHistory={gameHistory}
              onGameEnd={handleGameEnd}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/login"
        element={<Login setUser={setUsername} darkMode={darkMode} />}
      />
      <Route path="/register" element={<Register darkMode={darkMode} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
