import React from "react";
import { RandomHLine } from "react-random-shapes";

const getSeed = () => {
  const seed = Math.random();
  return seed;
};

const style = {
  fill: "transparent",
  strokeWidth: 2,
  transition: "all 0.3s ease-in-out"
};

const Shapes = (): JSX.Element => {
  const [seed, setSeed] = React.useState(getSeed());

  return (
    <div style={{background: "#dadaea", height: "100%", width: "100%", overflow: "hidden"}} onMouseEnter={()=> setSeed(getSeed())}>
      <RandomHLine width={150} height={100} options={{numLines:7, posWindowSize: 40, numControls: 3, seed: seed, styleMid: [
        {stroke: "rgb(102, 111, 255)", ...style},
        {stroke: "rgb(141, 255, 102)", ...style},
        {stroke: "rgb( 88,   0, 153)", ...style},
        {stroke: "rgb(102, 255, 247)", ...style},
        {stroke: "rgb(250, 200,   0)", ...style},
        {stroke: "rgb(180, 102, 255)", ...style},
        {stroke: "rgb(255, 102, 215)", ...style}
      ]}}/>
    </div>
  );
};

export { Shapes };