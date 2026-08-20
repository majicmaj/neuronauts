import { RefObject, useEffect, useMemo, useState } from "react";

interface Position {
  x: number;
  y: number;
}

const useBackgroundPosition = (ref: RefObject<HTMLDivElement | null>) => {
  const isMobile = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
    []
  );
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });

  useEffect(() => {
    let frame = 0;
    let pending: Position | null = null;

    const schedule = (next: Position) => {
      pending = next;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (pending) setPosition(pending);
      });
    };

    if (isMobile && window.DeviceOrientationEvent) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        const x = 50 - Math.max(-1, Math.min(1, (event.gamma || 0) / 90)) * 18;
        const y = 50 - Math.max(-1, Math.min(1, (event.beta || 0) / 180)) * 18;
        schedule({ x, y });
      };
      window.addEventListener("deviceorientation", handleOrientation, { passive: true });
      return () => {
        window.removeEventListener("deviceorientation", handleOrientation);
        if (frame) window.cancelAnimationFrame(frame);
      };
    }

    const handlePointerMove = (event: PointerEvent) => {
      const width = ref.current?.clientWidth || window.innerWidth;
      const height = ref.current?.clientHeight || window.innerHeight;
      schedule({
        x: 42 + (event.clientX / width) * 16,
        y: 42 + (event.clientY / height) * 16,
      });
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [isMobile, ref]);

  return { x: position.x, y: position.y, isMobile };
};

export default useBackgroundPosition;
