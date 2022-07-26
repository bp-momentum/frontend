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
import { setFriendRequests } from "@redux/friends/friendSlice";
import Helper from "@util/helper";

const { confirm } = Modal;

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

interface Props {
  children: React.ReactNode;
  currentPage?: "home" | "settings" | "leaderboard" | "profile" | "manage"; // highlightable menu items
  confirmLeaveMessage?: false | string;
}

/**
 * The main layout of the app.
 * @param {Props} props The props for the component.
 * @returns {JSX.Element} The layout.
 */
const Container: React.FC<Props> = ({
  children,
  currentPage,
  confirmLeaveMessage,
}: Props): JSX.Element => {
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
        await new Promise((resolve) => setTimeout(resolve, 500)); // sleep for 0.5 seconds
        dispatch({ type: "USER_LOGOUT" });
        navigate("/");
      },
    });
  };

  const token = useAppSelector((state) => state.token.token);
  const isUser = token && helper.getAccountType(token) === "user";
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

  const menuHome = {
    key: "home",
    icon: <HomeTwoTone />,
    label: t(Translations.tabBar.home),
  };

  const menuUsers = {
    key: "manage_users",
    icon: <TeamOutlined style={{ color: "#1890ff" }} />,
    label: t(Translations.tabBar.user),
  };

  const menuPlans = {
    key: "manage_plans",
    icon: <CalendarOutlined style={{ color: "#1890ff" }} />,
    label: t(Translations.tabBar.plans),
  };

  const menuLeaderboard = {
    key: "leaderboard",
    icon: <CrownTwoTone />,
    label: t(Translations.tabBar.leaderboard),
  };

  const menuProfile = {
    key: "profile",
    icon: <BarsOutlined style={{ color: "#1890ff" }} />,
    label: (
      <span
        className={
          hasRequests && currentPage !== "profile" ? "notification" : ""
        }
        style={{ position: "relative", paddingTop: 3, paddingRight: 3 }}
      >
        {t(Translations.tabBar.profile)}
      </span>
    ),
    style: { marginLeft: "auto" },
  };

  const menuSettings = {
    key: "settings",
    icon: <SettingTwoTone />,
    label: t(Translations.tabBar.settings),
  };

  const menuLogout = {
    key: "logout",
    icon: <LogoutOutlined style={{ color: "#1890ff" }} />,
    label: t(Translations.tabBar.logout),
  };

  const menuItemsUser = [
    menuHome,
    menuLeaderboard,
    menuProfile,
    menuSettings,
    menuLogout,
  ];
  const menuItemsTrainer = [
    menuHome,
    menuUsers,
    menuPlans,
    menuLeaderboard,
    menuProfile,
    menuSettings,
    menuLogout,
  ];
  const menuItemsAdmin = [
    menuHome,
    menuUsers,
    menuPlans,
    menuSettings,
    menuLogout,
  ];

  const menuItems = isUser
    ? menuItemsUser
    : isTrainer
    ? menuItemsTrainer
    : menuItemsAdmin;

  return (
    <Layout style={{ height: "100%", position: "absolute", width: "100%" }}>
      <Header style={{ backgroundColor: "#fff" }}>
        <Menu
          mode="horizontal"
          selectedKeys={currentPage ? [currentPage] : []}
          onClick={handleClick}
          items={menuItems}
        />
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
