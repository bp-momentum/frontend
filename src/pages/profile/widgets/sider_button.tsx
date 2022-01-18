import { Col, Row } from "antd";
import Text from "antd/es/typography/Text";
import React from "react";

const SiderButton = (props: {
  onClick: VoidFunction;
  image: string;
  title: string;
  rotation: number;
  color: string;
}) => {
  return (
    <Row justify="center">
      <div
        onClick={props.onClick}
        style={{
          marginBottom: "40px",
          cursor: "pointer",
          backgroundColor: props.color,
          width: "140px",
          height: "140px",
          borderRadius: "20px",
          color: "black",
          transform: `rotate(${props.rotation}deg)`,
          justifyContent: "center",
        }}
      >
        <Col style={{ paddingTop: "10px" }}>
          <Row justify="center">
            <img src={props.image} height={82} alt={`${props.title} Icon`} />
          </Row>
          <Row justify="center">
            <Text style={{ fontSize: "26" }}>{props.title}</Text>
          </Row>
        </Col>
      </div>
    </Row>
  );
};

export default SiderButton;
