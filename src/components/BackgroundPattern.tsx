import useBackgroundPosition from "@/hooks/useBgPosition";
import usePatternBg from "@/hooks/usePatternBg";
import { useRef } from "react";

const BackgroundPattern = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y } = useBackgroundPosition(containerRef);

  const style = usePatternBg();
  return (
    <div className="absolute w-full h-full overflow-hidden">
      <div
        className="absolute w-full h-full"
        style={{
          ...style,
          backgroundPosition: `${x}% ${y}%`,
        }}
        ref={containerRef}
      />
      <div
        className="absolute w-[100vmin] h-[100vmin] rounded-full"
        style={{
          transform: "translate(-50%, -50%)",
          left: `${-x * 100}%`,
          top: `${-y * 100}%`,
          background:
            "radial-gradient(circle, rgba(180,0,255,0.75) 0%, rgba(0,255,255,0.75) 40%, rgba(255,255,255,0) 70%)",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
};

export default BackgroundPattern;
