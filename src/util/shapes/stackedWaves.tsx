import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  HANDLE_MIN_OFFSET,
  HANDLE_RANDOMNESS,
  maxSegmentLength,
  shapeProps,
} from ".";
import { randomColor } from "./colors";
import Tween from "rc-tween-one";

const generateWave = ({
  orientation,
  closing,
  points,
  offset,
  length,
}: {
  orientation: string;
  closing: {
    p1: {
      x: number;
      y: number;
    };
    p2: {
      x: number;
      y: number;
    };
  };
  points: number;
  offset: number;
  length: number;
}) => {
  const scaledHANDLE_MIN_OFFSET = (HANDLE_MIN_OFFSET / 100) * length;
  const scaledHANDLE_RANDOMNESS = (HANDLE_RANDOMNESS / 100) * length;

  let pts =
    orientation === "-"
      ? Array.from({ length: points }, (_, i) => {
          return {
            x: (i * length) / (points - 1),
            y: offset + (Math.random() * length) / 7 - length / 9,
          };
        })
      : Array.from({ length: points }, (_, i) => {
          return {
            x: offset + (Math.random() * length) / 7 - length / 9,
            y: (i * length) / (points - 1),
          };
        });

  pts = [closing.p1, ...pts, closing.p2];

  const pointsWithHandles = pts.map((point, i) => {
    const nextPoint = pts[(i + 1) % pts.length];
    const prevPoint = pts[(i - 1 + pts.length) % pts.length];
    let deltaX = nextPoint.x - prevPoint.x;
    let deltaY = nextPoint.y - prevPoint.y;
    const norm = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    deltaX /= norm;
    deltaY /= norm;
    const incomingControlPoint = {
      x:
        point.x -
        deltaX *
          (scaledHANDLE_MIN_OFFSET + Math.random() * scaledHANDLE_RANDOMNESS),
      y:
        point.y -
        deltaY *
          (scaledHANDLE_MIN_OFFSET + Math.random() * scaledHANDLE_RANDOMNESS),
    };
    const outgoingControlPoint = {
      x:
        point.x +
        deltaX *
          (scaledHANDLE_MIN_OFFSET + Math.random() * scaledHANDLE_RANDOMNESS),
      y:
        point.y +
        deltaY *
          (scaledHANDLE_MIN_OFFSET + Math.random() * scaledHANDLE_RANDOMNESS),
    };
    return { point, incomingControlPoint, outgoingControlPoint };
  });

  const path = pointsWithHandles.map((point, i) => {
    const nextPoint = pointsWithHandles[(i + 1) % pointsWithHandles.length];
    return `C ${point.outgoingControlPoint.x} ${point.outgoingControlPoint.y} ${nextPoint.incomingControlPoint.x} ${nextPoint.incomingControlPoint.y} ${nextPoint.point.x} ${nextPoint.point.y}`;
  });

  const pathString = `M ${pts[0].x} ${pts[0].y} ${path.join(" ")}`;

  return pathString;
};

const StackedWaves: React.FC<shapeProps> = ({
  width,
  height,
  animated,
}: shapeProps): JSX.Element => {
  const [orientation] = useState(Math.random() > 0.5 ? "-" : "|");
  const [direction] = useState(Math.random() > 0.5 ? "up" : "down");

  const WAVE_COUNT = orientation === "-" ? 3 : 5;

  const [waves, setWaves] = useState({
    waves: Array.from({ length: WAVE_COUNT }, () => "M 0 0"),
    altWaves: Array.from({ length: WAVE_COUNT }, () => "M 0 0"),
  });

  useEffect(() => {
    const generateWaves = () => {
      let waves = Array.from({ length: WAVE_COUNT }, (_, i) => {
        return generateWave({
          orientation,
          closing:
            direction === "up"
              ? orientation === "-"
                ? { p1: { x: 0, y: height }, p2: { x: width, y: height } }
                : { p1: { x: 0, y: 0 }, p2: { x: 0, y: height } }
              : orientation === "-"
              ? { p1: { x: 0, y: 0 }, p2: { x: width, y: 0 } }
              : { p1: { x: width, y: 0 }, p2: { x: width, y: height } },
          points: 4,
          offset:
            (i + 1) *
            ((orientation === "-" ? height : width) / (WAVE_COUNT + 1)),
          length: orientation === "-" ? width : height,
        });
      });
      if (
        (orientation === "-" && direction === "down") ||
        (orientation === "|" && direction === "up")
      ) {
        waves = waves.reverse();
      }
      return waves;
    };

    setWaves({
      waves: generateWaves(),
      altWaves: generateWaves(),
    });
  }, [WAVE_COUNT, direction, height, orientation, width]);

  const [color] = useState(randomColor(true));

  const backgroundColor = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;

  const foregroundColors = useMemo(() => {
    const foregroundColors = Array.from({ length: WAVE_COUNT }, (_, i) => {
      return `hsl(${color.hue}, ${color.saturation}%, ${
        color.lightness - ((i + 1) * 40) / WAVE_COUNT
      }%)`;
    });
    return foregroundColors;
  }, [WAVE_COUNT, color]);

  const [paused, setPaused] = useState(true);

  const onPointerEnter = useCallback(() => {
    if (!animated) return;
    setPaused(false);
  }, [animated]);

  const onPointerLeave = () => {
    setPaused(true);
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      style={{ backgroundColor }}
    >
      {waves.waves.map((wave, i) => (
        <Tween
          key={i}
          animation={{
            SVGMorph: {
              path: waves.altWaves[i],
              maxSegmentLength: maxSegmentLength,
            },
            yoyo: true,
            repeat: -1,
            duration: 1000,
          }}
          paused={paused}
          style={{ fill: foregroundColors[i] }}
          component="path"
          d={wave}
        />
      ))}
    </svg>
  );
};

export default StackedWaves;
