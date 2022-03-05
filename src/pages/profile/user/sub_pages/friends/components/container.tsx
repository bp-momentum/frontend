import React from "react";

interface Props {
  onClick?: VoidFunction;
  children: React.ReactNode;
  size: {
    width: number | string;
    height: number | string;
  };
}

const Container: React.FC<Props> = ({ onClick, children, size }) => {
  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid black",
        padding: "10px 20px",
        borderRadius: "10px",
        boxShadow: "0px 0px 5px black",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: size.width,
        height: size.height,
        position: "relative",
      }}
    >
      {children}
    </div>
  );
};

export default Container;
