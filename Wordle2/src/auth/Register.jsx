import React, { useReducer, useState } from "react";
import { formReducer, initialState, validateForm } from "./reducer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Register() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: e.target.name,
      value: e.target.value,
    });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm(state);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log("Form submitted:", state);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#2c2c2c] to-[#1a1a1a] p-4">
      <motion.div
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
          {[
            { name: "name", label: "First Name" },
            { name: "lastName", label: "Last Name" },
            { name: "username", label: "Username" },
            { name: "email", label: "Email Id", type: "email" },
            { name: "password", label: "Password", type: "password" },
            {
              name: "confirmPassword",
              label: "Confirm Password",
              type: "password",
            },
            { name: "age", label: "Age", type: "number" },
          ].map(({ name, label, type = "text" }) => (
            <div key={name} className="flex flex-col">
              <label className="text-sm font-medium mb-1">{label}</label>
              <input
                type={type}
                name={name}
                placeholder={label}
                value={state[name] || ""}
                onChange={handleChange}
                className={`px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 ${
                  errors[name] ? "border-red-400" : ""
                }`}
                required
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
              required
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="preferNotToSay">Prefer not to say</option>
            </select>
            {errors.gender && (
              <p className="text-red-400 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          <div className="md:col-span-2 mt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition"
            >
              Create Account
            </button>
          </div>
        </form>

        <p className="text-sm text-center mt-6 text-white/70">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
