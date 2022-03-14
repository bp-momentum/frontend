import React, { MutableRefObject, useState } from "react";
import { Layout } from "antd";
import TrainSider from "./trainSider";
const { Content, Sider } = Layout;

interface Props {
  exercise?: ExerciseData;
  initialCollapsed: MutableRefObject<boolean>;
  children: React.ReactNode;
}

/**
 * The layout for the training page
 * @param {Props} props The props
 * @returns {JSX.Element} The component
 */
const TrainLayout: React.FC<Props> = ({
  children,
  exercise,
  initialCollapsed,
}: Props): JSX.Element => {
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
        <TrainSider exercise={exercise} collapsed={collapsed} />
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
