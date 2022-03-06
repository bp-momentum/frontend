import message from "antd/lib/message";
import React, { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import useApi from "@hooks/api";
import Helper from "@util/helper";
import Routes from "@util/routes";
import { Content } from "antd/lib/layout/layout";
import { Row } from "antd";
import ToggleButton from "../../components/toggleButton";
import {
  setFriendRequests,
  setFriends,
  setSentRequests,
} from "@/redux/friends/friendSlice";
import ActiveFriends from "./components/activeFriends";
import Requests from "./components/requests";
import AddFriend from "./components/addFriend";

const SubPageFriends: React.FC = () => {
  const api = useApi();
  const dispatch = useAppDispatch();

  const [tab, setTab] = React.useState<"friends" | "requests" | "add">(
    "friends"
  );

  const token = useAppSelector((state) => state.token.token);
  const username = Helper.getUserName(token ?? "");

  const requests = useAppSelector((state) => state.friends.friendRequests);

  const loadFriends = useCallback(async () => {
    const friendsToFriend = (friends: {
      friend1: string;
      friend2: string;
      id: number;
    }) => {
      return {
        username:
          friends.friend1 === username ? friends.friend2 : friends.friend1,
        id: friends.id,
      };
    };

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

    Promise.all([fetchFriends(), fetchRequests(), fetchSentRequests()]).then(
      ([friends, requests, invited]) => {
        if (friends && friends.friends)
          dispatch(setFriends(friends.friends.map(friendsToFriend)));
        if (requests && requests.requests)
          dispatch(setFriendRequests(requests.requests.map(friendsToFriend)));
        if (invited && invited.pending)
          dispatch(setSentRequests(invited.pending.map(friendsToFriend)));
      }
    );
  }, [api, dispatch, username]);

  useEffect(() => {
    loadFriends();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const delayedLoadFriends = useCallback(() => {
    setTimeout(() => {
      loadFriends();
    }, 100);
  }, [loadFriends]);

  return (
    <Content style={{ height: "100%", overflow: "auto", padding: "30px" }}>
      <Row justify="center">
        <ToggleButton
          onClick={() => {
            setTab("friends");
          }}
          toggled={tab === "friends"}
        >
          Friends
        </ToggleButton>
        <ToggleButton
          onClick={() => {
            setTab("requests");
          }}
          toggled={tab === "requests"}
          highlighted={requests.length > 0}
        >
          Requests
        </ToggleButton>
        <ToggleButton
          onClick={() => {
            setTab("add");
          }}
          toggled={tab === "add"}
        >
          Add Friend
        </ToggleButton>
      </Row>

      <Row justify="center" style={{ marginTop: "50px" }}>
        {tab === "friends" && (
          <ActiveFriends reloadFriends={delayedLoadFriends} />
        )}
        {tab === "requests" && <Requests reloadFriends={delayedLoadFriends} />}
        {tab === "add" && <AddFriend reloadFriends={delayedLoadFriends} />}
      </Row>
    </Content>
  );
};

export default SubPageFriends;
