import React, { useEffect } from "react";
import useApi from "@hooks/api";
import Routes from "@util/routes";
import { Achievement } from "@api/achievement";
import { Col, message, Row, Spin } from "antd";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";
import AchievementCard from "./achievementCard";
import HiddenAchievementCard from "./hiddenAchievementCard";
import _ from "lodash";
import EmptyDataRender from "@shared/emptyDataRender";
import { LoadingOutlined } from "@ant-design/icons";

const Achievements: React.FC = () => {
  const api = useApi();
  const { t } = useTranslation();

  const [unachievedHiddenAchievements, setUnachievedHiddenAchievements] =
    React.useState(0);
  const [achievements, setAchievements] = React.useState<Achievement[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadAchievements = async () => {
    const response = await api.execute(Routes.getAchievements());
    if (!response || !response.success) {
      message.error(
        response?.description ?? t(Translations.errors.unknownError)
      );
      return;
    }
    setLoading(false);
    setUnachievedHiddenAchievements(response.data.nr_unachieved_hidden);
    setAchievements(response.data.achievements);
  };

  useEffect(() => {
    loadAchievements().catch(message.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <Col style={{ marginTop: "50px" }}>
        <Row justify="center">
          <div style={{ height: "100%" }}>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 18,
                    marginRight: "10px",
                    color: "black",
                  }}
                  spin
                />
              }
            />
          </div>
          {t(Translations.achievements.loading)}
        </Row>
      </Col>
    );
  }

  if (achievements.length === 0 || unachievedHiddenAchievements === 0) {
    return (
      <Col style={{ marginTop: "50px" }}>
        <Row justify="center">
          <EmptyDataRender
            customText={t(Translations.achievements.noAchievements)}
          />
        </Row>
      </Col>
    );
  }

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
