import React, { useCallback, useEffect, useState } from "react";
import { randomColor } from "./colors";
import {
  HANDLE_MIN_OFFSET,
  HANDLE_RANDOMNESS,
  maxSegmentLength,
  shapeProps,
} from ".";
import Tween, { Plugins } from "rc-tween-one";
import SvgMorphPlugin from "rc-tween-one/es/plugin/SvgMorphPlugin";
Plugins.push(SvgMorphPlugin);

const generateRandomBlobShape = ({ points }: { points: number }) => {
  // create a random blob shape with from _points_ points
  // should be an svg path in the area of 0,0 to 100,100
  // with a center of 50,50
  // start with a regular polygon with _points_ points
  // then randomly move each point a bit

  // poygon points are at angle 2pi/n * i
  // where n is the number of points and i is the point number
  // the radius of the polygon is 30
  // the center of the polygon is 50,50
  const randomAngleOffset = Math.random() * 0.4 - 0.8;
  const polygonPoints = Array.from(Array(points).keys()).map((i) => {
    const angle = randomAngleOffset + ((2 * Math.PI) / points) * i;
    const x = 50 + 30 * Math.cos(angle);
    const y = 50 + 30 * Math.sin(angle);
    return { x, y };
  });

  // randomly move each point a bit
  const randomPoints = polygonPoints.map((point) => {
    // shift the point a bit along the line from the center to the point
    const angle = Math.atan2(point.y - 50, point.x - 50);
    const offset = (Math.random() * 50) / 3 - 50 / 4;
    const x = point.x + offset * Math.cos(angle);
    const y = point.y + offset * Math.sin(angle);
    return { x, y };
  });

  // create a path with bezier curves between the points
  // calculate the next controlpoint for each point
  const pointsWithHandles = randomPoints.map((point, i) => {
    const nextPoint = randomPoints[(i + 1) % randomPoints.length];
    const prevPoint =
      randomPoints[(i - 1 + randomPoints.length) % randomPoints.length];
    let deltaX = nextPoint.x - prevPoint.x;
    let deltaY = nextPoint.y - prevPoint.y;
    const norm = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    deltaX /= norm;
    deltaY /= norm;
    const incomingControlPoint = {
      x:
        point.x -
        deltaX * (HANDLE_MIN_OFFSET + Math.random() * HANDLE_RANDOMNESS),
      y:
        point.y -
        deltaY * (HANDLE_MIN_OFFSET + Math.random() * HANDLE_RANDOMNESS),
    };
    const outgoingControlPoint = {
      x:
        point.x +
        deltaX * (HANDLE_MIN_OFFSET + Math.random() * HANDLE_RANDOMNESS),
      y:
        point.y +
        deltaY * (HANDLE_MIN_OFFSET + Math.random() * HANDLE_RANDOMNESS),
    };
    return { point, incomingControlPoint, outgoingControlPoint };
  });

  const path = pointsWithHandles.map((point, i) => {
    const nextPoint = pointsWithHandles[(i + 1) % pointsWithHandles.length];
    return `C ${point.outgoingControlPoint.x} ${point.outgoingControlPoint.y} ${nextPoint.incomingControlPoint.x} ${nextPoint.incomingControlPoint.y} ${nextPoint.point.x} ${nextPoint.point.y}`;
  });

  const pathString = `M ${randomPoints[0].x} ${randomPoints[0].y} ${path.join(
    " "
  )}`;

  return pathString;
};

const Blob: React.FC<shapeProps> = ({
  width,
  height,
  animated,
}: shapeProps): JSX.Element => {
  const [points] = useState(Math.floor(Math.random() * 8) + 4);

  const [path, setPath] = useState("M 0 0");
  const [altPath, setAltPath] = useState("M 0 0");

  useEffect(() => {
    setPath(generateRandomBlobShape({ points }));
    setAltPath(generateRandomBlobShape({ points }));
  }, [points]);

  const [color] = useState(randomColor(true));

  const backgroundColor = `hsl(${color.hue}, ${color.saturation}%, ${color.lightness}%)`;

  const foregroundColor = `hsl(${color.hue}, ${color.saturation}%, ${
    color.lightness - 30
  }%)`;

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
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      style={{ backgroundColor }}
    >
      <Tween
        animation={{
          SVGMorph: {
            path: altPath,
            maxSegmentLength: maxSegmentLength,
          },
          yoyo: true,
          repeat: -1,
          duration: 1000,
        }}
        paused={paused}
        style={{ fill: foregroundColor }}
        component="path"
        d={path}
      />
    </svg>
  );
};

export default Blob;
