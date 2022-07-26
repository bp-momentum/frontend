import { Button } from "antd";
import React from "react";
import AvatarImage from "./avatar";
import {
  eyeColorTable,
  Hair,
  hairColorTable,
  hairStyleTable,
  skinColorTable,
} from "./definitions";

interface CarouselPropsColor {
  type: "color";
  value: string;
  left: () => void;
  right: () => void;
}

interface CarouselPropsJSX {
  type: "jsx";
  value: number;
  left: () => void;
  right: () => void;
}

const Carousel: React.FC<CarouselPropsColor | CarouselPropsJSX> = ({
  ...props
}: CarouselPropsColor | CarouselPropsJSX) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
      }}
    >
      <div
        onClick={props.left}
        style={{
          cursor: "pointer",
          userSelect: "none",
          padding: "0px 5px",
        }}
      >
        «
      </div>
      {props.type === "jsx" && (
        <Hair
          number={props.value}
          style={{
            height: 40,
            width: 40,
            pointerEvents: "none",
            color: "#000",
            fill: "#444",
          }}
        />
      )}
      {props.type === "color" && (
        <div
          style={{
            padding: 5,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              background: props.value,
              borderRadius: "20%",
            }}
          ></div>
        </div>
      )}
      <div
        onClick={props.right}
        style={{
          cursor: "pointer",
          userSelect: "none",
          padding: "0px 5px",
        }}
      >
        »
      </div>
    </div>
  );
};

interface Props {
  skinColor: number;
  hairColor: number;
  hairStyle: number;
  eyeColor: number;
  apply: (
    skinColor: number,
    hairColor: number,
    hairStyle: number,
    eyeColor: number
  ) => void;
  cancel: () => void;
}

const AvatarDesigner: React.FC<Props> = ({ ...props }: Props): JSX.Element => {
  const [skinColor, setSkinColor] = React.useState<number>(props.skinColor);
  const [hairColor, setHairColor] = React.useState<number>(props.hairColor);
  const [hairStyle, setHairStyle] = React.useState<number>(props.hairStyle);
  const [eyeColor, setEyeColor] = React.useState<number>(props.eyeColor);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resetState = () => {
    setSkinColor(props.skinColor);
    setHairColor(props.hairColor);
    setHairStyle(props.hairStyle);
    setEyeColor(props.eyeColor);
  };

  const nextSkinColor = (): void => {
    setSkinColor((skinColor + 1) % skinColorTable.length);
  };
  const prevSkinColor = (): void => {
    setSkinColor(
      (skinColor - 1 + skinColorTable.length) % skinColorTable.length
    );
  };
  const nextHairColor = (): void => {
    setHairColor((hairColor + 1) % hairColorTable.length);
  };
  const prevHairColor = (): void => {
    setHairColor(
      (hairColor - 1 + hairColorTable.length) % hairColorTable.length
    );
  };
  const nextHairStyle = (): void => {
    setHairStyle((hairStyle + 1) % hairStyleTable.length);
  };
  const prevHairStyle = (): void => {
    setHairStyle(
      (hairStyle - 1 + hairStyleTable.length) % hairStyleTable.length
    );
  };
  const nextEyeColor = (): void => {
    setEyeColor((eyeColor + 1) % eyeColorTable.length);
  };
  const prevEyeColor = (): void => {
    setEyeColor((eyeColor - 1 + eyeColorTable.length) % eyeColorTable.length);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Finished Avatar */}
        <AvatarImage
          eyeColor={eyeColor}
          hairColor={hairColor}
          hairStyle={hairStyle}
          skinColor={skinColor}
          width={300}
        />
        {/* Settings Container */}
        <div
          style={{
            width: 100,
            display: "flex",
            flexDirection: "column",
            padding: "20px 0 20px 20px",
          }}
        >
          {/* Hairstyle */}
          <Carousel
            left={prevHairStyle}
            right={nextHairStyle}
            type="jsx"
            value={hairStyle}
          />
          {/* Hair Color */}
          <Carousel
            left={prevHairColor}
            right={nextHairColor}
            type="color"
            value={hairColorTable[hairColor]}
          />
          {/* Eye Color */}
          <Carousel
            left={prevEyeColor}
            right={nextEyeColor}
            type="color"
            value={eyeColorTable[eyeColor]}
          />
          {/* Skin Color */}
          <Carousel
            left={prevSkinColor}
            right={nextSkinColor}
            type="color"
            value={skinColorTable[skinColor]}
          />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          danger
          onClick={() => {
            props.cancel();
          }}
          style={{ marginRight: "10px" }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => props.apply(skinColor, hairColor, hairStyle, eyeColor)}
          style={{ marginLeft: "10px" }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default AvatarDesigner;
