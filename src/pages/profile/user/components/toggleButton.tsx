import React from "react";

interface Props {
  onClick: VoidFunction;
  toggled: boolean;
  children: React.ReactNode;
  highlighted?: boolean;
}

/**
 * A button which can be toggled on and off.
 * @param onClick     called when clicking this button
 * @param toggled     whether the button is currently toggled on
 * @param children    the children of the button
 * @param highlighted whether the button is currently highlighted
 */
const ToggleButton: React.FC<Props> = ({
  onClick,
  toggled,
  children,
  highlighted,
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: toggled ? "#626FE5" : "white",
        color: toggled ? "white" : "black",
        borderRadius: "5px",
        cursor: "pointer",
        border: "1px solid black",
        boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        width: "150px",
        justifyContent: "center",
        margin: "20px",
        position: "relative",
      }}
      className={highlighted ? "notification" : ""}
    >
      {children}
    </div>
  );
};

ToggleButton.defaultProps = {
  highlighted: false,
};

export default ToggleButton;
