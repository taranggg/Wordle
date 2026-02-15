export const WINDOW_CHECKPOINTS = {
  MOBILE_MAX: 500,
  WINDOW_MIN: 501,
} as const;

export function getWindowWidth(): number {
  return window.innerWidth;
}

export function getWindowHeight(): number {
  return window.innerHeight;
}

export function getDeviceType(): "mobile" | "window" {
  const width = getWindowWidth();
  return width <= WINDOW_CHECKPOINTS.MOBILE_MAX ? "mobile" : "window";
}
