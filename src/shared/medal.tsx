import React from "react";
import { StarFilled } from "@ant-design/icons";
import { Tooltip } from "antd";

interface medalProps {
  type: "gold" | "silver" | "bronze" | "none";
  tooltipText?: string;
}

const Medal: React.FC<medalProps> = ({ ...props }) => {
  const { type, tooltipText } = props;

  const medalColor = {
    gold: "#f5c842",
    silver: "#c8c8c8",
    bronze: "#C17913",
    none: "#fff",
  };

  const medalDarkerColor = {
    gold: "#a8892d",
    silver: "#7b7b7b",
    bronze: "#74490b",
    none: "#ddd",
  };

  const medal = (
    <div
      style={{
        width: "90px",
        height: "90px",
        borderRadius: "50%",
        background: medalColor[type],
        marginBottom: "30px",
        border: `10px solid ${medalDarkerColor[type]}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: type === "none" ? 0.2 : 1,
      }}
    >
      <StarFilled style={{ color: "black", opacity: 0.2, fontSize: 50 }} />
    </div>
  );

  if (!tooltipText) {
    return medal;
  }

  return <Tooltip title={tooltipText}>{medal}</Tooltip>;
};

export default Medal;
