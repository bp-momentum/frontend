import { Col, Layout, Row } from "antd";
import SiderButton from "./sider_button";
import React from "react";

const { Sider } = Layout;

interface profileSiderProps {
  onClickFriends: VoidFunction;
  onClickAchievements: VoidFunction;
  avatarUrl: string;
  username: string;
}

const ProfileSider: React.FC<profileSiderProps> = ({ ...props }) => {
  return (
    <Sider
      data-testid="profile-sider"
      style={{
        backgroundColor: "#466995",
        color: "white",
        height: "100%",
        position: "fixed",
      }}
    >
      <Col>
        {props.avatarUrl.length !== 0 && (
          <Row justify="center">
            <img
              alt="Avatar"
              key={props.avatarUrl}
              src={props.avatarUrl}
              style={{
                height: "160px",
                padding: "20px 10px 0 10px",
                marginTop: "20px",
                clipPath: "circle(80px at center)",
                backgroundColor: "#626FE5",
              }}
            />
          </Row>
        )}
        <Row justify="center">
          <h5
            style={{
              textAlign: "center",
              fontSize: 48,
              color: "white",
              overflowWrap: "anywhere",
            }}
          >
            {props.username}
          </h5>
        </Row>

        <SiderButton
          onClick={() => props.onClickFriends()}
          image="friends_image.png"
          title="Freunde"
          rotation={-5.5}
          color="#FFE14D"
        />

        <SiderButton
          onClick={() => props.onClickAchievements()}
          image="achievements_image.png"
          title="Errungenschaften"
          rotation={3}
          color="#9713FF"
        />
      </Col>
    </Sider>
  );
};

export default ProfileSider;
