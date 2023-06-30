import { Layout, Menu, Modal } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import {
  HomeTwoTone,
  SettingTwoTone,
  BarsOutlined,
  TeamOutlined,
  CalendarOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import React from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";
import { MenuInfo } from "rc-menu/lib/interface";
import { useAppDispatch, useAppSelector } from "@redux/hooks";
import { ExclamationCircleOutlined } from "@ant-design/icons/lib";
import ApiRoutes from "@util/routes";
import useApi from "@hooks/api";

const { confirm } = Modal;

type pages =
  | "manage"
  | "home"
  | "settings"
  | "profile"
  | "manage_users"
  | "manage_plans"; // navigable pages
type pagesToRouteType = {
  [K in pages]: string;
};
const pageToRoute: pagesToRouteType = {
  home: "/",
  settings: "/settings",
  profile: "/profile",
  manage: "/manage",
  manage_users: "/manage/users",
  manage_plans: "/manage/plans",
};

interface Props {
  children: React.ReactNode;
  currentPage?: "home" | "settings" | "profile" | "manage"; // highlightable menu items
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
  const api = useApi();

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
        api.execute(ApiRoutes.logout());
        dispatch({ type: "USER_LOGOUT" });
        navigate("/");
      },
    });
  };

  const role = useAppSelector((state) => state.profile.role);

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

  const menuProfile = {
    key: "profile",
    icon: <BarsOutlined style={{ color: "#1890ff" }} />,
    label: t(Translations.tabBar.profile),
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

  const menuItemsUser = [menuHome, menuProfile, menuSettings, menuLogout];
  const menuItemsTrainer = [
    menuHome,
    menuUsers,
    menuPlans,
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

  const menuItems =
    role === "player"
      ? menuItemsUser
      : role === "trainer"
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
