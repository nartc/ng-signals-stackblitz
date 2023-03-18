export const initialColors = {
  coral: { r: 255, g: 127, b: 80 },
  darkTurquoise: { r: 0, g: 206, b: 209 },
  maroon: { r: 128, g: 0, b: 0 },
};

export type Color = keyof typeof initialColors;

export function createBgStyle(rgb: (typeof initialColors)[Color]) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}
