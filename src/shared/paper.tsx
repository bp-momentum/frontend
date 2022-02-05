import React from "react";
import pin from "../static/pin.png";

interface paperProps {
  title: React.ReactNode;
  padding: number;
  backdropColor?: string;
  totalWidth?: number;
  lineColor?: string;
  children: string;
}

const Paper: React.FC<paperProps> = ({ children, ...props }) => {
  const { title, padding, totalWidth, backdropColor, lineColor } = props;
  const realTotalWidth = totalWidth ? `${totalWidth}px` : "100%";
  const realInnerWidth = `calc(${realTotalWidth} - ${padding * 2}px)`;
  const realBackdropColor = backdropColor || "#000";
  const realLineColor = lineColor || "#000";

  console.log(realInnerWidth);

  return (
    <div style={{ width: realTotalWidth, paddingTop: "20px" }}>
      <div
        style={{
          width: realInnerWidth,
          background: "white",
          color: "black",
          borderRadius: "15px",
          margin: "0 auto",
          transform: "rotate(-4deg)",
          boxShadow: "-5px 5px 10px -2px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "50px",
            backgroundImage: `radial-gradient(${realBackdropColor} 25%, transparent 27%)`,
            backgroundPosition: "50% 10px",
            backgroundSize: "50px 50px",
            backgroundRepeat: "repeat-x",
          }}
        >
          <img
            src={pin}
            alt="Pin"
            style={{
              left: "50%",
              position: "absolute",
              marginTop: "-10px",
              transform: "translateX(-50%)",
              height: "60px",
              width: "60px",
              marginLeft: "-13px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundImage: `linear-gradient(to bottom, ${realLineColor} 1px, transparent 1px)`,
            backgroundPosition: "50% 10px",
            backgroundSize: "500px 1.57em",
            margin: "20px",
          }}
        >
          <span>{title}</span>
          <div style={{ padding: "0 10px 10px 10px" }}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Paper;
