module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        lavishly: ["'Lavishly Yours', cursive"],
        fredericka: ["'Fredericka the Great', cursive"],
        quicksand: ["'Quicksand'", "sans-serif"],
      },
      scale: {
        102: "1.02",
      },
    },
  },
  plugins: [],
  safelist: [
    "bg-green-500/50",
    "text-white",
    "border-green-600/80",
    "bg-yellow-400/50",
    "border-yellow-500/80",
    "bg-gray-400/50",
    "border-gray-500/80",
    "bg-green-500/70",
    "border-green-600/80",
    "bg-yellow-400/70",
    "border-yellow-500/80",
    "bg-gray-400/70",
    "border-gray-500/80",
    "bg-white/10",
    "border-white/20",
    "bg-black/10",
    "text-gray-900",
    "border-black/20",
  ],
};
