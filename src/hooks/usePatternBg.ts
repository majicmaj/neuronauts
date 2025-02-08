import { BG_STYLE, BG_STYLE_DARK } from "@/constants/bgStyle";
import { useTheme } from "@/contexts/ThemeContext";

const usePatternBg = () => {
  const { effectiveTheme } = useTheme();

  const isDark = effectiveTheme === "dark";
  const style = !isDark ? BG_STYLE : BG_STYLE_DARK;

  return style;
};

export default usePatternBg;
