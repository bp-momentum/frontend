import React from "react";
import { useTranslation } from "react-i18next";
import Container from "../shared/container";
import { Calendar, Card, Col, Layout, Popover, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useAppSelector } from "../redux/hooks";
import Helper from "../util/helper";
import ReactCardFlip from "react-card-flip";
import Text from "antd/es/typography/Text";
import {
  LeftOutlined,
  PhoneFilled,
  RightOutlined,
  ShareAltOutlined,
  StarFilled,
  MailOutlined,
} from "@ant-design/icons";
import "../styles/profile.css";
import Translations from "../localization/translations";
import ButtonContact, { ContactType } from "../shared/button_contact";

const RatingStars = (props: { rating: number }): JSX.Element => {
  return (
    <Row style={{ alignItems: "end" }} justify="space-around">
      <StarFilled
        style={{
          fontSize: 65,
          color: props.rating > 0 ? "#FFCC33" : "#C4C4C4",
        }}
      />
      <StarFilled
        style={{
          fontSize: 75,
          color: props.rating > 1 ? "#FFCC33" : "#C4C4C4",
        }}
      />
      <StarFilled
        style={{
          fontSize: 80,
          color: props.rating > 2 ? "#FFCC33" : "#C4C4C4",
        }}
      />
      <StarFilled
        style={{
          fontSize: 75,
          color: props.rating > 3 ? "#FFCC33" : "#C4C4C4",
        }}
      />
      <StarFilled
        style={{
          fontSize: 65,
          color: props.rating > 4 ? "#FFCC33" : "#C4C4C4",
        }}
      />
    </Row>
  );
};

const SiderButton = (props: {
  onClick: VoidFunction;
  image: string;
  title: string;
  rotation: number;
  color: string;
}) => {
  return (
    <Row justify="center">
      <div
        onClick={props.onClick}
        style={{
          marginBottom: "40px",
          cursor: "pointer",
          backgroundColor: props.color,
          width: "140px",
          height: "140px",
          borderRadius: "20px",
          color: "black",
          transform: `rotate(${props.rotation}deg)`,
          justifyContent: "center",
        }}
      >
        <Col style={{ paddingTop: "10px" }}>
          <Row justify="center">
            <img src={props.image} height={82} alt={`${props.title} Icon`} />
          </Row>
          <Row justify="center">
            <Text style={{ fontSize: "26" }}>{props.title}</Text>
          </Row>
        </Col>
      </div>
    </Row>
  );
};

interface DoneExercise {
  id: string;
  name: string;
  duration: number;
}

