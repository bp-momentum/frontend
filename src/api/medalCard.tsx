import React from "react";
import Container from "@/pages/profile/user/sub_pages/friends/components/container";
import Medal from "@shared/medal";
import { Col, Row } from "antd";
import Text from "antd/es/typography/Text";

interface medalCardProps {
  type: "gold" | "silver" | "bronze";
  count: number;
  exercise: string;
}

const MedalCard: React.FC<medalCardProps> = ({ ...props }) => {
  const { type, count, exercise } = props;

  return (
    <Container size={{ width: "300px", height: "90px" }}>
      <Row>
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          <Medal type={type} size="small" />
        </div>
        <Col style={{ marginLeft: "20px", overflow: "hidden" }}>
          <Text style={{ fontSize: 25 }}>{exercise}</Text>
          <br />
          <Text style={{ width: "50px", overflow: "hidden" }}>
            You earned this {count} times!
          </Text>
        </Col>
      </Row>
    </Container>
  );
};

export default MedalCard;
