import React, { useEffect, useState } from "react";
import Blob from "./blob";
import BlobScene from "./blobScene";
import StackedWaves from "./stackedWaves";

export const HANDLE_MIN_OFFSET = 5;
export const HANDLE_RANDOMNESS = 3;
export const maxSegmentLength = 5;

const choose = (choices: unknown[]) => {
  const index = Math.floor(Math.random() * choices.length);
  return choices[index];
};

export interface shapeProps {
  width: number;
  height: number;
  animated?: boolean;
}

type types = "random" | "blob" | "blobScene" | "stackedWaves";

// define shape types
interface generalShapeProps extends shapeProps {
  type: types;
}

const Shape: React.FC<generalShapeProps> = ({
  type,
  width,
  height,
  animated,
}: generalShapeProps): JSX.Element => {
  const [realType, setRealType] = useState<types>(type);

  useEffect(() => {
    if (type === "random") {
      setRealType(choose(["blob", "blobScene", "stackedWaves"]) as types);
    }
  }, [type]);

  switch (realType) {
    case "blob":
      return <Blob width={width} height={height} animated={animated} />;
    case "blobScene":
      return <BlobScene width={width} height={height} animated={animated} />;
    case "stackedWaves":
      return <StackedWaves width={width} height={height} animated={animated} />;
    default:
      return <></>;
  }
};

export default Shape;
