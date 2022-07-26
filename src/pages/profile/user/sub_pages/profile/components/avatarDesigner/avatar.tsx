import React from "react";
import { Avatar } from "@pages/profile/user/types";
import { ReactComponent as Head } from "./avatar/Head.svg";
import { ReactComponent as Eyes } from "./avatar/Eyes.svg";
import { ReactComponent as Overlay } from "./avatar/Head_Overlay.svg";
import {
  eyeColorTable,
  Hair,
  hairColorTable,
  sencondaryHairColorTable,
  skinColorTable,
} from "./definitions";

const AvatarImage: React.FC<Avatar & { width: number }> = ({
  width,
  ...props
}: Avatar & { width: number }): JSX.Element => {
  const skinColor = props.skinColor || 0;
  const hairColor = props.hairColor || 0;
  const hairStyle = props.hairStyle || 0;
  const eyeColor = props.eyeColor || 0;

  return (
    <div style={{ position: "relative", height: width, width: width }}>
      <Head
        style={{
          position: "absolute",
          height: width,
          pointerEvents: "none",
          fill: skinColorTable[skinColor],
        }}
      />
      <Eyes
        style={{
          position: "absolute",
          height: width,
          pointerEvents: "none",
          fill: eyeColorTable[eyeColor],
        }}
      />
      <Overlay
        style={{ position: "absolute", height: width, pointerEvents: "none" }}
      />
      <Hair
        number={hairStyle}
        style={{
          position: "absolute",
          height: width,
          pointerEvents: "none",
          color: hairColorTable[hairColor],
          fill: sencondaryHairColorTable[hairColor],
        }}
      />
    </div>
  );
};

export default AvatarImage;
