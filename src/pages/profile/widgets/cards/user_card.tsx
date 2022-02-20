import { Card, Col, Popover, Row } from "antd";
import Text from "antd/lib/typography/Text";
import Translations from "../../../../localization/translations";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import ReactCardFlip from "react-card-flip";
import React from "react";
import { useTranslation } from "react-i18next";
import Helper from "../../../../util/helper";
import { FaPen } from "react-icons/fa";

interface userCardProps {
  avatarId: number;
  username: string;
  accountCreated: number;
  motivation: string;
  saveNewUsername: (u: string) => void;
  saveNewMotivation: (m: string) => void;
  saveNewAvatarId: (a: number) => void;
}

const UserCard: React.FC<userCardProps> = ({ ...props }) => {
  const { t } = useTranslation();
  const [userFlipped, setUserFlipped] = React.useState<boolean>(false);
  const [popoverVisible, setPopoverVisible] = React.useState<boolean>(false);
  const [newAvatarId, setNewAvatarId] = React.useState<number>(props.avatarId);
  const [newUsername, setNewUsername] = React.useState<string>(props.username);
  const [newUsernameError, setNewUsernameError] = React.useState<string | null>(
    null
  );
  const [newMotivation, setNewMotivation] = React.useState<string>(
    props.motivation
  );

  const accountCreatedDiff = Date.now() - props.accountCreated;
  const accountCreatedMonths = Math.floor(
    accountCreatedDiff / 30 / 24 / 60 / 60 / 1000
  );

  const validateUsername = (username: string) => {
    if (username.trim().length === 0) {
      setNewUsernameError(t(Translations.profile.usernameEmpty));
      setNewUsername(props.username);
    } else if (!username.match(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/)) {
      setNewUsernameError(t(Translations.profile.usernameNotAllowed));
      setNewUsername(props.username);
    } else if (username.length > 50) {
      setNewUsernameError(t(Translations.profile.usernameTooLong));
      setNewUsername(props.username);
    } else {
      setNewUsernameError(null);
      setNewUsername(username.trim());
    }
  };

  const flipCard = () => {
    if (userFlipped) {
      setUserFlipped(false);
    } else {
      resetEditFields();
      setUserFlipped(true);
    }
  };

  const resetEditFields = () => {
    setNewAvatarId(props.avatarId);
    setNewUsername(props.username);
    setNewMotivation(props.motivation);
  };

  return (
    <ReactCardFlip
      isFlipped={userFlipped}
      flipDirection="horizontal"
      flipSpeedBackToFront={1.0}
      flipSpeedFrontToBack={1.0}
    >
      <Card
        data-testid="user-card"
        style={{
          borderRadius: "5px",
          borderColor: "black",
          backgroundColor: "#EDEDF4",
          boxShadow: "2px 4px 4px 0 rgba(0, 0, 0, 0.25)",
        }}
      >
        <Col>
          <Text
            style={{
              float: "right",
              marginTop: "-20px",
              marginRight: "-20px",
              cursor: "pointer",
            }}
            onClick={() => flipCard()}
            data-testid="edit-profile"
          >
            {t(Translations.profile.edit)} <EditOutlined />
          </Text>
          <Row>
            <img
              alt="Avatar"
              data-testid="user-avatar"
              key={Helper.getAvatarUrl(props.avatarId)}
              src={Helper.getAvatarUrl(props.avatarId)}
              style={{
                height: "100px",
                padding: "20px 10px 0 10px",
                marginBottom: "30px",
                marginRight: "30px",
                clipPath: "circle(50px at center)",
                backgroundColor: "#626FE5",
              }}
            />
            <Col>
              <Text style={{ fontSize: 24 }}>{props.username}</Text>
              <br />
              <Text style={{ fontSize: 15 }}>
                {accountCreatedMonths > 0
                  ? t(Translations.profile.activeSince, {
                      duration: accountCreatedMonths,
                    })
                  : t(Translations.profile.activeShortly)}
              </Text>
            </Col>
          </Row>
          {props.motivation && (
            <Col>
              <Text style={{ fontSize: 16 }}>
                {t(Translations.profile.motivation)}
              </Text>
              <br />
              <Text style={{ fontSize: 20 }}>{props.motivation}</Text>
            </Col>
          )}
        </Col>
      </Card>

      <Card
        style={{
          borderRadius: "5px",
          borderColor: "black",
          backgroundColor: "#EDEDF4",
          boxShadow: "2px 4px 4px 0 rgba(0, 0, 0, 0.25)",
        }}
      >
        <Col>
          <Row
            style={{
              float: "right",
              marginTop: "-20px",
              marginRight: "-20px",
            }}
          >
            <Text
              style={{
                cursor: "pointer",
                paddingRight: "15px",
              }}
              onClick={async () => {
                flipCard();
              }}
            >
              {t(Translations.profile.cancel)}
            </Text>
            <Text
              style={{
                cursor: "pointer",
              }}
              onClick={async () => {
                await props.saveNewUsername(newUsername);
                await props.saveNewMotivation(newMotivation);
                await props.saveNewAvatarId(newAvatarId);
                flipCard();
              }}
            >
              {t(Translations.profile.save)} <SaveOutlined />
            </Text>
          </Row>
          <Row>
            <Popover
              visible={popoverVisible}
              overlayStyle={{ width: "380px" }}
              placement="right"
              title={t(Translations.profile.selectNewAvatar)}
              content={
                <Row gutter={16}>
                  {Helper.availableAvatarIds.map((id) => {
                    return (
                      <img
                        alt="Avatar"
                        onClick={() => {
                          setNewAvatarId(id);
                          flipCard();
                        }}
                        key={id}
                        src={Helper.getAvatarUrl(id)}
                        style={{
                          height: "60px",
                          padding: "10px 5px 0 5px",
                          margin: "5px",
                          clipPath: "circle(30px at center)",
                          backgroundColor: "#626FE5",
                        }}
                      />
                    );
                  })}
                </Row>
              }
              trigger="click"
            >
              <div
                style={{
                  position: "relative",
                }}
              >
                <img
                  alt="Avatar"
                  onClick={() => {
                    setPopoverVisible(!popoverVisible);
                  }}
                  key={newAvatarId}
                  src={Helper.getAvatarUrl(newAvatarId)}
                  style={{
                    cursor: "pointer",
                    height: "100px",
                    padding: "20px 10px 0 10px",
                    marginBottom: "30px",
                    marginRight: "30px",
                    clipPath: "circle(50px at center)",
                    backgroundColor: "#626FE5",
                    display: "block",
                  }}
                />
                {!popoverVisible && (
                  <div
                    onClick={() => {
                      setPopoverVisible(!popoverVisible);
                    }}
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      top: "0",
                      right: "20px",
                      backgroundColor: "#BCBCBC",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                    }}
                  >
                    <FaPen
                      style={{
                        margin: "5px",
                      }}
                    />
                  </div>
                )}
              </div>
            </Popover>
            <Col style={{ flexDirection: "column", display: "flex" }}>
              <Text
                style={{ fontSize: 24 }}
                editable={{
                  onChange: (v) => {
                    validateUsername(v);
                  },
                }}
              >
                {newUsername}
              </Text>
              {newUsernameError && (
                <Text style={{ color: "red", fontSize: 14 }}>
                  {newUsernameError}
                </Text>
              )}
              <Text style={{ fontSize: 15 }}>
                {accountCreatedMonths > 0
                  ? t(Translations.profile.activeSince, {
                      duration: accountCreatedMonths,
                    })
                  : t(Translations.profile.activeShortly)}
              </Text>
            </Col>
          </Row>
          <Text style={{ fontSize: 16 }}>
            {t(Translations.profile.motivation)}
          </Text>
          <br />
          <Text
            editable={{ maxLength: 100, onChange: (v) => setNewMotivation(v) }}
            style={{ fontSize: 20 }}
          >
            {newMotivation}
          </Text>
        </Col>
      </Card>
    </ReactCardFlip>
  );
};

export default UserCard;
