import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import wordleLogo from "../assets/wordlelogo.png";

export default function LoginPage({ isDark }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login attempt:", { email, password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #1e1e1e 0%, #3a3a3a 100%)"
          : "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`w-full max-w-sm p-6 rounded-2xl shadow-xl border backdrop-blur-md ${
          isDark
            ? "bg-white/10 border-white/20 text-white"
            : "bg-white/30 border-gray-300 text-gray-800"
        }`}
      >
        <div className="flex justify-center mb-4">
          <img
            src={wordleLogo}
            alt="Wordle Logo"
            width={120}
            draggable={false}
            className="drop-shadow-md"
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>
        <p className="text-sm text-center mb-6 opacity-70">
          Sign in to continue Wordle
        </p>

        <div className="space-y-4">
          <div className="relative">
            <Mail className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400 transition text-sm placeholder:text-gray-300"
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-400 transition text-sm placeholder:text-gray-300"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            <LogIn className="w-4 h-4" />
            Login
          </button>
        </div>

        {/* 👉 Register Link */}
        <p className="text-xs text-center mt-6 opacity-70">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-orange-500 hover:underline font-medium"
          >
            Register
          </Link>
        </p>

        <p className="text-xs text-center mt-3 opacity-70">
          © {new Date().getFullYear()} Wordle. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
