import React from "react";
import Container from "@/pages/profile/user/sub_pages/friends/components/container";
import { Col, Row } from "antd";
import Text from "antd/lib/typography/Text";
import Medal from "@shared/medal";
import Translations from "@localization/translations";
import { useTranslation } from "react-i18next";

const HiddenAchievementCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container size={{ width: "320px", height: "120px" }}>
      <Row>
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          <Medal type="unknown" size="small" />
        </div>
        <Col style={{ marginLeft: "20px", overflow: "hidden" }}>
          <Text style={{ fontSize: 25 }}>
            {t(Translations.achievements.hiddenTitle)}
          </Text>
          <br />
          <div style={{ width: "200px" }}>
            {t(Translations.achievements.hiddenDescription)}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HiddenAchievementCard;
