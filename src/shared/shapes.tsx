import React from "react";
import { RandomHLine } from "react-random-shapes";

const getSeed = () => {
  const seed = Math.random();
  return seed;
};

const style = {
  fill: "transparent",
  strokeWidth: 2,
  transition: "all .6s linear",
};
const style2 = {
  fill: "transparent",
  strokeWidth: 2,
  transition: "all .8s linear",
};

const Shapes = (): JSX.Element => {
  const [seed, setSeed] = React.useState(getSeed());
  const [seed2, setSeed2] = React.useState(getSeed());
  const [animation, setAnimation] = React.useState<NodeJS.Timeout | null>();
  const [animation2, setAnimation2] = React.useState<NodeJS.Timeout | null>();

  const animate = (start: boolean) => {
    if (start) {
      setSeed(getSeed());
      setAnimation(setInterval(() => setSeed(getSeed()), 600));
      setSeed2(getSeed());
      setAnimation2(setInterval(() => setSeed2(getSeed()), 800));
    } else {
      if (animation) clearInterval(animation);
      if (animation2) clearInterval(animation2);
      setAnimation(null);
      setAnimation2(null);
    }
  };

  return (
    <div
      style={{ background: "#dadaea", height: "100%", width: "100%" }}
      onMouseEnter={() => animate(true)}
      onMouseLeave={() => animate(false)}
    >
      <div style={{ position: "absolute", top: "0", left: "0" }}>
        <RandomHLine
          width={150}
          height={100}
          options={{
            numLines: 3,
            posWindowSize: 40,
            numControls: 3,
            seed: seed,
            styleMid: [
              { stroke: "rgb(102, 111, 255)", ...style },
              { stroke: "rgb(141, 255, 102)", ...style },
              { stroke: "rgb( 88,   0, 153)", ...style },
            ],
          }}
        />
      </div>
      <RandomHLine
        width={150}
        height={100}
        options={{
          numLines: 3,
          posWindowSize: 40,
          numControls: 3,
          seed: seed2,
          styleMid: [
            { stroke: "rgb(250, 200,   0)", ...style2 },
            { stroke: "rgb(180, 102, 255)", ...style2 },
            { stroke: "rgb(255, 102, 215)", ...style2 },
          ],
        }}
      />
    </div>
  );
};

export { Shapes };
