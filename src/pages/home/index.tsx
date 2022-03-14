import React from "react";
import { useAppSelector } from "@redux/hooks";
import Container from "@shared/container";
import helper from "@util/helper";
import { Col, Divider, Layout, Row } from "antd";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";
import FaqComponent from "@shared/faqComponent";
import { Content } from "antd/lib/layout/layout";

const Home: React.FC = () => {
  const token = useAppSelector((state) => state.token.token);
  const { t } = useTranslation();

  return (
    <Container currentPage="home">
      <Layout style={{ height: "100%" }}>
        <Content
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          <h1
            style={{
              fontSize: "40px",
              fontWeight: "bold",
              margin: "30px 0px",
              padding: "30px 0",
            }}
          >
            {t(Translations.home.welcome)}
          </h1>
          <Col>
            <Divider plain style={{ fontSize: "20px", fontWeight: "bold" }}>
              {t(Translations.home.faq)}
            </Divider>
            {token &&
              Object.entries(
                helper.getAccountType(token) === "admin"
                  ? Translations.adminFAQs
                  : Translations.trainerFAQs
              ).map(([key, faq]) => (
                <Row key={key} style={{ paddingBottom: "20px" }}>
                  <FaqComponent
                    question={t(faq.question)}
                    answer={t(faq.answer)}
                  ></FaqComponent>
                </Row>
              ))}
          </Col>
        </Content>
      </Layout>
    </Container>
  );
};

export default Home;
