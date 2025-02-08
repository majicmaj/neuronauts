import { useState } from "react";
import type { GuessResult } from "../types";

interface GuessListProps {
  guesses: GuessResult[];
}

const sortBySimilarity = (a: GuessResult, b: GuessResult) => {
  if (a.similarity === null) return 1;
  if (b.similarity === null) return -1;
  return b.similarity - a.similarity;
};

export function GuessList({ guesses }: GuessListProps) {
  const [sort, setSort] = useState<"default" | "similarity">("similarity");

  const sortedGuesses = [...guesses].sort(
    sort === "similarity" ? sortBySimilarity : undefined
  );

  return (
    <div className="backdrop-blur-[2px] p-2 bg-zinc-100/80 dark:bg-zinc-900/80 lg:p-2 pb-0 rounded-[20px] w-full h-[calc(100vh-160px)] flex flex-col items-center gap-2 overflow-auto">
      <div className="grid grid-cols-2 gap-1 w-full bg-white dark:bg-black text-black dark:text-white rounded-full p-1">
        <button
          className={`px-2 py-1 transition-all rounded-full ${
            sort === "default"
              ? "bg-black text-white dark:text-black dark:bg-white"
              : ""
          }`}
          onClick={() => setSort("default")}
        >
          Default
        </button>
        <button
          className={`px-2 py-1 transition-all rounded-full ${
            sort === "similarity"
              ? "bg-black text-white dark:text-black dark:bg-white"
              : ""
          }`}
          onClick={() => setSort("similarity")}
        >
          Similarity
        </button>
      </div>
      <div className="p-2 rounded-xl w-full h-[calc(100vh-160px)] flex flex-col items-center gap-2 overflow-auto">
        {sortedGuesses.map((guess, index) => (
          <div
            key={`${guess.guess}-${index}`}
            className="max-w-md w-full text-black px-4 py-4 rounded-2xl bg-zinc-200 dark:bg-black dark:text-white"
          >
            <div className="flex justify-between gap-2 items-center">
              <span className="flex-1 font-medium truncate">{guess.guess}</span>

              <div className="flex justify-between gap-1 items-center flex-col lg:flex-row lg:gap-2">
                <div className="flex justify-between gap-2 items-center">
                  <span className="w-8 font-normal text-sm truncate opacity-60">
                    #{guesses?.indexOf(guess) + 1}
                  </span>

                  {guess.similarity !== null && (
                    <span className="w-12 text-sm opacity-80">
                      {(guess.similarity * 100).toFixed(2)}%
                    </span>
                  )}
                </div>
                {guess.similarity !== null ? (
                  <div className="w-40 overflow-auto bg-white dark:bg-zinc-800 rounded-full h-3">
                    <div
                      className="bg-[#0AC8B9] h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(0, guess.similarity) * 100}%`,
                        backgroundSize: "100% 100%",
                      }}
                    ></div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 truncate">
                    {guess.error}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {sortedGuesses.length === 0 && (
          <div className="px-4 py-2 rounded-2xl bg-zinc-200 dark:bg-black dark:text-white text-black">
            <p className="text-sm">No guesses yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
