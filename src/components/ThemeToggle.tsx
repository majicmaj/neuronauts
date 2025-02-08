import { Monitor, Moon, Sun } from "lucide-react";
import type { Theme } from "../hooks/useTheme";

interface ThemeToggleProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

export function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
      <button
        onClick={() => onChange("light")}
        className={`p-2 rounded-md transition-colors ${
          theme === "light"
            ? "bg-black dark:bg-white text-white dark:text-black"
            : "text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
        }`}
        aria-label="Light mode"
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange("system")}
        className={`p-2 rounded-md transition-colors ${
          theme === "system"
            ? "bg-black dark:bg-white text-white dark:text-black"
            : "text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
        }`}
        aria-label="System theme"
      >
        <Monitor className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange("dark")}
        className={`p-2 rounded-md transition-colors ${
          theme === "dark"
            ? "bg-black dark:bg-white text-white dark:text-black"
            : "text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
        }`}
        aria-label="Dark mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
