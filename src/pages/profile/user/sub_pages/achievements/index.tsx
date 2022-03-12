import React from "react";
import { Content } from "antd/lib/layout/layout";
import { Row } from "antd";
import ToggleButton from "@pages/profile/user/components/toggleButton";
import Achievements from "@pages/profile/user/sub_pages/achievements/components/achievements";
import Medals from "@pages/profile/user/sub_pages/achievements/components/medals";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";

const SubPageAchievements: React.FC = () => {
  const [tab, setTab] = React.useState<"achievements" | "medals">(
    "achievements"
  );
  const { t } = useTranslation();

  return (
    <Content style={{ height: "100%", overflow: "auto", padding: "30px" }}>
      <Row justify="center">
        <ToggleButton
          onClick={() => {
            setTab("achievements");
          }}
          toggled={tab === "achievements"}
        >
          {t(Translations.achievements.buttonTitle)}
        </ToggleButton>
        <ToggleButton
          onClick={() => {
            setTab("medals");
          }}
          toggled={tab === "medals"}
        >
          {t(Translations.medals.buttonTitle)}
        </ToggleButton>
      </Row>

      {tab === "achievements" && <Achievements />}
      {tab === "medals" && <Medals />}
    </Content>
  );
};

export default SubPageAchievements;
