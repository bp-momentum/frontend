import { Col, Layout, Row } from "antd";
import React from "react";
import "@styles/ProfileSider.css";
import { Avatar } from "../types";
import AvatarImage from "../sub_pages/profile/components/avatarDesigner/avatar";

const { Sider } = Layout;

interface Props {
  onClickProfile: VoidFunction;
  avatar: Avatar | undefined;
  username: string;
  selected: "profile" | "friends" | "achievements" | "loading";
}

/**
 * Sidebar of the user's profile.
 * @param {Props} props The properties of the component.
 * @returns {JSX.Element} The component.
 */
const ProfileSider: React.FC<Props> = ({
  onClickProfile,
  avatar,
  username,
  selected,
}: Props): JSX.Element => {
  return (
    <Sider
      data-testid="profile-sider"
      style={{
        backgroundColor: "#466995",
        color: "white",
        height: "100%",
        overflow: "auto",
      }}
    >
      <Col style={{ height: "100%" }}>
        {avatar !== undefined && (
          <Row justify="center">
            <div
              onClick={() => onClickProfile()}
              className={`hoverable ${
                selected === "profile" ? "selected" : ""
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
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AvatarImage {...avatar} width={130} />
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
            {username}
          </h5>
        </Row>
      </Col>
    </Sider>
  );
};

export default ProfileSider;
