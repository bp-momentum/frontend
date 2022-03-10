import { Layout, Menu, Modal } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import {
  HomeTwoTone,
  SettingTwoTone,
  CrownTwoTone,
  BarsOutlined,
  TeamOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";
import { MenuInfo } from "rc-menu/lib/interface";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import helper from "@util/helper";
import { ExclamationCircleOutlined } from "@ant-design/icons/lib";
import useApi from "@hooks/api";
import Routes from "@util/routes";
import { setFriendRequests } from "@/redux/friends/friendSlice";
import Helper from "@util/helper";

const { confirm } = Modal;

export interface containerProps {
  children: React.ReactNode;
  currentPage?: "home" | "settings" | "leaderboard" | "profile" | "manage"; // highlightable menu items
  color?: "red" | "gold" | "blue";
  confirmLeaveMessage?: false | string;
}

type pages =
  | "manage"
  | "home"
  | "settings"
  | "leaderboard"
  | "profile"
  | "manage_users"
  | "manage_plans"; // navigable pages
type pagesToRouteType = {
  [K in pages]: string;
};
const pageToRoute: pagesToRouteType = {
  home: "/",
  settings: "/settings",
  leaderboard: "/leaderboard",
  profile: "/profile",
  manage: "/manage",
  manage_users: "/manage/users",
  manage_plans: "/manage/plans",
};

const Container: React.FC<containerProps> = ({ ...props }) => {
  const { children, currentPage, confirmLeaveMessage } = props;
  const color = props.color || "blue";
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleClick = (e: MenuInfo) => {
    if (confirmLeaveMessage) {
      confirm({
        title: t(Translations.common.confirmLeave),
        icon: <ExclamationCircleOutlined />,
        content: confirmLeaveMessage,
        onOk() {
          executeClick(e);
        },
      });
    } else {
      executeClick(e);
    }
  };

  const executeClick = (e: MenuInfo) => {
    if (e.key === "logout") {
      confirmLogout();
    } else {
      navigate(pageToRoute[e.key as pages]);
    }
  };

  const confirmLogout = () => {
    confirm({
      title: t(Translations.tabBar.confirmLogout),
      icon: <ExclamationCircleOutlined />,
      content: t(Translations.tabBar.confirmLogoutContent),
      okType: "danger",
      async onOk() {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // sleep for 1 second
        dispatch({ type: "USER_LOGOUT" });
        navigate("/");
      },
    });
  };

  const token = useAppSelector((state) => state.token.token);
  const isUser = token && helper.getAccountType(token) === "user";
  const isAdmin = token && helper.getAccountType(token) === "admin";
  const isTrainer = token && helper.getAccountType(token) === "trainer";

  const hasRequests =
    useAppSelector((state) => state.friends.friendRequests).length > 0;

  const api = useApi();
  const username = token && Helper.getUserName(token);

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

  useEffect(() => {
    if (!isUser) return;

    api.execute(Routes.getFriendRequests()).then((data) => {
      dispatch(setFriendRequests(data.data.requests.map(friendsToFriend)));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout style={{ height: "100%", position: "absolute", width: "100%" }}>
      <Header style={{ backgroundColor: "#fff" }}>
        <Menu
          mode="horizontal"
          selectedKeys={currentPage ? [currentPage] : []}
          onClick={handleClick}
        >
          <Menu.Item key="home" icon={<HomeTwoTone twoToneColor={color} />}>
            {t(Translations.tabBar.home)}
          </Menu.Item>
          {(isTrainer || isAdmin) && (
            <>
              <Menu.Item
                key="manage_users"
                icon={<TeamOutlined style={{ color: color }} />}
              >
                {t(Translations.tabBar.user)}
              </Menu.Item>
              {isTrainer && (
                <Menu.Item
                  key="manage_plans"
                  icon={<CalendarOutlined style={{ color: color }} />}
                >
                  {t(Translations.tabBar.plans)}
                </Menu.Item>
              )}
            </>
          )}
          {!isAdmin && (
            <Menu.Item
              key="leaderboard"
              icon={<CrownTwoTone twoToneColor={color} />}
            >
              {t(Translations.tabBar.leaderboard)}
            </Menu.Item>
          )}
          {!isAdmin && (
            <Menu.Item
              key="profile"
              icon={<BarsOutlined style={{ color: color }} />}
              style={{ marginLeft: "auto" }}
            >
              <span
                className={
                  hasRequests && currentPage !== "profile" ? "notification" : ""
                }
                style={{ position: "relative", paddingTop: 3, paddingRight: 3 }}
              >
                {t(Translations.tabBar.profile)}
              </span>
            </Menu.Item>
          )}
          <Menu.Item
            key="settings"
            style={!isAdmin ? {} : { marginLeft: "auto" }}
            icon={<SettingTwoTone twoToneColor={color} />}
          >
            {t(Translations.tabBar.settings)}
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined style={{ color: color }} />}
          >
            {t(Translations.tabBar.logout)}
          </Menu.Item>
        </Menu>
      </Header>
      <Content
        style={{ position: "relative", height: "100%", overflow: "auto" }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default Container;
