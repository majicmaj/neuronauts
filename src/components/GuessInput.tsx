import { Send } from "lucide-react";
import React, { useState } from "react";

interface GuessInputProps {
  onGuess: (guess: string) => void;
  disabled?: boolean;
}

export function GuessInput({ onGuess, disabled }: GuessInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = input.trim();
    if (value.split(" ").length !== 1) {
      return;
    }

    if (value.trim()) {
      onGuess(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md h-9">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        placeholder="Enter your guess..."
        className="px-3 flex-1 rounded-full bg-zinc-200/80 bg-white dark:bg-black text-black dark:text-white placeholder-gray-500 focus:outline-none"
      />
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className="p-2 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
