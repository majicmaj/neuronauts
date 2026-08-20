import { useTheme, type Theme } from "@/contexts/theme";
import { useEffect, useRef, useState } from "react";
import { MissionGlyph, type MissionGlyphName } from "./MissionGlyph";

const THEMES: Array<{ value: Theme; label: string; icon: MissionGlyphName }> = [
  { value: "light", label: "Light", icon: "daylight" },
  { value: "dark", label: "Dark", icon: "night" },
  { value: "system", label: "System", icon: "system" },
];

export function ThemeToggle() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const selected = THEMES.find((option) => option.value === theme) || THEMES[2];

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
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Change theme and close the dropdown
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative z-10">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="theme-toggle"
        aria-label={`Theme: ${selected.label}`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <MissionGlyph name={selected.icon} className="h-6 w-6" />
      </button>

      <div
        role="menu"
        className={`theme-menu absolute right-0 top-[calc(100%+0.5rem)] w-36 p-1 transition duration-150 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
        }`}
      >
        {THEMES.map((option) => {
          return (
          <button
            key={option.value}
            role="menuitem"
            onClick={() => handleThemeChange(option.value)}
            className="theme-menu-item"
          >
            <MissionGlyph name={option.icon} className="h-6 w-6" />
            <span className="flex-1 text-left">{option.label}</span>
            {theme === option.value && <MissionGlyph name="confirm" className="h-6 w-6 text-teal-700 dark:text-teal-300" />}
          </button>
          );
        })}
      </div>
    </div>
  );
}
