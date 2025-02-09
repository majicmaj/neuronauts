import { useEffect, useState } from "react";

const useBackgroundPosition = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [x, setPositionX] = useState(0);
  const [y, setPositionY] = useState(0);

  useEffect(() => {
    // Add event listeners for mouse movement
    const handleMouseMove = (event: MouseEvent) => {
      const { clientWidth, clientHeight } = ref.current!;
      setPositionX(-(event.clientX / clientWidth));
      setPositionY(-(event.clientY / clientHeight));
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return { x, y };
};

export default useBackgroundPosition;
