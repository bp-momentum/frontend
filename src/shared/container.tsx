import { Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { HomeTwoTone, SettingTwoTone, StockOutlined, UserOutlined, CrownTwoTone, BarsOutlined } from "@ant-design/icons";
import React from "react";
import SubMenu from "antd/lib/menu/SubMenu";
import { useNavigate } from "react-router";
import {useTranslation} from "react-i18next";
import Translations from "../localization/translations";
import {MenuInfo} from "rc-menu/lib/interface";

export interface ContainerProps {
  children: React.ReactNode;
  currentPage: "home" | "settings" | "leaderboard";   // highlightable menu items
  color: "red" | "gold" | "blue";
}

type pages = "home" | "settings" | "leaderboard" | "profile" | "profile_overview" | "profile_stats"; // navigatable pages
type pagesToRouteType = {
  [K in pages]: string;
};
const pageToRoute: pagesToRouteType = {
  home: "/",
  settings: "/settings",
  leaderboard: "/leaderboard",
  profile: "/profile",
  profile_overview: "/profile/overview",
  profile_stats: "/profile/stats"};

export default function Container (props: ContainerProps) : JSX.Element {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = (e: MenuInfo) => {
    if (e?.key !== props.currentPage) {
      navigate(pageToRoute[e.key as pages]);
    }
  };

  return (
    <Layout style={{height: "100%", position: "absolute", width: "100%"}}>
      <Header style={{backgroundColor: "#fff"}}>
        <Menu mode="horizontal" selectedKeys={[props.currentPage]} onClick={handleClick}>
          <Menu.Item key="home" icon={<HomeTwoTone twoToneColor={props.color}/>}>
            {t(Translations.tabBar.home)}
          </Menu.Item>
          <Menu.Item key="leaderboard" icon={<CrownTwoTone twoToneColor={props.color} />}>
            {t(Translations.tabBar.leaderboard)}
          </Menu.Item>
          <SubMenu style={{marginLeft: "auto"}} key="profile" icon={<UserOutlined style={{color: props.color}} />} title={t(Translations.tabBar.profile)}>
            <Menu.Item key="profile_overview" icon={<BarsOutlined style={{color: props.color}} />}>{t(Translations.tabBar.overview)}</Menu.Item>
            <Menu.Item key="profile_stats" icon={<StockOutlined style={{color: props.color}} />}>{t(Translations.tabBar.statistics)}</Menu.Item>
          </SubMenu>
          <Menu.Item key="settings" icon={<SettingTwoTone twoToneColor={props.color} />}>
            {t(Translations.tabBar.settings)}
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{position: "relative"}}>
        {props.children}
      </Content>
      <Footer>
      </Footer>
    </Layout>
  );
}
