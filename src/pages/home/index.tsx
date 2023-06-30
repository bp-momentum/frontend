import React from "react";
import Container from "@shared/container";
import { Col, Divider, Layout, Row } from "antd";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";
import { Content } from "antd/lib/layout/layout";
import { useAppSelector } from "@redux/hooks";
import FaqComponent from "@shared/faqComponent";

/**
 * The Homepage for administrators and trainers.
 * @returns {JSX.Element} The page
 */
const Home: React.FC = (): JSX.Element => {
  const { t } = useTranslation();

  const role = useAppSelector((state) => state.profile.role);

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
            {Object.entries(
              role === "admin"
                ? Translations.adminFAQs
                : Translations.trainerFAQs
            ).map(([key, faq]) => (
              <Row key={key} style={{ paddingBottom: "20px" }}>
                <FaqComponent
                  question={t(faq.question)}
                  answer={t(faq.answer)}
                />
              </Row>
            ))}
          </Col>
        </Content>
      </Layout>
    </Container>
  );
};

export default Home;
