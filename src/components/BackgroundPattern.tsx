import useBackgroundPosition from "@/hooks/useBgPosition";
import usePatternBg from "@/hooks/usePatternBg";
import { useRef } from "react";

const BackgroundPattern = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y, isMobile } = useBackgroundPosition(containerRef);
  const style = usePatternBg();

  return (
    <div className="absolute w-full h-full overflow-hidden">
      <div
        className="absolute w-full h-full"
        style={{
          ...style,
          // On mobile, x and y are already percentages (50 means center).
          // On desktop, x and y are negative fractions (e.g. -0.5 when centered).
          // We leave the desktop backgroundPosition as before.
          backgroundPosition: isMobile ? `${x}% ${y}%` : `${x}% ${y}%`,
        }}
        ref={containerRef}
      />
      <div
        className="absolute w-[100vmin] h-[100vmin] rounded-full"
        style={{
          transform: "translate(-50%, -50%)",
          // For the circle, we want it to be centered on mobile (i.e. at x/y === 50%).
          // On desktop we use the original mapping.
          left: isMobile ? `${x}%` : `${-x * 100}%`,
          top: isMobile ? `${y}%` : `${-y * 100}%`,
          background:
            "radial-gradient(circle, rgba(180,0,255,0.75) 0%, rgba(0,255,255,0.75) 40%, rgba(255,255,255,0) 70%)",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
};

export default BackgroundPattern;
