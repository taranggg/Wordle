export const WINDOW_CHECKPOINTS = {
  MOBILE_MAX: 500,
  WINDOW_MIN: 501,
};

export function getWindowWidth() {
  return window.innerWidth;
}

export function getWindowHeight() {
  return window.innerHeight;
}

export function getDeviceType() {
  const width = getWindowWidth();
  if (width <= WINDOW_CHECKPOINTS.MOBILE_MAX) {
    return "mobile";
  } else {
    return "window";
  }
}
