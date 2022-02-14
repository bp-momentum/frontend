import { Row } from "antd";
import { StarFilled } from "@ant-design/icons";
import React from "react";

const RatingStars = (props: { rating: number }): JSX.Element => {
  return (
    <Row style={{ alignItems: "end" }} justify="space-around">
      <StarFilled
        style={{
          fontSize: 65,
          color: props.rating > 0 ? "#FFCC33" : "#C4C4C4",
        }}
      />
      <StarFilled
        style={{
          fontSize: 75,
          color: props.rating > 1 ? "#FFCC33" : "#C4C4C4",
        }}
      />
      <StarFilled
        style={{
          fontSize: 80,
          color: props.rating > 2 ? "#FFCC33" : "#C4C4C4",
        }}
      />
      <StarFilled
        style={{
          fontSize: 75,
          color: props.rating > 3 ? "#FFCC33" : "#C4C4C4",
        }}
      />
      <StarFilled
        style={{
          fontSize: 65,
          color: props.rating > 4 ? "#FFCC33" : "#C4C4C4",
        }}
      />
    </Row>
  );
};

export default RatingStars;
