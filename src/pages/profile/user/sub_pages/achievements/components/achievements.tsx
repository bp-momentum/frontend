import React, { useEffect } from "react";
import useApi from "@hooks/api";
import Routes from "@util/routes";
import { Achievement } from "@api/achievement";
import { Col, message, Row } from "antd";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";
import AchievementCard from "./achievementCard";
import HiddenAchievementCard from "./hiddenAchievementCard";
import _ from "lodash";

/**
 * The page where all achievements are displayed.
 * @returns {JSX.Element} The page
 */
const Achievements: React.FC = (): JSX.Element => {
  const api = useApi();
  const { t } = useTranslation();

  const [unachievedHiddenAchievements, setUnachievedHiddenAchievements] =
    React.useState(0);
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);

  const loadAchievements = async () => {
    const response = await api.execute(Routes.getAchievements());
    if (!response || !response.success) {
      message.error(
        response?.description ?? t(Translations.errors.unknownError)
      );
      return;
    }
    setUnachievedHiddenAchievements(response.data.nr_unachieved_hidden);
    setAchievements(response.data.achievements);
  };

  useEffect(() => {
    loadAchievements().catch(message.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Row gutter={16} justify="center" style={{ marginTop: "50px" }}>
      {achievements.map((achievement) => (
        <Col
          key={achievement.name}
          span={10}
          style={{
            paddingBottom: "30px",
            minWidth: "366px",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <AchievementCard achievement={achievement} />
        </Col>
      ))}
      {_.range(unachievedHiddenAchievements).map((key) => (
        <Col
          key={"hidden-" + key}
          span={10}
          style={{
            paddingBottom: "30px",
            minWidth: "366px",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <HiddenAchievementCard />
        </Col>
      ))}
    </Row>
  );
};

export default Achievements;