const Profile = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const token = useAppSelector((state) => state.token.token);
  const [userFlipped, setUserFlipped] = React.useState<boolean>(false);
  const [popoverVisible, setPopoverVisible] = React.useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = React.useState<string>(
    "https://cdn.geoscribble.de/avatars/avatar_1.png"
  );
  const dailyRating = 4; // TODO

  const minutesTrainedGoal = 45; // TODO
  const doneExercises: DoneExercise[] = [
    {
      id: "1",
      name: "Liegestütze",
      duration: 17 * 60 * 1000,
    },
    {
      id: "2",
      name: "Kniebeuge",
      duration: 13 * 60 * 1000,
    },
  ]; // TODO

  const minutesTrained =
    doneExercises.map((e) => e.duration).reduce((e1, e2) => e1 + e2) /
    1000 /
    60;

  const accountCreated = 1640991600000; // TODO
  const accountCreatedDiff = Date.now() - accountCreated;
  const accountCreatedMonths = Math.floor(
    accountCreatedDiff / 30 / 24 / 60 / 60 / 1000
  );
  const motivation = "Meine Gesundheit!"; // TODO
  const trainerName = "Dr. med-habil. Julian Imhof"; // TODO
  const trainerAddress1 = "Einbahnstr. 187"; // TODO
  const trainerAddress2 = "12345 Berlin"; // TODO
  const trainerEmail = "julian@hilfmir.de"; // TODO
  const trainerPhone = "0123456789"; // TODO

  const avatarUrls = [];
  for (let i = 1; i <= 50; i++) {
    avatarUrls.push(`https://cdn.geoscribble.de/avatars/avatar_${i}.png`);
  }

  let newUsername = Helper.getUserName(token ?? "");
  let newMotivation = motivation;
  const saveUsername = () => {
    // TODO
    console.log("Saving new username: " + newUsername);
  };

  const saveMotivation = () => {
    // TODO
    console.log("Saving new motivation: " + newMotivation);
  };

  const onClickShare = () => {
    // TODO
    console.log("Share");
  };

  const onClickFriends = () => {
    // TODO
    console.log("Friends");
  };

  const onClickAchievements = () => {
    console.log("Achievements");
  };

  return (
    <Container currentPage="profile" color="blue">
      <Layout style={{ height: "100%" }}>
        <Sider
          style={{
            backgroundColor: "#466995",
            color: "white",
            height: "100%",
          }}
        >
          <Col>
            <Row justify="center">
              <img
                alt="Avatar"
                key={avatarUrl}
                src={avatarUrl}
                style={{
                  height: "160px",
                  padding: "20px 10px 0 10px",
                  marginTop: "20px",
                  clipPath: "circle(80px at center)",
                  backgroundColor: "#626FE5",
                }}
              />
            </Row>
            <Row justify="center">
              <h5 style={{ fontSize: 48, color: "white" }}>
                {Helper.getUserName(token ?? "")}
              </h5>
            </Row>

            <SiderButton
              onClick={() => onClickFriends()}
              image="friends_image.png"
              title="Freunde"
              rotation={-5.5}
              color="#FFE14D"
            />

            <SiderButton
              onClick={() => onClickAchievements()}
              image="achievements_image.png"
              title="Errungenschaften"
              rotation={3}
              color="#9713FF"
            />
          </Col>
        </Sider>
        <Content>
          <Row gutter={16} justify="space-around" style={{ margin: 0 }}>
            <Col className="gutter-row" span={10} style={{ marginTop: "30px" }}>
              <ReactCardFlip
                isFlipped={userFlipped}
                flipDirection="horizontal"
                flipSpeedBackToFront={1.0}
                flipSpeedFrontToBack={1.0}
              >
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
                      onClick={() => setUserFlipped(true)}
                      underline
                    >
                      {t(Translations.profile.edit)}
                    </Text>
                    <Row>
                      <img
                        alt="Avatar"
                        key={avatarUrl}
                        src={avatarUrl}
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
                        <Text style={{ fontSize: 24 }}>
                          {Helper.getUserName(token ?? "")}
                        </Text>
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
                    <Text style={{ fontSize: 20 }}>{motivation}</Text>
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
                      onClick={() => {
                        saveUsername();
                        saveMotivation();
                        setUserFlipped(false);
                      }}
                      underline
                    >
                      {t(Translations.profile.save)}
                    </Text>
                    <Row>
                      <Popover
                        visible={popoverVisible}
                        overlayStyle={{ width: "370px" }}
                        placement="right"
                        title={t(Translations.profile.selectNewAvatar)}
                        content={
                          <Row gutter={16}>
                            {avatarUrls.map((url) => {
                              return (
                                <img
                                  alt="Avatar"
                                  onClick={() => {
                                    setAvatarUrl(url);
                                    setPopoverVisible(false);
                                  }}
                                  key={url}
                                  src={url}
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
                          key={avatarUrl}
                          src={avatarUrl}
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
                            onChange: (v) => (newUsername = v),
                          }}
                        >
                          {Helper.getUserName(token ?? "")}
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
                      editable={{ onChange: (v) => (newMotivation = v) }}
                      style={{ fontSize: 20 }}
                    >
                      {motivation}
                    </Text>
                  </Col>
                </Card>
              </ReactCardFlip>
            </Col>
            <Col className="gutter-row" span={10}>
              <Card
                style={{
                  marginTop: "30px",
                  borderRadius: "5px",
                  borderColor: "black",
                  backgroundColor: "#EDEDF4",
                  boxShadow: "2px 4px 4px 0 rgba(0, 0, 0, 0.25)",
                }}
              >
                <Row justify="space-around">
                  <Text>{t(Translations.user.trainer)}</Text>
                  <Text style={{ marginRight: "5px" }}>
                    {trainerName}
                    <br />
                    {trainerAddress1}
                    <br />
                    {trainerAddress2}
                    <br />
                    <ButtonContact
                      type={ContactType.phone}
                      contact={trainerPhone}
                      label={trainerPhone}
                    />
                    <PhoneFilled
                      style={{ marginTop: "5px", paddingLeft: "5px" }}
                    />
                    <br />
                    <ButtonContact
                      type={ContactType.email}
                      contact={trainerEmail}
                      label={trainerEmail}
                    />
                    <MailOutlined
                      style={{ marginTop: "5px", paddingLeft: "5px" }}
                    />
                  </Text>
                </Row>
              </Card>
            </Col>
            <Col className="gutter-row" span={10}>
              <Card
                style={{
                  marginTop: "40px",
                  borderRadius: "5px",
                  borderColor: "black",
                  backgroundColor: "#EDEDF4",
                  boxShadow: "2px 4px 4px 0 rgba(0, 0, 0, 0.25)",
                }}
              >
                <Text>{t(Translations.profile.chooseDate)}</Text>
                <Calendar
                  mode="month"
                  style={{
                    marginTop: "5px",
                    height: "300px",
                    backgroundColor: "#EDEDF4",
                    color: "transparent",
                  }}
                  fullscreen={false}
                  headerRender={({ value, type, onChange, onTypeChange }) => {
                    const localeData = value.localeData();
                    return (
                      <div style={{ padding: 8, color: "black" }}>
                        <Row justify="space-between">
                          <LeftOutlined
                            onClick={() => {
                              const newDate = value.clone();
                              newDate.subtract(1, "month");
                              onChange(newDate);
                            }}
                          />
                          <Text style={{ fontSize: 20, marginTop: -8 }}>
                            {localeData.months(value) + " " + value.year()}
                          </Text>
                          <RightOutlined
                            onClick={() => {
                              const newDate = value.clone();
                              newDate.add(1, "month");
                              onChange(newDate);
                            }}
                          />
                        </Row>
                      </div>
                    );
                  }}
                  dateFullCellRender={(date) => {
                    return (
                      <Text
                        style={{
                          color:
                            date.toDate().toDateString() ===
                            new Date().toDateString()
                              ? "#466995"
                              : "black",
                          borderRadius: "50%",
                        }}
                      >
                        {date.date()}
                      </Text>
                    );
                  }}
                />
              </Card>
            </Col>
            <Col className="gutter-row" span={10}>
              <Card
                style={{
                  marginTop: "40px",
                  borderRadius: "5px",
                  backgroundColor: "#E6E7EA",
                  boxShadow: "2px 4px 4px 0 rgba(0, 0, 0, 0.25)",
                }}
              >
                <Col>
                  <Row justify="center" style={{ fontSize: 30 }}>
                    {new Date().toLocaleDateString(i18n.language, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Row>
                  <RatingStars rating={dailyRating} />
                  <Row justify="center" style={{ marginTop: "15px" }}>
                    {t(Translations.profile.activeMinutes, {
                      active: minutesTrained,
                      goal: minutesTrainedGoal,
                    })}
                  </Row>
                  <Row>
                    <Col style={{ marginTop: "15px", marginLeft: "15px" }}>
                      {doneExercises.map((e) => {
                        return (
                          <Text key={e.id}>
                            {e.name}
                            <br />
                          </Text>
                        );
                      })}
                    </Col>
                    <Col style={{ marginTop: "15px", marginLeft: "80px" }}>
                      {doneExercises.map((e) => {
                        return (
                          <Text key={e.id}>
                            {e.duration / 1000 / 60} min
                            <br />
                          </Text>
                        );
                      })}
                    </Col>
                  </Row>
                  <Row justify="end">
                    <ShareAltOutlined
                      onClick={() => onClickShare()}
                      style={{
                        marginTop: "-15px",
                        backgroundColor: "#EDEDF4",
                        borderRadius: "50%",
                        padding: "6px 7px 5px 5px",
                      }}
                    />
                  </Row>
                </Col>
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Container>
  );
};

export default Profile;
