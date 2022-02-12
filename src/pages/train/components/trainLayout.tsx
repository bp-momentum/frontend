import React, { ReactElement, useState } from "react";
import { Layout } from "antd";
import TrainSider from "./trainSider";
import { ExerciseData } from "../index";
const { Content, Sider } = Layout;

const TrainLayout = (props: {
  content: ReactElement;
  loadingExercise: boolean;
  error: boolean;
  exercise?: ExerciseData;
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ height: "100%" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        width={collapsed ? "50px" : "500px"}
        style={{
          height: "calc(100% - 48px)",
          background: "#466995",
          overflow: "hidden",
        }}
      >
        <TrainSider
          loading={props.loadingExercise}
          exercise={props.exercise}
          error={props.error}
          collapsed={collapsed}
        />
      </Sider>
      <Content
        className="shadow"
        style={{
          background: "#466995",
          overflow: "hidden",
          height: "100%",
        }}
      >
        {props.content}
      </Content>
    </Layout>
  );
};

export default TrainLayout;
