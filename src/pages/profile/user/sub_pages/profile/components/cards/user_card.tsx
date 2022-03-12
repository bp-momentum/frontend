import { Card, Col, Popover, Progress, Row } from "antd";
import Text from "antd/lib/typography/Text";
import Translations from "@localization/translations";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import ReactCardFlip from "react-card-flip";
import React from "react";
import { useTranslation } from "react-i18next";
import Helper from "@util/helper";
import { FaPen } from "react-icons/fa";
import config from "@/config";

interface userCardProps {
  avatarId: number;
  username: string;
  accountCreated: number;
  motivation: string;
  level: number;
  progress: string;
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

  const today = new Date();
  const created = new Date(props.accountCreated * 1000);
  const accountCreatedMonths =
    (today.getFullYear() - created.getFullYear()) * 12 +
    today.getMonth() -
    created.getMonth() +
    (today.getDate() >= created.getDate() ? 0 : -1);

  const validateUsername = (username: string) => {
    const errorKey = Helper.checkUsername(username);
    if (!errorKey) {
      setNewUsernameError(null);
      setNewUsername(username);
    } else {
      setNewUsernameError(t(errorKey, { max: Helper.maxUsernameLength }));
      setNewUsername(props.username);
    }
  };

  const flipCard = () => {
    if (userFlipped) {
      setUserFlipped(false);
      setPopoverVisible(false);
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
          <span
            style={{
              float: "right",
              right: "-10px",
              marginTop: "-20px",
              cursor: "pointer",
              position: "absolute",
            }}
            onClick={() => flipCard()}
            data-testid="edit-profile"
          >
            {t(Translations.profile.edit)} <EditOutlined />
          </span>
          <Row>
            <img
              alt="Avatar"
              data-testid="user-avatar"
              key={props.avatarId}
              src={config.avatarUrlFormatter(props.avatarId)}
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
              <Row
                style={{ display: "flex", alignItems: "center" }}
                justify="center"
              >
                <Progress
                  // eslint-disable-next-line no-eval
                  percent={eval(props.progress)}
                  status="active"
                  showInfo={false}
                  style={{
                    width: "180px",
                    marginRight: "5px",
                  }}
                />
                <span className="text">
                  {t(Translations.profile.level, { level: props.level })}
                </span>
              </Row>
              <div
                className="text"
                style={{
                  fontSize: 13,
                  width: "180px",
                  marginTop: "-8px",
                  textAlign: "center",
                }}
              >{`${props.progress} XP`}</div>
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
              position: "absolute",
              right: "0",
              marginTop: "-20px",
              marginRight: "-10px",
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
                  {config.avatarRange.map((id) => {
                    return (
                      <img
                        alt="Avatar"
                        onClick={() => {
                          setNewAvatarId(id);
                          setPopoverVisible(false);
                        }}
                        key={id}
                        src={config.avatarUrlFormatter(id)}
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
                  src={config.avatarUrlFormatter(newAvatarId)}
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
                    validateUsername(v.trim());
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
