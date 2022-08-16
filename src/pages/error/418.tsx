import Layout, { Content } from "antd/lib/layout/layout";
import React from "react";
import Translations from "@localization/translations";
import Container from "@shared/container";
import { useTranslation } from "react-i18next";

/**
 * Error 404 page
 * @returns {JSX.Element} The page
 */
const Error404: React.FC = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container>
      <Layout style={{ height: "100%" }}>
        <Content
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            background: "#466995",
            fontSize: "30px",
          }}
        >
          <h1 style={{ fontSize: "60px", marginBottom: "-10px" }}>418</h1>
          <span>{t(Translations.errorPage.err418Text)}</span>
          <img
            src={process.env.PUBLIC_URL + "/_(.svg"}
            style={{ marginTop: "80px", width: "600px" }}
            alt="Sad Error Face"
          ></img>
        </Content>
      </Layout>
    </Container>
  );
};

export default Error404;
