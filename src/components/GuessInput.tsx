import { Send } from "lucide-react";
import { FormEvent, useState } from "react";

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
}

export function GuessInput({ onGuess, disabled }: GuessInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const value = input.trim();
    if (!value || value.includes(" ")) return;
    onGuess(value);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-1 gap-2">
      <label className="sr-only" htmlFor="guess-input">Guess a word</label>
      <input
        id="guess-input"
        type="text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        disabled={disabled}
        maxLength={40}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck="false"
        placeholder="Plot a word…"
        className="min-w-0 flex-1 rounded-2xl border border-zinc-200 bg-white/90 px-4 py-3 text-base text-black outline-none transition placeholder:text-zinc-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-950/90 dark:text-white"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim() || input.trim().includes(" ")}
        className="grid w-12 shrink-0 place-items-center rounded-2xl bg-zinc-950 text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 dark:bg-white dark:text-black dark:hover:bg-teal-300"
        aria-label="Send guess"
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
}
