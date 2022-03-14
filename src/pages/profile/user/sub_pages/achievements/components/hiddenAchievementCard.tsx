import React from "react";
import Container from "../../../components/container";
import { Col, Row } from "antd";
import Text from "antd/lib/typography/Text";
import Medal from "@shared/medal";
import Translations from "@localization/translations";
import { useTranslation } from "react-i18next";

/**
 * A card for displaying an unknown, hidden achievement.
 * @returns {JSX.Element} The component.
 */
const HiddenAchievementCard: React.FC = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container
      size={{ width: "350px", height: "130px" }}
      backgroundColor="#E4E4E4"
    >
      <Row>
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          <Medal type="unknown" size="small" />
        </div>
        <Col style={{ marginLeft: "20px", overflow: "hidden" }}>
          <Text style={{ fontSize: 25 }}>
            {t(Translations.achievements.hiddenTitle)}
          </Text>
          <br />
          <div style={{ width: "230px" }}>
            {t(Translations.achievements.hiddenDescription)}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HiddenAchievementCard;
