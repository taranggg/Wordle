import { WINDOW_CHECKPOINTS } from "../util/windowDimension";

import { useEffect, useState } from "react";

export const useWindowDimensions = () => {
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
};
