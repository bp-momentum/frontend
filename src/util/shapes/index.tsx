import React, { useEffect, useState } from "react";
import Blob from "./blob";
import BlobScene from "./blobScene";
import StackedWaves from "./stackedWaves";
import { mulberry32 } from "@util/helper";

export const HANDLE_MIN_OFFSET = 5;
export const HANDLE_RANDOMNESS = 3;
export const maxSegmentLength = 5;

const choose = (choices: unknown[], seed: number) => {
  const rand = mulberry32(seed)();
  const index = Math.floor(rand * choices.length);
  return choices[index];
};

export interface shapeProps {
  width: number;
  height: number;
  animated?: boolean;
  seed: number;
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
  seed,
}: generalShapeProps): JSX.Element => {
  const [realType, setRealType] = useState<types>(type);

  useEffect(() => {
    if (type === "random") {
      setRealType(choose(["blob", "blobScene", "stackedWaves"], seed) as types);
    }
  }, [seed, type]);

  switch (realType) {
    case "blob":
      return (
        <Blob width={width} height={height} animated={animated} seed={seed} />
      );
    case "blobScene":
      return (
        <BlobScene
          width={width}
          height={height}
          animated={animated}
          seed={seed}
        />
      );
    case "stackedWaves":
      return (
        <StackedWaves
          width={width}
          height={height}
          animated={animated}
          seed={seed}
        />
      );
    default:
      return <></>;
  }
};

export default Shape;
