import React, { ReactNode } from "react";
import { Empty } from "antd";
import Translations from "@localization/translations";
import { useTranslation } from "react-i18next";

interface Props {
  customText?: ReactNode;
}

/**
 * The empty data render component.
 * @param {Props} props The properties of the component.
 * @returns {JSX.Element} The component.
 */
const EmptyDataRender: React.FC<Props> = ({
  customText,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: "center", paddingTop: "10px" }}>
      {Empty.PRESENTED_IMAGE_SIMPLE}
      <p>{!customText ? t(Translations.errors.empty) : customText}</p>
    </div>
  );
};

export default EmptyDataRender;
