export const initialColors = {
  coral: { r: 255, g: 127, b: 80 },
  darkTurquoise: { r: 0, g: 206, b: 209 },
  maroon: { r: 128, g: 0, b: 0 },
};

export const initialCounts = {
  coral: { r: 0, g: 0, b: 0 },
  darkTurquoise: { r: 0, g: 0, b: 0 },
  maroon: { r: 0, g: 0, b: 0 },
};

export type Counts = typeof initialCounts;
export type Color = keyof typeof initialColors;
export type ColorComponent = keyof (typeof initialColors)[Color];

export function createBgStyle(rgb: (typeof initialColors)[Color]) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}
