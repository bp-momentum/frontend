import React, { useCallback, useEffect, useState } from "react";
import {
  HANDLE_MIN_OFFSET,
  HANDLE_RANDOMNESS,
  maxSegmentLength,
  shapeProps,
} from ".";
import Tween from "rc-tween-one";
import { randomColor } from "./colors";

const mirrorImage = (
  m1x: number,
  m1y: number,
  m2x: number,
  m2y: number,
  x1: number,
  y1: number
) => {
  const dx = m2x - m1x;
  const dy = m2y - m1y;

  const a = (dx * dx - dy * dy) / (dx * dx + dy * dy);
  const b = (2 * dx * dy) / (dx * dx + dy * dy);
  const x = a * (x1 - m1x) + b * (y1 - m1y) + m1x;
  const y = b * (x1 - m1x) - a * (y1 - m1y) + m1y;
  return [x, y];
};

const cubicN = (t: number, a: number, b: number, c: number, d: number) => {
  const t2 = t * t;
  const t3 = t2 * t;
  return (
    a +
    (-a * 3 + t * (3 * a - a * t)) * t +
    (3 * b + t * (-6 * b + b * 3 * t)) * t +
    (c * 3 - c * 3 * t) * t2 +
    d * t3
  );
};

const generateBlobCurve = ({
  from,
  to,
  center,
  points,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  center: { x: number; y: number };
  points: number;
}): string => {
  // draw _points_ points on a basic curve from _from_ to _to_
  // assume the distance of _from_ to _center_ is the same as _to_ to _center_
  // the curve is a bezier curve with two control points
  // the control points point towards the mirror point of the center along the line from _from_ to _to_
  // the control points are 2/3 of the distance from _center_ to _from_ and _to_

  const radius = Math.sqrt(
    (from.x - center.x) * (from.x - center.x) +
      (from.y - center.y) * (from.y - center.y)
  );

  const [mirrorX, mirrorY] = mirrorImage(
    from.x,
    from.y,
    to.x,
    to.y,
    center.x,
    center.y
  );

  const ctrl1Dir = { x: mirrorX - from.x, y: mirrorY - from.y };
  const ctrl2Dir = { x: mirrorX - to.x, y: mirrorY - to.y };

  const controlPoint1 = {
    x: from.x + (2 / 3) * ctrl1Dir.x,
    y: from.y + (2 / 3) * ctrl1Dir.y,
  };
  const controlPoint2 = {
    x: to.x + (2 / 3) * ctrl2Dir.x,
    y: to.y + (2 / 3) * ctrl2Dir.y,
  };

  const curvePoints = Array.from(Array(points).keys()).map((i) => {
    const t = (i + 1) / (points + 1);
    const x = cubicN(t, from.x, controlPoint1.x, controlPoint2.x, to.x);
    const y = cubicN(t, from.y, controlPoint1.y, controlPoint2.y, to.y);
    return { x, y };
  });

  // randomize the points a bit
  const randomizedPoints = curvePoints.map((p) => {
    // shift the point a bit along the line from the center to the point
    const deltaX = p.x - center.x;
    const deltaY = p.y - center.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const angle = Math.atan2(deltaY, deltaX);
    const randomOffset = (Math.random() * radius) / 3 - radius / 4;
    const randomDistance = distance + randomOffset;
    const randomX = center.x + randomDistance * Math.cos(angle);
    const randomY = center.y + randomDistance * Math.sin(angle);
    return { x: randomX, y: randomY };
  });

  // add _from_ to the beginning, _to_ and _center_ to the end
  const pointsWithEnds = [from, ...randomizedPoints, to, center];

  const scaledHANDLE_MIN_OFFSET = (HANDLE_MIN_OFFSET / 100) * radius;
  const scaledHANDLE_RANDOMNESS = (HANDLE_RANDOMNESS / 100) * radius;

  const pointsWithHandles = pointsWithEnds.map((point, i) => {
    const nextPoint = pointsWithEnds[(i + 1) % pointsWithEnds.length];
    const prevPoint =
      pointsWithEnds[(i - 1 + pointsWithEnds.length) % pointsWithEnds.length];
    let deltaX = nextPoint.x - prevPoint.x;
    let deltaY = nextPoint.y - prevPoint.y;
    const norm = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    deltaX /= norm;
    deltaY /= norm;
    const randomInc =
      scaledHANDLE_MIN_OFFSET + Math.random() * scaledHANDLE_RANDOMNESS;
    const incomingControlPoint = {
      x: point.x - deltaX * randomInc,
      y: point.y - deltaY * randomInc,
    };
    const randomOut =
      scaledHANDLE_MIN_OFFSET + Math.random() * scaledHANDLE_RANDOMNESS;
    const outgoingControlPoint = {
      x: point.x + deltaX * randomOut,
      y: point.y + deltaY * randomOut,
    };
    return { point, incomingControlPoint, outgoingControlPoint };
  });

  const path = pointsWithHandles.map((point, i) => {
    const nextPoint = pointsWithHandles[(i + 1) % pointsWithHandles.length];
    return `C ${point.outgoingControlPoint.x} ${point.outgoingControlPoint.y} ${nextPoint.incomingControlPoint.x} ${nextPoint.incomingControlPoint.y} ${nextPoint.point.x} ${nextPoint.point.y}`;
  });

  const pathString = `M ${pointsWithEnds[0].x} ${
    pointsWithEnds[0].y
  } ${path.join(" ")}`;

  return pathString;
};

