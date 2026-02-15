import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, UserRound } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import wordleLogo from "../assets/wordlelogo.png";
import { useAuth } from "../context/AuthContext";
import { authWithGoogle } from "../api/client";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

const MotionDiv = motion.div;

interface LoginPageProps {
  isDark?: boolean;
}

export default function LoginPage({ isDark = false }: LoginPageProps) {
  const [loading, setLoading] = useState(false);
  const { user, setUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname ?? "/";

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true });
  }, [authLoading, user, navigate, from]);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        const res = await authWithGoogle(tokenResponse.access_token);
        setUser(res.user);
        toast.success("Welcome back!");
        navigate(from, { replace: true });
      } catch (err) {
        toast.error("Google login failed.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Google login failed.");
      setLoading(false);
    }
  });

  if (!authLoading && user) return null;

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
      <MotionDiv
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

        <div className="flex flex-col gap-4">
          <button
            onClick={() => loginWithGoogle()}
            type="button"
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 font-medium transition text-base shadow-sm"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            )}
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 border-white/40 hover:bg-white/10 transition text-sm font-medium opacity-90 text-inherit"
          >
            <UserRound className="w-5 h-5" />
            Continue as Guest
          </button>
        </div>

        <p className="text-xs text-center mt-6 opacity-70">
          © {new Date().getFullYear()} Wordle. All rights reserved.
        </p>
      </MotionDiv>
    </div>
  );
}
