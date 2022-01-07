import React from "react";
import { useTranslation } from "react-i18next";
import Container from "../shared/container";
import { Avatar, Calendar, Card, Col, Layout, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useAppSelector } from "../redux/hooks";
import Helper from "../util/helper";
import ReactCardFlip from "react-card-flip";
import Text from "antd/es/typography/Text";
import { EditOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";

const Profile = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const token = useAppSelector((state) => state.token.token);
  const [userFlipped, setUserFlipped] = React.useState<boolean>(false);

  return (
    <Container currentPage="profile" color="blue">
      <Layout>
        <Layout>
          <Sider
            style={{
              backgroundColor: "#466995",
              color: "white",
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
            <Row gutter={16} justify="space-around">
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
                        <Avatar
                          shape="circle"
                          style={{
                            backgroundColor: "#626FE5",
                            marginRight: "30px",
                            marginBottom: "30px",
                          }}
                          src="https://cdn.geoscribble.de/avatars/avatar_2.png"
                          size={100}
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
                    onClick={() => setUserFlipped(false)}
                    style={{
                      borderRadius: "5px",
                      borderColor: "black",
                      backgroundColor: "#EDEDF4",
                    }}
                  >
                    <Row>
                      <Avatar
                        shape="circle"
                        style={{ backgroundColor: "#626FE5" }}
                        src="https://cdn.geoscribble.de/avatars/boy_1.png"
                        size={100}
                      />
                      <Col style={{ justifyContent: "center" }}>
                        <p style={{ fontSize: 24 }}>
                          {Helper.getUserName(token ?? "")}
                        </p>
                        <p>Fleißig seit 2 Monaten</p>
                      </Col>
                    </Row>
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
                              onClick={() =>
                                onChange(value.subtract(1, "month"))
                              }
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
      </Layout>
    </Container>
  );
};

export default Profile;
