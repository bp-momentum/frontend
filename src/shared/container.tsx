import { Layout, Menu } from "antd";
import { Content, Footer, Header } from "antd/lib/layout/layout";
import { HomeTwoTone, SettingTwoTone, StockOutlined, UserOutlined, CrownTwoTone, BarsOutlined } from "@ant-design/icons";
import React from "react";
import SubMenu from "antd/lib/menu/SubMenu";
import { useNavigate } from "react-router";

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

  const handleClick = (e : any) => {
    if (e?.key !== props.currentPage) {
      navigate(pageToRoute[e.key as pages]);
    }
  };

  return (
    <Layout>
      <Header style={{backgroundColor: "#fff"}}>
        <Menu mode="horizontal" selectedKeys={[props.currentPage]} onClick={handleClick}>
          <Menu.Item key="home" icon={<HomeTwoTone twoToneColor={props.color}/>}>
            Home
          </Menu.Item>
          <Menu.Item key="leaderboard" icon={<CrownTwoTone twoToneColor={props.color} />}>
            Leaderboard
          </Menu.Item>
          <SubMenu style={{marginLeft: "auto"}} key="profile" icon={<UserOutlined style={{color: props.color}} />} title="Profil">
            <Menu.Item key="profile_overview" icon={<BarsOutlined style={{color: props.color}} />}>Overview</Menu.Item>
            <Menu.Item key="profile_stats" icon={<StockOutlined style={{color: props.color}} />}>Stats</Menu.Item>
          </SubMenu>
          <Menu.Item key="settings" icon={<SettingTwoTone twoToneColor={props.color} />}>
            Settings
          </Menu.Item>
        </Menu>
      </Header>
      <Content>
        {props.children}
      </Content>
      <Footer>
      </Footer>
    </Layout>
  );
}