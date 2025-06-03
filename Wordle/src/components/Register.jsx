import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register({ darkMode }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      navigate("/login");
    } catch (err) {
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
            Create Account
          </h2>
          <p className={darkMode ? "text-gray-300" : "text-gray-500"}>
            Join the Wordle community
          </p>
        </div>

        {error && (
          <div
            className={`mb-6 p-3 rounded-lg ${
              darkMode ? "bg-red-800/30 text-red-200" : "bg-red-50 text-red-700"
            }`}
          >
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleRegister}>
          <div className="relative mb-4">
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Username:
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                darkMode
                  ? "bg-slate-600/50 border-slate-500 text-gray-100"
                  : "bg-gray-50/50 border-gray-200 text-gray-700"
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </div>

          <div className="relative mb-4">
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Full Name:
            </label>
            <input
              type="text"
              placeholder="Full Name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                darkMode
                  ? "bg-slate-600/50 border-slate-500 text-gray-100"
                  : "bg-gray-50/50 border-gray-200 text-gray-700"
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="relative mb-4">
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Age:
            </label>
            <input
              type="number"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                darkMode
                  ? "bg-slate-600/50 border-slate-500 text-gray-100"
                  : "bg-gray-50/50 border-gray-200 text-gray-700"
              }`}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Age"
              min="13"
            />
          </div>

          <div className="relative mb-4">
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Email Id:
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                darkMode
                  ? "bg-slate-600/50 border-slate-500 text-gray-100"
                  : "bg-gray-50/50 border-gray-200 text-gray-700"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Id"
            />
          </div>

          <div className="relative mb-6">
            <label
              className={`block mb-2 ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              Password:
            </label>
            <input
              type="password"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                darkMode
                  ? "bg-slate-600/50 border-slate-500 text-gray-100"
                  : "bg-gray-50/50 border-gray-200 text-gray-700"
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg active:scale-95"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        <p
          className={`mt-6 text-center ${
            darkMode ? "text-gray-300" : "text-gray-500"
          }`}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className={`font-medium ${
              darkMode ? "text-blue-300" : "text-blue-600"
            } hover:text-blue-400`}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    const registerResponse = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (registerResponse.ok) {
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (loginResponse.ok) {
        const data = await loginResponse.json();
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
      }
    }
  } catch (err) {
    setError("Something went wrong");
  } finally {
    setIsLoading(false);
  }
};
