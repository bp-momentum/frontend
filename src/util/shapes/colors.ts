export const randomColor = (blueBoost: boolean) => {
  const hue = 360 * Math.random();
  let saturation = 40 + 55 * Math.random();
  let lightness = 80 + 10 * Math.random();

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
