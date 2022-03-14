import React from "react";
import "@styles/speechBubble.css";

interface paperProps {
  text: React.ReactNode;
  padding: number;
  width?: number;
}

const SpeechBubble: React.FC<paperProps> = ({ children, ...props }) => {
  const { text, padding, width } = props;

  return (
    <div
      style={{ width: width, padding: padding }}
      className="bubble bubble-bottom-right"
    >
      {text}
    </div>
  );
};

export default SpeechBubble;
