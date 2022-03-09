import React from "react";
import Container from "@/pages/profile/user/sub_pages/friends/components/container";
import Medal from "@shared/medal";

interface medalCardProps {
  type: "gold" | "silver" | "bronze";
  count: number;
  exercise: string;
}

const MedalCard: React.FC<medalCardProps> = ({ ...props }) => {
  const { type, count, exercise } = props;

  return (
    <Container size={{ width: "280px", height: "90px" }}>
      <span
        style={{
          textOverflow: "ellipsis",
          width: "140px",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <Medal type={type} size="50px" />
        {count + "x " + exercise + " " + type}
      </span>
    </Container>
  );
};

export default MedalCard;
