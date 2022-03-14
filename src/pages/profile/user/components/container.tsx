import React from "react";

interface Props {
  onClick?: VoidFunction;
  children: React.ReactNode;
  size: {
    width: number | string;
    height: number | string;
  };
  backgroundColor?: string;
}

/**
 * A card component for displaying friends, achievements, medals, etc.
 */
const Container: React.FC<Props> = ({ ...props }) => {
  const { onClick, children, size, backgroundColor } = props;
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
        backgroundColor: backgroundColor,
      }}
    >
      {children}
    </div>
  );
};

export default Container;
