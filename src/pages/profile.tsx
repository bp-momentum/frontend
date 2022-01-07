import React from "react";
import { useTranslation } from "react-i18next";
import Container from "../shared/container";
import { Avatar, Card, Col, Layout, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useAppSelector } from "../redux/hooks";
import Helper from "../util/helper";
import ReactCardFlip from "react-card-flip";

const Profile = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const token = useAppSelector((state) => state.token.token);
  const [flipped, setFlipped] = React.useState<boolean>(false);

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
                  isFlipped={flipped}
                  flipDirection="horizontal"
                  flipSpeedBackToFront={1.0}
                  flipSpeedFrontToBack={1.0}
                >
                  <Card
                    onClick={() => setFlipped(true)}
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

                  <Card
                    onClick={() => setFlipped(false)}
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
                <div style={{ backgroundColor: "red" }}>col-6</div>
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
