import React from "react";
import { MdPersonAdd, MdPersonRemove } from "react-icons/md";
import Container from "./container";

interface IncomingProps {
  username: string;
  onAccept: VoidFunction;
  onDecline: VoidFunction;
}

export const IncomingRequestCard: React.FC<IncomingProps> = ({
  username,
  onAccept,
  onDecline,
}) => {
  return (
    <Container size={{ width: 250, height: 60 }}>
      <span
        style={{
          textOverflow: "ellipsis",
          width: "140px",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {username}
      </span>
      <MdPersonAdd
        style={{
          marginLeft: "auto",
          cursor: "pointer",
          marginRight: "10px",
        }}
        className="hoverGreen"
        size={25}
        onClick={onAccept}
      />
      <MdPersonRemove
        style={{ cursor: "pointer" }}
        className="hoverRed"
        size={25}
        onClick={onDecline}
      />
    </Container>
  );
};

interface OutgoingProps {
  username: string;
  onCancel: VoidFunction;
}

export const OutgoingRequestCard: React.FC<OutgoingProps> = ({
  username,
  onCancel,
}) => {
  return (
    <Container size={{ width: "250px", height: "60px" }}>
      <span
        style={{
          textOverflow: "ellipsis",
          width: "140px",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        {username}
      </span>
      <MdPersonRemove
        style={{ cursor: "pointer", marginLeft: "auto" }}
        className="hoverRed"
        size={25}
        onClick={onCancel}
      />
    </Container>
  );
};