const BlobScene: React.FC<shapeProps> = ({
  width,
  height,
  animated,
}: shapeProps): JSX.Element => {
  const [orientation] = useState(Math.random() > 0.5 ? "\\" : "/");

  const [path1, setPath1] = useState("M 0 0");
  const [path2, setPath2] = useState("M 0 0");

  const [altPath1, setAltPath1] = useState("M 0 0");
  const [altPath2, setAltPath2] = useState("M 0 0");

  useEffect(() => {
    // generate path1
    const radius = Math.max(width, height) / 2;
    if (orientation === "\\") {
      let from = { x: 0, y: height - radius };
      let to = { x: radius, y: height };
      let center = { x: 0, y: height };
      setPath1(generateBlobCurve({ from, to, center, points: 4 }));
      setAltPath1(generateBlobCurve({ from, to, center, points: 4 }));
      from = { x: width - radius, y: 0 };
      to = { x: width, y: radius };
      center = { x: width, y: 0 };
      setPath2(generateBlobCurve({ from, to, center, points: 4 }));
      setAltPath2(generateBlobCurve({ from, to, center, points: 4 }));
    }
    if (orientation === "/") {
      let from = { x: 0, y: radius };
      let to = { x: radius, y: 0 };
      let center = { x: 0, y: 0 };
      setPath1(generateBlobCurve({ from, to, center, points: 4 }));
      setAltPath1(generateBlobCurve({ from, to, center, points: 4 }));
      from = { x: width - radius, y: height };
      to = { x: width, y: height - radius };
      center = { x: width, y: height };
      setPath2(generateBlobCurve({ from, to, center, points: 4 }));
      setAltPath2(generateBlobCurve({ from, to, center, points: 4 }));
    }
  }, [width, height, orientation]);

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
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      style={{ backgroundColor }}
    >
      <Tween
        animation={{
          SVGMorph: {
            path: altPath1,
            maxSegmentLength: maxSegmentLength,
          },
          yoyo: true,
          repeat: -1,
          duration: 1000,
        }}
        paused={paused}
        style={{ fill: foregroundColor }}
        component="path"
        d={path1}
      />
      <Tween
        animation={{
          SVGMorph: {
            path: altPath2,
            maxSegmentLength: maxSegmentLength,
          },
          yoyo: true,
          repeat: -1,
          duration: 1000,
        }}
        paused={paused}
        style={{ fill: foregroundColor }}
        component="path"
        d={path2}
      />
    </svg>
  );
};

export default BlobScene;
