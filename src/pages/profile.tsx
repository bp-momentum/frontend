import React from "react";
import { useTranslation } from "react-i18next";
import Container from "../shared/container";
import { Card, Col, Image, Layout, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { useAppSelector } from "../redux/hooks";
import Helper from "../util/helper";

const Profile = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const token = useAppSelector((state) => state.token.token);

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
                <Card>Jürgen</Card>
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
