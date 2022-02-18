import React, { MutableRefObject, useState } from "react";
import { Layout } from "antd";
import TrainSider from "./trainSider";
const { Content, Sider } = Layout;

interface trainLayoutProps {
  loadingExercise: boolean;
  error: boolean;
  exercise?: ExerciseData;
  initialCollapsed: MutableRefObject<boolean>;
}

const TrainLayout: React.FC<trainLayoutProps> = ({ ...props }) => {
  const { children, loadingExercise, error, exercise, initialCollapsed } =
    props;

  const [collapsed, setCollapsed] = useState(initialCollapsed.current);

  return (
    <Layout style={{ height: "100%" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => {
          initialCollapsed.current = !collapsed;
          setCollapsed(!collapsed);
        }}
        width={collapsed ? "50px" : "500px"}
        style={{
          height: "calc(100% - 48px)",
          background: "#466995",
          overflow: "hidden",
        }}
      >
        <TrainSider
          loading={loadingExercise}
          exercise={exercise}
          error={error}
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
        {children}
      </Content>
    </Layout>
  );
};

export default TrainLayout;
