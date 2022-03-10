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
import React from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Translations from "../localization/translations";
import { MenuInfo } from "rc-menu/lib/interface";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import helper from "../util/helper";
import { ExclamationCircleOutlined } from "@ant-design/icons/lib";

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
  | "profile_overview"
  | "profile_stats"
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
  profile_overview: "/profile",
  profile_stats: "/profile/stats",
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
  const isAdmin = token && helper.getAccountType(token) === "admin";
  const isTrainer = token && helper.getAccountType(token) === "trainer";

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
              key="profile_overview"
              icon={<BarsOutlined style={{ color: color }} />}
              style={{ marginLeft: "auto" }}
            >
              {t(Translations.tabBar.profile)}
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
