import { useEffect, useState } from "react";

const useBackgroundPosition = (ref: React.RefObject<HTMLDivElement | null>) => {
  // A simple mobile check (you can improve this if needed)
  const isMobile =
    typeof window !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);

  // For mobile, start at 50 (i.e. 50%) so the background is centered.
  // For desktop, we keep the original initial state (0).
  const [x, setPositionX] = useState(isMobile ? 50 : 0);
  const [y, setPositionY] = useState(isMobile ? 50 : 0);

  useEffect(() => {
    if (isMobile && window.DeviceOrientationEvent) {
      // On mobile, use device orientation.
      // We assume gamma is the left/right tilt (roughly ±90°) and beta is the front/back tilt (roughly ±180°).
      // By mapping these to a ±50 range and subtracting from 50, no tilt (0°) gives 50%
      // while maximum tilt gives 0% or 100%.
      const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
        const normalizedX = event.gamma ? event.gamma / 90 : 0; // in [-1, 1]
        const normalizedY = event.beta ? event.beta / 180 : 0; // in [-1, 1]
        setPositionX(50 - normalizedX * 50);
        setPositionY(50 - normalizedY * 50);
      };

      window.addEventListener("deviceorientation", handleDeviceOrientation);
      return () => {
        window.removeEventListener(
          "deviceorientation",
          handleDeviceOrientation
        );
      };
    } else {
      // Desktop: use mouse movement.
      // (This branch is left unchanged from your original code.)
      const handleMouseMove = (event: MouseEvent) => {
        if (ref.current) {
          const { clientWidth, clientHeight } = ref.current;
          setPositionX(-(event.clientX / clientWidth));
          setPositionY(-(event.clientY / clientHeight));
        }
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [ref, isMobile]);

  // We also return the isMobile flag so the component can adjust any styling if needed.
  return { x, y, isMobile };
};

export default useBackgroundPosition;
