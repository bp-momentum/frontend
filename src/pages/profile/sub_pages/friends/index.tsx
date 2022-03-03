import message from "antd/lib/message";
import React, { useEffect } from "react";
import { useAppSelector } from "@redux/hooks";
import useApi from "@util/api";
import Helper from "@util/helper";
import Routes from "@util/routes";
import { Content } from "antd/lib/layout/layout";
import { Row } from "antd";

interface Friend {
  username: string;
}

const SubPageFriends: React.FC = () => {
  const api = useApi();

  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [requests, setRequests] = React.useState<Friend[]>([]);
  const [sentRequests, setSentRequests] = React.useState<Friend[]>([]);

  const fetchFriends = async () => {
    const response = await api.execute(Routes.getFriends());
    if (!response) return;
    if (!response.success) {
      message.error(response.description);
      return;
    }
    return response.data;
  };

  const fetchRequests = async () => {
    const response = await api.execute(Routes.getFriendRequests());
    if (!response) return;
    if (!response.success) {
      message.error(response.description);
      return;
    }
    return response.data;
  };

  const fetchSentRequests = async () => {
    const response = await api.execute(Routes.getSentFriendRequests());
    if (!response) return;
    if (!response.success) {
      message.error(response.description);
      return;
    }
    return response.data;
  };

  const token = useAppSelector((state) => state.token.token);
  const username = Helper.getUserName(token ?? "");

  const friendsToFriend = (friends: { friend1: string; friend2: string }) => {
    return friends.friend1 === username ? friends.friend2 : friends.friend1;
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([fetchFriends(), fetchRequests(), fetchSentRequests()]).then(
      ([friends, invites, invited]) => {
        if (!isMounted) return;
        if (friends && friends.friends)
          setFriends(friends.friends.map(friendsToFriend));
        if (invites && invites.requests)
          setRequests(invites.requests.map(friendsToFriend));
        if (invited && invited.pending)
          setSentRequests(invited.pending.map(friendsToFriend));
      }
    );

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Content style={{ height: "100%", overflow: "auto", padding: "30px" }}>
      <Row>
        <h1>Friends</h1>
      </Row>

      <div>
        <h2>Friends</h2>
        <ul>
          {friends.map((friend) => (
            <li key={friend.username}>{friend}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Friend Requests</h2>
        <ul>
          {requests.map((request) => (
            <li key={request.username}>{request}</li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Sent Friend Requests</h2>
        <ul>
          {sentRequests.map((request) => (
            <li key={request.username}>{request}</li>
          ))}
        </ul>
      </div>
    </Content>
  );
};

export default SubPageFriends;
