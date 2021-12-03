import { Layout, Menu } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import { HomeTwoTone, SettingTwoTone, StockOutlined, UserOutlined, CrownTwoTone, BarsOutlined, TeamOutlined, CalendarOutlined } from "@ant-design/icons";
import React from "react";
import SubMenu from "antd/lib/menu/SubMenu";
import { useNavigate } from "react-router";
import { useAppSelector } from "../redux/hooks";
import helper from "../util/helper";

export interface ContainerProps {
  children: React.ReactNode;
  currentPage: "home" | "settings" | "leaderboard" | "profile" | "manage";   // highlightable menu items
  color?: "red" | "gold" | "blue";
}

type pages = "manage" | "home" | "settings" | "leaderboard" | "profile" | "profile_overview" | "profile_stats" | "manage_user" | "manage_plans"; // navigatable pages
type pagesToRouteType = {
  [K in pages]: string;
};
const pageToRoute: pagesToRouteType = {
  home: "/",
  settings: "/settings",
  leaderboard: "/leaderboard",
  profile: "/profile",
  profile_overview: "/profile/overview",
  profile_stats: "/profile/stats",
  manage: "/manage",
  manage_user: "/manage/user",
  manage_plans: "/manage/plans"
};

export default function Container (props: ContainerProps) : JSX.Element {
  const color = props.color || "blue";
  const navigate = useNavigate();

  const handleClick = (e : any) => {
    if (e?.key !== props.currentPage) {
      navigate(pageToRoute[e.key as pages]);
    }
  };
  
  const token = useAppSelector(state => state.token.token)!;
  const isAdmin = helper.getAccountType(token) === "admin";
  const isTrainer = helper.getAccountType(token) === "trainer";

  return (
    <Layout style={{height: "100%", position: "absolute", width: "100%"}}>
      <Header style={{backgroundColor: "#fff"}}>
        <Menu mode="horizontal" selectedKeys={[props.currentPage]} onClick={handleClick}>
          <Menu.Item key="home" icon={<HomeTwoTone twoToneColor={props.color}/>}>
            Home
          </Menu.Item>
          {(isTrainer || isAdmin) && 
            <SubMenu key="manage" title="Manage" icon={<SettingTwoTone twoToneColor={props.color}/>}>
              <Menu.Item key="manage_user" icon={<TeamOutlined style={{color: color}} />}>User</Menu.Item>
              <Menu.Item key="manage_plans" icon={<CalendarOutlined style={{color: color}} />}>Plans</Menu.Item>
            </SubMenu>
          }
          {!(isTrainer || isAdmin) &&
            <Menu.Item key="leaderboard" icon={<CrownTwoTone twoToneColor={color} />}>
              Leaderboard
            </Menu.Item>
          }
          <SubMenu style={{marginLeft: "auto"}} key="profile" icon={<UserOutlined style={{color: color}} />} title="Profil">
            <Menu.Item key="profile_overview" icon={<BarsOutlined style={{color: color}} />}>Overview</Menu.Item>
            <Menu.Item key="profile_stats" icon={<StockOutlined style={{color: color}} />}>Stats</Menu.Item>
          </SubMenu>
          <Menu.Item key="settings" icon={<SettingTwoTone twoToneColor={color} />}>
            Settings
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{position: "relative"}}>
        {props.children}
      </Content>
    </Layout>
  );
}