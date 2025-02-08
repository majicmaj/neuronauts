import { GuessResult } from "@/types";

const GuessItem = ({
  guess,
  index,
  invert = false,
}: {
  guess: GuessResult;
  index: number;
  invert?: boolean;
}) => {
  const colorStyles = invert
    ? "bg-zinc-800 dark:bg-white text-white dark:text-black border-zinc-800 dark:border-zinc-200"
    : "bg-white dark:bg-zinc-800 text-black dark:text-white border-zinc-200 dark:border-zinc-800";

  return (
    <div
      className={`max-w-md w-full border px-4 py-4 rounded-2xl ${colorStyles}`}
    >
      <div className="flex justify-between gap-2 items-center">
        <span className="flex-1 font-medium truncate">{guess.guess}</span>

        <div className="flex justify-between gap-1 items-center flex-col lg:flex-row lg:gap-2">
          <div className="flex justify-between gap-2 items-center">
            <span className="w-10 font-normal text-sm truncate opacity-60">
              #{index + 1}
            </span>

            {guess.similarity !== null && (
              <span className="w-14 text-sm opacity-80">
                {(guess.similarity * 100).toFixed(2)}%
              </span>
            )}
          </div>

          {guess.similarity !== null ? (
            <div className="w-40 overflow-auto bg-zinc-200/80 dark:bg-zinc-900 rounded-full h-3">
              <div
                className="bg-[#0AC8B9] h-full rounded-full transition-all"
                style={{
                  width: `${Math.max(0, guess.similarity) * 100}%`,
                  backgroundSize: "100% 100%",
                }}
              ></div>
            </div>
          ) : (
            <p className="text-sm text-zinc-500 truncate">{guess.error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuessItem;
