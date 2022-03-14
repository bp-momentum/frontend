import React from "react";
import { QuestionOutlined, StarFilled } from "@ant-design/icons";
import { Tooltip } from "antd";
import { MedalType } from "@api/medal";

interface Props {
  type: MedalType;
  size: "small" | "large";
  tooltipText?: string;
}

/**
 * Component to display a medal.
 * @param {Props} props The properties of the component.
 * @constructor
 */
const Medal: React.FC<Props> = ({ type, tooltipText, size }: Props) => {
  const medalColor = {
    gold: "#f5c842",
    silver: "#c8c8c8",
    bronze: "#C17913",
    none: "#fff",
    unknown: "#C4C4C4",
  };

  const medalDarkerColor = {
    gold: "#a8892d",
    silver: "#7b7b7b",
    bronze: "#74490b",
    none: "#ddd",
    unknown: "#aaa",
  };

  const medalSize = {
    large: "90px",
    small: "50px",
  };

  const borderSize = {
    large: "10px",
    small: "5px",
  };

  const iconSize = {
    large: 50,
    small: 30,
  };

  const marginBottom = {
    large: "30px",
    small: "0",
  };

  const medal = (
    <div
      style={{
        width: medalSize[size],
        height: medalSize[size],
        borderRadius: "50%",
        background: medalColor[type],
        marginBottom: marginBottom[size],
        border: `${borderSize[size]} solid ${medalDarkerColor[type]}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: type === "none" ? 0.2 : 1,
      }}
    >
      {type !== "unknown" && (
        <StarFilled
          style={{ color: "black", opacity: 0.2, fontSize: iconSize[size] }}
        />
      )}
      {type === "unknown" && (
        <QuestionOutlined
          style={{ color: "black", opacity: 0.2, fontSize: iconSize[size] }}
        />
      )}
    </div>
  );

  if (!tooltipText) {
    return medal;
  }

  return <Tooltip title={tooltipText}>{medal}</Tooltip>;
};

export default Medal;
