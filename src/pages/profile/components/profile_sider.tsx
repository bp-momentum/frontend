import { Col, Layout, Row } from "antd";
import SiderButton from "./sider_button";
import React from "react";
import "@styles/ProfileSider.css";

const { Sider } = Layout;

interface profileSiderProps {
  onClickFriends: VoidFunction;
  onClickAchievements: VoidFunction;
  onClickProfile: VoidFunction;
  avatarUrl: string;
  username: string;
  selected: "profile" | "friends" | "achievements" | "loading";
}

const ProfileSider: React.FC<profileSiderProps> = ({ ...props }) => {
  return (
    <Sider
      data-testid="profile-sider"
      style={{
        backgroundColor: "#466995",
        color: "white",
        height: "100%",
      }}
    >
      <Col>
        {props.avatarUrl.length !== 0 && (
          <Row justify="center">
            <div
              onClick={() => props.onClickProfile()}
              className={`hoverable ${
                props.selected === "profile" ? "selected" : ""
              }`}
              style={{
                backgroundColor: "#626FE5",
                borderRadius: "50%",
                height: "160px",
                width: "160px",
                cursor: "pointer",
                padding: "20px 10px 0 10px",
                overflow: "hidden",
                marginTop: "20px",
              }}
            >
              <img
                alt="Avatar"
                key={props.avatarUrl}
                src={props.avatarUrl}
                style={{
                  height: "100%",
                  width: "100%",
                }}
              />
            </div>
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
          backgroundColor="#FFE14D"
          color="#000"
          className={`hoverable ${
            props.selected === "friends" ? "selected" : ""
          }`}
        />

        <SiderButton
          onClick={() => props.onClickAchievements()}
          image="achievements_image.png"
          title="Errungenschaften"
          rotation={3}
          backgroundColor="#9713FF"
          color="#fff"
          className={`hoverable ${
            props.selected === "achievements" ? "selected" : ""
          }`}
        />
      </Col>
    </Sider>
  );
};

export default ProfileSider;
