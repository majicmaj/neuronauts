import { Monitor, Moon, Sun } from "lucide-react";
import type { Theme } from "../hooks/useTheme";

interface ThemeToggleProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  return (
    <div className="z-10 relative group">
      <button
        onClick={() => onChange(theme)}
        className="p-3 rounded-lg bg-black dark:bg-white text-white dark:text-black"
        aria-label="Selected Theme"
      >
        {theme === "light" && <Sun className="w-4 h-4" />}
        {theme === "system" && <Monitor className="w-4 h-4" />}
        {theme === "dark" && <Moon className="w-4 h-4" />}
      </button>

      <div className="absolute top-0 left-0 flex flex-col gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
        {theme !== "light" && (
          <button
            onClick={() => onChange("light")}
            className="p-2 rounded-md text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
            aria-label="Light mode"
          >
            <Sun className="w-4 h-4" />
          </button>
        )}
        {theme !== "system" && (
          <button
            onClick={() => onChange("system")}
            className="p-2 rounded-md text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
            aria-label="System theme"
          >
            <Monitor className="w-4 h-4" />
          </button>
        )}
        {theme !== "dark" && (
          <button
            onClick={() => onChange("dark")}
            className="p-2 rounded-md text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
            aria-label="Dark mode"
          >
            <Moon className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
