import Layout, { Content } from "antd/lib/layout/layout";
import React from "react";
import Container from "../../shared/container";
import Error from "../../static/_(.svg";

const Error404 = () => {
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
          <span>Ich bin ne Teekanne!</span>
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
