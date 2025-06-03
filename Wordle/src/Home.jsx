import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import WordleGame from "./components/WordleGame";

export default function Home() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        try {
          const response = await fetch("http://localhost:5000/api/user", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (!response.ok) throw new Error("Failed to fetch user data");

          const userData = await response.json();
          setUser({
            username: userData.username,
            email: userData.email,
            stats: userData.gameStats,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("authToken");
        }
      }
    };

    fetchUserData();
  }, []);

  const handleGameEnd = useCallback((result) => {
    if (result.type !== "reset") {
      setGameHistory((prev) => [...prev, result]);
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    setIsSidebarOpen(false);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-slate-900" : "bg-amber-100"
      }`}
    >
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 p-2 rounded-lg bg-amber-200/80 dark:bg-slate-700/80 z-50
                   md:left-4"
        >
          ☰
        </button>
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        handleLogout={handleLogout}
        username={user?.username}
        gameHistory={gameHistory}
      />

      <main
        className={`p-8 max-w-4xl mx-auto transition-all duration-300 ${
          isSidebarOpen ? "ml-0 md:ml-64" : ""
        }`}
      >
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="fixed top-4 right-4 p-2 rounded-lg bg-amber-200/80 dark:bg-slate-700/80"
        >
          {darkMode ? (
            <img
              src="../src/assets/sun.png"
              alt="Light mode"
              className="w-6 h-6"
            />
          ) : (
            <img
              src="../src/assets/moon.png"
              alt="Dark mode"
              className="w-6 h-6"
            />
          )}
        </button>

        <WordleGame onGameEnd={handleGameEnd} username={user?.username} />
      </main>
    </div>
  );
}
