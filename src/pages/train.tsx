import { Layout, Progress } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import Container from "../shared/container";
import api from "../util/api";
import Routes from "../util/routes";
import "../styles/train.css";

const { Sider } = Layout;

const Train = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(0);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    let isMounted = true;

    if (loading) return;
    setLoading(1);
    // api.execute(Routes.getStuff()).then((response) => {
    //   if (!isMounted) return;
    //   if (!response.success) {
    //     setError(true);
    //   }
    //   setLoading(2);
    // });

    // api.openStream().then((stream) => {
    //   while (isMounted) {
    //     const data = stream.write();
    //     if (data) {
    //       console.log(data);
    //     }
    //   }
    // });

    // api.openSocket().then((socket) => {
    //   socket.on("data", (data) => {
    //     console.log(data);
    //     setProgress(data.progress);
    //   });
    // });

    return () => {
      // clean up
      isMounted = false;
    };
  });

  return (
    <Container>
      <Layout style={{ height: "100%" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={() => setCollapsed(!collapsed)}
          width={collapsed ? "50px" : "500px"}
          style={{
            height: "calc(100% - 48px)",
            background: "#466995",
            overflow: collapsed ? "hidden" : "auto",
          }}
        >
          <div
            style={{
              paddingTop: "90px",
              height: "100%",
            }}
          >
            <div
              style={{
                position: "absolute",
                transform: collapsed
                  ? "translate(-50%, -50%) rotate(-90deg)"
                  : "translate(-50%, -50%) rotate(0deg)",
                top: collapsed ? "50%" : "40px",
                left: "50%",
                fontSize: "30px",
                color: "white",
                transition: "all 0.2s ease-in-out",
              }}
            >
              Instructions
            </div>
            <div
              style={{
                position: "absolute",
                width: "100%",
                color: "white",
                top: collapsed ? "100%" : "90px",
                transition: "all 0.2s ease-in-out",
                transitionDelay: collapsed ? "0s" : "0.05s",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ul>
                <li>
                  1. Click on the &quot;Start&quot; button to begin the training
                  session.
                </li>
                <li>
                  2. Click on the &quot;Stop&quot; button to stop the training
                  session.
                </li>
                <li>
                  3. Click on the &quot;Reset&quot; button to reset the training
                  session.
                </li>
                <li>
                  4. Click on the &quot;Save&quot; button to save the training
                  session.
                </li>
                <li>
                  5. Click on the &quot;Load&quot; button to load the training
                  session.
                </li>
              </ul>

              <div
                style={{
                  marginTop: "80px",
                  height: "200px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  width: "80%",
                  background: "white",
                }}
              >
                Video
              </div>
            </div>
          </div>
        </Sider>
        <Content
          className="shadow"
          style={{ background: "#466995", overflow: "hidden", padding: "20px" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1 style={{ color: "white", fontSize: "20px" }}>Squat Exercise</h1>
            <div
              style={{
                width: "200px",
              }}
            >
              <Progress
                percent={progress}
                status="active"
                showInfo={false}
                strokeColor={"#0ff"}
              />
            </div>
            <div style={{ color: "white", marginTop: "10px" }}>10/10</div>
            <div
              style={{
                background: "white",
                width: "640px",
                height: "360px",
                marginTop: "40px",
              }}
            ></div>
          </div>
        </Content>
      </Layout>
    </Container>
  );
};

export default Train;
