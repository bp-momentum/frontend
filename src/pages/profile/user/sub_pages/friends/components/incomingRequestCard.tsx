import React from "react";
import { MdPersonAdd, MdPersonRemove } from "react-icons/md";
import Container from "../../../components/container";

interface Props {
  username: string;
  onAccept: VoidFunction;
  onDecline: VoidFunction;
}

/**
 * A component that renders details of an incoming friend request
 * @param {Props} props The properties of the component
 * @returns {JSX.Element} The component
 */
const IncomingRequestCard: React.FC<Props> = ({
  username,
  onAccept,
  onDecline,
}: Props): JSX.Element => {
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

export default IncomingRequestCard;
