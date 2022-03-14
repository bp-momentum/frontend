import { useAppSelector } from "@redux/hooks";
import { Col, message, Row } from "antd";
import React, { useState } from "react";
import FriendCard from "./friendCard";
import Routes from "@util/routes";
import useApi from "@hooks/api";
import BigFriendCard from "./bigFriendCard";
import EmptyDataRender from "@shared/emptyDataRender";
import Translations from "@localization/translations";
import { useTranslation } from "react-i18next";

interface Props {
  reloadFriends: VoidFunction;
}

/**
 * A component that renders a list of friends
 * or details of a single friend
 * @param {Props} props
 * @returns {JSX.Element}
 */
const ActiveFriends: React.FC<Props> = ({
  reloadFriends,
}: Props): JSX.Element => {
  const friends = useAppSelector((state) => state.friends.friends);
  const api = useApi();

  const { t } = useTranslation();

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
          <EmptyDataRender customText={t(Translations.friends.noFriends)} />
        </Row>
      </Col>
    );

  if (selectedFriend) {
    return (
      <Row>
        <BigFriendCard
          username={selectedFriend}
          onClose={() => setSelectedFriend(null)}
        />
      </Row>
    );
  }

  return (
    <Row gutter={[20, 20]} wrap justify="center">
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
