import React from "react";
import { ReactComponent as Hair1 } from "./avatar/hair/1.svg";
import { ReactComponent as Hair2 } from "./avatar/hair/2.svg";
import { ReactComponent as Hair3 } from "./avatar/hair/3.svg";
import { ReactComponent as Hair4 } from "./avatar/hair/4.svg";
import { ReactComponent as Hair5 } from "./avatar/hair/5.svg";
import { ReactComponent as Hair6 } from "./avatar/hair/6.svg";
import { ReactComponent as Hair7 } from "./avatar/hair/7.svg";
import { ReactComponent as Hair8 } from "./avatar/hair/8.svg";
import { ReactComponent as Hair9 } from "./avatar/hair/9.svg";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Hair: React.FC<any> = ({ number, ...props }: any) => {
  switch (number) {
    case 0:
      return <Hair1 {...props} />;
    case 1:
      return <Hair2 {...props} />;
    case 2:
      return <Hair3 {...props} />;
    case 3:
      return <Hair4 {...props} />;
    case 4:
      return <Hair5 {...props} />;
    case 5:
      return <Hair6 {...props} />;
    case 6:
      return <Hair7 {...props} />;
    case 7:
      return <Hair8 {...props} />;
    case 8:
      return <Hair9 {...props} />;
    default:
      return <Hair1 {...props} />;
  }
};

export const hairStyleTable = [
  Hair1,
  Hair2,
  Hair3,
  Hair4,
  Hair5,
  Hair6,
  Hair7,
  Hair8,
  Hair9,
];

export const skinColorTable = [
  "#FCE5DA",
  "#FFCC99",
  "#ffb872",
  "#E5AC69",
  "#B98865",
  "#AA724B",
];
export const hairColorTable = [
  "#7E836C",
  "#BC9B34",
  "#653521",
  "#B07B61",
  "#FF9900",
  "#3399FF",
  "#FF99CC",
  "#009966",
];
export const eyeColorTable = [
  "#634e34",
  "#2e536f",
  "#3d671d",
  "#1c7847",
  "#497665",
];

// hairColorTable but a little darker
export const sencondaryHairColorTable = [
  "#868C73",
  "#BDA854",
  "#512A1A",
  "#9C5A3A",
  "#CC7A00",
  "#297ACC",
  "#CC7AA3",
  "#007A52",
];
