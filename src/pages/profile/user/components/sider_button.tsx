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

/**
 * A large colorful button.
 * @param onClick         called when the user clicks on this button
 * @param image           the image of the button
 * @param title           the title of the button
 * @param rotation        the rotation of the button
 * @param backgroundColor the background color of the button
 * @param color           the foreground color of the button
 * @param className       the class name of the button
 * @constructor
 */
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
