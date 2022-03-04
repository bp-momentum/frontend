import { useAppSelector } from "@/redux/hooks";
import { Col, Row } from "antd";
import React from "react";
import sad from "@static/sad.svg";

const ActiveFriends: React.FC = () => {
  const friends = useAppSelector((state) => state.friends.friends);

  if (!friends || friends.length === 0)
    return (
      <Col>
        <Row justify="center">
          <img src={sad} width={150} alt="Sad face" />
        </Row>
        <Row justify="center">No frens</Row>
      </Col>
    );

  return (
    <div>
      <h2>Active Friends</h2>
      <div>
        {friends.map((friend) => (
          <div key={friend.username}>{friend.username}</div>
        ))}
      </div>
    </div>
  );
};

export default ActiveFriends;
