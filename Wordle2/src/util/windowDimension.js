// Utility to get window dimension checkpoints for mobile and window (desktop/tablet)

export const WINDOW_CHECKPOINTS = {
  MOBILE_MAX: 500, // max width for mobile devices
  WINDOW_MIN: 501, // min width for window (tablet/desktop)
};

/**
 * Returns the current window width.
 */
export function getWindowWidth() {
  return window.innerWidth;
}

/**
 * Returns the current window height.
 */
export function getWindowHeight() {
  return window.innerHeight;
}

/**
 * Returns the current device type based on window width.
 * @returns {'mobile' | 'window'}
 */
export function getDeviceType() {
  const width = getWindowWidth();
  if (width <= WINDOW_CHECKPOINTS.MOBILE_MAX) {
    return "mobile";
  } else {
    return "window";
  }
}
