import { Card, Col, Popover, Row } from "antd";
import Text from "antd/lib/typography/Text";
import Translations from "../../../../localization/translations";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import ReactCardFlip from "react-card-flip";
import React from "react";
import { useTranslation } from "react-i18next";
import Helper from "../../../../util/helper";

const UserCard = (props: {
  avatarId: number;
  username: string;
  accountCreated: number;
  motivation: string;
  saveNewUsername: (u: string) => void;
  saveNewMotivation: (m: string) => void;
  saveNewAvatarId: (a: number) => void;
}): JSX.Element => {
  const { t } = useTranslation();
  const [userFlipped, setUserFlipped] = React.useState<boolean>(false);
  const [popoverVisible, setPopoverVisible] = React.useState<boolean>(false);
  const [newAvatarId, setNewAvatarId] = React.useState<number>(props.avatarId);
  const [newUsername, setNewUsername] = React.useState<string>(props.username);
  const [newMotivation, setNewMotivation] = React.useState<string>(
    props.motivation
  );

  const accountCreatedDiff = Date.now() - props.accountCreated;
  const accountCreatedMonths = Math.floor(
    accountCreatedDiff / 30 / 24 / 60 / 60 / 1000
  );

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
            }}
            onClick={() => setUserFlipped(true)}
            data-testid="edit-profile"
          >
            {t(Translations.profile.edit)}
            <EditOutlined />
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
          <Text style={{ fontSize: 16 }}>
            {t(Translations.profile.motivation)}
          </Text>
          <br />
          <Text style={{ fontSize: 20 }}>{props.motivation}</Text>
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
          <Text
            style={{
              float: "right",
              marginTop: "-20px",
              marginRight: "-20px",
            }}
            onClick={async () => {
              await props.saveNewUsername(newUsername);
              await props.saveNewMotivation(newMotivation);
              await props.saveNewAvatarId(newAvatarId);
              setUserFlipped(false);
            }}
          >
            {t(Translations.profile.save)}
            <SaveOutlined />
          </Text>
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
                          setPopoverVisible(false);
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
              <img
                alt="Avatar"
                onClick={() => {
                  setPopoverVisible(!popoverVisible);
                }}
                key={newAvatarId}
                src={Helper.getAvatarUrl(newAvatarId)}
                style={{
                  height: "100px",
                  padding: "20px 10px 0 10px",
                  marginBottom: "30px",
                  marginRight: "30px",
                  clipPath: "circle(50px at center)",
                  backgroundColor: "#626FE5",
                }}
              />
            </Popover>
            <Col style={{ flexDirection: "column", display: "flex" }}>
              <Text
                style={{ fontSize: 24 }}
                editable={{
                  onChange: (v) => {
                    setNewUsername(v);
                  },
                }}
              >
                {newUsername}
              </Text>
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
            editable={{ onChange: (v) => setNewMotivation(v) }}
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
