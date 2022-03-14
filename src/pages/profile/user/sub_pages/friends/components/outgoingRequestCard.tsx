import React from "react";
import { MdPersonRemove } from "react-icons/md";
import Container from "../../../components/container";

interface Props {
  username: string;
  onCancel: VoidFunction;
}

/**
 * A component that renders details of an outgoing friend request
 * @param {Props} props The properties of the component
 * @returns {JSX.Element} The component
 */
const OutgoingRequestCard: React.FC<Props> = ({
  username,
  onCancel,
}: Props): JSX.Element => {
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

export default OutgoingRequestCard;
