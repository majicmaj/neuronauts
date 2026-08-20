import React, { useEffect, useState } from "react";
import { ThemeContext, type Theme } from "./theme";

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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getSavedTheme);
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
    getSystemTheme
  );
  const root = window.document.documentElement;
  const effectiveTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    const handleChange = (e: MediaQueryListEvent) =>
      setSystemTheme(e.matches ? "dark" : "light");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    root.classList.remove("light", "dark");
    root.classList.add(effectiveTheme);
    localStorage.setItem("theme", theme);
  }, [theme, effectiveTheme, root]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
