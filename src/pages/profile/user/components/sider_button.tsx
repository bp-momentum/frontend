import { Col, Row } from "antd";
import React from "react";

interface Props {
  onClick: VoidFunction;
  image: string;
  title: string;
  rotation: number;
  backgroundColor: string;
  color: string;
  className?: string;
}

const SiderButton: React.FC<Props> = ({
  onClick,
  image,
  title,
  rotation,
  backgroundColor,
  color,
  className,
}) => {
  return (
    <Row justify="center">
      <div
        onClick={onClick}
        style={{
          marginBottom: "40px",
          cursor: "pointer",
          transform: `rotate(${rotation}deg)`,
          justifyContent: "center",
        }}
      >
        <div
          className={className}
          style={{
            backgroundColor: backgroundColor,
            width: "140px",
            height: "140px",
            borderRadius: "20px",
          }}
        >
          <Col style={{ paddingTop: "10px" }}>
            <Row justify="center">
              <img src={image} height={82} alt={`${title} Icon`} />
            </Row>
            <Row justify="center">
              <span style={{ fontSize: 18, color: color, marginTop: "3px" }}>
                {title}
              </span>
            </Row>
          </Col>
        </div>
      </div>
    </Row>
  );
};

export default SiderButton;
