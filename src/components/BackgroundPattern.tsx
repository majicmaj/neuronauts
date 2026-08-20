import useBackgroundPosition from "@/hooks/useBgPosition";
import usePatternBg from "@/hooks/usePatternBg";
import { useRef } from "react";

const BackgroundPattern = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y } = useBackgroundPosition(containerRef);
  const style = usePatternBg();

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-70 dark:opacity-50"
        style={{
          ...style,
          backgroundPosition: `${x}% ${y}%`,
        }}
        ref={containerRef}
      />
      <div
        className="absolute h-[110vmin] w-[110vmin] rounded-full opacity-70 blur-2xl"
        style={{
          transform: "translate(-50%, -50%)",
          left: `${x}%`,
          top: `${y}%`,
          background:
            "radial-gradient(circle, rgba(180,0,255,0.75) 0%, rgba(0,255,255,0.75) 40%, rgba(255,255,255,0) 70%)",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
};

export default BackgroundPattern;
