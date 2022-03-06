import { useAppSelector } from "@redux/hooks";
import { Col, message, Row } from "antd";
import React, { useState } from "react";
import FriendCard from "./friendCard";
import Routes from "@util/routes";
import useApi from "@hooks/api";
import BigFriendCard from "./bigFriendCard";
import EmptyDataRender from "@/shared/emptyDataRender";

interface Props {
  reloadFriends: VoidFunction;
}

const ActiveFriends: React.FC<Props> = ({ reloadFriends }) => {
  const friends = useAppSelector((state) => state.friends.friends);
  const api = useApi();

  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  const removeFriend = (id: number) => {
    api.execute(Routes.removeFriend({ friendId: id })).then((response) => {
      if (!response) return;
      if (!response.success) {
        message.error(response.description);
        return;
      }
      message.success(response.description);
    });
  };

  if (!friends || friends.length === 0)
    return (
      <Col>
        <Row justify="center">
          <EmptyDataRender customText="No frens" />
        </Row>
      </Col>
    );

  if (selectedFriend) {
    return (
      <Row>
        <BigFriendCard
          reloadFriends={reloadFriends}
          username={selectedFriend}
          onClose={() => setSelectedFriend(null)}
        />
      </Row>
    );
  }

  return (
    <Row>
      {friends.map((friend) => (
        <Col key={friend.username}>
          <FriendCard
            username={friend.username}
            onRemove={() => {
              if (!friend.id) return;
              removeFriend(friend.id);
              reloadFriends();
            }}
            onClick={() => {
              setSelectedFriend(friend.username);
            }}
          />
        </Col>
      ))}
    </Row>
  );
};

export default ActiveFriends;
