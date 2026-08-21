import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { MissionGlyph } from "./MissionGlyph";

interface GuessInputProps {
  onGuess: (guess: string) => void;
  onTypingChange?: (isTyping: boolean) => void;
  disabled?: boolean;
  inputId?: string;
  submitLabel?: string;
}

export function GuessInput({
  onGuess,
  onTypingChange,
  disabled,
  inputId = "guess-input",
  submitLabel,
}: GuessInputProps) {
  const [input, setInput] = useState("");
  const typing = useRef(false);
  const idleTimer = useRef<number | null>(null);

  const stopTyping = useCallback(() => {
    if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
    idleTimer.current = null;
    if (!typing.current) return;
    typing.current = false;
    onTypingChange?.(false);
  }, [onTypingChange]);

  const handleChange = (value: string) => {
    setInput(value);
    if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
    if (!value.trim()) {
      stopTyping();
      return;
    }
    if (!typing.current) {
      typing.current = true;
      onTypingChange?.(true);
    }
    idleTimer.current = window.setTimeout(stopTyping, 1_400);
  };

  useEffect(() => {
    if (disabled) stopTyping();
  }, [disabled, stopTyping]);

  useEffect(
    () => () => {
      stopTyping();
    },
    [stopTyping]
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const value = input.trim();
    if (!value || value.includes(" ")) return;
    stopTyping();
    onGuess(value);
    setInput("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-w-0 flex-1 gap-2">
      <label className="sr-only" htmlFor={inputId}>Guess a word</label>
      <input
        id={inputId}
        type="text"
        value={input}
        onChange={(event) => handleChange(event.target.value)}
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
        className={`neuron-primary-button guess-submit-button shrink-0 ${submitLabel ? "has-label" : ""}`}
        aria-label="Send guess"
      >
        <MissionGlyph name="transmit" className="h-6 w-6" />
        {submitLabel && <span className="guess-submit-label">{submitLabel}</span>}
      </button>
    </form>
  );
}
