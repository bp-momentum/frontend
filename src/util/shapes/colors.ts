import { mulberry32 } from "@util/helper";

export const randomColor = (blueBoost: boolean, seed: number) => {
  const randomGen = mulberry32(seed);
  const hue = 360 * randomGen();
  let saturation = 40 + 55 * randomGen();
  let lightness = 80 + 10 * randomGen();

  if (blueBoost && hue > 215 && hue < 265) {
    const gain = 20;
    const blueness = 1 - Math.abs(hue - 240) / 25;
    const change = Math.floor(gain * blueness);
    lightness += change;
    saturation -= change;
  }

  return {
    hue: hue,
    saturation: saturation,
    lightness: lightness,
  };
};
