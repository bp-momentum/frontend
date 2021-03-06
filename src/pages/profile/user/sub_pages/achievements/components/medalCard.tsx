import React from "react";
import Container from "../../../components/container";
import Medal from "@shared/medal";
import { Col, Row } from "antd";
import Text from "antd/lib/typography/Text";
import { useTranslation } from "react-i18next";
import Translations from "@localization/translations";

interface Props {
  type: "gold" | "silver" | "bronze";
  count: number;
  exercise: string;
}

/**
 * A card for displaying an achieved medal.
 * @param {Props} props The props for the component.
 * @returns {JSX.Element} The component.
 */
const MedalCard: React.FC<Props> = ({
  type,
  count,
  exercise,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Container size={{ width: "320px", height: "120px" }}>
      <Row>
        <div style={{ marginTop: "auto", marginBottom: "auto" }}>
          <Medal type={type} size="small" />
        </div>
        <Col style={{ marginLeft: "20px", overflow: "hidden" }}>
          <Text style={{ fontSize: 25 }}>
            {t(Translations.medals.medalTitle, {
              context: type,
              exercise: exercise,
            })}
          </Text>
          <br />
          <div style={{ width: "200px" }}>
            {t(Translations.medals.amount, { count: count })}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MedalCard;
