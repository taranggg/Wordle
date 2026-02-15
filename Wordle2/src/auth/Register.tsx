import { useReducer, useState } from "react";
import { formReducer, initialState, validateForm } from "./reducer";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const MotionDiv = motion.div;

export default function Register() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof initialState, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: e.target.name as keyof typeof initialState,
      value: e.target.value,
    });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(state);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        firstName: state.firstName.trim(),
        lastName: (state.lastName ?? "").trim(),
        username: state.username.trim(),
        email: state.email.trim(),
        password: state.password,
        gender: state.gender || undefined,
      };
      const data = await signup(payload);
      setUser(data.user);
      toast.success("Account created. Welcome!");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#1a1a1a] p-4">
      <MotionDiv
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-4xl p-8 rounded-3xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl text-white"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold font-serif">Create an account</h1>
          <p className="text-white/70 text-sm mt-1">
            Join the Wordle community
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {(
            [
              { name: "firstName", label: "First Name", type: "text" as const },
              { name: "lastName", label: "Last Name", type: "text" as const },
              { name: "username", label: "Username", type: "text" as const },
              { name: "email", label: "Email Id", type: "email" as const },
              {
                name: "password",
                label: "Password",
                type: "password" as const,
              },
              {
                name: "confirmPassword",
                label: "Confirm Password",
                type: "password" as const,
              },
            ] as Array<{
              name: keyof typeof initialState;
              label: string;
              type: string;
            }>
          ).map(({ name, label, type }) => (
            <div key={name} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{label}</label>
              <input
                type={type}
                name={name}
                placeholder={label}
                value={state[name] ?? ""}
                onChange={handleChange}
                className={`px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errors[name] ? "border-red-400" : ""
                }`}
                required={name !== "lastName"}
                disabled={loading}
              />
              {errors[name] && (
                <p className="text-red-400 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={state.gender}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white focus:outline-none ${
                errors.gender ? "border-red-400" : ""
              }`}
              disabled={loading}
            >
              <option value="">Select Gender (optional)</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="preferNotToSay">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="text-red-400 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          <p className="text-white/60 text-xs md:col-span-2">
            Password must be at least 8 characters and contain a letter and a
            number.
          </p>

          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </div>
        </form>

        <p className="text-sm text-center mt-6 text-white/70">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </MotionDiv>
    </div>
  );
}
