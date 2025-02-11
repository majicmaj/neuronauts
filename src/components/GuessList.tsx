import { useState } from "react";
import type { GuessResult } from "../types";
import GuessItem from "./GuessItem";

interface GuessListProps {
  guesses: GuessResult[];
}

const sortBySimilarity = (a: GuessResult, b: GuessResult) => {
  if (a.similarity === null) return 1;
  if (b.similarity === null) return -1;
  return b.similarity - a.similarity;
};

const sortByReverseOrder = (a: GuessResult, b: GuessResult) => {
  return -1;
};

const filterDuplicates = (guesses: GuessResult[]) => {
  const seen = new Set();
  return guesses.filter((guess) => {
    const key = `${guess.guess}-${guess.similarity}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export function GuessList({ guesses }: GuessListProps) {
  const [sort, setSort] = useState<"default" | "similarity">("similarity");

  const sortedGuesses = [...guesses].sort(
    sort === "similarity" ? sortBySimilarity : sortByReverseOrder
  );

  const mostRecentGuess = guesses[guesses.length - 1];

  return (
    <div className="bg-white dark:bg-black p-2 border border-zinc-200 dark:border-zinc-800 lg:p-2 pb-0 rounded-[20px] w-full h-[calc(100vh-160px)] flex flex-col items-center gap-2 overflow-auto">
      <div className="grid grid-cols-2 gap-1 w-full bg-white dark:bg-black text-black dark:text-white rounded-full p-1">
        <button
          className={`px-2 py-1 transition-all rounded-full ${
            sort === "default"
              ? "bg-black text-white dark:text-black dark:bg-white"
              : ""
          }`}
          onClick={() => setSort("default")}
        >
          Newest
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

      <div className="rounded-xl w-full h-[calc(100vh-160px)] flex flex-col items-center gap-2 overflow-auto">
        {mostRecentGuess && (
          <div className="max-w-md w-full bg-black text-white border px-4 py-4 rounded-2xl dark:bg-white dark:text-black">
            <div className="flex justify-between gap-2 items-center">
              <span className="flex-1 font-medium truncate">
                {mostRecentGuess.guess}
              </span>
              <div className="flex justify-between gap-1 items-center flex-col lg:flex-row lg:gap-2">
                <div className="flex justify-between gap-2 items-center">
                  <span className="w-10 font-normal text-sm truncate opacity-60">
                    #{guesses?.indexOf(mostRecentGuess) + 1}
                  </span>

                  {mostRecentGuess.similarity !== null && (
                    <span className="w-14 text-sm opacity-80">
                      {(mostRecentGuess.similarity * 100).toFixed(2)}%
                    </span>
                  )}
                </div>
                {mostRecentGuess.similarity !== null ? (
                  <div className="w-40 overflow-auto bg-zinc-800 dark:bg-zinc-200 rounded-full h-3">
                    <div
                      className="bg-[#0AC8B9] h-full rounded-full transition-all"
                      style={{
                        width: `${
                          Math.max(0, mostRecentGuess.similarity) * 100
                        }%`,
                        backgroundSize: "100% 100%",
                      }}
                    ></div>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 truncate">
                    {mostRecentGuess.error}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="border-b border-zinc-300 dark:border-zinc-700 w-[calc(100%-64px)] my-2" />

        {filterDuplicates(sortedGuesses).map((guess, index) => (
          <GuessItem key={index} guess={guess} index={guesses.indexOf(guess)} />
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
