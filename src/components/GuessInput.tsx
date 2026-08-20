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
        className="mission-input min-w-0 flex-1"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim() || input.trim().includes(" ")}
        className="neuron-primary-button grid w-12 shrink-0 place-items-center px-0"
        aria-label="Send guess"
      >
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
}
