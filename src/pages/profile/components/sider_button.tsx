import { Col, Row } from "antd";
import React from "react";

interface siderButtonProps {
  onClick: VoidFunction;
  image: string;
  title: string;
  rotation: number;
  backgroundColor: string;
  color: string;
  className?: string;
}

const SiderButton: React.FC<siderButtonProps> = ({ ...props }) => {
  return (
    <Row justify="center">
      <div
        onClick={props.onClick}
        style={{
          marginBottom: "40px",
          cursor: "pointer",
          transform: `rotate(${props.rotation}deg)`,
          justifyContent: "center",
        }}
      >
        <div
          className={props.className}
          style={{
            backgroundColor: props.backgroundColor,
            width: "140px",
            height: "140px",
            borderRadius: "20px",
          }}
        >
          <Col style={{ paddingTop: "10px" }}>
            <Row justify="center">
              <img src={props.image} height={82} alt={`${props.title} Icon`} />
            </Row>
            <Row justify="center">
              <span
                style={{ fontSize: 18, color: props.color, marginTop: "3px" }}
              >
                {props.title}
              </span>
            </Row>
          </Col>
        </div>
      </div>
    </Row>
  );
};

export default SiderButton;
