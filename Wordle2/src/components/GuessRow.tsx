import GuessCell from "./GuessCell";

interface GuessRowProps {
  guess: { word: string; status: string[] } | null;
  isDark?: boolean;
  compact?: boolean;
}

const WORD_LENGTH = 5;

export default function GuessRow({
  guess,
  isDark = false,
  compact = false,
}: GuessRowProps) {
  return (
    <div
      className={`flex justify-center ${compact ? "space-x-1.5" : "space-x-1"}`}
    >
      {Array.from({ length: WORD_LENGTH }).map((_, j) => {
        const letter = guess ? (guess.word[j] ?? "") : "";
        const status = guess ? (guess.status[j] ?? "") : "";
        return (
          <GuessCell
            key={j}
            letter={letter}
            status={status}
            isDark={isDark}
            compact={compact}
          />
        );
      })}
    </div>
  );
}
