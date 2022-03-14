import { Card, Row } from "antd";
import Text from "antd/lib/typography/Text";
import Translations from "@localization/translations";
import ButtonContact, { ContactType } from "@shared/button_contact";
import React from "react";
import { useTranslation } from "react-i18next";

interface Props {
  name: string;
  address: string;
  phone: string;
  email: string;
}

/**
 * A card for displaying all important contact information of a user's trainer.
 * @param {Props} props The props for the component.
 * @returns {JSX.Element} The component.
 */
const TrainerCard: React.FC<Props> = ({
  name,
  address,
  phone,
  email,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Card
      data-testid="trainer-information"
      style={{
        marginTop: "30px",
        borderRadius: "5px",
        borderColor: "black",
        backgroundColor: "#EDEDF4",
        boxShadow: "2px 4px 4px 0 rgba(0, 0, 0, 0.25)",
      }}
    >
      <Row justify="space-around">
        <Text>{t(Translations.user.trainer)}</Text>
        <Text style={{ marginRight: "5px", whiteSpace: "pre-wrap" }}>
          {name}
          <br />
          {address.replaceAll(", ", "\n")}
          <br />
          <ButtonContact
            type={ContactType.phone}
            contact={phone}
            label={phone}
          />
          <br />
          <ButtonContact
            type={ContactType.email}
            contact={email}
            label={email}
          />
        </Text>
      </Row>
    </Card>
  );
};

export default TrainerCard;
