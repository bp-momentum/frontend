import Layout, { Content } from "antd/lib/layout/layout";
import React from "react";
import Container from "../../shared/container";

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
          <h1 style={{ fontSize: "60px" }}>404</h1>
          <span>Des hamma net!</span>
        </Content>
      </Layout>
    </Container>
  );
};

export default Error404;
