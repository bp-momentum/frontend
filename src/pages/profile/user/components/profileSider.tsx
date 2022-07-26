import { Col, Layout, Row } from "antd";
import SiderButton from "./siderButton";
import React from "react";
import "@styles/ProfileSider.css";
import { useAppSelector } from "@redux/hooks";
import Translations from "@localization/translations";
import { useTranslation } from "react-i18next";
import { Avatar } from "../types";
import AvatarImage from "../sub_pages/profile/components/avatarDesigner/avatar";

const { Sider } = Layout;

interface Props {
  onClickFriends: VoidFunction;
  onClickAchievements: VoidFunction;
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
  onClickFriends,
  onClickAchievements,
  onClickProfile,
  avatar,
  username,
  selected,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const hasRequests =
    useAppSelector((state) => state.friends.friendRequests).length > 0;

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

        <SiderButton
          onClick={() => onClickFriends()}
          image="friends_image.png"
          title={t(Translations.profile.friends)}
          rotation={-5.5}
          backgroundColor="#FFE14D"
          color="#000"
          className={`hoverable ${selected === "friends" ? "selected" : ""} ${
            hasRequests && selected !== "friends" ? "notification" : ""
          }`}
        />

        <SiderButton
          onClick={() => onClickAchievements()}
          image="achievements_image.png"
          title={t(Translations.profile.achievements)}
          rotation={3}
          backgroundColor="#9713FF"
          color="#fff"
          className={`hoverable ${
            selected === "achievements" ? "selected" : ""
          }`}
        />
      </Col>
    </Sider>
  );
};

export default ProfileSider;
