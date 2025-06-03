import React from "react";

export default function InputBox({ input, setInput, handleGuess, disabled }) {
  return (
    <div className="mt-4 flex space-x-2 justify-center">
      <input
        type="text"
        maxLength={5}
        value={input}
        onChange={(e) => setInput(e.target.value.toUpperCase())}
        className="w-40 text-center uppercase border p-2 rounded"
        disabled={disabled}
      />
      <button
        onClick={handleGuess}
        className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-500
          text-white rounded-xl shadow-lg hover:shadow-xl
          transition-all duration-150 hover:-translate-y-0.5
          active:scale-95 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M5 13l4 4L19 7"/>
        </svg>
        Check
      </button>
    </div>
  );
}
