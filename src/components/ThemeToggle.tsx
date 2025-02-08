import { useTheme } from "@/contexts/ThemeContext";
import { Theme } from "@/hooks/useTheme";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [supportsHover, setSupportsHover] = useState(false);

  const { theme, setTheme } = useTheme();

  // Check if the device supports hover (typically desktops)
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(hover: hover)").matches) {
      setSupportsHover(true);
    }
  }, []);

  // Close the dropdown when clicking outside the component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Change theme and close the dropdown
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setOpen(false);
  };

  // Conditionally add hover events only on devices that support them.
  const containerProps = supportsHover
    ? {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
      }
    : {};

  return (
    <div ref={containerRef} className="z-10 relative" {...containerProps}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-3 rounded-lg bg-black dark:bg-white text-white dark:text-black"
        aria-label="Selected Theme"
      >
        {theme === "light" && <Sun className="w-4 h-4" />}
        {theme === "system" && <Monitor className="w-4 h-4" />}
        {theme === "dark" && <Moon className="w-4 h-4" />}
      </button>

      <div
        className={`absolute top-0 left-0 flex flex-col gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg transition-opacity duration-200 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {theme !== "light" && (
          <button
            onClick={() => handleThemeChange("light")}
            className="p-2 rounded-md text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
            aria-label="Light mode"
          >
            <Sun className="w-4 h-4" />
          </button>
        )}
        {theme !== "system" && (
          <button
            onClick={() => handleThemeChange("system")}
            className="p-2 rounded-md text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700"
            aria-label="System theme"
          >
            <Monitor className="w-4 h-4" />
          </button>
        )}
        {theme !== "dark" && (
          <button
            onClick={() => handleThemeChange("dark")}
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
