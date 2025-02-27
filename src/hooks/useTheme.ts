import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

const getSavedTheme = () => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme") as Theme;
    return savedTheme || "system";
  }
  return "system";
};

const getSystemTheme = () => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getSavedTheme);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
    getSystemTheme
  );
  const root = window.document.documentElement;
  const effectiveTheme = theme === "system" ? systemTheme : theme;

  /* Add an event listener to update the theme when the system theme changes */
  useEffect(() => {
    const handleChange = (e: MediaQueryListEvent) =>
      setSystemTheme(e.matches ? "dark" : "light");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  /* Update the theme in the DOM when the theme changes */
  useEffect(() => {
    root.classList.remove("light", "dark");
    root.classList.add(effectiveTheme);

    localStorage.setItem("theme", theme);
  }, [theme, effectiveTheme, root]);

  console.log({ theme, effectiveTheme });

  return {
    theme,
    setTheme,
    effectiveTheme,
  };
}
