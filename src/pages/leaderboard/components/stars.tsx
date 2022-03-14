import { Row, Tooltip } from "antd";
import React from "react";
import { StarFilled } from "@ant-design/icons";

interface Props {
  rating: number;
}

/**
 * Stars that are filled based on the rating in percentage
 * @param {Props} props
 * @returns {JSX.Element}
 */
const Stars: React.FC<Props> = ({ rating }: Props): JSX.Element => {
  return (
    <Tooltip title={`${(rating * 0.05).toFixed(2)} / 5`}>
      <Row
        style={{ alignItems: "end", position: "relative" }}
        justify="space-around"
      >
        <StarFilled
          style={{
            color: "#FFCC33",
          }}
        />
        <StarFilled
          style={{
            color: "#FFCC33",
          }}
        />
        <StarFilled
          style={{
            color: "#FFCC33",
          }}
        />
        <StarFilled
          style={{
            color: "#FFCC33",
          }}
        />
        <StarFilled
          style={{
            color: "#FFCC33",
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
        />
      </Row>
    </Tooltip>
  );
};

export default Stars;
