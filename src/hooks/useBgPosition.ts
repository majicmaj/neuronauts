import { useEffect, useState } from "react";

const useBackgroundPosition = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [x, setPositionX] = useState(0);
  const [y, setPositionY] = useState(0);

  useEffect(() => {
    // A simple mobile detection using the user agent
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile && window.DeviceOrientationEvent) {
      const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
        // DeviceOrientationEvent properties:
        // - gamma: left to right tilt in degrees, range roughly [-90, 90]
        // - beta: front to back tilt in degrees, range roughly [-180, 180]
        // Normalize values so that x and y are in the range [-1, 1]

        const normalizedX = event.gamma ? event.gamma / 90 : 0; // -1 (left tilt) to 1 (right tilt)
        const normalizedY = event.beta ? event.beta / 180 : 0; // -1 (forward tilt) to 1 (back tilt)

        // The negative sign mirrors the movement (adjust as needed)
        setPositionX(-normalizedX);
        setPositionY(-normalizedY);
      };

      window.addEventListener("deviceorientation", handleDeviceOrientation);

      return () => {
        window.removeEventListener(
          "deviceorientation",
          handleDeviceOrientation
        );
      };
    } else {
      // Fallback for non-mobile devices: use mouse movement
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
  }, [ref]);

  return { x, y };
};

export default useBackgroundPosition;
