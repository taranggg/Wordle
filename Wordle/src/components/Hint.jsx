import React from "react";

export default function Hint({ hints, hintsUsed, onHint, attempts }) {
  return (
    <div className="hint-container mb-4">
      <button
        onClick={onHint}
        disabled={hintsUsed >= 2 || attempts < 2 + hintsUsed}
        className="bg-amber-500 hover:bg-amber-700 dark:bg-slate-500 dark:hover:bg-slate-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        Hint ({2 - hintsUsed} left)
      </button>
      {hintsUsed > 0 && (
        <div className="mt-2 p-3 rounded">
          <p className="text-gray-700">
            {hints[hintsUsed - 1] || "Hint not available"}
          </p>
        </div>
      )}
    </div>
  );
}
