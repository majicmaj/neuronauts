import type { GuessResult } from "../types";

interface GuessListProps {
  guesses: GuessResult[];
}

export function GuessList({ guesses }: GuessListProps) {
  const sortedGuesses = [...guesses].sort((a, b) => {
    if (a.similarity === null) return 1;
    if (b.similarity === null) return -1;
    return b.similarity - a.similarity;
  });

  return (
    <div className="p-2 border border-zinc-200 rounded-xl w-full h-[calc(100vh-160px)] flex flex-col items-center gap-2 overflow-auto">
      {sortedGuesses.map((guess, index) => (
        <div
          key={`${guess.guess}-${index}`}
          className="max-w-md w-full text-black px-4 py-2 rounded-2xl bg-zinc-200 dark:bg-black dark:text-white"
        >
          <div className="flex justify-between gap-2 items-center">
            <span className="font-medium truncate">
              #{guesses?.indexOf(guess)} {guess.guess}
            </span>

            {guess.similarity !== null && (
              <span className="text-sm flex-1">
                {(guess.similarity * 100).toFixed(2)}%
              </span>
            )}
            {guess.similarity !== null ? (
              <div className="w-40 overflow-auto border-zinc-200 border-1 bg-white dark:bg-gray-800 rounded-full h-4">
                <div
                  className="bg-black dark:bg-white h-full rounded-full transition-all"
                  style={{ width: `${Math.max(0, guess.similarity) * 100}%` }}
                ></div>
              </div>
            ) : (
              <p className="text-sm text-zinc-500 truncate">{guess.error}</p>
            )}
          </div>
        </div>
      ))}
      {sortedGuesses.length === 0 && (
        <div className="px-4 py-2 rounded-2xl border-2 bg-black dark:bg-white text-white dark:text-black">
          <p className="text-sm text-zinc-100">No guesses yet</p>
        </div>
      )}
    </div>
  );
}
