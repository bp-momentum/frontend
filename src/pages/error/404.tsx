import Layout, { Content } from "antd/lib/layout/layout";
import React from "react";
import Container from "../../shared/container";
import Error from "../../static/_(.svg";
import { t } from "i18next";
import Translations from "../../localization/translations";

const Error404: React.FC = () => {
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
          <h1 style={{ fontSize: "60px", marginBottom: "-10px" }}>404</h1>
          <span>{t(Translations.errorPage.err404Text)}</span>
          <img
            src={Error}
            style={{ marginTop: "80px", width: "600px" }}
            alt="Sad Error Face"
          ></img>
        </Content>
      </Layout>
    </Container>
  );
};

export default Error404;
