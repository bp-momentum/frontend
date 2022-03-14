import { Row } from "antd";
import { StarFilled } from "@ant-design/icons";
import React from "react";

interface Props {
  rating: number;
}

/**
 * Displays five stars which can be filled when a certain rating is achieved.
 * @param rating  the rating, number between 0 and 5
 */
const RatingStars: React.FC<Props> = ({ rating }) => {
  return (
    <Row style={{ alignItems: "end" }} justify="space-around">
      <StarFilled
        style={{
          fontSize: 65,
          color: rating > 0 ? "#FFCC33" : "#C4C4C4",
        }}
      />
      <StarFilled
        style={{
          fontSize: 75,
          color: rating > 1 ? "#FFCC33" : "#C4C4C4",
        }}
      />
      <StarFilled
        style={{
          fontSize: 80,
          color: rating > 2 ? "#FFCC33" : "#C4C4C4",
        }}
      />
      <StarFilled
        style={{
          fontSize: 75,
          color: rating > 3 ? "#FFCC33" : "#C4C4C4",
        }}
      />
      <StarFilled
        style={{
          fontSize: 65,
          color: rating > 4 ? "#FFCC33" : "#C4C4C4",
        }}
      />
    </Row>
  );
};

export default RatingStars;
