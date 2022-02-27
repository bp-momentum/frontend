import { Row, Tooltip } from "antd";
import React from "react";
import { StarFilled } from "@ant-design/icons";

interface Props {
  rating: number;
}

const Stars: React.FC<Props> = ({ rating }) => {
  return (
    <Tooltip title={`${(rating * 0.05).toFixed(2)} / 5`}>
      <Row
        style={{ alignItems: "end", position: "relative" }}
        justify="space-around"
      >
        <StarFilled
          style={{
            color: rating > 0 ? "#FFCC33" : "#C4C4C4",
          }}
        />
        <StarFilled
          style={{
            color: rating > 1 ? "#FFCC33" : "#C4C4C4",
          }}
        />
        <StarFilled
          style={{
            color: rating > 2 ? "#FFCC33" : "#C4C4C4",
          }}
        />
        <StarFilled
          style={{
            color: rating > 3 ? "#FFCC33" : "#C4C4C4",
          }}
        />
        <StarFilled
          style={{
            color: rating > 4 ? "#FFCC33" : "#C4C4C4",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: `${100 - rating}%`,
            right: "0px",
            height: "100%",
            background: "#6D6D6D",
            mixBlendMode: "hue",
          }}
        ></div>
      </Row>
    </Tooltip>
  );
};

export default Stars;
