import { Layout, Menu } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import {
  HomeTwoTone,
  SettingTwoTone,
  StockOutlined,
  UserOutlined,
  CrownTwoTone,
  BarsOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import React from "react";
import SubMenu from "antd/lib/menu/SubMenu";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Translations from "../localization/translations";
import { MenuInfo } from "rc-menu/lib/interface";
import { useAppSelector } from "../redux/hooks";
import helper from "../util/helper";

export interface ContainerProps {
  children: React.ReactNode;
  currentPage: "home" | "settings" | "leaderboard" | "profile" | "manage"; // highlightable menu items
  color?: "red" | "gold" | "blue";
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

export default function Container(props: ContainerProps): JSX.Element {
  const color = props.color || "blue";
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = (e: MenuInfo) => {
    navigate(pageToRoute[e.key as pages]);
  };

  const token = useAppSelector((state) => state.token.token);
  const isUser = token && helper.getAccountType(token) === "user";
  const isAdmin = token && helper.getAccountType(token) === "admin";
  const isTrainer = token && helper.getAccountType(token) === "trainer";

  return (
    <Layout style={{ height: "100%", position: "absolute", width: "100%" }}>
      <Header style={{ backgroundColor: "#fff" }}>
        <Menu
          mode="horizontal"
          selectedKeys={[props.currentPage]}
          onClick={handleClick}
        >
          <Menu.Item
            key="home"
            icon={<HomeTwoTone twoToneColor={props.color} />}
          >
            {t(Translations.tabBar.home)}
          </Menu.Item>
          {(isTrainer || isAdmin) && (
            <SubMenu
              key="manage"
              title={t(Translations.tabBar.manage)}
              icon={<SettingTwoTone twoToneColor={props.color} />}
            >
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
            </SubMenu>
          )}
          {!(isTrainer || isAdmin) && (
            <Menu.Item
              key="leaderboard"
              icon={<CrownTwoTone twoToneColor={color} />}
            >
              {t(Translations.tabBar.leaderboard)}
            </Menu.Item>
          )}
          {isUser && (
            <SubMenu
              style={{ marginLeft: "auto" }}
              key="profile"
              icon={<UserOutlined style={{ color: color }} />}
              title={t(Translations.tabBar.profile)}
            >
              <Menu.Item
                key="profile_overview"
                icon={<BarsOutlined style={{ color: props.color }} />}
              >
                {t(Translations.tabBar.overview)}
              </Menu.Item>
              <Menu.Item
                key="profile_stats"
                icon={<StockOutlined style={{ color: props.color }} />}
              >
                {t(Translations.tabBar.statistics)}
              </Menu.Item>
            </SubMenu>
          )}
          <Menu.Item
            key="settings"
            style={isUser ? {} : { marginLeft: "auto" }}
            icon={<SettingTwoTone twoToneColor={props.color} />}
          >
            {t(Translations.tabBar.settings)}
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ position: "relative" }}>{props.children}</Content>
    </Layout>
  );
}
