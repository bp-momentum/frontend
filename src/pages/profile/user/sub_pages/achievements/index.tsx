import React from "react";
import { Content } from "antd/lib/layout/layout";
import { Row } from "antd";
import ToggleButton from "@/pages/profile/user/components/toggleButton";
import Achievements from "@/pages/profile/user/sub_pages/achievements/components/achievements";
import Medals from "@/pages/profile/user/sub_pages/achievements/components/medals";

const SubPageAchievements: React.FC = () => {
  const [tab, setTab] = React.useState<"achievements" | "medals">(
    "achievements"
  );

  return (
    <Content style={{ height: "100%", overflow: "auto", padding: "30px" }}>
      <Row justify="center">
        <ToggleButton
          onClick={() => {
            setTab("achievements");
          }}
          toggled={tab === "achievements"}
        >
          Achievements
        </ToggleButton>
        <ToggleButton
          onClick={() => {
            setTab("medals");
          }}
          toggled={tab === "medals"}
        >
          Medals
        </ToggleButton>
      </Row>

      <Row justify="center" style={{ marginTop: "50px" }}>
        {tab === "achievements" && <Achievements />}
        {tab === "medals" && <Medals />}
      </Row>
    </Content>
  );
};

export default SubPageAchievements;
