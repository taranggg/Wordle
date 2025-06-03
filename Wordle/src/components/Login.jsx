import React, { useState } from "react";
import { saveToken } from "../auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login({ setUser, darkMode }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      saveToken(data.token);
      setUser(data.username);
      navigate("/");
    } catch (err) {
      console.log(err);

      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode
          ? "bg-slate-700/80 backdrop-blur-lg"
          : "bg-amber-200/80 backdrop-blur-lg"
      } `}
    >
      <div
        className={`w-full max-w-md rounded-2xl p-8 shadow-xl ${
          darkMode ? "bg-slate-700/90" : "bg-white/90"
        }`}
      >
        <div className="text-center mb-8">
          <h2
            className={`text-4xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Welcome Back
          </h2>
          <p className={darkMode ? "text-gray-300" : "text-gray-500"}>
            Sign in to continue to Wordle
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Username
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 peer ${
                darkMode
                  ? "bg-slate-600/50 border-slate-500 text-gray-100 focus:ring-blue-400"
                  : "bg-gray-50/50 border-gray-200 text-gray-700 focus:ring-blue-500"
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>

          <div className="relative mt-4">
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 peer ${
                darkMode
                  ? "bg-slate-600/50 border-slate-500 text-gray-100 focus:ring-blue-400"
                  : "bg-gray-50/50 border-gray-200 text-gray-700 focus:ring-blue-500"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-6 rounded-lg font-semibold shadow-md ${
              darkMode
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          {error && (
            <div
              className={`mb-6 p-3 rounded-lg ${
                darkMode
                  ? "bg-red-800/30 text-red-200"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {error}
            </div>
          )}
        </form>

        <p
          className={`mt-6 text-center ${
            darkMode ? "text-gray-300" : "text-gray-500"
          }`}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            className={`hover:text-blue-400 font-medium ${
              darkMode ? "text-blue-300" : "text-blue-600"
            }`}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
