import React from "react";
import { useAppSelector } from "../redux/hooks";
import Container from "../shared/container";
import helper from "../util/helper";
import { Col, Row, Space } from "antd";
import { useTranslation } from "react-i18next";
import Translations from "../localization/translations";

const Home: React.FC = () => {
  const token = useAppSelector((state) => state.token.token);
  const { t } = useTranslation();

  return (
    <Container currentPage="home" color="blue">
      <Space
        size="large"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Col>
          <Row
            justify="center"
            style={{ fontSize: "30px", fontWeight: "bold" }}
          >
            {token &&
              t(Translations.home.youAre, {
                type: t("user." + helper.getAccountType(token)),
              })}
          </Row>
        </Col>
      </Space>
    </Container>
  );
};

export default Home;
