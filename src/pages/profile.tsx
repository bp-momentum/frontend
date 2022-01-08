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
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "../styles/profile.css";

const Profile = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const token = useAppSelector((state) => state.token.token);
  const [userFlipped, setUserFlipped] = React.useState<boolean>(false);
  const [popoverVisible, setPopoverVisible] = React.useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = React.useState<string>(
    "https://cdn.geoscribble.de/avatars/avatar_1.png"
  );
  const avatarUrls = [];

  for (let i = 1; i <= 50; i++) {
    avatarUrls.push(`https://cdn.geoscribble.de/avatars/avatar_${i}.png`);
  }

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
              <h5 style={{ fontSize: 48, color: "white" }}>
                {Helper.getUserName(token ?? "")}
              </h5>
            </Row>

            <Row justify="center">Freunde</Row>
          </Col>
        </Sider>
        <Content>
          <Row gutter={16} justify="space-around" style={{ margin: 0 }}>
            <Col className="gutter-row" span={10}>
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
                    marginTop: "30px",
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
                      Bearbeiten 🖋
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
                          Fleißig seit 2 Monaten
                        </Text>
                      </Col>
                    </Row>
                    <Text style={{ fontSize: 16 }}>
                      Das treibt mich täglich an:
                    </Text>
                    <br />
                    <Text style={{ fontSize: 20 }}>Meine Gesundheit!</Text>
                  </Col>
                </Card>

                <Card
                  style={{
                    borderRadius: "5px",
                    borderColor: "black",
                    backgroundColor: "#EDEDF4",
                    marginTop: "30px",
                  }}
                >
                  <Col>
                    <Text
                      style={{
                        float: "right",
                        marginTop: "-20px",
                        marginRight: "-20px",
                      }}
                      onClick={() => setUserFlipped(false)}
                      underline
                    >
                      Speichern
                    </Text>
                    <Row>
                      <Popover
                        visible={popoverVisible}
                        overlayStyle={{ width: "370px" }}
                        placement="right"
                        title="Wähle deinen neuen Avatar"
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
                        <Text style={{ fontSize: 24 }} editable>
                          {Helper.getUserName(token ?? "")}
                        </Text>
                        <Text style={{ fontSize: 15 }}>
                          Fleißig seit 2 Monaten
                        </Text>
                      </Col>
                    </Row>
                    <Text style={{ fontSize: 16 }}>
                      Das treibt mich täglich an:
                    </Text>
                    <br />
                    <Text editable style={{ fontSize: 20 }}>
                      Meine Gesundheit!
                    </Text>
                  </Col>
                </Card>
              </ReactCardFlip>
            </Col>
            <Col className="gutter-row" span={10}>
              <div style={{ backgroundColor: "red" }}>col-6</div>
            </Col>
            <Col className="gutter-row" span={10}>
              <Card
                style={{
                  marginTop: "40px",
                  borderRadius: "5px",
                  borderColor: "black",
                  backgroundColor: "#EDEDF4",
                }}
              >
                <Text>Wähle einen Tag aus um deine Aktivität zu sehen</Text>
                <Calendar
                  mode="month"
                  style={{
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
                            onClick={() => onChange(value.subtract(1, "month"))}
                          />
                          <Text style={{ fontSize: 20, marginTop: -8 }}>
                            {localeData.months(value)}
                          </Text>
                          <RightOutlined
                            onClick={() => onChange(value.add(1, "month"))}
                          />
                        </Row>
                      </div>
                    );
                  }}
                  dateFullCellRender={(date) => {
                    return <Text>{date.date()}</Text>;
                  }}
                />
              </Card>
            </Col>
            <Col className="gutter-row" span={10}>
              <div style={{ backgroundColor: "red" }}>col-6</div>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Container>
  );
};

export default Profile;
