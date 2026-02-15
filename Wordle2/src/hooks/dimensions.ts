import { useEffect, useState } from "react";
import { WINDOW_CHECKPOINTS } from "../utils/windowDimension";

export function useWindowDimensions(): {
  windowWidth: number;
  isDesktop: boolean;
  isMobile: boolean;
} {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    windowWidth,
    isDesktop: windowWidth >= WINDOW_CHECKPOINTS.WINDOW_MIN,
    isMobile: windowWidth <= WINDOW_CHECKPOINTS.MOBILE_MAX,
  };
}
